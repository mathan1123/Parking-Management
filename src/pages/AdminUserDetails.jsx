import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import './AdminUserDetails.css';

const AdminUserDetails = () => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            console.log("Fetching bookings...");
            const response = await axios.get('/api/bookings/');
            console.log("Data received:", response.data);

            if (!Array.isArray(response.data)) {
                console.error("Data is not an array");
                setLoading(false);
                return;
            }

            // Filter only employee types and uniqueify by employee_id
            const employeeData = response.data.filter(b => b && b.user_type === 'employee');

            // Uniqueify by employee_id, keeping the latest one. Safely handle missing IDs.
            const uniqueEmployees = Array.from(new Map(
                employeeData
                    .filter(item => item && item.employee_id)
                    .map(item => [item.employee_id, item])
            ).values());

            console.log("Processed employees:", uniqueEmployees);
            setEmployees(uniqueEmployees);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employee data:", error);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterType(e.target.value);
    };

    const filteredEmployees = employees.filter(emp => {
        const id = (emp && emp.employee_id) ? String(emp.employee_id).toLowerCase() : '';
        const name = (emp && emp.name) ? String(emp.name).toLowerCase() : '';
        const vehicleNo = (emp && emp.vehicle_no) ? String(emp.vehicle_no).toLowerCase() : '';

        const matchesSearch = id.includes(searchTerm.toLowerCase()) ||
            name.includes(searchTerm.toLowerCase()) ||
            vehicleNo.includes(searchTerm.toLowerCase());

        const matchesType = filterType === 'All' || emp.vehicle_type === filterType;

        return matchesSearch && matchesType;
    });

    const exportToExcel = () => {
        if (filteredEmployees.length === 0) return;

        // Create CSV content
        const headers = ["Employee ID", "Employee Name", "Vehicle Number", "Email", "Phone", "Vehicle Type"];
        const rows = filteredEmployees.map(emp => [
            emp.employee_id,
            emp.name,
            emp.vehicle_no,
            emp.email,
            emp.phone,
            emp.vehicle_type
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `employee_details_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="user-details-layout">
            <AdminSidebar />
            <main className="user-details-main">
                <div className="user-details-header">
                    <h1>User Details</h1>
                    <div className="header-actions">
                        <div className="search-container">
                            <span className="search-icon">🔍</span>
                            <input
                                type="text"
                                placeholder="Search by ID, Name or Vehicle..."
                                className="search-input"
                                value={searchTerm}
                                onChange={handleSearch}
                            />
                        </div>
                        <div className="filter-container">
                            <select
                                className="filter-select"
                                value={filterType}
                                onChange={handleFilterChange}
                            >
                                <option value="All">All Vehicles</option>
                                <option value="bike">Bike</option>
                                <option value="car">Car</option>
                            </select>
                        </div>
                        <button className="export-btn" onClick={exportToExcel}>
                            <span>📥</span> Export to Excel
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-state">Loading employee data...</div>
                ) : (
                    <div className="tables-grid">
                        <div className="table-card">
                            <div className="table-card-header">
                                <h3>Employee ID</h3>
                            </div>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map(emp => (
                                        <tr key={emp.employee_id}>
                                            <td className="id-cell">{emp.employee_id}</td>
                                        </tr>
                                    ))}
                                    {filteredEmployees.length === 0 && (
                                        <tr><td>No data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-card">
                            <div className="table-card-header">
                                <h3>Employee Name</h3>
                            </div>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map(emp => (
                                        <tr key={emp.employee_id}>
                                            <td>{emp.name}</td>
                                        </tr>
                                    ))}
                                    {filteredEmployees.length === 0 && (
                                        <tr><td>No data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-card">
                            <div className="table-card-header">
                                <h3>Employee Vehicle Number</h3>
                            </div>
                            <table className="user-table">
                                <thead>
                                    <tr>
                                        <th>Vehicle No</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map(emp => (
                                        <tr key={emp.employee_id}>
                                            <td>{emp.vehicle_no}</td>
                                        </tr>
                                    ))}
                                    {filteredEmployees.length === 0 && (
                                        <tr><td>No data</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminUserDetails;

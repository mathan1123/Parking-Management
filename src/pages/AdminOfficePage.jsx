import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css';
import './AdminOfficePage.css';

const AdminOfficePage = () => {
    const [offices, setOffices] = useState([]);

    useEffect(() => {
        fetchOffices();
    }, []);

    const fetchOffices = async () => {
        try {
            const res = await axios.get('/api/offices/');
            setOffices(res.data);
        } catch (err) {
            console.error('Failed to fetch offices', err);
        }
    };

    const handleAddOffice = async () => {
        const name = prompt("Enter Office Name (e.g., VDart GCC, Trichy):");
        if (!name) return;

        const location = prompt("Enter Location (e.g., Trichy):");
        if (!location) return;

        try {
            await axios.post('/api/offices/', { name, location });
            fetchOffices();
        } catch (err) {
            console.error('Failed to add office', err);
            alert('Failed to add office');
        }
    };

    const handleEditOffice = async (office) => {
        const name = prompt("Enter Office Name (e.g., VDart GCC, Trichy):", office.name);
        if (name === null) return; // Cancelled

        const location = prompt("Enter Location (e.g., Trichy):", office.location);
        if (location === null) return; // Cancelled

        try {
            await axios.patch(`/api/offices/${office.id}/`, { name, location });
            setOffices(offices.map(o => o.id === office.id ? { ...o, name, location } : o));
        } catch (err) {
            console.error('Failed to update office', err);
            alert('Failed to update office');
        }
    };

    const handleDeleteOffice = async (id) => {
        if (!confirm('Are you sure you want to delete this office?')) return;
        try {
            await axios.delete(`/api/offices/${id}/`);
            setOffices(offices.filter(o => o.id !== id));
        } catch (err) {
            console.error('Failed to delete office', err);
            alert('Failed to delete office');
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                <div className="office-header-section">
                    <div>
                        <h2>Office Master</h2>
                        <p style={{ color: '#64748b' }}>Manage your office locations.</p>
                    </div>
                    <button className="btn-add-office" onClick={handleAddOffice}>
                        + Add Office
                    </button>
                </div>

                <div className="office-card">
                    <table className="office-table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'left', paddingLeft: '2rem' }}>NAME</th>
                                <th style={{ textAlign: 'left' }}>LOCATION</th>
                                <th style={{ textAlign: 'center' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {offices.length === 0 ? (
                                <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No offices found.</td></tr>
                            ) : (
                                offices.map(office => (
                                    <tr key={office.id}>
                                        <td style={{ paddingLeft: '2rem', fontWeight: '500' }}>{office.name}</td>
                                        <td>{office.location}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <button
                                                className="action-icon-btn edit"
                                                onClick={() => handleEditOffice(office)}
                                            >
                                                📝
                                            </button>
                                            <button
                                                className="action-icon-btn delete"
                                                onClick={() => handleDeleteOffice(office.id)}
                                            >
                                                🗑
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminOfficePage;

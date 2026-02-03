import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css';
import './AdminCreatePage.css';

const AdminCreatePage = () => {
    const [admins, setAdmins] = useState([]);
    const [offices, setOffices] = useState([]);
    const [editingId, setEditingId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        adminCode: '',
        password: '',
        office: '',
        designation: '',
        mobileNumber: '',
        shift: '',
        others: '',
        username: '', // Derived or input
        email: ''
    });

    useEffect(() => {
        fetchAdmins();
        fetchOffices();
    }, []);

    const fetchAdmins = async () => {
        try {
            const res = await axios.get('/api/admins/');
            setAdmins(res.data);
        } catch (err) {
            console.error('Failed to fetch admins', err);
        }
    };

    const fetchOffices = async () => {
        try {
            const res = await axios.get('/api/offices/');
            setOffices(res.data);
        } catch (err) {
            console.error('Failed to fetch offices', err);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construct payload for Serializer
        const payload = {
            username: formData.adminCode, // Using AdminCode as username for simplicity
            password: formData.password,
            email: formData.email,
            admin_code: formData.adminCode,
            office: formData.office,
            designation: formData.designation,
            mobile: formData.mobileNumber,
            shift: formData.shift
        };

        try {
            if (editingId) {
                // Update existing
                await axios.put(`/api/admins/${editingId}/`, payload);
                alert('Admin Updated Successfully!');
            } else {
                // Create new
                await axios.post('/api/admins/', payload);
                alert('Admin Created Successfully!');
            }
            // Reset and Refresh
            setFormData({
                adminCode: '', password: '', office: '', designation: '',
                mobileNumber: '', shift: '', others: '', username: '', email: ''
            });
            setEditingId(null);
            fetchAdmins();
        } catch (err) {
            console.error('Save Admin Failed', err.response?.data || err);
            alert('Failed to save admin. Check console.');
        }
    };

    const handleEdit = (admin) => {
        setEditingId(admin.id);
        setFormData({
            adminCode: admin.admin_code || '',
            password: '', // Keep empty to require re-entry or optional? For now logic implies reset
            office: admin.office || '',
            designation: admin.designation || '',
            mobileNumber: admin.mobile || '',
            shift: admin.shift || '',
            others: '',
            username: admin.username || '',
            email: admin.email || ''
        });
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                <div className="page-header">
                    <h2>Create Admin User</h2>
                    <p>Add a new administrator to the system.</p>
                </div>

                <div className="create-admin-layout">
                    {/* LEFT: Create Form */}
                    <div className="create-admin-card form-section">
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Admin Code</label>
                                    <input
                                        type="text"
                                        name="adminCode"
                                        value={formData.adminCode}
                                        onChange={handleChange}
                                        placeholder="ADM002"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Email (for Login)</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="admin@vdart.in"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Office</label>
                                    <select
                                        name="office"
                                        value={formData.office}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Office</option>
                                        {offices.map(off => (
                                            <option key={off.id} value={off.name}>{off.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Shift</label>
                                    <input
                                        type="text"
                                        name="shift"
                                        value={formData.shift}
                                        onChange={handleChange}
                                        placeholder="Morning"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <input
                                        type="text"
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleChange}
                                        placeholder="Create Designation" // Re-using placeholder from design as label/input
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Designation</label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleChange}
                                        placeholder="HR Manager"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Others</label>
                                <textarea
                                    name="others"
                                    value={formData.others}
                                    onChange={handleChange}
                                    rows="3"
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-create-submit">
                                {editingId ? 'Update Admin' : 'Create Admin'}
                            </button>
                        </form>
                    </div>

                    {/* RIGHT: Existing Admins List */}
                    <div className="create-admin-card list-section">
                        <h3>Existing Admin Users</h3>
                        <div className="admin-list">
                            {admins.map(admin => (
                                <div key={admin.id} className="admin-list-item">
                                    <div className="admin-info">
                                        <span className="admin-code">{admin.admin_code}</span>
                                        <span className="admin-email">{admin.email}</span>
                                        <span className="admin-office" style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{admin.office}</span>
                                    </div>
                                    <button
                                        className="btn-edit-link"
                                        onClick={() => handleEdit(admin)}
                                    >
                                        Edit
                                    </button>
                                </div>
                            ))}
                            {admins.length === 0 && <p className="no-data">No additional admins found.</p>}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminCreatePage;

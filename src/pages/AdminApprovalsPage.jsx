import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css'; // Reuse layout styles
import './AdminApprovalsPage.css';

const AdminApprovalsPage = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [filterStatus, setFilterStatus] = useState('Pending'); // Default to Pending per req

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/bookings/');
            setBookings(res.data);
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        let reason = null;

        if (newStatus === 'Rejected') {
            reason = prompt("Please enter the reason for rejection:");
            if (!reason) return; // Cancel if no reason provided
        } else if (newStatus === 'Approved') {
            // Visual Slot Selection Flow
            try {
                // First mark as Approved (without slot)
                await axios.patch(`/api/bookings/${id}/`, {
                    status: 'Approved'
                });

                // Direct redirect to Slot Page for allocation
                navigate('/slot-management', { state: { bookingId: id } });
                return;
            } catch (err) {
                console.error('Failed to approve booking', err);
                alert('Failed to approve booking');
                return;
            }
        }

        try {
            await axios.patch(`/api/bookings/${id}/`, {
                status: newStatus,
                rejection_reason: reason
            });
            // Optimistic update
            setBookings(prev => prev.map(b => b.id === id ? {
                ...b,
                status: newStatus,
                rejection_reason: reason
            } : b));
        } catch (err) {
            console.error('Failed to update status', err);
            alert('Failed to update status');
        }
    };

    const filteredBookings = filterStatus === 'All'
        ? bookings
        : bookings.filter(b => b.status === filterStatus);

    const getStatusBadgeClass = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'status-badge approved';
            case 'rejected': return 'status-badge rejected';
            case 'cancelled': return 'status-badge cancelled';
            default: return 'status-badge pending';
        }
    };

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                <div className="approvals-header">
                    <h2>Booking Approvals</h2>
                    <p>Review and manage all parking booking requests.</p>
                </div>

                <div className="status-tabs">
                    {['All', 'Pending', 'Approved', 'Rejected', 'Cancelled'].map(status => (
                        <button
                            key={status}
                            className={`status-tab ${filterStatus === status ? 'active' : ''}`}
                            onClick={() => setFilterStatus(status)}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                <div className="approvals-container">
                    <table className="approvals-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Office</th>
                                <th>Date & Time</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No bookings found</td>
                                </tr>
                            ) : (
                                filteredBookings.map(b => (
                                    <tr key={b.id}>
                                        <td>#{b.id}</td>
                                        <td>
                                            <div style={{ fontWeight: '600' }}>{b.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{b.email}</div>
                                        </td>
                                        <td>{b.office}</td>
                                        <td>
                                            <div>{b.booking_date}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.time_slot}</div>
                                        </td>
                                        <td>
                                            <span className={getStatusBadgeClass(b.status)}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td>
                                            {b.status === 'Pending' && (
                                                <>
                                                    <button
                                                        className="action-btn btn-approve"
                                                        title="Approve"
                                                        onClick={() => handleStatusUpdate(b.id, 'Approved')}
                                                    >
                                                        ✔
                                                    </button>
                                                    <button
                                                        className="action-btn btn-reject"
                                                        title="Reject"
                                                        onClick={() => handleStatusUpdate(b.id, 'Rejected')}
                                                    >
                                                        ✖
                                                    </button>
                                                </>
                                            )}
                                            {/* Could add Cancel/Edit buttons here later */}
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

export default AdminApprovalsPage;

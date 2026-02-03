import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import AdminStatsCards from '../components/AdminStatsCards';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('upcoming'); // Default to upcoming to show data

    useEffect(() => {
        axios.get('/api/bookings/')
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    }, []);

    // Check for today's date
    const isBookingToday = (booking) => {
        const today = new Date();
        const y = today.getFullYear();
        const m = (today.getMonth() + 1).toString().padStart(2, '0');
        const d = today.getDate().toString().padStart(2, '0');
        const todayStr = `${y}-${m}-${d}`;

        if (!booking.booking_date) return false;

        // legacy match? "Jan 14, 2026"
        if (booking.booking_date.includes(',')) {
            // Quick naive check or reuse logic?
            // Let's assume standardized YYYY-MM-DD for now as per previous fixes,
            // or if legacy, we skip for "current" tab simplicity unless confirmed needed.
            // Actually, let's copy the robust logic to be safe.
            const monthMap = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };
            const legacyMatch = booking.booking_date.match(/([A-z]+)\s(\d+),\s(\d+)/);
            if (legacyMatch) {
                const [_, mStr, dStr, yStr] = legacyMatch;
                const monthIndex = monthMap[mStr];
                if (monthIndex !== undefined) {
                    const ly = yStr;
                    const lm = (monthIndex + 1).toString().padStart(2, '0');
                    const ld = dStr.padStart(2, '0');
                    return `${ly}-${lm}-${ld}` === todayStr;
                }
            }
        }

        // Standard range check YYYY-MM-DD or YYYY-MM-DD/YYYY-MM-DD
        if (booking.booking_date.includes('/')) {
            const [start, end] = booking.booking_date.split('/');
            return todayStr >= start && todayStr <= end;
        }

        return booking.booking_date === todayStr;
    };

    // Metrics calculation
    const currentBookings = bookings.filter(b => b.status === 'Approved' && isBookingToday(b));

    const metrics = {
        total: bookings.length,
        upcoming: bookings.filter(b => b.status === 'Approved').length, // Using this for "Upcoming" card
        approved: bookings.filter(b => b.status === 'Approved').length, // Same as upcoming/approved generally
        pending: bookings.filter(b => b.status === 'Pending').length,
        rejected: bookings.filter(b => b.status === 'Rejected').length,
        cancelled: bookings.filter(b => b.status === 'Cancelled').length
    };

    const handleCardClick = (key) => {
        if (key === 'maintenance') {
            alert('Maintenance details are coming soon!');
            return;
        }
        if (key === 'total') {
            // Maybe show all?
            // Since we don't have an "All" tab in UI, let's create a temporary view or just switch to main
            // Let's implement 'all' view
            setActiveTab('all');
        } else if (key === 'available') {
            setActiveTab('current');
        } else if (key === 'upcoming') {
            setActiveTab('upcoming');
        } else if (key === 'approved') {
            // Show all approved?
            setActiveTab('approved');
        } else if (key === 'pending') {
            setActiveTab('pending');
        } else if (key === 'rejected') {
            setActiveTab('rejected');
        } else if (key === 'cancelled') {
            setActiveTab('cancelled');
        }
    };

    const renderTable = (data) => (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem', color: '#64748b' }}>ID</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>User</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Date & Slot</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Vehicle</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Office</th>
                    <th style={{ padding: '1rem', color: '#64748b' }}>Status</th>
                </tr>
            </thead>
            <tbody>
                {data.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                        <td style={{ padding: '1rem', fontWeight: '600' }}>#{b.id}</td>
                        <td style={{ padding: '1rem' }}>
                            <div style={{ fontWeight: '500', color: '#1e293b' }}>{b.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{b.email}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                            <div style={{ color: '#334155' }}>{b.booking_date}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{b.time_slot}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                            <div style={{ color: '#334155' }}>{b.vehicle_no}</div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{b.vehicle_type}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{b.office}</td>
                        <td style={{ padding: '1rem' }}>
                            <span style={{
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                backgroundColor: b.status === 'Approved' ? '#dcfce7' :
                                    b.status === 'Rejected' ? '#fee2e2' :
                                        b.status === 'Cancelled' ? '#f3f4f6' : '#fff7ed',
                                color: b.status === 'Approved' ? '#166534' :
                                    b.status === 'Rejected' ? '#991b1b' :
                                        b.status === 'Cancelled' ? '#374151' : '#9a3412'
                            }}>
                                {b.status}
                            </span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                {/* Filters Header */}
                <div className="dashboard-header-filters">
                    <div className="filter-group">
                        <label>Filter by Office</label>
                        <select className="filter-select"><option>All Offices</option></select>
                    </div>
                    <div className="filter-group">
                        <label>Filter by Category</label>
                        <select className="filter-select"><option>All Categories</option></select>
                    </div>
                    <div className="filter-group">
                        <label>Filter by Session</label>
                        <select className="filter-select"><option>All Sessions</option></select>
                    </div>
                    <div className="filter-group">
                        <label>From</label>
                        <input type="date" className="filter-select" />
                    </div>
                    <div className="filter-group">
                        <label>To</label>
                        <input type="date" className="filter-select" />
                    </div>
                    <button className="export-btn">⬇ Export</button>
                </div>

                <AdminStatsCards metrics={metrics} onCardClick={handleCardClick} />

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'current' ? 'active' : ''}`}
                        onClick={() => setActiveTab('current')}
                    >
                        Current Working Slots
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Approved Bookings
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approvals
                    </button>
                </div>

                <div className="table-container">
                    {activeTab === 'current' && (
                        currentBookings.length > 0
                            ? renderTable(currentBookings)
                            : (
                                <div style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🕒</div>
                                    <p>No parking slots currently in use</p>
                                </div>
                            )
                    )}

                    {activeTab === 'upcoming' && (
                        bookings.filter(b => b.status === 'Approved').length > 0
                            ? renderTable(bookings.filter(b => b.status === 'Approved'))
                            : <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No upcoming approved bookings found.</p>
                    )}

                    {activeTab === 'pending' && (
                        bookings.filter(b => b.status === 'Pending').length > 0
                            ? renderTable(bookings.filter(b => b.status === 'Pending'))
                            : <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No pending approvals found.</p>
                    )}

                    {activeTab === 'rejected' && (
                        bookings.filter(b => b.status === 'Rejected').length > 0
                            ? renderTable(bookings.filter(b => b.status === 'Rejected'))
                            : <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No rejected bookings found.</p>
                    )}

                    {activeTab === 'cancelled' && (
                        bookings.filter(b => b.status === 'Cancelled').length > 0
                            ? renderTable(bookings.filter(b => b.status === 'Cancelled'))
                            : <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No cancelled bookings found.</p>
                    )}

                    {activeTab === 'all' && (
                        bookings.length > 0
                            ? renderTable(bookings)
                            : <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No bookings found.</p>
                    )}

                    {activeTab === 'approved' && (
                        bookings.filter(b => b.status === 'Approved').length > 0
                            ? renderTable(bookings.filter(b => b.status === 'Approved'))
                            : <p style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No approved bookings found.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;

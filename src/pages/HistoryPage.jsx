import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HistoryPage.css';

const HistoryPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [bookings, setBookings] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [userType, setUserType] = useState('employee'); // 'employee', 'visitor'
    const allowedDomains = ['vdartacademy.com', 'vdartinc.com', 'vdartdigital.com'];

    const isValidEmail = (email) => {
        if (!email.includes('@')) return false;
        const domain = email.split('@')[1];
        if (!domain) return false;

        if (userType === 'employee') {
            return allowedDomains.includes(domain);
        } else {
            // Visitor: Any domain EXCEPT the allowed ones
            return !allowedDomains.includes(domain);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!isValidEmail(email)) return;

        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/api/bookings/?email=' + email);
            setBookings(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch bookings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="history-container">
            <div className="history-card">
                <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
                <h2>History Tracking</h2>
                <p>Access your booking history</p>

                <div className="user-type-selector" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        className={`type-btn ${userType === 'employee' ? 'active' : ''}`}
                        onClick={() => setUserType('employee')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: userType === 'employee' ? '#ef4444' : '#fff',
                            color: userType === 'employee' ? '#fff' : '#000',
                            cursor: 'pointer'
                        }}
                    >
                        Employee
                    </button>
                    <button
                        className={`type-btn ${userType === 'visitor' ? 'active' : ''}`}
                        onClick={() => setUserType('visitor')}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            background: userType === 'visitor' ? '#ef4444' : '#fff',
                            color: userType === 'visitor' ? '#fff' : '#000',
                            cursor: 'pointer'
                        }}
                    >
                        Visitor
                    </button>
                </div>

                <form onSubmit={handleSearch}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <div className="input-wrapper">
                            <span className="input-icon">✉️</span>
                            <input
                                type="email"
                                className="history-input"
                                placeholder={userType === 'employee' ? "Enter your company email" : "Enter your email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="domain-hint">
                            {userType === 'employee'
                                ? "Allowed domains: vdartacademy.com, vdartinc.com, vdartdigital.com"
                                : "Enter your personal email (Corporate domains not allowed for visitors)"}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className={'access-btn ' + (isValidEmail(email) ? 'active' : '')}
                        disabled={!isValidEmail(email) || loading}
                    >
                        {loading ? 'Loading...' : '→ Enter Valid Email'}
                    </button>
                </form>

                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

                {bookings && (
                    <div className="bookings-list">
                        <h3>Your Bookings ({bookings.length})</h3>
                        {bookings.length === 0 ? (
                            <p>No bookings found for this email.</p>
                        ) : (
                            bookings.map(booking => (
                                <div key={booking.id} className="booking-item">
                                    <div className="booking-header-row">
                                        <h4>{booking.office.toUpperCase()}</h4>
                                        <span className={`status-badge ${booking.status.toLowerCase()}`}>{booking.status}</span>
                                    </div>
                                    <span>{booking.booking_date} | {booking.time_slot}</span>
                                    <br />
                                    <small>{booking.vehicle_no}</small>

                                    {/* Additional Details */}
                                    {booking.status === 'Approved' && booking.allocated_slot && (
                                        <div className="status-detail success">
                                            Allocated Slot: <strong>{booking.allocated_slot}</strong>
                                        </div>
                                    )}
                                    {(booking.status === 'Rejected' || booking.status === 'Cancelled') && booking.rejection_reason && (
                                        <div className="status-detail error">
                                            Reason: {booking.rejection_reason}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HistoryPage;

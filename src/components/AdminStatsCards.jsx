import React from 'react';

const AdminStatsCards = ({ metrics, onCardClick }) => {
    // Colors matching the image reference (approximate)
    const cards = [
        { title: 'Total Parking Slots', value: '50', icon: '🏢', color: '#3b82f6', key: 'total' },
        { title: 'Available Slots', value: (50 - (parseInt(metrics.approved) || 0)).toString(), icon: '✔', color: '#8b5cf6', key: 'available' },
        { title: 'Maintenance', value: '6', icon: '⚙️', color: '#f97316', key: 'maintenance' }, // Hardcoded
        { title: 'Upcoming Booked', value: metrics.upcoming || '0', icon: '📅', color: '#a855f7', key: 'upcoming' },
        { title: 'Approved Bookings', value: metrics.approved || '0', icon: '✓', color: '#22c55e', key: 'approved' },
        { title: 'Pending Bookings', value: metrics.pending || '0', icon: '🕒', color: '#eab308', key: 'pending' },
        { title: 'Rejected Bookings', value: metrics.rejected || '0', icon: '⨯', color: '#ef4444', key: 'rejected' },
        { title: 'Cancelled Bookings', value: metrics.cancelled || '0', icon: '⊘', color: '#64748b', key: 'cancelled' },
    ];

    return (
        <div className="stats-grid">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="stat-card"
                    onClick={() => onCardClick && onCardClick(card.key)}
                    style={{ cursor: 'pointer' }}
                >
                    <div className="stat-icon" style={{ backgroundColor: card.color }}>
                        {card.icon}
                    </div>
                    <div className="stat-info">
                        <h4>{card.title}</h4>
                        <p>{card.value}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminStatsCards;

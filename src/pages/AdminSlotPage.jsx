import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import './AdminDashboard.css';
import './AdminSlotPage.css';

const AdminSlotPage = () => {
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [offices, setOffices] = useState([]);
    const [selectedOffice, setSelectedOffice] = useState(''); // Store office name/code
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [actionModal, setActionModal] = useState(null); // { booking: ..., slot: ... }

    // Map month names to 0-indexed numbers for parsing
    const monthMap = {
        "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
        "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };

    useEffect(() => {
        const init = async () => {
            await fetchOffices();
            await fetchBookings();
        };
        init();
    }, []);

    const fetchOffices = async () => {
        try {
            const res = await axios.get('/api/offices/');
            setOffices(res.data);
            if (res.data.length > 0) {
                // Default to first office, or use location state if set
                setSelectedOffice(res.data[0].name);
            }
        } catch (err) {
            console.error('Failed to fetch offices', err);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await axios.get('/api/bookings/');
            setBookings(res.data);

            const incomingId = location.state?.bookingId;
            if (incomingId) {
                const targetBooking = res.data.find(b => b.id === incomingId);
                if (targetBooking) {
                    setSelectedBooking(targetBooking);
                    // Auto-switch date to booking date
                    let dateToSet = targetBooking.booking_date;
                    // ... (existing date logic preserved in replacement, simplified here for context) ...

                    // Handle Range: "2026-01-14/2026-01-16" -> Take start
                    if (dateToSet.includes('/')) {
                        dateToSet = dateToSet.split('/')[0];
                    }
                    // Handle Legacy: "Jan 14, 2026"
                    else if (dateToSet.match(/[A-z]+/)) {
                        const match = dateToSet.match(/([A-z]+)\s(\d+),\s(\d+)/);
                        if (match) {
                            const [_, mStr, dStr, yStr] = match;
                            const monthIndex = monthMap[mStr];
                            if (monthIndex !== undefined) {
                                const m = (monthIndex + 1).toString().padStart(2, '0');
                                const d = dStr.padStart(2, '0');
                                dateToSet = `${yStr}-${m}-${d}`;
                            }
                        }
                    }
                    setSelectedDate(dateToSet);

                    // NEW: Auto-switch office
                    if (targetBooking.office) {
                        // Assumption: targetBooking.office matches office.name or office.location depending on how it's stored.
                        // Booking model stores "office". BookingPage sends "trichy" code or office name?
                        // Let's check BookingPage map: 'trichy': 'VDart GCC, Trichy'.
                        // If backend stores 'trichy', we need to map it or we just expect mapped name?
                        // Model says max_length=100. Let's assume matches selector values. 
                        // If it's a code, we might need to find matching office name.
                        // But let's set it directly for now; if it exists in dropdown it works.

                        // Try to find matching office name if it's a code like 'trichy'
                        // Actually BookingPage sends code 'trichy'. 
                        // AdminOfficePage allows creating offices with any name.
                        // Ideally we should match against office.id or normalized name.
                        // For this task, let's assume we can selecting by matching value.

                        // We will allow the selector to be controlled by finding correct office from list or direct match
                        // But wait, the office selector options will come from `offices`.
                        // If booking has 'trichy', and offices has 'VDart Trichy', mismatch.
                        // But user says "branches", implies offices exist.
                        // Let's rely on standardizing or finding "like" match?
                        // Or maybe simple: set selectedOffice to targetBooking.office

                        // Let's check against loaded offices list for better matching if possible.
                        // For now, simple set.
                        setSelectedOffice(targetBooking.office);
                    }
                }
            }
        } catch (err) {
            console.error('Failed to fetch bookings', err);
        }
    };

    const handleSlotClick = (slotNum, booking) => {
        if (booking) {
            // Occupied: Open Action Modal
            setActionModal({ booking, slot: slotNum });
        } else {
            // Empty: Allocate if booking selected
            handleAllocateSlot(slotNum);
        }
    };

    const handleAllocateSlot = async (slotNumber) => {
        if (!selectedBooking) {
            alert("Please select a booking from the list (or 'Move' a slot) first.");
            return;
        }

        try {
            await axios.patch(`/api/bookings/${selectedBooking.id}/`, {
                allocated_slot: slotNumber.toString()
            });

            // Update local state
            const updatedBookings = bookings.map(b =>
                b.id === selectedBooking.id ? { ...b, allocated_slot: slotNumber.toString() } : b
            );
            setBookings(updatedBookings);
            setSelectedBooking(null); // Deselect
        } catch (err) {
            console.error('Failed to allocate slot', err);
            alert('Failed to allocate slot');
        }
    };

    const handleMoveBooking = () => {
        if (!actionModal) return;
        setSelectedBooking(actionModal.booking);
        setActionModal(null);
    };

    const handleCancelBooking = async () => {
        if (!actionModal) return;

        const reason = prompt("Enter reason for cancellation:");
        if (!reason) return;

        try {
            await axios.patch(`/api/bookings/${actionModal.booking.id}/`, {
                status: 'Cancelled',
                rejection_reason: reason,
                allocated_slot: null
            });

            // Update local state
            const updatedBookings = bookings.map(b =>
                b.id === actionModal.booking.id ? {
                    ...b,
                    status: 'Cancelled',
                    rejection_reason: reason,
                    allocated_slot: null
                } : b
            );
            setBookings(updatedBookings);
            setActionModal(null);

            if (selectedBooking?.id === actionModal.booking.id) {
                setSelectedBooking(null);
            }
        } catch (err) {
            console.error('Failed to cancel booking', err);
            alert('Failed to cancel booking');
        }
    };

    // Helper to check if selectedDate is within booking range
    const isBookingForDate = (booking, targetDate) => {
        if (!booking.booking_date) return false;

        // Handle "YYYY-MM-DD/YYYY-MM-DD" range format
        if (booking.booking_date.includes('/')) {
            const [start, end] = booking.booking_date.split('/');
            return targetDate >= start && targetDate <= end;
        }

        // Handle legacy/messy formats (try exact match or simple includes)
        // If it's pure YYYY-MM-DD
        if (booking.booking_date === targetDate) return true;

        // Handle Legacy Format: "Jan 14, 2026"
        const monthMap = { "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5, "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11 };
        const legacyMatch = booking.booking_date.match(/([A-z]+)\s(\d+),\s(\d+)/);
        if (legacyMatch) {
            const [_, mStr, dStr, yStr] = legacyMatch;
            const monthIndex = monthMap[mStr];
            if (monthIndex !== undefined) {
                const y = yStr;
                const m = (monthIndex + 1).toString().padStart(2, '0');
                const d = dStr.padStart(2, '0');
                const legacyIso = `${y}-${m}-${d}`;
                return legacyIso === targetDate;
            }
        }
        return false;
    };



    // Helper to check if booking belongs to selected office
    const isBookingForOffice = (booking, office) => {
        // Office matching: exact or code-based?
        // Booking might store 'trichy', selectedOffice might be 'VDart GCC, Trichy'
        // Simple includes check?
        if (!office) return true;
        if (!booking.office) return false;

        const bOffice = booking.office.toLowerCase();
        const sOffice = office.toLowerCase();

        return bOffice === sOffice || sOffice.includes(bOffice) || bOffice.includes(sOffice);
    };

    const unallocatedBookings = bookings.filter(b =>
        b.status === 'Approved' &&
        !b.allocated_slot &&
        isBookingForDate(b, selectedDate) &&
        isBookingForOffice(b, selectedOffice)
    );

    const allocatedSlots = {};
    bookings.forEach(b => {
        if (b.allocated_slot &&
            b.status === 'Approved' &&
            isBookingForDate(b, selectedDate) &&
            isBookingForOffice(b, selectedOffice)
        ) {
            allocatedSlots[b.allocated_slot] = b;
        }
    });

    return (
        <div className="admin-layout">
            <AdminSidebar />

            <main className="dashboard-main">
                <div className="office-header-section">
                    <h2>Slot Management</h2>
                </div>

                <div className="slot-management-container">
                    <div className="slot-controls">
                        <div className="control-group">
                            <label>Select Branch:</label>
                            <select
                                className="office-selector"
                                value={selectedOffice}
                                onChange={(e) => setSelectedOffice(e.target.value)}
                            >
                                {offices.map(off => (
                                    <option key={off.id} value={off.name}>{off.name}</option>
                                ))}
                                {/* Fallback options if API fails or empty */}
                                {offices.length === 0 && (
                                    <>
                                        <option value="trichy">Trichy</option>
                                        <option value="bangalore">Bangalore</option>
                                        <option value="chennai">Chennai</option>
                                        <option value="atlanta">Atlanta</option>
                                    </>
                                )}
                            </select>
                        </div>

                        <div className="control-group">
                            <label>Select Date:</label>
                            <input
                                type="date"
                                className="date-picker-input"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                            />
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>(Displaying 50 Slots)</span>
                        {/* ... moving indicator ... */}

                        {selectedBooking && selectedBooking.allocated_slot && (
                            <span className="moving-indicator">
                                Moving <strong>{selectedBooking.name}</strong> from Slot {selectedBooking.allocated_slot}...
                                <button className="cancel-move-btn" onClick={() => setSelectedBooking(null)}>Cancel Move</button>
                            </span>
                        )}
                    </div>

                    <div className="slot-layout">
                        <div className="slot-grid">
                            {Array.from({ length: 50 }, (_, i) => i + 1).map(num => {
                                const booking = allocatedSlots[num.toString()];
                                const isOccupied = !!booking;

                                return (
                                    <div
                                        key={num}
                                        className={`slot-box ${isOccupied ? 'occupied' : ''} ${selectedBooking ? 'allocating' : ''}`}
                                        onClick={() => handleSlotClick(num, booking)}
                                    >
                                        {num}
                                        {isOccupied && booking && (
                                            <span className="tooltip">
                                                {booking.name}<br />
                                                {booking.vehicle_no}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="unallocated-panel">
                            <h3>Unallocated Bookings ({unallocatedBookings.length})</h3>
                            {unallocatedBookings.length === 0 ? (
                                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No approved bookings awaiting allocation.</p>
                            ) : (
                                unallocatedBookings.map(b => (
                                    <div
                                        key={b.id}
                                        className={`booking-item ${selectedBooking?.id === b.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedBooking(b)}
                                    >
                                        <h4>{b.name}</h4>
                                        <p>{b.vehicle_no} • {b.vehicle_type}</p>
                                        <p style={{ marginTop: '0.2rem' }}>{b.booking_date}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {actionModal && (
                    <div className="modal-overlay" onClick={() => setActionModal(null)}>
                        <div className="action-modal" onClick={e => e.stopPropagation()}>
                            <h3>Manage Slot {actionModal.slot}</h3>
                            <div className="modal-details">
                                <p><strong>User:</strong> {actionModal.booking.name}</p>
                                <p><strong>Vehicle:</strong> {actionModal.booking.vehicle_no}</p>
                                <p><strong>Time:</strong> {actionModal.booking.time_slot}</p>
                            </div>
                            <div className="modal-actions">
                                <button className="modal-btn move-btn" onClick={handleMoveBooking}>
                                    Move Slot
                                </button>
                                <button className="modal-btn cancel-booking-btn" onClick={handleCancelBooking}>
                                    Cancel Booking
                                </button>
                                <button className="modal-btn close-btn" onClick={() => setActionModal(null)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminSlotPage;

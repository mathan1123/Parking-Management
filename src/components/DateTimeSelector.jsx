import React, { useState } from 'react';
import TimeTumbler from './TimeTumbler';
import './DateTimeSelector.css';

const DateTimeSelector = ({ onBack, onConfirm }) => {
    const [dateRange, setDateRange] = useState({ start: null, end: null }); // Range selection

    // Time States
    const [inTime, setInTime] = useState({ hour: '09', minute: '00', period: 'AM' });
    const [outTime, setOutTime] = useState({ hour: '06', minute: '00', period: 'PM' });

    const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); // Start Jan 2026



    // Calendar Utils
    const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getStartDay = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate);
    const startOffset = getStartDay(currentDate);
    const dates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleConfirm = () => {
        const timeString = `${inTime.hour}:${inTime.minute} ${inTime.period} - ${outTime.hour}:${outTime.minute} ${outTime.period}`;

        // Format range string for display
        const startMonth = monthNames[dateRange.monthIndex];
        const rangeString = `${dateRange.start} - ${dateRange.end} ${monthNames[currentDate.getMonth()]}`;

        // Construct standardized date objects/strings for backend
        // Assuming current year 2026 based on state init, but should rely on currentDate.getFullYear()
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        // Helper to format YYYY-MM-DD
        const formatDate = (d) => {
            const date = new Date(year, month, d);
            // Adjust for timezone offset to get local YYYY-MM-DD
            const offset = date.getTimezoneOffset();
            const localDate = new Date(date.getTime() - (offset * 60 * 1000));
            return localDate.toISOString().split('T')[0];
        };

        const startDateStr = formatDate(dateRange.start);
        const endDateStr = dateRange.end ? formatDate(dateRange.end) : startDateStr;

        // Pass structured data
        onConfirm(rangeString, timeString, { start: startDateStr, end: endDateStr });
    };

    const handleDateClick = (day) => {
        // Simple logic: Reset if changing months? Or keep simple logic "Select dates in CURRENT VIEW"
        // For this task scope, let's allow selection within the current view month.
        if (!dateRange.start || (dateRange.start && dateRange.end)) {
            setDateRange({ start: day, end: null, monthIndex: currentDate.getMonth() });
        } else {
            const start = Math.min(dateRange.start, day);
            const end = Math.max(dateRange.start, day);
            setDateRange({ start, end, monthIndex: currentDate.getMonth() });
        }
    };

    return (
        <div className="datetime-wrapper">
            <h3 className="section-title">Select Date & Time</h3>

            <div className="datetime-container">
                {/* Calendar Section */}
                <div className="calendar-section">
                    <div className="calendar-header">
                        <span className="month-label" style={{ color: '#000', fontWeight: 'bold' }}>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </span>
                        <div className="calendar-nav">
                            <button className="nav-arrow" onClick={handlePrevMonth}>{'<'}</button>
                            <button className="nav-arrow" onClick={handleNextMonth}>{'>'}</button>
                        </div>
                    </div>

                    <div className="calendar-grid">
                        {days.map(day => (
                            <div key={day} className="calendar-day-header">{day}</div>
                        ))}
                        {Array.from({ length: startOffset }).map((_, i) => (
                            <div key={`empty-${i}`} className="calendar-date empty"></div>
                        ))}
                        {dates.map(date => {
                            const isSelected = dateRange.monthIndex === currentDate.getMonth() &&
                                (dateRange.start === date || dateRange.end === date);
                            const isInRange = dateRange.monthIndex === currentDate.getMonth() &&
                                (date > dateRange.start && date < dateRange.end);

                            return (
                                <button
                                    key={date}
                                    className={`calendar-date 
                                    ${isSelected ? 'selected' : ''}
                                    ${isInRange ? 'in-range' : ''}
                                `}
                                    onClick={() => handleDateClick(date)}
                                >
                                    {date}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Time Selection Section */}
                <div className="time-select-section">
                    <div className="slots-header">
                        <span className="slots-title">Select Duration</span>
                    </div>

                    <div className="tumbler-layout">
                        <TimeTumbler
                            label="IN TIME"
                            value={inTime}
                            onChange={setInTime}
                        />

                        <div className="tumbler-separator">to</div>

                        <TimeTumbler
                            label="OUT TIME"
                            value={outTime}
                            onChange={setOutTime}
                        />
                    </div>

                    <div className="time-summary">
                        Selected: {inTime.hour}:{inTime.minute} {inTime.period} to {outTime.hour}:{outTime.minute} {outTime.period}
                    </div>
                </div>
            </div>

            <div className="action-footer">
                <button onClick={onBack} className="back-link">Back</button>
                <button
                    className="book-btn"
                    disabled={!dateRange.start}
                    onClick={handleConfirm}
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};

export default DateTimeSelector;

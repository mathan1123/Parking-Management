import React, { useRef, useEffect } from 'react';
import './TimeTumbler.css';

const TimeTumbler = ({ label, value, onChange }) => {
    // value format: { hour: '12', minute: '00', period: 'AM' }

    // Generate arrays
    const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    // Helper to handle scroll snap selection (Simplified for V1: click to select)
    // For a true "tumbler" feel, we use scrollable divs with snap points.

    const Column = ({ items, selected, onSelect, type }) => {
        const scrollRef = useRef(null);

        useEffect(() => {
            if (scrollRef.current) {
                // Determine index of selected item
                const index = items.indexOf(selected);
                if (index !== -1) {
                    const itemHeight = 40; // Approx height of an item
                    scrollRef.current.scrollTop = index * itemHeight;
                }
            }
        }, [selected]); // Only scroll on external change or init

        return (
            <div className="tumbler-column">
                <div className="tumbler-scroll" ref={scrollRef}>
                    <div className="spacer"></div>
                    {items.map(item => (
                        <div
                            key={item}
                            className={`tumbler-item ${item === selected ? 'selected' : ''}`}
                            onClick={() => onSelect(type, item)}
                        >
                            {item}
                        </div>
                    ))}
                    <div className="spacer"></div>
                </div>
            </div>
        );
    };

    const handleSelect = (type, val) => {
        onChange({ ...value, [type]: val });
    };

    return (
        <div className="time-tumbler-wrapper">
            <h4 className="tumbler-label">{label}</h4>
            <div className="tumbler-container">
                <Column items={hours} selected={value.hour} onSelect={handleSelect} type="hour" />
                <div className="tumbler-colon">:</div>
                <Column items={minutes} selected={value.minute} onSelect={handleSelect} type="minute" />
                <div className="tumbler-gap"></div>
                <Column items={periods} selected={value.period} onSelect={handleSelect} type="period" />

                {/* Visual Overlay for the "Selected" window */}
                <div className="tumbler-overlay"></div>
            </div>
        </div>
    );
};

export default TimeTumbler;

import React from 'react';
import './GuideSection.css';

const GuideSection = () => {
    const steps = [
        {
            id: 1,
            title: "Select Office",
            icon: "🏢",
            description: "Choose your VDart office location."
        },
        {
            id: 2,
            title: "Fill Details",
            icon: "📝",
            description: "Enter vehicle & contact info."
        },
        {
            id: 3,
            title: "Select Date",
            icon: "📅",
            description: "Pick your dates & times."
        },
        {
            id: 4,
            title: "Get Slot",
            icon: "🅿️",
            description: "Receive your allocated parking slot."
        }
    ];

    return (
        <section id="guide" className="guide-section">
            <h2 className="guide-title">How It <span className="highlight">Works</span></h2>
            <p className="guide-subtitle">A simple 4-step process to secure your parking spot.</p>

            <div className="isometric-container">
                <div className="isometric-grid">
                    {steps.map((step, index) => (
                        <div key={step.id} className="iso-card" style={{ '--i': index }}>
                            <div className="card-content">
                                <div className="step-number">0{step.id}</div>
                                <div className="step-icon">{step.icon}</div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                            <div className="card-layer"></div>
                        </div>
                    ))}
                </div>
                {/* Connecting Line Graphic (CSS drawn) */}
                <div className="connection-path"></div>
            </div>
        </section>
    );
};

export default GuideSection;

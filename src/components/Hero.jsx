import React from 'react';
import { useNavigate } from 'react-router-dom';
import newHeroBg from '../assets/new_hero_bg.jpg';
import './Hero.css';

const Hero = () => {
    const navigate = useNavigate();

    const handleOfficeChange = (e) => {
        const selectedOffice = e.target.value;
        navigate('/booking', { state: { office: selectedOffice } });
    };

    return (
        <div className="hero-container">
            <div className="hero-card" style={{ backgroundImage: `url(${newHeroBg})` }}>
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1 className="hero-title">Parking Portal</h1>
                        <p className="hero-subtitle">
                            Find, book, and manage your parking spaces with
                            ease. Our intuitive system simplifies the entire process.
                        </p>

                        <div className="office-selector">
                            <select
                                defaultValue=""
                                onChange={handleOfficeChange}
                                className="office-dropdown"
                            >
                                <option value="" disabled>Select an office...</option>
                                <option value="trichy">VDart GCC, Trichy</option>
                                <option value="bangalore">VDart Digital, Bangalore</option>
                                <option value="chennai">VDart Digital, Chennai</option>
                                <option value="atlanta">VDart, US Atlanta</option>
                            </select>
                            <div className="dropdown-arrow">▼</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;

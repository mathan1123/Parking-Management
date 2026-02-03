import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-brand-section">
                    <div className="footer-logo">
                        <span className="logo-icon">➤</span>
                        <span className="logo-text">VDart</span>
                    </div>

                    <div className="contact-section">
                        <h4>Contact us</h4>
                        <div className="contact-details">
                            <div className="contact-item">
                                <span className="icon">📍</span>
                                <span>Vdart, 30, Chennai - Theni Hwy, Mannarpuram</span>
                            </div>
                            <div className="contact-item">
                                <span className="icon">📞</span>
                                <span>+91 99445 48333</span>
                            </div>
                            <div className="contact-item">
                                <span className="icon">✉️</span>
                                <span>info@vdartacademy.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-links-section">
                    <div className="link-column">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><a href="#guide">Guide</a></li>
                            <li><a href="#">Gallery</a></li>
                        </ul>
                    </div>
                    <div className="link-column">
                        <h4>Social Links</h4>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">Twitter</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="copyright">
                    © VDart Academy 2025. All Rights Reserved. <a href="#">Disclaimer</a> | <a href="#">Privacy Policy</a>
                </div>
                <button className="scroll-top-btn" onClick={scrollToTop}>↑</button>
            </div>
        </footer>
    );
};

export default Footer;

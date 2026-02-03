import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';
import logo from '../assets/vdart_logo_new.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToGuide = (e) => {
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation and then scroll (using small timeout for simplicity)
      setTimeout(() => {
        const guideSection = document.getElementById('guide');
        if (guideSection) guideSection.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    e.preventDefault();
    const guideSection = document.getElementById('guide');
    if (guideSection) {
      guideSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = (e) => {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const adminPaths = [
    '/admin-dashboard',
    '/approvals',
    '/office-master',
    '/slot-management',
    '/create-admin',
    '/user-details',
    '/admin-login'
  ];

  if (adminPaths.includes(location.pathname)) {
    return null;
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <div className="navbar-brand" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="VDart Logo" className="logo-image" />
        </div>

        <div className="navbar-links">
          <Link to="/" onClick={handleHomeClick} className="nav-link">Home</Link>
          <a href="#guide" onClick={scrollToGuide} className="nav-link">Guide</a>
        </div>

        <div className="navbar-actions">
          <Link to="/history" className="btn btn-primary">History Tracking</Link>
          <Link to="/admin-login" className="btn btn-primary">Admin Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

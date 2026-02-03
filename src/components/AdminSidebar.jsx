import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/vdart_logo_admin.png';
import './AdminSidebar.css';

const AdminSidebar = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <aside className="admin-sidebar">
            <div className="sidebar-logo">
                <img src={logo} alt="VDart Logo" style={{ width: '120px', height: 'auto', marginBottom: '10px' }} />
            </div>

            <ul className="sidebar-menu">
                <li>
                    <Link to="/admin-dashboard" className={`menu-item ${currentPath === '/admin-dashboard' ? 'active' : ''}`}>
                        <span>⊞</span> Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/approvals" className={`menu-item ${currentPath === '/approvals' ? 'active' : ''}`}>
                        <span>✓</span> Approvals
                    </Link>
                </li>
                <li>
                    <Link to="/office-master" className={`menu-item ${currentPath === '/office-master' ? 'active' : ''}`}>
                        <span>🏢</span> Office Master
                    </Link>
                </li>

                <li>
                    <Link to="/slot-management" className={`menu-item ${currentPath === '/slot-management' ? 'active' : ''}`}>
                        <span>⏱</span> Slot Management
                    </Link>
                </li>
                <li>
                    <Link to="/create-admin" className={`menu-item ${currentPath === '/create-admin' ? 'active' : ''}`}>
                        <span>👤</span> Create Admin
                    </Link>
                </li>
                <li>
                    <Link to="/user-details" className={`menu-item ${currentPath === '/user-details' ? 'active' : ''}`}>
                        <span>📊</span> User Details
                    </Link>
                </li>
            </ul>

            <div className="sidebar-footer">
                <a href="/" className="menu-item">
                    <span>←</span> Logout
                </a>
            </div>
        </aside>
    );
};

export default AdminSidebar;

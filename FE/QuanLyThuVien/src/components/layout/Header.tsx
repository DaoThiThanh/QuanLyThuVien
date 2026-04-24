import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './Header.css';

const Header: React.FC = () => {
  return (
    <header className="library-header">
      <div className="header-container">
        {/* Logo Section */}
        <div className="header-logo">
          <div className="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="logo-text">LibraryHub</span>
        </div>

        {/* Navigation Section */}
        <nav className="header-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"} end>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            Trang chủ
          </NavLink>
          <NavLink to="/book-detail" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            Sách
          </NavLink>
          <NavLink to="/borrowed-books" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
            Lịch sử mượn
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
            Hồ sơ
          </NavLink>
        </nav>

        {/* User Actions Section */}
        <div className="header-actions">
          <button className="action-btn search-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
          </button>

          <button className="action-btn notif-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            <span className="notif-badge"></span>
          </button>

          <div className="auth-actions">
            <Link to="/login" className="btn-auth btn-login-outline">Đăng nhập</Link>
            <Link to="/register" className="btn-auth btn-register-solid">Đăng ký</Link>
          </div>
        </div>
      </div>
    </header>

  );
};

export default Header;

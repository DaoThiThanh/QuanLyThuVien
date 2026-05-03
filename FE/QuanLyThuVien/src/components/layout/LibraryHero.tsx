import React, { useState, useEffect } from 'react';
import './LibraryHero.css';
import { getUserName, getToken, getUserId } from '../../services/modules/authService';

const LibraryHero: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    const name = getUserName();
    const id = getUserId();
    
    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Người dùng');
      setUserId(id);
    }
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-image-bg"></div>
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="hero-content-wrapper">
        <div className="hero-main">

          {/* Left Column */}
          <div className="hero-left">
            <div className="welcome-badge">
              <span className="wave-icon">👋</span>
              <span>Xin chào, {isLoggedIn ? userName : 'Bạn'}</span>
            </div>

            <h1 className="hero-title">
              Khám phá kho sách <br />
              <span className="highlight-text">thư viện sinh viên</span>
            </h1>

            <p className="hero-description">
              Tìm kiếm, mượn và quản lý sách dễ dàng. Hơn <strong>1,200 đầu sách</strong> đang chờ bạn khám phá.
            </p>

            <div className="search-box">
              <div className="search-input-wrapper">
                <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input type="text" placeholder="Tìm kiếm sách, tác giả, thể loại..." className="search-input" />
              </div>
              <button className="search-button">Tìm kiếm</button>
            </div>

            <div className="quick-links">
              <span className="quick-links-label">Tìm nhanh:</span>
              <div className="tags-container">
                <span className="tag">Lập trình</span>
                <span className="tag">Toán học</span>
                <span className="tag">Kinh tế</span>
                <span className="tag">Văn học</span>
                <span className="tag">Trí tuệ nhân tạo</span>
              </div>
            </div>
          </div>

          {/* Right Column - User Card */}
          <div className="hero-right">
            <div className="user-glass-card">
              <div className="user-info-row">
                <div className="user-avatar-large">
                  {isLoggedIn && userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="user-details">
                  <h3 className="user-name-large">{isLoggedIn ? userName : 'Khách'}</h3>
                  <span className="user-id">{isLoggedIn ? (userId?.substring(0, 8).toUpperCase() || 'Member') : 'Chưa đăng nhập'}</span>
                </div>
              </div>

              <div className="user-stats-row">
                <div className="stat-box">
                  <span className="stat-number">{isLoggedIn ? '0' : '-'}</span>
                  <span className="stat-label">Tổng mượn</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number highlight-yellow">{isLoggedIn ? '0' : '-'}</span>
                  <span className="stat-label">Đang mượn</span>
                </div>
              </div>

              <div className="user-actions">
                <button className="user-action-btn">
                  <div className="action-btn-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                    <span>Sách đang mượn</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
                <button className="user-action-btn">
                  <div className="action-btn-left">
                    <svg className="accent-yellow" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></svg>
                    <span>Mượn sách mới</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Overlapping Cards */}
      <div className="bottom-stats-container">
        <div className="bottom-stats-grid">
          <div className="stat-card">
            <div className="icon-wrapper icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            </div>
            <div className="stat-card-text">
              <h4 className="stat-card-value">1,200+</h4>
              <span className="stat-card-label">Đầu sách</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-wrapper icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className="stat-card-text">
              <h4 className="stat-card-value">320+</h4>
              <span className="stat-card-label">Tác giả</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="icon-wrapper icon-green">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <div className="stat-card-text">
              <h4 className="stat-card-value">850+</h4>
              <span className="stat-card-label">Lượt mượn / tháng</span>
            </div>
          </div>

          <div className="stat-card icon-yellow-bg">
            <div className="icon-wrapper icon-yellow">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-3.09 1.63.59-3.46L7 10.74l3.47-.5L12 7l1.53 3.24 3.47.5-2.5 2.43.59 3.46z" /><path d="M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2z" /></svg>
            </div>
            <div className="stat-card-text">
              <h4 className="stat-card-value">4.7★</h4>
              <span className="stat-card-label">Đánh giá TB</span>
            </div>
          </div>

          <div className="stat-card icon-red-bg">
            <div className="icon-wrapper icon-red">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            </div>
            <div className="stat-card-text">
              <h4 className="stat-card-value">2,500+</h4>
              <span className="stat-card-label">Sinh viên dùng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;

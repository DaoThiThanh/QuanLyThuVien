import React from 'react';

const ProfileStats: React.FC = () => {
  return (
    <div className="profile-stats-container">
      <div className="stat-card">
        <div className="stat-icon total">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
        <h3 className="stat-value">4</h3>
        <p className="stat-label">Tổng mượn</p>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon borrowing">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
        </div>
        <h3 className="stat-value">2</h3>
        <p className="stat-label">Đang mượn</p>
      </div>

      <div className="stat-card">
        <div className="stat-icon returned">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 className="stat-value">2</h3>
        <p className="stat-label">Đã trả</p>
      </div>
    </div>
  );
};

export default ProfileStats;

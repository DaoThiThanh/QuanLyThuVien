import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <div className="profile-card profile-header-card">
      <div className="profile-user-info">
        <div className="profile-avatar-container">
          <div className="profile-avatar">
            N
          </div>
          <button className="profile-avatar-edit-btn" aria-label="Change avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
        <div className="profile-details">
          <h2>Nguyễn Minh Tuấn</h2>
          <p className="profile-email">tuan.nguyen@student.edu.vn</p>
          <div className="profile-tags">
            <span className="profile-tag tag-student">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              Sinh viên
            </span>
            <span className="profile-tag tag-id">SV2021001</span>
          </div>
        </div>
      </div>
      
      <button className="btn-edit-profile">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
          <path d="m15 5 4 4"/>
        </svg>
        Chỉnh sửa
      </button>
    </div>
  );
};

export default ProfileHeader;

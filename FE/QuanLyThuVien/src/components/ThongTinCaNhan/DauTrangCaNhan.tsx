import React from 'react';
import { type ProfileData } from '../../dichVu/modules/dichVuXacThuc';
import styles from './DauTrangCaNhan.module.css';

interface ProfileHeaderProps {
  profile: ProfileData | null;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const getRoleName = (role: number) => {
    switch (role) {
      case 1: return 'Quản trị viên';
      case 2: return 'Thủ thư';
      case 3: return 'Sinh viên';
      default: return 'Thành viên';
    }
  };

  return (
    <div className={`${styles['profile-card']} ${styles['profile-header-card']}`}>
      <div className={styles['profile-user-info']}>
        <div className={styles['profile-avatar-container']}>
          <div className={styles['profile-avatar']}>
            {profile?.hoTen?.charAt(0).toUpperCase() || 'U'}
          </div>
          <button className={styles['profile-avatar-edit-btn']} aria-label="Change avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
        </div>
        <div className={styles['profile-details']}>
          <h2>{profile?.hoTen || 'Đang tải...'}</h2>
          <p className={styles['profile-email']}>{profile?.email || '...'}</p>
          <div className={styles['profile-tags']}>
            <span className={`${styles['profile-tag']} ${styles['tag-student']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
              </svg>
              {getRoleName(profile?.vaiTro || 3)}
            </span>
            <span className={`${styles['profile-tag']} ${styles['tag-id']}`}>{profile?.id.substring(0, 8).toUpperCase() || 'ID'}</span>
          </div>
        </div>
      </div>
      
      <button className={styles['btn-edit-profile']}>
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

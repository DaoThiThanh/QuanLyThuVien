import React from 'react';
import { type ProfileData } from '../../dichVu/modules/dichVuXacThuc';
import styles from './ThongTinCaNhan.module.css';

interface PersonalInfoProps {
  profile: ProfileData | null;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ profile }) => {
  return (
    <div className={styles['profile-card']}>
      <h3 className={styles['profile-card-title']}>Thông tin cá nhân</h3>
      
      <div className={styles['info-form-group']}>
        <label className={styles['info-label']}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          Họ và tên
        </label>
        <div className={styles['info-input-wrapper']}>
          <input type="text" className={styles['info-input']} value={profile?.hoTen || ''} readOnly />
        </div>
      </div>

      <div className={styles['info-form-group']}>
        <label className={styles['info-label']}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
          Email
        </label>
        <div className={styles['info-input-wrapper']}>
          <input type="email" className={styles['info-input']} value={profile?.email || ''} readOnly />
        </div>
      </div>

      <div className={styles['info-form-group']}>
        <label className={styles['info-label']}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          Số điện thoại
        </label>
        <div className={styles['info-input-wrapper']}>
          <input type="tel" className={styles['info-input']} value={profile?.soDienThoai || 'Chưa cập nhật'} readOnly />
        </div>
      </div>

      <div className={styles['info-form-group']}>
        <label className={styles['info-label']}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="5" rx="2"/>
            <line x1="2" x2="22" y1="10" y2="10"/>
          </svg>
          Mã định danh
        </label>
        <div className={styles['info-input-wrapper']}>
          <input type="text" className={styles['info-input']} value={profile?.id || ''} readOnly />
          <span className={styles['input-suffix']}>(Không thể thay đổi)</span>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;

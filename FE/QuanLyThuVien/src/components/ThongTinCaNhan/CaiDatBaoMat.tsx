import React from 'react';
import styles from './CaiDatBaoMat.module.css';

const SecuritySettings: React.FC = () => {
  return (
    <div className={styles['profile-card']}>
      <h3 className={styles['profile-card-title']}>Bảo mật</h3>
      <p className={styles['security-description']}>Quản lý mật khẩu và bảo mật tài khoản</p>
      
      <button className={styles['btn-change-password']}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
        </svg>
        Đổi mật khẩu
      </button>
    </div>
  );
};

export default SecuritySettings;

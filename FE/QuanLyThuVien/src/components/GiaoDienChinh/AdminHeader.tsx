import React from 'react';
import { Link } from 'react-router-dom';
import { FiRefreshCw, FiLogOut, FiChevronDown } from 'react-icons/fi';
import styles from '../../pages/TrangAdmin.module.css';
import { getUserName } from '../../dichVu/modules/dichVuXacThuc';

interface AdminHeaderProps {
  title: string;
  onRefresh: () => void;
  accentColor?: string;
  avatarLetter?: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ 
  title, 
  onRefresh, 
  accentColor = 'var(--accent)', 
  avatarLetter = 'A' 
}) => {
  const userName = getUserName();
  const displayLetter = avatarLetter || (userName ? userName.charAt(0).toUpperCase() : 'A');

  return (
    <header className={styles['admin-header']}>
      <div className={styles['header-left-group']}>
        <h1 className={styles['admin-header-title']}>{title}</h1>
        <div className={styles['header-breadcrumb']}>
            <span>Hệ thống</span>
            <span className={styles['breadcrumb-separator']}>/</span>
            <span className={styles['breadcrumb-active']}>{title}</span>
        </div>
      </div>

      <div className={styles['admin-header-actions']}>
        <div className={styles['header-clock-box']}>
            <span className={styles['clock-date']}>
                {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
        </div>

        <button className={styles['icon-btn']} onClick={onRefresh} title="Làm mới dữ liệu">
          <FiRefreshCw size={20} />
        </button>

        <div className={styles['admin-profile-btn']} style={{ borderColor: accentColor }}>
          <div className={styles['admin-avatar']} style={{ 
            backgroundColor: accentColor, 
            boxShadow: `0 0 0 2px var(--bg), 0 0 0 4px ${accentColor}` 
          }}>
            {displayLetter}
          </div>
          <div className={styles['profile-info-mini']}>
            <span className={styles['admin-username']}>{userName || 'Người dùng'}</span>
            <span className={styles['admin-role-badge']}>Chuyên viên</span>
          </div>
          <FiChevronDown className={styles['chevron-icon']} size={16} />
        </div>

        <Link to="/" className={styles['exit-btn']} title="Trở về trang chủ">
          <FiLogOut size={20} />
        </Link>
      </div>
    </header>
  );
};

export default AdminHeader;

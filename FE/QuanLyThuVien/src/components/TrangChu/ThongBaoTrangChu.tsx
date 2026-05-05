import React from 'react';
import styles from './ThongBaoTrangChu.module.css';


const HomeAnnouncements: React.FC = () => {
  return (
    <div className={styles['announcements-container']}>
      <div className={`${styles['announcement-item']} ${styles['info']}`}>
        <div className={styles['announcement-icon-wrapper']}>
          <span role="img" aria-label="megaphone">📢</span>
        </div>
        <p className={styles['announcement-text']}>
          Thư viện mở cửa từ 7:00 – 21:00 các ngày trong tuần.
        </p>
      </div>

      <div className={`${styles['announcement-item']} ${styles['success']}`}>
        <div className={styles['announcement-icon-wrapper']}>
          <span role="img" aria-label="party">🎉</span>
        </div>
        <p className={styles['announcement-text']}>
          Bổ sung 50 đầu sách mới trong tháng 3/2026 – xem ngay!
        </p>
        <a href="#" className={styles['announcement-link']}>Xem ngay &rarr;</a>
      </div>

      <div className={`${styles['announcement-item']} ${styles['warning']}`}>
        <div className={styles['announcement-icon-wrapper']}>
          <span role="img" aria-label="warning">⚠️</span>
        </div>
        <p className={styles['announcement-text']}>
          Nhắc nhở: Hạn trả sách tháng 3 là ngày 25/03/2026.
        </p>
      </div>
    </div>
  );
};

export default HomeAnnouncements;

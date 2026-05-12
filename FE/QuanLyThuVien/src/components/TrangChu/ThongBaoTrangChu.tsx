import React, { useState, useEffect } from 'react';
import styles from './ThongBaoTrangChu.module.css';
import { GetDanhSachSach } from '../../dichVu/modules/dichVuSach';
import { useNavigate } from 'react-router-dom';

const HomeAnnouncements: React.FC = () => {
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        const res = await GetDanhSachSach(1, 1);
        if (isMounted && res && res.totalItems) {
          setTotalBooks(res.totalItems);
        }
      } catch (err) {
        // Handle error silently or with a fallback
        console.warn("Could not fetch total books count for announcements:", err);
      }
    };
    fetchStats();
    return () => { isMounted = false; };
  }, []);
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

      {totalBooks > 0 && (
        <div className={`${styles['announcement-item']} ${styles['success']}`}>
          <div className={styles['announcement-icon-wrapper']}>
            <span role="img" aria-label="party">🎉</span>
          </div>
          <p className={styles['announcement-text']}>
            Thư viện hiện có hơn <strong>{totalBooks}</strong> đầu sách đa dạng các thể loại – khám phá ngay!
          </p>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/books'); }} className={styles['announcement-link']}>Xem ngay &rarr;</a>
        </div>
      )}
    </div>
  );
};

export default HomeAnnouncements;

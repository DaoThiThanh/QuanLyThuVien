import React from 'react';
import { Link } from 'react-router-dom';
import { LuBookOpen, LuMapPin, LuPhone, LuMail, LuClock } from 'react-icons/lu';
import styles from './CuoiTrang.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles['footer-container']}>
      <div className={styles['footer-content']}>
        <div className={`${styles['footer-column']} ${styles['brand-column']}`}>
          <div className={styles['footer-brand']}>
            <div className={styles['brand-logo']}>
              <LuBookOpen size={24} />
            </div>
            <span className={styles['brand-name']}>LibraryHub</span>
          </div>
          <p className={styles['brand-description']}>
            Hệ thống quản lý thư viện sinh viên hiện đại, giúp bạn tìm kiếm và mượn sách dễ dàng.
          </p>
        </div>

        <div className={`${styles['footer-column']} ${styles['links-column']}`}>
          <h3 className={styles['footer-title']}>Liên kết nhanh</h3>
          <ul className={styles['footer-links']}>
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/books">Danh sách sách</Link></li>
            <li><Link to="/borrowed">Sách đang mượn</Link></li>
            <li><Link to="/profile">Hồ sơ cá nhân</Link></li>
          </ul>
        </div>

        <div className={`${styles['footer-column']} ${styles['contact-column']}`}>
          <h3 className={styles['footer-title']}>Liên hệ</h3>
          <ul className={styles['footer-contact']}>
            <li>
              <LuMapPin className={`${styles['contact-icon']} ${styles['text-red']}`} size={18} />
              <span>Phòng 101, Tòa nhà A, Trường ĐH</span>
            </li>
            <li>
              <LuPhone className={`${styles['contact-icon']} ${styles['text-red']}`} size={18} />
              <span>(024) 3456 7890</span>
            </li>
            <li>
              <LuMail className={styles['contact-icon']} size={18} />
              <span>library@university.edu.vn</span>
            </li>
            <li>
              <LuClock className={styles['contact-icon']} size={18} />
              <span>Thứ 2 - 7: 7:00 - 21:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles['footer-bottom']}>
        <p>© 2026 LibraryHub — Hệ thống quản lý thư viện sinh viên</p>
      </div>
    </footer>
  );
};

export default Footer;

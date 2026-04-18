import React from 'react';
import { Link } from 'react-router-dom';
import { LuBookOpen, LuMapPin, LuPhone, LuMail, LuClock } from 'react-icons/lu';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-column brand-column">
          <div className="footer-brand">
            <div className="brand-logo">
              <LuBookOpen size={24} />
            </div>
            <span className="brand-name">LibraryHub</span>
          </div>
          <p className="brand-description">
            Hệ thống quản lý thư viện sinh viên hiện đại, giúp bạn tìm kiếm và mượn sách dễ dàng.
          </p>
        </div>

        <div className="footer-column links-column">
          <h3 className="footer-title">Liên kết nhanh</h3>
          <ul className="footer-links">
            <li><Link to="/">Trang chủ</Link></li>
            <li><Link to="/books">Danh sách sách</Link></li>
            <li><Link to="/borrowed">Sách đang mượn</Link></li>
            <li><Link to="/profile">Hồ sơ cá nhân</Link></li>
          </ul>
        </div>

        <div className="footer-column contact-column">
          <h3 className="footer-title">Liên hệ</h3>
          <ul className="footer-contact">
            <li>
              <LuMapPin className="contact-icon text-red" size={18} />
              <span>Phòng 101, Tòa nhà A, Trường ĐH</span>
            </li>
            <li>
              <LuPhone className="contact-icon text-red" size={18} />
              <span>(024) 3456 7890</span>
            </li>
            <li>
              <LuMail className="contact-icon" size={18} />
              <span>library@university.edu.vn</span>
            </li>
            <li>
              <LuClock className="contact-icon" size={18} />
              <span>Thứ 2 - 7: 7:00 - 21:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 LibraryHub — Hệ thống quản lý thư viện sinh viên</p>
      </div>
    </footer>
  );
};

export default Footer;

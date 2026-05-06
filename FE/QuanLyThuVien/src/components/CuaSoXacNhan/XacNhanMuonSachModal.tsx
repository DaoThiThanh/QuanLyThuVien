import React from 'react';
import { FiX, FiCalendar } from 'react-icons/fi';
import styles from './XacNhanMuonSachModal.module.css';

interface XacNhanMuonSachModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  bookData: {
    tenSach: string;
    tenTacGia: string;
    hinhAnh: string;
    tenDanhMuc: string;
  };
}

const XacNhanMuonSachModal: React.FC<XacNhanMuonSachModalProps> = ({ isOpen, onClose, onConfirm, bookData, isLoading }) => {
  if (!isOpen) return null;

  // Calculate dates
  const today = new Date();
  const dueDate = new Date();
  dueDate.setDate(today.getDate() + 14);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h2 className={styles['modal-title']}>Xác nhận mượn sách</h2>
          <button className={styles['close-btn']} onClick={onClose} disabled={isLoading}>
            <FiX />
          </button>
        </div>

        <div className={styles['modal-body']}>
          <div className={styles['book-summary-card']}>
            <img src={bookData.hinhAnh} alt={bookData.tenSach} className={styles['summary-image']} />
            <div className={styles['summary-info']}>
              <h3 className={styles['summary-title']}>{bookData.tenSach}</h3>
              <p className={styles['summary-author']}>{bookData.tenTacGia}</p>
              <span className={styles['summary-tag']}>{bookData.tenDanhMuc}</span>
            </div>
          </div>

          <div className={styles['date-info-section']}>
            <div className={styles['date-row']}>
              <div className={styles['date-label']}>
                <FiCalendar className={styles['icon-blue']} />
                <span>Ngày mượn</span>
              </div>
              <span className={styles['date-value']}>{formatDate(today)}</span>
            </div>
            
            <div className={`${styles['date-row']} ${styles['highlight-orange']}`}>
              <div className={styles['date-label']}>
                <FiCalendar className={styles['icon-orange']} />
                <span>Hạn trả sách</span>
              </div>
              <span className={`${styles['date-value']} ${styles['text-orange']}`}>{formatDate(dueDate)}</span>
            </div>
          </div>

          <p className={styles['modal-note']}>
            Vui lòng trả sách đúng hạn để tránh bị phạt. Mỗi ngày trễ sẽ bị tính phí 2.000đ.
          </p>

          <div className={styles['modal-actions']}>
            <button className={styles['btn-cancel']} onClick={onClose} disabled={isLoading}>Hủy bỏ</button>
            <button 
              className={styles['btn-confirm-borrow']} 
              onClick={onConfirm} 
              disabled={isLoading}
            >
              {isLoading ? 'Đang xử lý...' : 'Xác nhận mượn'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XacNhanMuonSachModal;

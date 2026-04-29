import React from 'react';
import { FiX, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import './BorrowConfirmModal.css';

interface BorrowConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookData: {
    tenSach: string;
    tenTacGia: string;
    hinhAnh: string;
    tenDanhMuc: string;
  };
}

const BorrowConfirmModal: React.FC<BorrowConfirmModalProps> = ({ isOpen, onClose, onConfirm, bookData }) => {
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
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Xác nhận mượn sách</h2>
          <button className="close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div className="book-summary-card">
            <img src={bookData.hinhAnh} alt={bookData.tenSach} className="summary-image" />
            <div className="summary-info">
              <h3 className="summary-title">{bookData.tenSach}</h3>
              <p className="summary-author">{bookData.tenTacGia}</p>
              <span className="summary-tag">{bookData.tenDanhMuc}</span>
            </div>
          </div>

          <div className="date-info-section">
            <div className="date-row">
              <div className="date-label">
                <FiCalendar className="icon-blue" />
                <span>Ngày mượn</span>
              </div>
              <span className="date-value">{formatDate(today)}</span>
            </div>
            
            <div className="date-row highlight-orange">
              <div className="date-label">
                <FiCalendar className="icon-orange" />
                <span>Hạn trả sách</span>
              </div>
              <span className="date-value text-orange">{formatDate(dueDate)}</span>
            </div>
          </div>

          <p className="modal-note">
            Vui lòng trả sách đúng hạn để tránh bị phạt. Mỗi ngày trễ sẽ bị tính phí 2.000đ.
          </p>

          <div className="modal-actions">
            <button className="btn-cancel" onClick={onClose}>Hủy bỏ</button>
            <button className="btn-confirm-borrow" onClick={onConfirm}>Xác nhận mượn</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BorrowConfirmModal;

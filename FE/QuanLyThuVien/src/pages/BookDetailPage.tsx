import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiTag, FiPrinter, FiCalendar, FiBook, FiCheckCircle } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BorrowConfirmModal from '../components/modals/BorrowConfirmModal';
import './BookDetailPage.css';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  
  // Mock data for demonstration - in real app, fetch from API using id
  const book = {
    id: id || '1',
    tenSach: 'Nhập môn Trí tuệ nhân tạo',
    tenTacGia: 'Trần Thị Linh',
    hinhAnh: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
    tenDanhMuc: 'Công nghệ thông tin',
    nhaXuatBan: 'NXB Đại học Bách Khoa',
    namXuatBan: 2023,
    isbn: '978-604-123-456-12',
    moTa: 'Cuốn sách giới thiệu toàn diện về trí tuệ nhân tạo và học máy, từ các thuật toán cơ bản đến mạng neural và deep learning. Phù hợp cho sinh viên CNTT muốn tìm hiểu về AI.',
    soLuongTon: 2,
    tongSoLuong: 4,
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmBorrow = () => {
    // Logic for confirming borrow (e.g., API call)
    alert('Yêu cầu mượn sách đã được gửi thành công!');
    setShowBorrowModal(false);
  };

  return (
    <div className="book-detail-page">
      <Header />
      
      <main className="detail-container">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs">
          <button className="back-link" onClick={handleBack}>
            <FiArrowLeft /> Quay lại
          </button>
          <span className="separator">/</span>
          <span className="breadcrumb-item">Sách</span>
          <span className="separator">/</span>
          <span className="breadcrumb-item active">{book.tenSach}</span>
        </nav>

        <div className="detail-card">
          <div className="detail-grid">
            {/* Left Column: Image & Stats */}
            <div className="detail-left">
              <div className="book-cover-wrapper">
                <img src={book.hinhAnh} alt={book.tenSach} className="book-detail-cover" />
                <div className="status-badge-detail">
                  <FiCheckCircle /> Có sẵn
                </div>
              </div>
              
              <div className="availability-stats">
                <p className="stats-label">Bản sao hiện có</p>
                <div className="dots-indicator">
                  {[...Array(book.tongSoLuong)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`dot ${i < book.soLuongTon ? 'active' : ''}`}
                    ></span>
                  ))}
                </div>
                <p className="stats-text">
                  <span className="available-count">{book.soLuongTon}/{book.tongSoLuong}</span> bản có sẵn
                </p>
              </div>
            </div>

            {/* Right Column: Info & Actions */}
            <div className="detail-right">
              <div className="book-header-info">
                <span className="category-tag">{book.tenDanhMuc}</span>
                <h1 className="book-detail-title">{book.tenSach}</h1>
                <p className="book-detail-author">{book.tenTacGia}</p>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <div className="info-icon">
                    <FiUser />
                  </div>
                  <div className="info-content">
                    <span className="label">Tác giả</span>
                    <span className="value">{book.tenTacGia}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FiTag />
                  </div>
                  <div className="info-content">
                    <span className="label">Thể loại</span>
                    <span className="value">{book.tenDanhMuc}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FiPrinter />
                  </div>
                  <div className="info-content">
                    <span className="label">Nhà xuất bản</span>
                    <span className="value">{book.nhaXuatBan}</span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-icon">
                    <FiCalendar />
                  </div>
                  <div className="info-content">
                    <span className="label">Năm xuất bản</span>
                    <span className="value">{book.namXuatBan}</span>
                  </div>
                </div>

                <div className="info-item full-width">
                  <div className="info-icon">
                    <FiBook />
                  </div>
                  <div className="info-content">
                    <span className="label">ISBN</span>
                    <span className="value">{book.isbn}</span>
                  </div>
                </div>
              </div>

              <div className="book-description">
                <h3 className="desc-title">Mô tả sách</h3>
                <p className="desc-text">{book.moTa}</p>
              </div>

              <div className="detail-actions">
                <button className="btn-borrow-main" onClick={() => setShowBorrowModal(true)}>
                  <FiBook /> Mượn sách này
                </button>
                <button className="btn-back-list" onClick={handleBack}>
                  <FiArrowLeft /> Quay lại danh sách
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BorrowConfirmModal 
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        onConfirm={handleConfirmBorrow}
        bookData={{
          tenSach: book.tenSach,
          tenTacGia: book.tenTacGia,
          hinhAnh: book.hinhAnh,
          tenDanhMuc: book.tenDanhMuc
        }}
      />

      <Footer />
    </div>
  );
};

export default BookDetailPage;

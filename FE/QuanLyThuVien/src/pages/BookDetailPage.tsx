import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiTag, FiPrinter, FiCalendar, FiBook, FiCheckCircle } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BorrowConfirmModal from '../components/modals/BorrowConfirmModal';
import styles from './BookDetailPage.module.css';

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
    <div className={styles['book-detail-page']}>
      <Header />
      
      <main className={styles['detail-container']}>
        {/* Breadcrumbs */}
        <nav className={styles['breadcrumbs']}>
          <button className={styles['back-link']} onClick={handleBack}>
            <FiArrowLeft /> Quay lại
          </button>
          <span className={styles['separator']}>/</span>
          <span className={styles['breadcrumb-item']}>Sách</span>
          <span className={styles['separator']}>/</span>
          <span className={`${styles['breadcrumb-item']} ${styles['active']}`}>{book.tenSach}</span>
        </nav>

        <div className={styles['detail-card']}>
          <div className={styles['detail-grid']}>
            {/* Left Column: Image & Stats */}
            <div className={styles['detail-left']}>
              <div className={styles['book-cover-wrapper']}>
                <img src={book.hinhAnh} alt={book.tenSach} className={styles['book-detail-cover']} />
                <div className={styles['status-badge-detail']}>
                  <FiCheckCircle /> Có sẵn
                </div>
              </div>
              
              <div className={styles['availability-stats']}>
                <p className={styles['stats-label']}>Bản sao hiện có</p>
                <div className={styles['dots-indicator']}>
                  {[...Array(book.tongSoLuong)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`${styles['dot']} ${i < book.soLuongTon ? styles['active'] : ''}`}
                    ></span>
                  ))}
                </div>
                <p className={styles['stats-text']}>
                  <span className={styles['available-count']}>{book.soLuongTon}/{book.tongSoLuong}</span> bản có sẵn
                </p>
              </div>
            </div>

            {/* Right Column: Info & Actions */}
            <div className={styles['detail-right']}>
              <div className={styles['book-header-info']}>
                <span className={styles['category-tag']}>{book.tenDanhMuc}</span>
                <h1 className={styles['book-detail-title']}>{book.tenSach}</h1>
                <p className={styles['book-detail-author']}>{book.tenTacGia}</p>
              </div>

              <div className={styles['info-grid']}>
                <div className={styles['info-item']}>
                  <div className={styles['info-icon']}>
                    <FiUser />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>Tác giả</span>
                    <span className={styles['value']}>{book.tenTacGia}</span>
                  </div>
                </div>

                <div className={styles['info-item']}>
                  <div className={styles['info-icon']}>
                    <FiTag />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>Thể loại</span>
                    <span className={styles['value']}>{book.tenDanhMuc}</span>
                  </div>
                </div>

                <div className={styles['info-item']}>
                  <div className={styles['info-icon']}>
                    <FiPrinter />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>Nhà xuất bản</span>
                    <span className={styles['value']}>{book.nhaXuatBan}</span>
                  </div>
                </div>

                <div className={styles['info-item']}>
                  <div className={styles['info-icon']}>
                    <FiCalendar />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>Năm xuất bản</span>
                    <span className={styles['value']}>{book.namXuatBan}</span>
                  </div>
                </div>

                <div className={`${styles['info-item']} ${styles['full-width']}`}>
                  <div className={styles['info-icon']}>
                    <FiBook />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>ISBN</span>
                    <span className={styles['value']}>{book.isbn}</span>
                  </div>
                </div>
              </div>

              <div className={styles['book-description']}>
                <h3 className={styles['desc-title']}>Mô tả sách</h3>
                <p className={styles['desc-text']}>{book.moTa}</p>
              </div>

              <div className={styles['detail-actions']}>
                <button className={styles['btn-borrow-main']} onClick={() => setShowBorrowModal(true)}>
                  <FiBook /> Mượn sách này
                </button>
                <button className={styles['btn-back-list']} onClick={handleBack}>
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

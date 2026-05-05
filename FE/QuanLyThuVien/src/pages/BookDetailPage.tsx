import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiTag, FiPrinter, FiCalendar, FiBook, FiCheckCircle } from 'react-icons/fi';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BorrowConfirmModal from '../components/modals/BorrowConfirmModal';
import styles from './BookDetailPage.module.css';
import { getToken } from '../services/modules/authService';
import { GetBookById } from '../services/modules/bookService';

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await GetBookById(id);
        setBook(data);
      } catch (error) {
        console.error("Lỗi khi tải chi tiết sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetail();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleConfirmBorrow = () => {
    // Logic for confirming borrow (e.g., API call)
    alert('Yêu cầu mượn sách đã được gửi thành công!');
    setShowBorrowModal(false);
  };

  if (loading) {
    return (
      <div className={styles['book-detail-page']}>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="loader">Đang tải thông tin sách...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!book) {
    return (
      <div className={styles['book-detail-page']}>
        <Header />
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: '20px' }}>
          <h3>Không tìm thấy thông tin sách.</h3>
          <button className={styles['btn-back-list']} onClick={handleBack}>Quay lại</button>
        </div>
        <Footer />
      </div>
    );
  }

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
                <img src={book.hinhAnh || 'https://via.placeholder.com/400x600'} alt={book.tenSach} className={styles['book-detail-cover']} />
                <div className={styles['status-badge-detail']}>
                  <FiCheckCircle /> {book.soLuongTon > 0 ? "Có sẵn" : "Hết sách"}
                </div>
              </div>
              
              <div className={styles['availability-stats']}>
                <p className={styles['stats-label']}>Bản sao hiện có</p>
                <div className={styles['dots-indicator']}>
                  {[...Array(book.tongSoLuong || 5)].map((_, i) => (
                    <span 
                      key={i} 
                      className={`${styles['dot']} ${i < book.soLuongTon ? styles['active'] : ''}`}
                    ></span>
                  ))}
                </div>
                <p className={styles['stats-text']}>
                  <span className={styles['available-count']}>{book.soLuongTon}/{book.tongSoLuong || 5}</span> bản có sẵn
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
                    <span className={styles['value']}>{book.tenNhaXuatBan || "Đang cập nhật"}</span>
                  </div>
                </div>

                <div className={styles['info-item']}>
                  <div className={styles['info-icon']}>
                    <FiCalendar />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>Năm xuất bản</span>
                    <span className={styles['value']}>{book.namXuatBan || "N/A"}</span>
                  </div>
                </div>

                <div className={`${styles['info-item']} ${styles['full-width']}`}>
                  <div className={styles['info-icon']}>
                    <FiBook />
                  </div>
                  <div className={styles['info-content']}>
                    <span className={styles['label']}>ISBN</span>
                    <span className={styles['value']}>{book.isbn || "Đang cập nhật"}</span>
                  </div>
                </div>
              </div>

              <div className={styles['book-description']}>
                <h3 className={styles['desc-title']}>Mô tả sách</h3>
                <p className={styles['desc-text']}>{book.moTa || "Chưa có mô tả cho cuốn sách này."}</p>
              </div>

              <div className={styles['detail-actions']}>
                <button 
                  className={styles['btn-borrow-main']} 
                  disabled={book.soLuongTon <= 0}
                  onClick={() => {
                    if (!getToken()) {
                      // Nếu chưa đăng nhập, chuyển hướng sang trang login và lưu lại URL hiện tại
                      navigate('/login', { state: { from: `/book-detail/${id}` } });
                      return;
                    }
                    setShowBorrowModal(true);
                  }}
                >
                  <FiBook /> {book.soLuongTon > 0 ? "Mượn sách này" : "Tạm hết sách"}
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

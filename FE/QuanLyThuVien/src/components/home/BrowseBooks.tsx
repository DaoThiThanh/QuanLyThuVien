import React, { useEffect, useState } from 'react';
import styles from './BrowseBooks.module.css';
import { FiBookOpen, FiGrid, FiList, FiEye } from 'react-icons/fi';
import { GetDanhSachSach } from '../../services/modules/bookService';
import type { PaginatedBookItem } from '../../types/book';
import { useNavigate } from 'react-router-dom';


const BrowseBooks: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const [books, setBooks] = useState<PaginatedBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await GetDanhSachSach(page, pageSize);
        if (response && response.items) {
          if (page === 1) {
            setBooks(response.items);
          } else {
            setBooks(prev => [...prev, ...response.items]);
          }
          setTotalItems(response.totalItems);
        }
      } catch (err: any) {
        console.error('Failed to fetch books:', err);
        setError(err.message || 'Lỗi khi tải danh sách sách.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [page, pageSize]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleCollapse = () => {
    setPage(1);
    // Optional: Scroll back to the top of the section
    const section = document.querySelector(`.${styles['browse-books-section']}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className={styles['browse-books-section']}>
      <div className={styles['section-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-fire']} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <FiBookOpen size={24} />
          </div>
          <div className={styles['header-titles']}>
            <h2 className={styles['section-title']}>Duyệt kho sách</h2>
            <p className={styles['section-subtitle']}>Hàng ngàn đầu sách đang chờ bạn</p>
          </div>
        </div>
      </div>

      <div className={styles['browse-filters']}>
        <div className={styles['category-tabs']}>
          <button className={`${styles['tab-btn']} ${activeTab === 'all' ? styles['active'] : ''}`} onClick={() => setActiveTab('all')}>
            Tất cả sách <span className={styles['count']}>{totalItems}</span>
          </button>
          <button className={`${styles['tab-btn']} ${activeTab === 'science' ? styles['active'] : ''}`} onClick={() => setActiveTab('science')}>
            Khoa học <span className={styles['count']}>0</span>
          </button>
          <button className={`${styles['tab-btn']} ${activeTab === 'economic' ? styles['active'] : ''}`} onClick={() => setActiveTab('economic')}>
            Kinh tế <span className={styles['count']}>0</span>
          </button>
          <button className={`${styles['tab-btn']} ${activeTab === 'literature' ? styles['active'] : ''}`} onClick={() => setActiveTab('literature')}>
            Văn học <span className={styles['count']}>0</span>
          </button>
        </div>

        <div className={styles['filter-controls']}>
          <div className={styles['filter-selects']}>
            <div className={styles['select-group']}>
              <label>Thể loại</label>
              <select>
                <option>Tất cả</option>
                <option>Giáo trình</option>
                <option>Tham khảo</option>
              </select>
            </div>
            <div className={styles['select-group']}>
              <label>Năm xuất bản</label>
              <select>
                <option>Tất cả năm</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div className={styles['select-group']}>
              <label>Tình trạng</label>
              <select>
                <option>Chỉ sách có sẵn</option>
                <option>Tất cả</option>
              </select>
            </div>
          </div>

          <div className={styles['view-toggles']}>
            <span className={styles['view-label']}>Chế độ xem</span>
            <button className={`${styles['view-btn']} ${styles['active']}`}><FiGrid /></button>
            <button className={styles['view-btn']}><FiList /></button>
          </div>
        </div>
      </div>

      <p className={styles['results-count']}>Hiển thị {books.length} trong tổng số {totalItems} sách</p>

      {error ? (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          {error}
        </div>
      ) : (
        <div className={styles['browse-books-grid']}>
          {books.map((book) => (
            <div className={styles['browse-book-card']} key={book.id}>
              <div className={styles['book-image-wrapper']}>
                <img src={book.hinhAnh || 'https://via.placeholder.com/150'} alt={book.tenSach} className={styles['book-cover']} />
                <div className={styles['book-badges']}>
                  <span className={`${styles['badge']} ${styles['status']} ${book.soLuongTon > 0 ? styles['available'] : styles['unavailable']}`}>
                    {book.soLuongTon > 0 ? 'Có sẵn' : 'Hết sách'}
                  </span>
                </div>
              </div>
              <div className={styles['book-details']}>
                <div className={styles['book-meta']}>
                  <span className={styles['book-category']}>{book.tenDanhMuc}</span>
                </div>
                <h3 className={styles['book-title']}>{book.tenSach}</h3>
                <p className={styles['book-author']}>{book.tenTacGia}</p>

                <div className={styles['book-footer']}>
                  <div className={styles['book-rating']}>
                    <span className={styles['star']}>★</span> 5.0
                  </div>
                  <div className={styles['book-actions-btns']}>
                    <button 
                      className={styles['view-detail-btn']}
                      onClick={() => navigate(`/book-detail/${book.id}`)}
                    >
                      <FiEye /> Chi tiết
                    </button>
                    <button className={`${styles['borrow-btn']} ${book.soLuongTon <= 0 ? styles['disabled'] : ''}`} disabled={book.soLuongTon <= 0}>
                      Mượn
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>Đang tải...</div>
      )}

      <div className={styles['load-more-container']}>
        {!loading && books.length < totalItems && (
          <button className={styles['load-more-btn']} onClick={handleLoadMore}>
            Tải thêm sách
          </button>
        )}
        {!loading && books.length > pageSize && (
          <button className={styles['collapse-btn']} onClick={handleCollapse}>
            Thu gọn lại
          </button>
        )}
      </div>
    </section>
  );
};


export default BrowseBooks;

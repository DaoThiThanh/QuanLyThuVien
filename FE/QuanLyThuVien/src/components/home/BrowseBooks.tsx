import React, { useEffect, useState } from 'react';
import './BrowseBooks.css';
import { FiBookOpen, FiGrid, FiList } from 'react-icons/fi';
import { GetDanhSachSach } from '../../services/modules/bookService';
import type { PaginatedBookItem } from '../../types/book';

const BrowseBooks: React.FC = () => {
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

  return (
    <section className="browse-books-section">
      <div className="section-header">
        <div className="header-left">
          <div className="icon-fire" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
            <FiBookOpen size={24} />
          </div>
          <div className="header-titles">
            <h2 className="section-title">Duyệt kho sách</h2>
            <p className="section-subtitle">Hàng ngàn đầu sách đang chờ bạn</p>
          </div>
        </div>
      </div>

      <div className="browse-filters">
        <div className="category-tabs">
          <button className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
            Tất cả sách <span className="count">{totalItems}</span>
          </button>
          <button className={`tab-btn ${activeTab === 'science' ? 'active' : ''}`} onClick={() => setActiveTab('science')}>
            Khoa học <span className="count">0</span>
          </button>
          <button className={`tab-btn ${activeTab === 'economic' ? 'active' : ''}`} onClick={() => setActiveTab('economic')}>
            Kinh tế <span className="count">0</span>
          </button>
          <button className={`tab-btn ${activeTab === 'literature' ? 'active' : ''}`} onClick={() => setActiveTab('literature')}>
            Văn học <span className="count">0</span>
          </button>
        </div>

        <div className="filter-controls">
          <div className="filter-selects">
            <div className="select-group">
              <label>Thể loại</label>
              <select>
                <option>Tất cả</option>
                <option>Giáo trình</option>
                <option>Tham khảo</option>
              </select>
            </div>
            <div className="select-group">
              <label>Năm xuất bản</label>
              <select>
                <option>Tất cả năm</option>
                <option>2024</option>
                <option>2023</option>
              </select>
            </div>
            <div className="select-group">
              <label>Tình trạng</label>
              <select>
                <option>Chỉ sách có sẵn</option>
                <option>Tất cả</option>
              </select>
            </div>
          </div>

          <div className="view-toggles">
            <span className="view-label">Chế độ xem</span>
            <button className="view-btn active"><FiGrid /></button>
            <button className="view-btn"><FiList /></button>
          </div>
        </div>
      </div>

      <p className="results-count">Hiển thị {books.length} trong tổng số {totalItems} sách</p>

      {error ? (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          {error}
        </div>
      ) : (
        <div className="browse-books-grid">
          {books.map((book) => (
            <div className="browse-book-card" key={book.id}>
              <div className="book-image-wrapper">
                <img src={book.hinhAnh || 'https://via.placeholder.com/150'} alt={book.tenSach} className="book-cover" />
                <div className="book-badges">
                  <span className={`badge status ${book.soLuongTon > 0 ? 'available' : 'unavailable'}`}>
                    {book.soLuongTon > 0 ? 'Có sẵn' : 'Hết sách'}
                  </span>
                </div>
              </div>
              <div className="book-details">
                <div className="book-meta">
                  <span className="book-category">{book.tenDanhMuc}</span>
                </div>
                <h3 className="book-title">{book.tenSach}</h3>
                <p className="book-author">{book.tenTacGia}</p>
                
                <div className="book-footer">
                  <div className="book-rating">
                    <span className="star">★</span> 5.0
                  </div>
                  <button className={`borrow-btn ${book.soLuongTon <= 0 ? 'disabled' : ''}`} disabled={book.soLuongTon <= 0}>
                    Mượn sách
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '1rem' }}>Đang tải...</div>
      )}

      {!loading && books.length < totalItems && (
        <div className="load-more-container">
          <button className="load-more-btn" onClick={handleLoadMore}>
            Tải thêm sách
          </button>
        </div>
      )}
    </section>
  );
};

export default BrowseBooks;

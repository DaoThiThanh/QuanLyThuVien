import React, { useEffect, useState } from 'react';
import styles from './DuyetSach.module.css';
import { FiBookOpen, FiGrid, FiList, FiEye } from 'react-icons/fi';
import { GetDanhSachSach, GetCategories } from '../../dichVu/modules/dichVuSach';
import type { PaginatedBookItem, CategoryItem } from '../../kieuDuLieu/sach';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../dichVu/modules/dichVuXacThuc';


const BrowseBooks: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const [allBooks, setAllBooks] = useState<PaginatedBookItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [displayCount, setDisplayCount] = useState(12);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('available'); // default to 'Chỉ sách có sẵn'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          GetDanhSachSach(1, 1000),
          GetCategories()
        ]);
        
        if (booksResponse && booksResponse.items) {
          setAllBooks(booksResponse.items);
        }
        
        if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else if (categoriesResponse && (categoriesResponse as any).data) {
          setCategories((categoriesResponse as any).data);
        }
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.message || 'Lỗi khi tải dữ liệu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Extract distinct years from books
  const availableYears = Array.from(new Set(allBooks.map(b => b.namXuatBan).filter(y => y))).sort((a, b) => (b as number) - (a as number));
  
  // Use fetched categories from database
  const availableCategories = categories.map(c => c.tenDanhMuc);

  // Filter books
  const filteredBooks = allBooks.filter(book => {
    // Tab filter
    if (activeTab !== 'all' && book.tenDanhMuc !== activeTab) return false;
    
    // Dropdown filters
    if (selectedCategory !== 'all' && book.tenDanhMuc !== selectedCategory) return false;
    if (selectedYear !== 'all' && book.namXuatBan?.toString() !== selectedYear) return false;
    if (selectedStatus === 'available' && book.soLuongTon <= 0) return false;
    
    return true;
  });

  const displayedBooks = filteredBooks.slice(0, displayCount);

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + 12);
  };

  const handleCollapse = () => {
    setDisplayCount(12);
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
            Tất cả sách <span className={styles['count']}>{allBooks.length}</span>
          </button>
          {availableCategories.slice(0, 3).map(cat => {
            const count = allBooks.filter(b => b.tenDanhMuc === cat).length;
            return (
              <button key={cat} className={`${styles['tab-btn']} ${activeTab === cat ? styles['active'] : ''}`} onClick={() => setActiveTab(cat)}>
                {cat} <span className={styles['count']}>{count}</span>
              </button>
            );
          })}
        </div>

        <div className={styles['filter-controls']}>
          <div className={styles['filter-selects']}>
            <div className={styles['select-group']}>
              <label>Thể loại</label>
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="all">Tất cả</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className={styles['select-group']}>
              <label>Năm xuất bản</label>
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                <option value="all">Tất cả năm</option>
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className={styles['select-group']}>
              <label>Tình trạng</label>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
                <option value="available">Chỉ sách có sẵn</option>
                <option value="all">Tất cả</option>
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

      <p className={styles['results-count']}>Hiển thị {displayedBooks.length} trong tổng số {filteredBooks.length} sách</p>

      {error ? (
        <div className="error-message" style={{ color: 'red', textAlign: 'center', padding: '2rem' }}>
          {error}
        </div>
      ) : (
        <div className={styles['browse-books-grid']}>
          {displayedBooks.map((book) => (
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
                    <span className={styles['star']}>⭐</span> 5.0
                  </div>
                  <div className={styles['book-actions-btns']}>
                    <button 
                      className={styles['view-detail-btn']}
                      onClick={() => navigate(`/book-detail/${book.id}`)}
                    >
                      <FiEye /> Chi tiết
                    </button>
                    <button 
                      className={`${styles['borrow-btn']} ${book.soLuongTon <= 0 ? styles['disabled'] : ''}`} 
                      disabled={book.soLuongTon <= 0}
                      onClick={() => {
                        if (!getToken()) {
                          navigate('/login', { state: { from: '/' } });
                          return;
                        }
                        navigate(`/book-detail/${book.id}`);
                      }}
                    >
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
        {!loading && displayedBooks.length < filteredBooks.length && (
          <button className={styles['load-more-btn']} onClick={handleLoadMore}>
            Tải thêm sách
          </button>
        )}
        {!loading && displayedBooks.length > 12 && (
          <button className={styles['collapse-btn']} onClick={handleCollapse}>
            Thu gọn lại
          </button>
        )}
      </div>
    </section>
  );
};


export default BrowseBooks;

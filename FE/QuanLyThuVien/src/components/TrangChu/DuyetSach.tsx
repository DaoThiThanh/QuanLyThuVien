import React, { useEffect, useState } from 'react';
import styles from './DuyetSach.module.css';
import { FiBookOpen, FiArrowRight, FiEye } from 'react-icons/fi';
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksResponse, categoriesResponse] = await Promise.all([
          GetDanhSachSach(1, 100), // Lấy một lượng đủ dùng cho trang chủ
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

  // Filter books by category tab
  const filteredBooks = allBooks.filter(book => {
    if (activeTab !== 'all' && book.tenDanhMuc !== activeTab) return false;
    return true;
  });

  // Limit to 12 books on homepage
  const displayedBooks = filteredBooks.slice(0, 12);

  return (
    <section className={styles['browse-books-section']}>
      <div className={styles['section-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-badge']}>
            <FiBookOpen size={24} />
          </div>
          <div className={styles['header-titles']}>
            <h2 className={styles['section-title']}>Duyệt kho sách</h2>
            <p className={styles['section-subtitle']}>Hàng ngàn đầu sách đang chờ bạn khám phá</p>
          </div>
        </div>
        <button className={styles['see-all-top-btn']} onClick={() => navigate('/books')}>
          Xem tất cả <FiArrowRight />
        </button>
      </div>

      <div className={styles['category-navigation']}>
        <div className={styles['category-tabs']}>
          <button 
            className={`${styles['tab-btn']} ${activeTab === 'all' ? styles['active'] : ''}`} 
            onClick={() => setActiveTab('all')}
          >
            Tất cả sách <span className={styles['count-badge']}>{allBooks.length}</span>
          </button>
          {categories.map(cat => {
            const count = allBooks.filter(b => b.tenDanhMuc === cat.tenDanhMuc).length;
            return (
              <button 
                key={cat.id} 
                className={`${styles['tab-btn']} ${activeTab === cat.tenDanhMuc ? styles['active'] : ''}`} 
                onClick={() => setActiveTab(cat.tenDanhMuc)}
              >
                {cat.tenDanhMuc} <span className={styles['count-badge']}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className={styles['error-state']}>
          {error}
        </div>
      ) : (
        <>
          <div className={styles['books-grid']}>
            {displayedBooks.map((book) => (
              <div className={styles['book-card']} key={book.id}>
                <div className={styles['card-media']}>
                  <img 
                    src={book.hinhAnh || 'https://via.placeholder.com/150?text=No+Image'} 
                    alt={book.tenSach} 
                    className={styles['book-image']} 
                  />
                  {book.soLuongTon > 0 && (
                    <span className={styles['availability-tag']}>Có sẵn</span>
                  )}
                  <div className={styles['card-overlay']}>
                    <button className={styles['quick-view-btn']} onClick={() => navigate(`/book-detail/${book.id}`)}>
                      <FiEye /> Xem nhanh
                    </button>
                  </div>
                </div>
                <div className={styles['card-content']}>
                  <span className={styles['category-tag']}>{book.tenDanhMuc}</span>
                  <h3 className={styles['book-name']} title={book.tenSach}>{book.tenSach}</h3>
                  <p className={styles['author-name']}>{book.tenTacGia}</p>
                  
                  <div className={styles['card-footer']}>
                    <div className={styles['stock-info']}>
                      Còn {book.soLuongTon} cuốn
                    </div>
                    <button 
                      className={styles['action-btn']}
                      onClick={() => navigate(`/book-detail/${book.id}`)}
                    >
                      Mượn ngay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {displayedBooks.length === 0 && !loading && (
            <div className={styles['empty-state']}>
              Không có sách nào trong danh mục này.
            </div>
          )}

          {!loading && filteredBooks.length > 12 && (
            <div className={styles['footer-actions']}>
              <button className={styles['explore-more-btn']} onClick={() => navigate('/books')}>
                Khám phá thêm nhiều sách hơn <FiArrowRight />
              </button>
            </div>
          )}
        </>
      )}

      {loading && (
        <div className={styles['loading-state']}>
          <div className={styles['spinner']}></div>
          <p>Đang tải kho sách...</p>
        </div>
      )}
    </section>
  );
};

export default BrowseBooks;

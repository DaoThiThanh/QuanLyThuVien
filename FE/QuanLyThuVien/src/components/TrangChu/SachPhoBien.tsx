import React from 'react';
import styles from './SachPhoBien.module.css';
import { useEffect, useState } from 'react';
import { GetPopularBooks } from '../../dichVu/modules/dichVuSach';
import type { BookItem } from '../../kieuDuLieu/sach';
import { useNavigate } from 'react-router-dom';

const PopularBooks: React.FC = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await GetPopularBooks();
        if (Array.isArray(response)) {
          setBooks(response);
        }
        else if (response && response.data) {
          setBooks(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải sách nổi bật:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className={styles['popular-books-container']}>
      <div className={styles['section-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-fire']}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.2 0-4-1.8-4-4a8 8 0 0 1 8-8 8 8 0 0 1 8 8c0 2.2-1.8 4-4 4a2.5 2.5 0 0 0 2.5 2.5C21.5 18 18 22 12 22s-9.5-4-9.5-7.5c0-2.3 2.1-4.7 4.1-6 2.3-1.6 3.4-3.5 3.4-3.5" /></svg>
          </div>
          <div className={styles['header-titles']}>
            <h2 className={styles['section-title']}>Sách phổ biến nhất</h2>
            <p className={styles['section-subtitle']}>Được mượn nhiều nhất</p>
          </div>
        </div>
        <a href="#" className={styles['view-all-link']}>
          Xem tất cả <span className={styles['arrow']}>&gt;</span>
        </a>
      </div>

      <div className={styles['books-list']}>
        {loading ? (
          <div className={styles['loading-state']}>Đang tải sách nổi bật...</div>
        ) : books.length > 0 ? (
          books.map((book) => (
            <div 
              className={styles['book-card-popular']} 
              key={book.id}
              onClick={() => navigate(`/book-detail/${book.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div
                className={styles['book-image-bg']}
                style={{ backgroundImage: `url(${book.hinhAnh})` }}
              >
                <div className={styles['book-gradient-overlay']}></div>
                
                <div className={styles['availability-badge']}>
                   {book.soLuongTon > 0 ? (
                     <span className={styles['status-online']}>● Có sẵn</span>
                   ) : (
                     <span className={styles['status-offline']}>● Hết sách</span>
                   )}
                </div>

                <div className={styles['book-info']}>
                  <h3 className={styles['book-title']}>{book.tenSach}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles['empty-state']}>Không có sách nổi bật nào.</div>
        )}
      </div>
    </div>
  );
};

export default PopularBooks;

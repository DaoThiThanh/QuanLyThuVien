import React, { useEffect, useState } from 'react';
import styles from './SachMoi.module.css';
import { GetNewBooks } from '../../dichVu/modules/dichVuSach';
import type { NewBookItem } from '../../kieuDuLieu/sach';
import { useNavigate } from 'react-router-dom';

const NewBooks: React.FC = () => {
  const navigate = useNavigate();
  const [newBooks, setNewBooks] = useState<NewBookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewBooks = async () => {
      try {
        const data = await GetNewBooks();
        if (Array.isArray(data)) {
          setNewBooks(data);
        } else if (data && data.data) {
          setNewBooks(data.data);
        }
      } catch (err: any) {
        console.error('Failed to fetch new books:', err);
        setError(err.message || 'Có lỗi khi lấy danh sách sách mới.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewBooks();
  }, []);

  return (
    <div className={styles['new-books-container']}>
      <div className={styles['section-header']}>
        <div className={styles['header-left']}>
          <div className={styles['icon-sparkle']}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div className={styles['header-titles']}>
            <h2 className={styles['section-title']}>Sách mới bổ sung</h2>
            <p className={styles['section-subtitle']}>Cập nhật gần đây</p>
          </div>
        </div>
        <a href="#" className={styles['view-all-link']}>
          Xem tất cả <span className={styles['arrow']}>&gt;</span>
        </a>
      </div>

      {loading ? (
        <div className="new-books-list" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem 0' }}>
          <p>Đang tải sách mới...</p>
        </div>
      ) : error ? (
        <div className="new-books-list" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem 0', color: 'red' }}>
          <p>{error}</p>
        </div>
      ) : newBooks.length === 0 ? (
        <div className="new-books-list" style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem 0' }}>
          <p>Chưa có sách mới nào.</p>
        </div>
      ) : (
        <div className={styles['new-books-list']}>
          {newBooks.map((book) => {
            const title = book.TenSach || (book as any).tenSach;
            const image = book.HinhAnh || (book as any).hinhAnh;
            const soLuongTon = book.SoLuongTon ?? (book as any).soLuongTon ?? 0;
            const namXuatBan = book.NamXuatBan ?? (book as any).namXuatBan ?? '';

            return (
              <div 
                className={styles['new-book-card']} 
                key={book.id}
                onClick={() => navigate(`/book-detail/${book.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles['book-cover-wrapper']}>
                  <img src={image || 'https://via.placeholder.com/150'} alt={title} className={styles['book-cover-image']} />
                  <div className={styles['badge-new-blue']}>MỚI</div>
                  {soLuongTon > 0 && (
                    <div className={`${styles['badge-status']} ${styles['online']}`}>● Có sẵn</div>
                  )}
                </div>
                <div className={styles['book-info']}>
                  <span className={styles['book-category']}>{namXuatBan ? `Năm XB: ${namXuatBan}` : 'Sách mới'}</span>
                  <h3 className={styles['book-title']}>{title}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewBooks;

import React, { useEffect, useState } from 'react';
import './NewBooks.css';
import { GetNewBooks } from '../../services/modules/bookService';
import type { NewBookItem } from '../../types/book';

const NewBooks: React.FC = () => {
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
    <div className="new-books-container">
      <div className="section-header">
        <div className="header-left">
          <div className="icon-sparkle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div className="header-titles">
            <h2 className="section-title">Sách mới bổ sung</h2>
            <p className="section-subtitle">Cập nhật gần đây</p>
          </div>
        </div>
        <a href="#" className="view-all-link">
          Xem tất cả <span className="arrow">&gt;</span>
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
        <div className="new-books-list">
          {newBooks.map((book) => {
            // Handle both PascalCase and camelCase if backend serialization differs from interface
            const title = book.TenSach || (book as any).tenSach;
            const image = book.HinhAnh || (book as any).hinhAnh;
            const soLuongTon = book.SoLuongTon ?? (book as any).soLuongTon ?? 0;
            const namXuatBan = book.NamXuatBan ?? (book as any).namXuatBan ?? '';

            return (
              <div className="new-book-card" key={book.id}>
                <div className="book-cover-wrapper">
                  <img src={image || 'https://via.placeholder.com/150'} alt={title} className="book-cover-image" />
                  <div className="badge-new-blue">MỚI</div>
                  {soLuongTon > 0 && (
                    <div className="badge-status online">• Có sẵn</div>
                  )}
                </div>
                <div className="book-info">
                  <span className="book-category">{namXuatBan ? `Năm XB: ${namXuatBan}` : 'Sách mới'}</span>
                  <h3 className="book-title">{title}</h3>
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

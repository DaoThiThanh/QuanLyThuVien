import React from 'react';
import './PopularBooks.css';
import { useEffect, useState } from 'react';
import { GetPopularBooks } from '../../services/modules/bookService';
import type { BookItem } from '../../types/book';

const PopularBooks: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await GetPopularBooks();
        // Kiểm tra nếu API trả về mảng trực tiếp
        if (Array.isArray(response)) {
          setBooks(response);
        } 
        // Hoặc nếu API trả về cục { data: [...] }
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
  console.log(books);
  return (
    <div className="popular-books-container">
      <div className="section-header">
        <div className="header-left">
          <div className="icon-fire">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c-2.2 0-4-1.8-4-4a8 8 0 0 1 8-8 8 8 0 0 1 8 8c0 2.2-1.8 4-4 4a2.5 2.5 0 0 0 2.5 2.5C21.5 18 18 22 12 22s-9.5-4-9.5-7.5c0-2.3 2.1-4.7 4.1-6 2.3-1.6 3.4-3.5 3.4-3.5" /></svg>
          </div>
          <div className="header-titles">
            <h2 className="section-title">Sách phổ biến nhất</h2>
            <p className="section-subtitle">Được mượn nhiều nhất</p>
          </div>
        </div>
        <a href="#" className="view-all-link">
          Xem tất cả <span className="arrow">&gt;</span>
        </a>
      </div>

      <div className="books-list">
        {loading ? (
          <div className="loading-state">Đang tải sách nổi bật...</div>
        ) : books.length > 0 ? (
          books.map((book) => (
            <div className="book-card" key={book.id}>
              <div
                className="book-image-bg"
                style={{ backgroundImage: `url(${book.hinhAnh})` }}
              >
                <div className="book-gradient-overlay"></div>

                <div className="book-info">
                  <h3 className="book-title">{book.tenSach}</h3>
                  <div className="book-rating">
                    <span className="star">🔥</span> {book.soLuongMuon} lượt mượn
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">Không có sách nổi bật nào.</div>
        )}
      </div>
    </div>
  );
};

export default PopularBooks;

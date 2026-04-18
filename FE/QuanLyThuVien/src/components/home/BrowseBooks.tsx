import React, { useState } from 'react';
import './BrowseBooks.css';
import { FiBookOpen, FiGrid, FiList, FiFilter } from 'react-icons/fi';

interface Book {
  id: number;
  title: string;
  author: string;
  rating: number;
  isNew: boolean;
  status: 'Có sẵn' | 'Hết sách';
  image: string;
  category: string;
}

const allBooks: Book[] = [
  { id: 1, title: 'Lập trình C++ cơ bản đến nâng cao', author: 'Nguyễn Văn A', rating: 4.8, isNew: true, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400', category: 'Khoa học' },
  { id: 2, title: 'Kinh tế vi mô - Nguyên lý và ứng dụng', author: 'Trần Thị B', rating: 4.5, isNew: false, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400', category: 'Kinh tế' },
  { id: 3, title: 'Giải tích 1 - Toán cao cấp', author: 'Lê Văn C', rating: 4.2, isNew: false, status: 'Hết sách', image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400', category: 'Khoa học' },
  { id: 4, title: 'Sapiens - Lược sử loài người', author: 'Yuval Noah Harari', rating: 4.9, isNew: false, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400', category: 'Lịch sử' },
  { id: 5, title: 'Tiếng Anh học thuật cho sinh viên', author: 'Hoàng Văn D', rating: 4.6, isNew: true, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1546410531-bea4ea04d5bf?auto=format&fit=crop&q=80&w=400', category: 'Ngoại ngữ' },
  { id: 6, title: 'Từ điển Tiếng Anh - Everyday English', author: 'Nguyễn Thị E', rating: 4.4, isNew: false, status: 'Hết sách', image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=400', category: 'Ngoại ngữ' },
  { id: 7, title: 'Triết học Mác - Lênin', author: 'Bộ Giáo dục', rating: 4.1, isNew: false, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=400', category: 'Chính trị' },
  { id: 8, title: 'Tâm lý học tội phạm', author: 'Stanton E. Samenow', rating: 4.7, isNew: true, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=400', category: 'Tâm lý học' },
  { id: 9, title: 'Nhập môn Trí tuệ nhân tạo', author: 'Stuart Russell', rating: 4.8, isNew: false, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400', category: 'Khoa học' },
  { id: 10, title: 'Cấu trúc dữ liệu và giải thuật', author: 'Nguyễn Văn F', rating: 4.5, isNew: false, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=400', category: 'Khoa học' },
  { id: 11, title: 'Marketing căn bản', author: 'Philip Kotler', rating: 4.6, isNew: true, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=400', category: 'Kinh tế' },
  { id: 12, title: 'Nhà giả kim', author: 'Paulo Coelho', rating: 4.9, isNew: false, status: 'Có sẵn', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400', category: 'Văn học' },
];

const BrowseBooks: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

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
            Tất cả sách <span className="count">12</span>
          </button>
          <button className={`tab-btn ${activeTab === 'science' ? 'active' : ''}`} onClick={() => setActiveTab('science')}>
            Khoa học <span className="count">4</span>
          </button>
          <button className={`tab-btn ${activeTab === 'economic' ? 'active' : ''}`} onClick={() => setActiveTab('economic')}>
            Kinh tế <span className="count">2</span>
          </button>
          <button className={`tab-btn ${activeTab === 'literature' ? 'active' : ''}`} onClick={() => setActiveTab('literature')}>
            Văn học <span className="count">1</span>
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

      <p className="results-count">Hiển thị 1-12 trong tổng số 12 sách</p>

      <div className="browse-books-grid">
        {allBooks.map((book) => (
          <div className="browse-book-card" key={book.id}>
            <div className="book-image-wrapper">
              <img src={book.image} alt={book.title} className="book-cover" />
              <div className="book-badges">
                {book.isNew && <span className="badge new">MỚI</span>}
                <span className={`badge status ${book.status === 'Có sẵn' ? 'available' : 'unavailable'}`}>
                  {book.status}
                </span>
              </div>
            </div>
            <div className="book-details">
              <div className="book-meta">
                <span className="book-category">{book.category}</span>
              </div>
              <h3 className="book-title">{book.title}</h3>
              <p className="book-author">{book.author}</p>
              
              <div className="book-footer">
                <div className="book-rating">
                  <span className="star">★</span> {book.rating}
                </div>
                <button className={`borrow-btn ${book.status !== 'Có sẵn' ? 'disabled' : ''}`} disabled={book.status !== 'Có sẵn'}>
                  Mượn sách
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="load-more-container">
        <button className="load-more-btn">
          Xem toàn bộ kho sách 
        </button>
      </div>
    </section>
  );
};

export default BrowseBooks;

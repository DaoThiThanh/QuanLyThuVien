import React, { useState, useEffect } from 'react';
import styles from './BannerThuVien.module.css';
import { getUserName, getToken, getUserId } from '../../dichVu/modules/dichVuXacThuc';
import { CheckBorrowingLimit } from '../../dichVu/modules/dichVuMuonSach';
import { useNavigate } from 'react-router-dom';

const LibraryHero: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({ total: 0, current: 0 });

  useEffect(() => {
    const token = getToken();
    const name = getUserName();
    const id = getUserId();

    if (token) {
      setIsLoggedIn(true);
      setUserName(name || 'Người dùng');
      setUserId(id);

      if (id) {
        CheckBorrowingLimit(id).then(data => {
          setUserStats({
            total: data.totalBorrowed,
            current: data.currentCount
          });
        }).catch(err => console.error("Error fetching user stats:", err));
      }
    }
  }, []);

  return (
    <section className={styles['hero-section']}>
      <div className={styles['hero-background']}>
        <div className={styles['hero-image-bg']}></div>
        <div className={`${styles['circle']} ${styles['circle-1']}`}></div>
        <div className={`${styles['circle']} ${styles['circle-2']}`}></div>
        <div className={`${styles['circle']} ${styles['circle-3']}`}></div>
      </div>

      <div className={styles['hero-content-wrapper']}>
        <div className={styles['hero-main']}>

          {/* Left Column */}
          <div className={styles['hero-left']}>
            <div className={styles['welcome-badge']}>
              <span className={styles['wave-icon']}>👋</span>
              <span>Xin chào, {isLoggedIn ? userName : 'Bạn'}</span>
            </div>

            <h1 className={styles['hero-title']}>
              Khám phá kho sách <br />
              <span className={styles['highlight-text']}>thư viện sinh viên</span>
            </h1>

            <p className={styles['hero-description']}>
              Tìm kiếm, mượn và quản lý sách dễ dàng. Hơn <strong>1,200 đầu sách</strong> đang chờ bạn khám phá.
            </p>

            <div className={styles['search-box']}>
              <div className={styles['search-input-wrapper']}>
                <svg className={styles['search-icon']} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                <input type="text" placeholder="Tìm kiếm sách, tác giả, thể loại..." className={styles['search-input']} />
              </div>
              <button className={styles['search-button']}>Tìm kiếm</button>
            </div>

            <div className={styles['quick-links']}>
              <span className={styles['quick-links-label']}>Tìm nhanh:</span>
              <div className={styles['tags-container']}>
                <span className={styles['tag']}>Lập trình</span>
                <span className={styles['tag']}>Toán học</span>
                <span className={styles['tag']}>Kinh tế</span>
                <span className={styles['tag']}>Văn học</span>
                <span className={styles['tag']}>Trí tuệ nhân tạo</span>
              </div>
            </div>
          </div>

          {/* Right Column - User Card */}
          <div className={styles['hero-right']}>
            <div className={styles['user-glass-card']}>
              <div className={styles['user-info-row']}>
                <div className={styles['user-avatar-large']}>
                  {isLoggedIn && userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className={styles['user-details']}>
                  <h3 className={styles['user-name-large']}>{isLoggedIn ? userName : 'Khách'}</h3>
                  <span className={styles['user-id']}>{isLoggedIn ? (userId?.substring(0, 8).toUpperCase() || 'Member') : 'Chưa đăng nhập'}</span>
                </div>
              </div>

              <div className={styles['user-stats-row']}>
                <div className={styles['stat-box']}>
                  <span className={styles['stat-number']}>{isLoggedIn ? userStats.total : '-'}</span>
                  <span className={styles['stat-label']}>Tổng mượn</span>
                </div>
                <div className={styles['stat-box']}>
                  <span className={`${styles['stat-number']} ${styles['highlight-yellow']}`}>{isLoggedIn ? userStats.current : '-'}</span>
                  <span className={styles['stat-label']}>Đang mượn</span>
                </div>
              </div>

              <div className={styles['user-actions']}>
                <button
                  className={styles['user-action-btn']}
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login', { state: { from: '/' } });
                      return;
                    }
                    navigate('/borrowed-books');
                  }}
                >
                  <div className={styles['action-btn-left']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                    <span>Sách đang mượn</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
                <button
                  className={styles['user-action-btn']}
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login', { state: { from: '/' } });
                      return;
                    }
                    navigate('/books');
                  }}
                >
                  <div className={styles['action-btn-left']}>
                    <svg className={styles['accent-yellow']} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2-2v16z" /></svg>
                    <span>Mượn sách mới</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Overlapping Cards */}
      <div className={styles['bottom-stats-container']}>
        <div className={styles['bottom-stats-grid']}>
          <div className={styles['stat-card']}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-blue']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>1,200+</h4>
              <span className={styles['stat-card-label']}>Đầu sách</span>
            </div>
          </div>

          <div className={styles['stat-card']}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-purple']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>320+</h4>
              <span className={styles['stat-card-label']}>Tác giả</span>
            </div>
          </div>

          <div className={styles['stat-card']}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-green']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>850+</h4>
              <span className={styles['stat-card-label']}>Lượt mượn / tháng</span>
            </div>
          </div>

          <div className={`${styles['stat-card']} ${styles['icon-yellow-bg']}`}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-yellow']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15l-3.09 1.63.59-3.46L7 10.74l3.47-.5L12 7l1.53 3.24 3.47.5-2.5 2.43.59 3.46z" /><path d="M12 2A10 10 0 1 0 22 12 10 10 0 0 0 12 2z" /></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>4.7⭐</h4>
              <span className={styles['stat-card-label']}>Đánh giá TB</span>
            </div>
          </div>

          <div className={`${styles['stat-card']} ${styles['icon-red-bg']}`}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-red']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>2,500+</h4>
              <span className={styles['stat-card-label']}>Sinh viên dùng</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;

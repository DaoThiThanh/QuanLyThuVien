import React, { useState, useEffect } from 'react';
import styles from './BannerThuVien.module.css';
import { getUserName, getToken, getUserId } from '../../dichVu/modules/dichVuXacThuc';
import { CheckBorrowingLimit, GetPhieuMuonByUser } from '../../dichVu/modules/dichVuMuonSach';
import { GetDanhSachSach, GetTacGias, GetCategories } from '../../dichVu/modules/dichVuSach';
import { useNavigate } from 'react-router-dom';

const LibraryHero: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userStats, setUserStats] = useState({ total: 0, current: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [overdueCount, setOverdueCount] = useState(0);
  const [dueSoonCount, setDueSoonCount] = useState(0);
  const [totalBooks, setTotalBooks] = useState<number>(0);
  const [totalAuthors, setTotalAuthors] = useState<number>(0);
  const [totalCategories, setTotalCategories] = useState<number>(0);

  useEffect(() => {
    const fetchPublicStats = async () => {
      try {
        const [books, authors, categories] = await Promise.all([
          GetDanhSachSach(1, 1),
          GetTacGias(),
          GetCategories()
        ]);
        if (books && books.totalItems) setTotalBooks(books.totalItems);
        if (Array.isArray(authors)) setTotalAuthors(authors.length);
        
        if (Array.isArray(categories)) {
           setTotalCategories(categories.length);
        } else if (categories && (categories as any).data) {
           setTotalCategories((categories as any).data.length);
        }
      } catch (err) {
        console.error("Lỗi khi tải thống kê chung:", err);
      }
    };
    fetchPublicStats();
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/books?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/books');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleQuickLink = (tag: string) => {
    navigate(`/books?search=${encodeURIComponent(tag)}`);
  };

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

        GetPhieuMuonByUser(id).then(loans => {
            if (Array.isArray(loans)) {
                let overdue = 0;
                let dueSoon = 0;
                const now = new Date();
                const threeDaysFromNow = new Date();
                threeDaysFromNow.setDate(now.getDate() + 3);

                loans.forEach((pm: any) => {
                    pm.chiTiet.forEach((ct: any) => {
                        if (!ct.ngayTraThucTe) {
                            const hanTra = new Date(pm.hanTra);
                            if (hanTra < now) {
                                overdue++;
                            } else if (hanTra <= threeDaysFromNow) {
                                dueSoon++;
                            }
                        }
                    });
                });
                setOverdueCount(overdue);
                setDueSoonCount(dueSoon);
            }
        }).catch(err => console.error("Error fetching loans for banner:", err));
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
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sách, tác giả, thể loại..." 
                  className={styles['search-input']} 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button className={styles['search-button']} onClick={handleSearch}>Tìm kiếm</button>
            </div>

            <div className={styles['quick-links']}>
              <span className={styles['quick-links-label']}>Tìm nhanh:</span>
              <div className={styles['tags-container']}>
                <span className={styles['tag']} onClick={() => handleQuickLink('Lập trình')} style={{cursor: 'pointer'}}>Lập trình</span>
                <span className={styles['tag']} onClick={() => handleQuickLink('Toán học')} style={{cursor: 'pointer'}}>Toán học</span>
                <span className={styles['tag']} onClick={() => handleQuickLink('Kinh tế')} style={{cursor: 'pointer'}}>Kinh tế</span>
                <span className={styles['tag']} onClick={() => handleQuickLink('Văn học')} style={{cursor: 'pointer'}}>Văn học</span>
                <span className={styles['tag']} onClick={() => handleQuickLink('Trí tuệ nhân tạo')} style={{cursor: 'pointer'}}>Trí tuệ nhân tạo</span>
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

              { (overdueCount > 0 || dueSoonCount > 0) ? (
                <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #fca5a5',
                    animation: 'pulseWarning 2s infinite',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)'
                }} onClick={() => navigate('/borrowed-books')}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Cảnh báo hạn trả!</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', opacity: 0.95 }}>
                      Bạn có {overdueCount > 0 ? <strong>{overdueCount} quá hạn</strong> : ''}
                      {overdueCount > 0 && dueSoonCount > 0 ? ', ' : ''}
                      {dueSoonCount > 0 ? <strong>{dueSoonCount} sắp tới hạn</strong> : ''}. 
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{opacity: 0.8}}><path d="m9 18 6-6-6-6" /></svg>
                </div>
              ) : isLoggedIn ? (
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    border: '1px solid #6ee7b7',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)'
                }}>
                  <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '50%', display: 'flex' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '15px', fontWeight: 700 }}>Tốt!</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '13px', opacity: 0.95 }}>
                      Bạn không có sách nào quá hạn.
                    </p>
                  </div>
                </div>
              ) : null}

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
              <h4 className={styles['stat-card-value']}>{totalBooks > 0 ? `${totalBooks}+` : '-'}</h4>
              <span className={styles['stat-card-label']}>Đầu sách</span>
            </div>
          </div>

          <div className={styles['stat-card']}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-purple']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>{totalAuthors > 0 ? `${totalAuthors}+` : '-'}</h4>
              <span className={styles['stat-card-label']}>Tác giả</span>
            </div>
          </div>

          <div className={styles['stat-card']}>
            <div className={`${styles['icon-wrapper']} ${styles['icon-green']}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
            </div>
            <div className={styles['stat-card-text']}>
              <h4 className={styles['stat-card-value']}>{totalCategories > 0 ? `${totalCategories}+` : '-'}</h4>
              <span className={styles['stat-card-label']}>Danh mục</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulseWarning {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
      `}</style>
    </section>
  );
};

export default LibraryHero;

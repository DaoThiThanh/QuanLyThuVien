import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TrangAdmin.module.css';
import { getAllUsers, updateUserRole, type UserItem } from '../dichVu/modules/dichVuNguoiDung';
import { getUserName } from '../dichVu/modules/dichVuXacThuc';
import { getThongKeAdmin, type ThongKeAdminDto } from '../dichVu/modules/dichVuThongKe';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<ThongKeAdminDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsData, usersData] = await Promise.all([
          getThongKeAdmin(),
          getAllUsers()
        ]);
        setStats(statsData);
        setUsers(usersData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const recentActivities = [
    { id: 1, user: 'Trần Quản trị', action: 'Duyệt yêu cầu mượn sách', time: '10 phút trước', type: 'approve' },
    { id: 2, user: 'Nguyễn Văn A', action: 'Đăng ký tài khoản mới', time: '25 phút trước', type: 'user' },
    { id: 3, user: 'Lê Thị B', action: 'Báo mất sách "Clean Code"', time: '1 giờ trước', type: 'warning' },
    { id: 4, user: 'Hệ thống', action: 'Tự động sao lưu dữ liệu', time: '3 giờ trước', type: 'system' },
  ];

  const handleRoleChange = async (userId: string, newRole: number) => {
    if (window.confirm("Bạn có chắc chắn muốn thay đổi quyền của người dùng này?")) {
      const success = await updateUserRole(userId, newRole);
      if (success) {
        alert("Cập nhật quyền thành công!");
        const data = await getAllUsers();
        setUsers(data);
      } else {
        alert("Cập nhật thất bại!");
      }
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'users', label: 'Quản lý Độc giả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'librarians', label: 'Quản lý Thủ thư', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
    { id: 'settings', label: 'Cài đặt Tham số', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
  ];

  return (
    <div className={styles['admin-container']}>
      {/* Sidebar */}
      <aside className={styles['admin-sidebar']}>
        <div className={styles['admin-logo']}>
          <div className={styles['admin-logo-icon']}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
          </div>
          <span>AdminHub</span>
        </div>

        <nav className={styles['admin-nav']}>
          {menuItems.map((item) => (
            <a
              key={item.id}
              className={`${styles['admin-nav-item']} ${activeTab === item.id ? styles['active'] : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab(item.id); }}
              href={`#${item.id}`}
            >
              <div className={styles['icon-wrapper']}>{item.icon}</div>
              {item.label}
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles['admin-main']}>
        {/* Header */}
        <header className={styles['admin-header']}>
          <h1 className={styles['admin-header-title']}>
            {menuItems.find(m => m.id === activeTab)?.label}
          </h1>
          
          <div className={styles['admin-header-actions']}>
            <button className={styles['icon-btn']}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <div className={styles['admin-profile-btn']}>
              <div className={styles['admin-avatar']}>
                {getUserName() ? getUserName()!.charAt(0).toUpperCase() : 'A'}
              </div>
              <span className={styles['admin-username']}>{getUserName() || 'Quản trị viên'}</span>
              <svg className={styles['chevron-icon']} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
            <Link to="/" className={styles['exit-btn']} title="Trở về trang chủ">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
            </Link>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className={styles['admin-content']}>
          {activeTab === 'dashboard' && (
            <>
              {/* Stats Grid */}
              <div className={styles['dashboard-stats']}>
                <div className={styles['stat-card']}>
                  <div className={styles['stat-header']}>
                    <span>Tổng Độc giả</span>
                    <div className={styles['stat-icon']} style={{color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : stats?.totalReaders}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-up']}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    <span>+12% tháng này</span>
                  </div>
                </div>

                <div className={styles['stat-card']}>
                  <div className={styles['stat-header']}>
                    <span>Sách Đang Mượn</span>
                    <div className={styles['stat-icon']} style={{color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : stats?.activeLoans}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-up']}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    <span>24 yêu cầu mới</span>
                  </div>
                </div>

                <div className={styles['stat-card']}>
                  <div className={styles['stat-header']}>
                    <span>Doanh Thu Phạt</span>
                    <div className={styles['stat-icon']} style={{color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : `${(stats?.totalRevenue || 0).toLocaleString()} ₫`}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-up']}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    <span>+15.2%</span>
                  </div>
                </div>

                <div className={styles['stat-card']}>
                  <div className={styles['stat-header']}>
                    <span>Hệ Thống</span>
                    <div className={styles['stat-icon']} style={{color: '#aa3bff', backgroundColor: 'rgba(170, 59, 255, 0.1)'}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']} style={{fontSize: '28px'}}>{loading ? '...' : stats?.systemStatus}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-up']}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                    <span>Uptime 99.9%</span>
                  </div>
                </div>
              </div>

              <div className={styles['admin-dashboard-grid']}>
                {/* Employee Table */}
                <div className={styles['admin-section']}>
                  <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Nhân viên trực tuyến</h2>
                    <Link to="/admin/users" className={styles['view-all-link']}>Xem tất cả</Link>
                  </div>
                  <div className={styles['table-responsive']}>
                    <table className={styles['admin-table']}>
                      <thead>
                        <tr>
                          <th>Nhân Viên</th>
                          <th>Vai Trò</th>
                          <th>Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.filter(u => u.vaiTro === 1 || u.vaiTro === 2).length > 0 ? (
                          users.filter(u => u.vaiTro === 1 || u.vaiTro === 2).map((user) => (
                            <tr key={user.id}>
                              <td>
                                <div className={styles['user-info']}>
                                  <div className={styles['user-avatar']} style={{backgroundColor: user.vaiTro === 1 ? 'rgba(170, 59, 255, 0.1)' : '#10b98120', color: user.vaiTro === 1 ? 'var(--accent)' : '#10b981', fontSize: '14px', width: '32px', height: '32px'}}>
                                    {user.hoTen.charAt(0).toUpperCase()}
                                  </div>
                                  <div className={styles['user-details']}>
                                    <span className={styles['user-name']} style={{fontSize: '14px'}}>{user.hoTen}</span>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className={styles['status-badge']} style={{padding: '4px 10px', fontSize: '12px', backgroundColor: user.vaiTro === 1 ? '#f5f3ff' : '#ecfdf5', color: user.vaiTro === 1 ? '#7c3aed' : '#10b981'}}>
                                  {user.vaiTro === 1 ? 'Admin' : 'Thủ thư'}
                                </span>
                              </td>
                              <td>
                                <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                                  <span className={`${styles['status-dot']} ${styles['active']}`}></span>
                                  <span style={{fontSize: '13px', color: '#10b981', fontWeight: '500'}}>Online</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>Chưa có nhân viên nào online</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className={`${styles['admin-section']} ${styles['recent-activities-panel']}`}>
                  <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Hoạt động gần đây</h2>
                  </div>
                  <div className={styles['activity-list']}>
                    {recentActivities.map(activity => (
                      <div key={activity.id} className={styles['activity-item']}>
                        <div className={`${styles['activity-icon-box']} ${styles[activity.type]}`}>
                          {activity.type === 'approve' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
                          {activity.type === 'user' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                          {activity.type === 'warning' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>}
                          {activity.type === 'system' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>}
                        </div>
                        <div className={styles['activity-info']}>
                          <p className={styles['activity-text']}><strong>{activity.user}</strong> {activity.action}</p>
                          <span className={styles['activity-time']}>{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'users' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Danh sách Độc giả</h2>
                <button className={styles['section-action']}>+ Thêm Độc Giả</button>
              </div>
              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Độc Giả</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.vaiTro === 3).length > 0 ? (
                      users.filter(u => u.vaiTro === 3).map((user) => (
                        <tr key={user.id}>
                          <td>{user.hoTen}</td>
                          <td>{user.email}</td>
                          <td>{user.soDienThoai || 'N/A'}</td>
                          <td>
                            <span className={`${styles['status-badge']} ${user.trangThai === 1 ? styles['status-active'] : styles['status-inactive']}`}>
                              {user.trangThai === 1 ? 'Hoạt động' : 'Đã khóa'}
                            </span>
                          </td>
                          <td>
                             <button className={`${styles['btn-icon']} ${styles['view']}`}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Chưa có độc giả nào</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'librarians' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Danh sách Thủ thư</h2>
                <button className={styles['section-action']}>+ Thêm Thủ Thư</button>
              </div>
              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Họ Tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.vaiTro === 2).length > 0 ? (
                      users.filter(u => u.vaiTro === 2).map((user) => (
                        <tr key={user.id}>
                          <td style={{fontWeight: '600'}}>{user.hoTen}</td>
                          <td>{user.email}</td>
                          <td>{user.soDienThoai || 'N/A'}</td>
                          <td>
                            <span className={`${styles['status-badge']} ${user.trangThai === 1 ? styles['status-active'] : styles['status-inactive']}`}>
                              {user.trangThai === 1 ? 'Đang làm việc' : 'Đã nghỉ'}
                            </span>
                          </td>
                          <td>
                             <div className={styles['action-buttons']}>
                               <button className={`${styles['btn-icon']} ${styles['view']}`} title="Chi tiết"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                               <button className={`${styles['btn-icon']} ${styles['reject']}`} title="Khóa tài khoản"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></button>
                             </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Chưa có thủ thư nào</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className={styles['placeholder-content']}>
              <div className={styles['placeholder-icon']}>
                 {menuItems.find(m => m.id === activeTab)?.icon}
              </div>
              <h3>Giao diện {menuItems.find(m => m.id === activeTab)?.label} đang được phát triển</h3>
              <p>Phần này sẽ sớm được hoàn thiện với các chức năng đầy đủ.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPage;

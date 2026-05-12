import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TrangAdmin.module.css';
import { getAllUsers, updateUserStatus, type UserItem } from '../dichVu/modules/dichVuNguoiDung';
import { getUserName } from '../dichVu/modules/dichVuXacThuc';
import { getThongKeAdmin, type ThongKeAdminDto } from '../dichVu/modules/dichVuThongKe';
import { getQuyDinh, updateQuyDinh, type ThamSoQuyDinhDto } from '../dichVu/modules/dichVuQuyDinh';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import AdminHeader from '../components/GiaoDienChinh/AdminHeader';

const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<ThongKeAdminDto | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quyDinh, setQuyDinh] = useState<ThamSoQuyDinhDto | null>(null);
  const [savingQuyDinh, setSavingQuyDinh] = useState(false);
  
  // States cho Người dùng (Độc giả)
  const [accounts, setAccounts] = useState<UserItem[]>([]);
  const [readerPage, setReaderPage] = useState(1);
  const [readerTotalPages, setReaderTotalPages] = useState(1);
  const [readerSearchTerm, setReaderSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<number | undefined>(undefined);

  // State cho Modal mới
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metadataModalConfig, setMetadataModalConfig] = useState({
    title: '',
    placeholder: '',
    initialValue: '',
    initialIcon: '',
    type: 'category' as 'category' | 'author'
  });

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const statsData = await getThongKeAdmin();
      setStats(statsData);
      
      const qdData = await getQuyDinh();
      setQuyDinh(qdData);
      
      // Load accounts
      await fetchAccounts();
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khởi tạo admin:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccounts = async () => {
      const data = await getAllUsers(selectedRole, readerPage, 10, readerSearchTerm);
      if (data) {
          setAccounts(data.items || []);
          setReaderTotalPages(data.totalPages || 1);
      }
  };

  const fetchData = async () => {
    await fetchInitialData();
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Effect to handle chart rendering delay
  useEffect(() => {
    if (activeTab === 'analytics') {
      const timer = setTimeout(() => setShowCharts(true), 200);
      return () => { clearTimeout(timer); setShowCharts(false); };
    }
  }, [activeTab]);

  // Effects for pagination and search
  useEffect(() => { fetchAccounts(); }, [readerPage, readerSearchTerm, selectedRole]);

  const handleToggleUserStatus = async (userId: string, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 2 : 1;
    const confirmMsg = newStatus === 2 ? 'Bạn có chắc chắn muốn KHÓA tài khoản này?' : 'Bạn có chắc chắn muốn MỞ KHÓA tài khoản này?';
    
    if (!window.confirm(confirmMsg)) return;

    try {
      const success = await updateUserStatus(userId, newStatus);
      if (success) {
        alert('Cập nhật trạng thái thành công!');
        fetchAccounts();
      } else {
        alert('Cập nhật thất bại.');
      }
    } catch (error) {
      alert('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleSaveQuyDinh = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quyDinh) return;
    setSavingQuyDinh(true);
    try {
      await updateQuyDinh(quyDinh);
      alert('Cập nhật quy định thành công!');
    } catch (error) {
      alert('Lỗi khi cập nhật quy định');
    } finally {
      setSavingQuyDinh(false);
    }
  };





  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan & Hoạt động', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg> },
    { id: 'analytics', label: 'Thống kê Chuyên sâu', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> },
    { id: 'accounts', label: 'Quản lý Tài khoản', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> },
    { id: 'settings', label: 'Cấu hình Quy định', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
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
        <AdminHeader 
          title={menuItems.find(m => m.id === activeTab)?.label || 'Quản trị'} 
          onRefresh={fetchData}
          accentColor="var(--accent)"
          avatarLetter={getUserName() ? getUserName()!.charAt(0).toUpperCase() : 'A'}
        />

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
                    <h2 className={styles['section-title']}>Nhân viên hệ thống</h2>
                    <button onClick={() => { setActiveTab('accounts'); setSelectedRole(2); }} className={styles['view-all-link']}>Xem tất cả</button>
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
                        {accounts.filter(u => u.vaiTro === 1 || u.vaiTro === 2).length > 0 ? (
                          accounts.filter(u => u.vaiTro === 1 || u.vaiTro === 2).slice(0, 5).map((user) => (
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
                                  <span className={`${styles['status-dot']} ${user.trangThai === 1 ? styles['active'] : ''}`}></span>
                                  <span style={{fontSize: '13px', color: user.trangThai === 1 ? '#10b981' : '#ef4444', fontWeight: '500'}}>
                                    {user.trangThai === 1 ? 'Hoạt động' : 'Đã khóa'}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr><td colSpan={3} style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>Chưa có dữ liệu nhân viên</td></tr>
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
                    {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                      stats.recentActivities.map((activity, index) => (
                        <div key={index} className={styles['activity-item']}>
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
                      ))
                    ) : (
                      <div style={{textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '14px'}}>Chưa có hoạt động nào</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analytics' && (
            <div key={activeTab} className={styles['admin-section']} style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
              <div className={styles['analytics-grid']} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
                
                {/* Borrow Trends Line Chart */}
                <div className={styles['chart-card']} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>Xu hướng Mượn sách</h3>
                  <div style={{ flex: 1, minHeight: '300px', width: '100%' }}>
                    {showCharts && (
                      <ResponsiveContainer width="99%" height={300} debounce={100}>
                        <LineChart data={stats?.borrowTrends || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                          <Line type="monotone" dataKey="value" name="Số lượt mượn" stroke="#6366f1" strokeWidth={3} dot={{r: 4, fill: '#6366f1'}} activeDot={{r: 6}} />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Member Growth Bar Chart */}
                <div className={styles['chart-card']} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>Tăng trưởng Độc giả</h3>
                  <div style={{ flex: 1, minHeight: '300px', width: '100%' }}>
                    {showCharts && (
                      <ResponsiveContainer width="99%" height={300} debounce={100}>
                        <BarChart data={stats?.memberGrowth || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                          <Bar dataKey="value" name="Độc giả mới" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                </div>

                {/* Category Distribution Pie Chart */}
                <div className={styles['chart-card']} style={{ background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', gridColumn: 'span 2', minHeight: '450px' }}>
                  <h3 style={{ marginBottom: '20px', fontSize: '18px', fontWeight: '700' }}>Phân bổ Sách theo Danh mục</h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', height: '350px' }}>
                    <div style={{ height: '350px', width: '50%' }}>
                      {showCharts && (
                        <ResponsiveContainer width="99%" height="100%" debounce={100}>
                          <PieChart>
                            <Pie
                              data={stats?.categoryDistribution || []}
                              cx="50%"
                              cy="50%"
                              innerRadius={80}
                              outerRadius={120}
                              paddingAngle={5}
                              dataKey="value"
                              nameKey="name"
                            >
                              {(stats?.categoryDistribution || []).map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6]} />
                              ))}
                            </Pie>
                            <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} />
                          </PieChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                    <div style={{ width: '40%', maxHeight: '350px', overflowY: 'auto' }}>
                       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
                          {(stats?.categoryDistribution || []).map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', background: '#f8fafc', borderRadius: '8px' }}>
                               <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][index % 6] }}></div>
                               <span style={{ fontSize: '14px', color: '#64748b', flex: 1 }}>{item.name}</span>
                               <span style={{ fontWeight: '700', color: '#1e293b' }}>{item.value}</span>
                            </div>
                          ))}
                          {(!stats?.categoryDistribution || stats.categoryDistribution.length === 0) && (
                            <p style={{ textAlign: 'center', color: '#94a3b8' }}>Chưa có dữ liệu danh mục</p>
                          )}
                       </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Danh sách Tài khoản Hệ thống</h2>
                <div className={styles['header-tools']}>
                  <select 
                    value={selectedRole || ''} 
                    onChange={(e) => { setSelectedRole(e.target.value ? Number(e.target.value) : undefined); setReaderPage(1); }}
                    className={styles['role-select']}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', marginRight: '12px', background: 'white' }}
                  >
                    <option value="">Tất cả vai trò</option>
                    <option value="1">Quản trị viên (Admin)</option>
                    <option value="2">Thủ thư (Librarian)</option>
                    <option value="3">Độc giả (Reader)</option>
                  </select>
                  <div className={styles['search-box']}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    <input 
                      type="text" 
                      placeholder="Tìm kiếm họ tên, email..." 
                      value={readerSearchTerm}
                      onChange={(e) => { setReaderSearchTerm(e.target.value); setReaderPage(1); }}
                    />
                  </div>
                </div>
              </div>
              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Họ Tên</th>
                      <th>Vai trò</th>
                      <th>Email</th>
                      <th>Ngày tham gia</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accounts.length > 0 ? (
                      accounts.map((user) => (
                        <tr key={user.id}>
                          <td style={{fontWeight: '600'}}>{user.hoTen}</td>
                          <td>
                            <span className={styles['role-label']} style={{ 
                                padding: '4px 8px', 
                                borderRadius: '6px', 
                                fontSize: '12px',
                                background: user.vaiTro === 1 ? '#fee2e2' : user.vaiTro === 2 ? '#e0e7ff' : '#f3f4f6',
                                color: user.vaiTro === 1 ? '#b91c1c' : user.vaiTro === 2 ? '#4338ca' : '#374151'
                            }}>
                                {user.vaiTro === 1 ? 'Admin' : user.vaiTro === 2 ? 'Thủ thư' : 'Độc giả'}
                            </span>
                          </td>
                          <td>{user.email}</td>
                          <td>{new Date(user.ngayTao).toLocaleDateString('vi-VN')}</td>
                          <td>
                            <span className={`${styles['status-badge']} ${user.trangThai === 1 ? styles['status-active'] : styles['status-inactive']}`}>
                              {user.trangThai === 1 ? 'Đang hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                          <td>
                             <div className={styles['action-buttons']}>
                               <button 
                                 onClick={() => handleToggleUserStatus(user.id, user.trangThai)}
                                 className={`${styles['btn-icon']} ${user.trangThai === 1 ? styles['reject'] : styles['approve']}`} 
                                 title={user.trangThai === 1 ? 'Khóa tài khoản' : 'Mở khóa'}
                               >
                                 {user.trangThai === 1 ? (
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                 ) : (
                                   <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V5a5 5 0 0 1 9.9-1"/></svg>
                                 )}
                               </button>
                             </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} style={{textAlign: 'center', padding: '20px'}}>Không tìm thấy tài khoản nào</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {readerTotalPages > 1 && (
                <div className={styles['pagination']}>
                  <button 
                    disabled={readerPage === 1}
                    onClick={() => setReaderPage(p => p - 1)}
                    className={styles['page-btn']}
                  >
                    Trước
                  </button>
                  {[...Array(readerTotalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setReaderPage(i + 1)}
                      className={`${styles['page-number']} ${readerPage === i + 1 ? styles['active'] : ''}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={readerPage === readerTotalPages}
                    onClick={() => setReaderPage(p => p + 1)}
                    className={styles['page-btn']}
                  >
                    Sau
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && quyDinh && (
            <div className={styles['admin-section']} style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Cấu hình Quy định Thư viện</h2>
              </div>
              <form onSubmit={handleSaveQuyDinh} style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: '600', color: '#1e293b' }}>Số sách mượn tối đa (quyển)</label>
                  <input 
                    type="number" 
                    value={quyDinh.soSachMuonToiDa} 
                    onChange={e => setQuyDinh({...quyDinh, soSachMuonToiDa: parseInt(e.target.value)})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    min="1"
                    required
                  />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Giới hạn số lượng sách một độc giả có thể mượn cùng lúc.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: '600', color: '#1e293b' }}>Thời hạn mượn tối đa (ngày)</label>
                  <input 
                    type="number" 
                    value={quyDinh.soNgayMuonToiDa} 
                    onChange={e => setQuyDinh({...quyDinh, soNgayMuonToiDa: parseInt(e.target.value)})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    min="1"
                    required
                  />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Số ngày tối đa độc giả được phép giữ sách trước khi bị tính là quá hạn.</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontWeight: '600', color: '#1e293b' }}>Phí phạt trễ hạn mỗi ngày (VNĐ)</label>
                  <input 
                    type="number" 
                    value={quyDinh.phiPhatTreHanMoiNgay} 
                    onChange={e => setQuyDinh({...quyDinh, phiPhatTreHanMoiNgay: parseFloat(e.target.value)})}
                    style={{ padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px' }}
                    min="0"
                    step="1000"
                    required
                  />
                  <span style={{ fontSize: '13px', color: '#64748b' }}>Số tiền phạt cho mỗi cuốn sách trễ hạn tính theo ngày.</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    type="submit" 
                    disabled={savingQuyDinh}
                    style={{ background: '#3b82f6', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
                  >
                    {savingQuyDinh ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

    </div>
  );
};

export default AdminPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TrangAdmin.module.css'; // Reusing the same rich CSS as Admin
import { getThongKeThuThu, type ThongKeThuThuDto } from '../dichVu/modules/dichVuThongKe';
import { getUserName } from '../dichVu/modules/dichVuXacThuc';
import { GetAllYeuCauMuon, GetDanhSachPhieuMuon, GetPhieuMuonQuaHan, GetPhieuMuonById, type YeuCauMuonDto } from '../dichVu/modules/dichVuMuonSach';
import { GetDanhSachSach, CreateBook, UpdateBook, DeleteBook, GetTacGias, GetNhaXuatBans, GetCategories } from '../dichVu/modules/dichVuSach';
import type { TacGiaItem, NhaXuatBanItem, CategoryItem, UpsertSachDto } from '../kieuDuLieu/sach';
import DuyetYeuCauModal from '../components/CuaSoXacNhan/DuyetYeuCauModal';
import KiemTraKhoModal from '../components/CuaSoXacNhan/KiemTraKhoModal';
import XacNhanTraSachModal from '../components/CuaSoXacNhan/XacNhanTraSachModal';

const LibrarianPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<ThongKeThuThuDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<YeuCauMuonDto[]>([]);
  const [borrowedBooks, setBorrowedBooks] = useState<any[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<any[]>([]);
  const [selectedYeuCau, setSelectedYeuCau] = useState<any>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showCheckStockModal, setShowCheckStockModal] = useState(false);
  const [inventoryBooks, setInventoryBooks] = useState<any[]>([]);
  const [readers, setReaders] = useState<any[]>([]);
  const [tacGias, setTacGias] = useState<TacGiaItem[]>([]);
  const [nhaXuatBans, setNhaXuatBans] = useState<NhaXuatBanItem[]>([]);
  const [danhMucs, setDanhMucs] = useState<CategoryItem[]>([]);
  const [quyDinh, setQuyDinh] = useState<any>(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedPhieuMuon, setSelectedPhieuMuon] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpsertSachDto>({
    tenSach: '', soLuongTon: 0, danhMucId: '', tacGiaId: '', nxbId: '', namXuatBan: new Date().getFullYear()
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, requestsData, borrowedData, overdueData, inventoryData, tacGiasData, nxbsData, dmData] = await Promise.all([
        getThongKeThuThu(),
        GetAllYeuCauMuon(),
        GetDanhSachPhieuMuon(1, 10),
        GetPhieuMuonQuaHan(),
        GetDanhSachSach(1, 50),
        GetTacGias(),
        GetNhaXuatBans(),
        GetCategories()
      ]);

      setStats(statsData);
      setRequests(requestsData || []);
      setBorrowedBooks(borrowedData?.items || []);
      setOverdueBooks(overdueData || []);
      setInventoryBooks(inventoryData?.items || []);
      // @ts-ignore
      setTacGias(tacGiasData || []);
      // @ts-ignore
      setNhaXuatBans(nxbsData || []);
      // @ts-ignore
      setDanhMucs(dmData || []);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu thủ thư:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCheckStock = (yeuCau: any) => {
    setSelectedYeuCau(yeuCau);
    setShowCheckStockModal(true);
  };

  const handleIssueBooks = (yeuCau: any) => {
    setSelectedYeuCau(yeuCau);
    setShowApproveModal(true);
  };


  const handleEditBook = (book: any) => {
    setEditingBookId(book.id);
    setFormData({
      tenSach: book.tenSach,
      soLuongTon: book.soLuongTon,
      danhMucId: danhMucs.find(d => d.tenDanhMuc === book.tenDanhMuc)?.id || danhMucs[0]?.id || '',
      tacGiaId: tacGias.find(t => t.tenTacGia === book.tenTacGia)?.id || tacGias[0]?.id || '',
      nxbId: nhaXuatBans[0]?.id || '',
      namXuatBan: new Date().getFullYear(),
      hinhAnh: book.hinhAnh || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sách này?')) return;
    try {
      await DeleteBook(id);
      fetchData();
    } catch (e) {
      alert('Không thể xóa sách này');
    }
  };

  const handleReturnClick = async (phieuId: string) => {
    try {
      const data = await GetPhieuMuonById(phieuId);
      setSelectedPhieuMuon(data);
      setShowReturnModal(true);
    } catch (error) {
      alert('Không thể tải chi tiết phiếu mượn');
    }
  };

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBookId) {
        await UpdateBook(editingBookId, formData);
      } else {
        await CreateBook(formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      alert('Lỗi lưu sách');
    }
  };
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('vi-VN');
  };

  const recentLibrarianActivities = [
    { id: 1, user: 'Nguyễn Văn A', action: 'vừa trả sách "Lập trình React"', time: '5 phút trước', type: 'return' },
    { id: 2, user: 'Lê Thị B', action: 'mượn 02 cuốn sách Kinh tế', time: '15 phút trước', type: 'borrow' },
    { id: 3, user: 'Trần C', action: 'gia hạn thêm 07 ngày mượn', time: '1 giờ trước', type: 'extend' },
    { id: 4, user: 'Hệ thống', action: 'cập nhật 50 đầu sách mới nhập', time: '2 giờ trước', type: 'update' },
  ];


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg> },
    { id: 'books', label: 'Quản lý Kho Sách', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg> },
    { id: 'borrow', label: 'Quản lý Mượn/Trả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg> },
    { id: 'requests', label: 'Yêu Cầu Mượn', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg> },
    { id: 'readers', label: 'Quản lý Độc giả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="18" cy="7" r="4" /></svg> },
    { id: 'metadata', label: 'Danh mục & Tác giả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" x2="21" y1="6" y2="6" /><line x1="8" x2="21" y1="12" y2="12" /><line x1="8" x2="21" y1="18" y2="18" /><line x1="3" x2="3.01" y1="6" y2="6" /><line x1="3" x2="3.01" y1="12" y2="12" /><line x1="3" x2="3.01" y1="18" y2="18" /></svg> },
  ];

  return (
    <div className={styles['admin-container']}>
      {/* Sidebar */}
      <aside className={styles['admin-sidebar']}>
        <div className={styles['admin-logo']}>
          <div className={styles['admin-logo-icon']} style={{ background: 'linear-gradient(135deg, #10b981, #34d399)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
          </div>
          <span>Thủ Thư Hub</span>
        </div>

        <nav className={styles['admin-nav']}>
          {menuItems.map((item) => (
            <a
              key={item.id}
              className={`${styles['admin-nav-item']} ${activeTab === item.id ? styles['active'] : ''}`}
              onClick={(e) => { e.preventDefault(); setActiveTab(item.id); fetchData(); }}
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
            <button className={styles['icon-btn']} onClick={fetchData} title="Làm mới dữ liệu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>
            </button>
            <div className={styles['admin-profile-btn']} style={{ borderColor: '#10b981' }}>
              <div className={styles['admin-avatar']} style={{ backgroundColor: '#10b981', boxShadow: '0 0 0 2px var(--bg), 0 0 0 4px #10b981' }}>
                {getUserName() ? getUserName()!.charAt(0).toUpperCase() : 'T'}
              </div>
              <span className={styles['admin-username']}>{getUserName() || 'Thủ Thư (NV)'}</span>
              <svg className={styles['chevron-icon']} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
            <Link to="/" className={styles['exit-btn']} title="Trở về trang chủ">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
            </Link>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className={styles['admin-content']}>
          {activeTab === 'dashboard' && (
            <>
              <div className={styles['dashboard-stats']}>
                <div className={`${styles['stat-card']} ${styles['librarian-card']}`} onClick={() => setActiveTab('borrow')} style={{ cursor: 'pointer' }}>
                  <div className={styles['stat-header']}>
                    <span>Sách Đang Mượn</span>
                    <div className={styles['stat-icon']} style={{ color: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : stats?.booksBorrowed}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-up']}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>
                    <span>Cập nhật liên tục</span>
                  </div>
                </div>

                <div className={`${styles['stat-card']} ${styles['librarian-card']}`} onClick={() => setActiveTab('requests')} style={{ cursor: 'pointer' }}>
                  <div className={styles['stat-header']}>
                    <span>Yêu Cầu Chờ</span>
                    <div className={styles['stat-icon']} style={{ color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : stats?.pendingRequests}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-down']}`} style={{ color: (stats?.pendingRequests || 0) > 0 ? '#ef4444' : '#10b981' }}>
                    <span>{(stats?.pendingRequests || 0) > 0 ? 'Cần xử lý ngay' : 'Đã hết yêu cầu'}</span>
                  </div>
                </div>

                <div className={`${styles['stat-card']} ${styles['librarian-card']}`} onClick={() => setActiveTab('borrow')} style={{ cursor: 'pointer' }}>
                  <div className={styles['stat-header']}>
                    <span>Sách Trễ Hạn</span>
                    <div className={styles['stat-icon']} style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : stats?.booksOverdue}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-down']}`} style={{ color: '#ef4444' }}>
                    <span>{stats?.booksOverdue || 0} Độc giả vi phạm</span>
                  </div>
                </div>

                <div className={`${styles['stat-card']} ${styles['librarian-card']}`}>
                  <div className={styles['stat-header']}>
                    <span>Tổng Kho Sách</span>
                    <div className={styles['stat-icon']} style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
                    </div>
                  </div>
                  <div className={styles['stat-value']}>{loading ? '...' : (stats?.totalBooks || 0).toLocaleString()}</div>
                  <div className={`${styles['stat-trend']} ${styles['trend-up']}`}>
                    <span>Toàn bộ đầu sách</span>
                  </div>
                </div>
              </div>

              <div className={styles['admin-dashboard-grid']}>
                {/* Recent Requests Table */}
                <div className={styles['admin-section']}>
                  <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Yêu Cầu Mượn Online Mới</h2>
                    <Link to="/librarian/requests" className={styles['view-all-link']} onClick={(e) => { e.preventDefault(); setActiveTab('requests') }}>Xem tất cả</Link>
                  </div>
                  <div className={styles['table-responsive']}>
                    <table className={styles['admin-table']}>
                      <thead>
                        <tr>
                          <th>Độc Giả</th>
                          <th>Danh sách Sách</th>
                          <th>Hẹn Nhận</th>
                          <th>Trạng Thái</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.length === 0 ? (
                          <tr><td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>Không có yêu cầu nào</td></tr>
                        ) : (
                          requests.slice(0, 5).map((req) => (
                            <tr key={req.id}>
                              <td>
                                <div className={styles['user-details']}>
                                  <span className={styles['user-name']} style={{ fontSize: '14px', fontWeight: '600' }}>{req.tenDocGia}</span>
                                  <div style={{ fontSize: '11px', color: '#10b981' }}>{req.email}</div>
                                </div>
                              </td>
                              <td style={{ fontSize: '13px', maxWidth: '250px' }}>
                                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: req.tenCacSach && req.tenCacSach.length > 0 ? 'inherit' : '#9ca3af' }} title={req.tenCacSach?.join(', ')}>
                                  {req.tenCacSach && req.tenCacSach.length > 0 ? req.tenCacSach.join(', ') : (req.tenCacSach ? 'Chưa chọn sách' : 'Đang tải...')}
                                </div>
                              </td>
                              <td style={{ fontSize: '13px' }}>{formatDate(req.ngayHenNhan || '')}</td>
                              <td>
                                <span className={`${styles['status-badge']} ${styles['status-' + (req.trangThai === 0 ? 'pending' : req.trangThai === 1 ? 'approved' : 'rejected')]}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                                  {req.trangThai === 0 ? 'Chờ duyệt' : req.trangThai === 1 ? 'Đã duyệt' : 'Từ chối'}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className={`${styles['admin-section']} ${styles['recent-activities-panel']}`}>
                  <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Hoạt động nghiệp vụ</h2>
                  </div>
                  <div className={styles['activity-list']}>
                    {recentLibrarianActivities.map(activity => (
                      <div key={activity.id} className={styles['activity-item']}>
                        <div className={`${styles['activity-icon-box']} ${activity.type === 'borrow' ? styles['user'] : activity.type === 'return' ? styles['approve'] : activity.type === 'extend' ? styles['warning'] : styles['system']}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {activity.type === 'borrow' ? <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> : activity.type === 'return' ? <polyline points="20 6 9 17 4 12" /> : activity.type === 'extend' ? <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></> : <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />}
                          </svg>
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

          {activeTab === 'books' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Kho Sách Thư Viện</h2>
                <button className={styles['section-action']} onClick={() => {
                  setEditingBookId(null);
                  setFormData({ tenSach: '', soLuongTon: 0, danhMucId: danhMucs[0]?.id || '', tacGiaId: tacGias[0]?.id || '', nxbId: nhaXuatBans[0]?.id || '', namXuatBan: new Date().getFullYear() });
                  setIsModalOpen(true);
                }}>+ Nhập Sách Mới</button>
              </div>
              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Mã Sách</th>
                      <th>Tiêu Đề</th>
                      <th>Tác Giả</th>
                      <th>Thể Loại</th>
                      <th>Số Lượng</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventoryBooks.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Kho sách trống</td></tr>
                    ) : (
                      inventoryBooks.map(book => (
                        <tr key={book.id}>
                          <td style={{ fontSize: '12px' }}>{book.id}</td>
                          <td style={{ fontWeight: '600' }}>{book.tenSach}</td>
                          <td>{book.tenTacGia}</td>
                          <td>{book.tenDanhMuc}</td>
                          <td>{book.soLuongTon}</td>
                          <td>
                            <span className={`${styles['status-badge']} ${book.soLuongTon > 0 ? styles['status-active'] : styles['status-pending']}`}>
                              {book.soLuongTon > 0 ? 'Sẵn sàng' : 'Đã hết'}
                            </span>
                          </td>
                          <td>
                            <div className={styles['action-buttons']}>
                              <button className={`${styles['btn-icon']} ${styles['view']}`} title="Sửa" onClick={() => handleEditBook(book)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                              </button>
                              <button className={`${styles['btn-icon']} ${styles['reject']}`} title="Xóa" onClick={() => handleDeleteBook(book.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'borrow' && (
            <div className={styles['admin-dashboard-grid']} style={{ gridTemplateColumns: '1fr' }}>
              <div className={styles['admin-section']}>
                <div className={styles['section-header']}>
                  <h2 className={styles['section-title']}>Danh sách Sách đang mượn</h2>
                  <button className={styles['section-action']}>+ Tạo Phiếu Mượn</button>
                </div>
                <div className={styles['table-responsive']}>
                  <table className={styles['admin-table']}>
                    <thead>
                      <tr>
                        <th>Mã Phiếu</th>
                        <th>Độc Giả</th>
                        <th>Tên Sách</th>
                        <th>Ngày Mượn</th>
                        <th>Hạn Trả</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowedBooks.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Không có sách nào đang được mượn</td></tr>
                      ) : (
                        borrowedBooks.map(item => (
                          <tr key={item.id}>
                            <td><strong>#{String(item.id).substring(0, 8)}</strong></td>
                            <td>{item.tenDocGia}</td>
                            <td>{item.tenSach || "Nhiều sách"}</td>
                            <td>{formatDate(item.ngayMuon)}</td>
                            <td><span style={{ color: '#3b82f6', fontWeight: '500' }}>{formatDate(item.hanTra)}</span></td>
                            <td>
                              <button 
                                className={`${styles['status-badge']} ${styles['status-active']}`} 
                                style={{ border: 'none', cursor: 'pointer' }}
                                onClick={() => handleReturnClick(item.id)}
                              >
                                Trả sách
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles['admin-section']} style={{ marginTop: '30px' }}>
                <div className={styles['section-header']}>
                  <h2 className={styles['section-title']} style={{ color: '#ef4444' }}>Sách quá hạn (Cần xử lý)</h2>
                </div>
                <div className={styles['table-responsive']}>
                  <table className={styles['admin-table']}>
                    <thead>
                      <tr>
                        <th>Mã Phiếu</th>
                        <th>Độc Giả</th>
                        <th>Tên Sách</th>
                        <th>Hạn Trả</th>
                        <th>Số ngày trễ</th>
                        <th>Tiền phạt dự kiến</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overdueBooks.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Tuyệt vời! Không có sách quá hạn.</td></tr>
                      ) : (
                        overdueBooks.map(item => {
                          const delayDays = Math.ceil((new Date().getTime() - new Date(item.hanTra).getTime()) / (1000 * 3600 * 24));
                          return (
                            <tr key={item.id}>
                              <td><strong>#{String(item.id).substring(0, 8)}</strong></td>
                              <td>{item.tenDocGia}</td>
                              <td>{item.tenSach || "Nhiều sách"}</td>
                              <td>{formatDate(item.hanTra)}</td>
                              <td><span className={`${styles['status-badge']} ${styles['status-rejected']}`}>{delayDays} ngày</span></td>
                              <td><strong style={{ color: '#ef4444' }}>{(delayDays * 5000).toLocaleString()} ₫</strong></td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Chi tiết Yêu cầu mượn Online</h2>
              </div>
              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Độc Giả</th>
                      <th>Sách mượn</th>
                      <th>Ngày Hẹn</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>Không có yêu cầu mượn nào</td></tr>
                    ) : (
                      requests.map(req => (
                        <tr key={req.id}>
                          <td>
                            <div style={{ fontWeight: '600' }}>{req.tenDocGia}</div>
                            <div style={{ fontSize: '12px', color: '#10b981' }}>{req.email}</div>
                            <div style={{ fontSize: '11px', color: '#6b7280' }}>#{String(req.id).substring(0, 8)}</div>
                          </td>
                          <td style={{ fontSize: '13px' }}>
                            {req.tenCacSach && req.tenCacSach.length > 0 ? (
                              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                                {req.tenCacSach.map((s, idx) => <li key={idx}>{s}</li>)}
                              </ul>
                            ) : (
                              <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>
                                {req.tenCacSach ? 'Chưa chọn sách' : 'Đang tải...'}
                              </span>
                            )}
                          </td>
                          <td style={{ fontSize: '13px' }}>{formatDate(req.ngayHenNhan || '')}</td>
                          <td>
                            <span className={`${styles['status-badge']} ${req.trangThai === 0 ? styles['status-pending'] :
                              req.trangThai === 1 ? styles['status-approved'] :
                                req.trangThai === 3 ? styles['status-completed'] : styles['status-rejected']
                              }`}>
                              {req.trangThai === 0 ? 'Đang chờ' :
                                req.trangThai === 1 ? 'Đã duyệt' :
                                  req.trangThai === 3 ? 'Đã cấp sách' : 'Đã từ chối'}
                            </span>
                          </td>
                          <td>
                            {req.trangThai === 0 && (
                              <div className={styles['action-buttons']}>
                                <button
                                  className={`${styles['action-btn-mini']} ${styles['btn-check-stock']}`}
                                  onClick={() => handleOpenCheckStock(req)}
                                >
                                  Kiểm tra
                                </button>
                              </div>
                            )}
                            {req.trangThai === 1 && (
                              <button
                                className={`${styles['action-btn-mini']} ${styles['btn-issue-book']}`}
                                onClick={() => handleIssueBooks(req)}
                              >
                                Bàn giao sách
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'readers' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Quản lý Danh sách Độc giả</h2>
                <div className={styles['header-search']}>
                    <input type="text" placeholder="Tìm tên, email..." className={styles['form-control']} style={{ width: '250px' }} />
                </div>
              </div>
              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Họ Tên</th>
                      <th>Liên Hệ</th>
                      <th>Trạng Thái</th>
                      <th>Ngày tham gia</th>
                      <th>Hoạt động</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock data for readers for now since we don't have GetReaders service yet */}
                    <tr>
                      <td><strong>Nguyễn Văn A</strong></td>
                      <td>
                        <div>vana@email.com</div>
                        <div style={{ fontSize: '12px' }}>090xxxxxxx</div>
                      </td>
                      <td><span className={`${styles['status-badge']} ${styles['status-active']}`}>Hoạt động</span></td>
                      <td>01/01/2026</td>
                      <td>Đang mượn 2 cuốn</td>
                      <td><button className={styles['action-btn-mini']}>Xem hồ sơ</button></td>
                    </tr>
                    <tr>
                      <td><strong>Lê Thị B</strong></td>
                      <td>
                        <div>lethib@email.com</div>
                        <div style={{ fontSize: '12px' }}>091xxxxxxx</div>
                      </td>
                      <td><span className={`${styles['status-badge']} ${styles['status-active']}`}>Hoạt động</span></td>
                      <td>15/02/2026</td>
                      <td>Không có sách mượn</td>
                      <td><button className={styles['action-btn-mini']}>Xem hồ sơ</button></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className={styles['admin-dashboard-grid']}>
               <div className={styles['admin-section']}>
                  <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Danh mục Sách</h2>
                    <button className={styles['section-action-mini']}>+ Thêm</button>
                  </div>
                  <div className={styles['table-responsive']}>
                    <table className={styles['admin-table']}>
                      <thead>
                        <tr>
                          <th>Tên Danh Mục</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {danhMucs.map(dm => (
                          <tr key={dm.id}>
                            <td>{dm.tenDanhMuc}</td>
                            <td><button className={styles['btn-icon']}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
               <div className={styles['admin-section']}>
                  <div className={styles['section-header']}>
                    <h2 className={styles['section-title']}>Tác giả</h2>
                    <button className={styles['section-action-mini']}>+ Thêm</button>
                  </div>
                  <div className={styles['table-responsive']}>
                    <table className={styles['admin-table']}>
                      <thead>
                        <tr>
                          <th>Tên Tác Giả</th>
                          <th>Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tacGias.map(tg => (
                          <tr key={tg.id}>
                            <td>{tg.tenTacGia}</td>
                            <td><button className={styles['btn-icon']}><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
              <div className={styles['modal-header']}>
                <h2>{editingBookId ? 'Cập Nhật Sách' : 'Thêm Sách Mới'}</h2>
                <button className={styles['modal-close-btn']} onClick={() => setIsModalOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                </button>
              </div>
              <form onSubmit={handleSaveBook}>
                <div className={styles['modal-body']}>
                  <div className={styles['form-group']}>
                    <label>Tên Sách</label>
                    <input required type="text" className={styles['form-control']} value={formData.tenSach} onChange={e => setFormData({ ...formData, tenSach: e.target.value })} />
                  </div>
                  <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                      <label>Số Lượng Tồn</label>
                      <input required type="number" min="0" className={styles['form-control']} value={formData.soLuongTon} onChange={e => setFormData({ ...formData, soLuongTon: parseInt(e.target.value) })} />
                    </div>
                    <div className={styles['form-group']}>
                      <label>Năm Xuất Bản</label>
                      <input required type="number" min="1900" max={new Date().getFullYear()} className={styles['form-control']} value={formData.namXuatBan} onChange={e => setFormData({ ...formData, namXuatBan: parseInt(e.target.value) })} />
                    </div>
                  </div>
                  <div className={styles['form-row']}>
                    <div className={styles['form-group']}>
                      <label>Danh Mục</label>
                      <select required className={styles['form-control']} value={formData.danhMucId} onChange={e => setFormData({ ...formData, danhMucId: e.target.value })}>
                        {danhMucs.map(dm => <option key={dm.id} value={dm.id}>{dm.tenDanhMuc}</option>)}
                      </select>
                    </div>
                    <div className={styles['form-group']}>
                      <label>Tác Giả</label>
                      <select required className={styles['form-control']} value={formData.tacGiaId} onChange={e => setFormData({ ...formData, tacGiaId: e.target.value })}>
                        {tacGias.map(tg => <option key={tg.id} value={tg.id}>{tg.tenTacGia}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className={styles['form-group']}>
                    <label>Nhà Xuất Bản</label>
                    <select required className={styles['form-control']} value={formData.nxbId} onChange={e => setFormData({ ...formData, nxbId: e.target.value })}>
                      {nhaXuatBans.map(nxb => <option key={nxb.id} value={nxb.id}>{nxb.tenNXB}</option>)}
                    </select>
                  </div>
                  <div className={styles['form-group']}>
                    <label>Link Hình Ảnh</label>
                    <input type="text" className={styles['form-control']} value={formData.hinhAnh} onChange={e => setFormData({ ...formData, hinhAnh: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
                <div className={styles['modal-footer']}>
                  <button type="button" className={styles['btn-secondary']} onClick={() => setIsModalOpen(false)}>Hủy</button>
                  <button type="submit" className={styles['btn-primary']}>{editingBookId ? 'Cập Nhật' : 'Lưu Sách'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Kiểm tra kho & Duyệt/Từ chối */}
        {selectedYeuCau && (
          <KiemTraKhoModal
            isOpen={showCheckStockModal}
            onClose={() => setShowCheckStockModal(false)}
            yeuCau={selectedYeuCau}
            onSuccess={() => {
              fetchData();
            }}
          />
        )}

        {/* Modal Bàn giao sách */}
        {selectedYeuCau && (
          <DuyetYeuCauModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            yeuCau={selectedYeuCau}
            onSuccess={() => {
              fetchData();
            }}
          />
        )}

        <XacNhanTraSachModal 
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          onSuccess={fetchData}
          phieuMuon={selectedPhieuMuon}
        />
      </main>
    </div>
  );
};

export default LibrarianPage;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './TrangAdmin.module.css'; // Reusing the same rich CSS as Admin
import { getThongKeThuThu, type ThongKeThuThuDto } from '../dichVu/modules/dichVuThongKe';
import { getUserName } from '../dichVu/modules/dichVuXacThuc';
import { GetAllYeuCauMuon, GetDanhSachPhieuMuon, GetPhieuMuonQuaHan, GetPhieuMuonById, type YeuCauMuonDto } from '../dichVu/modules/dichVuMuonSach';
import { GetDanhSachSach, CreateBook, UpdateBook, DeleteBook, GetTacGias, GetNhaXuatBans, GetCategories, DeleteCategory, DeleteTacGia, CreateCategory, CreateTacGia, UpdateCategory, UpdateTacGia, GetPagedCuonSachs, UpdateCuonSach, DeleteCuonSach, CreateCuonSach, GetPagedCategories, GetPagedTacGias } from '../dichVu/modules/dichVuSach';
import type { TacGiaItem, NhaXuatBanItem, CategoryItem, UpsertSachDto } from '../kieuDuLieu/sach';
import MetadataModal from '../components/common/MetadataModal';
import DuyetYeuCauModal from '../components/CuaSoXacNhan/DuyetYeuCauModal';
import KiemTraKhoModal from '../components/CuaSoXacNhan/KiemTraKhoModal';
import XacNhanTraSachModal from '../components/CuaSoXacNhan/XacNhanTraSachModal';
import TaoPhieuMuonModal from '../components/CuaSoXacNhan/TaoPhieuMuonModal';
import { FiX, FiSearch, FiBook, FiTrash2 } from 'react-icons/fi';
import { getAllUsers, type UserItem } from '../dichVu/modules/dichVuNguoiDung';

const formatDate = (dateString: string) => {
  if (!dateString) return '---';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

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
  const [readers, setReaders] = useState<UserItem[]>([]);
  const [tacGias, setTacGias] = useState<TacGiaItem[]>([]);
  const [nhaXuatBans, setNhaXuatBans] = useState<NhaXuatBanItem[]>([]);
  const [danhMucs, setDanhMucs] = useState<CategoryItem[]>([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [showLoanDetailModal, setShowLoanDetailModal] = useState(false);
  const [loanSearchTerm, setLoanSearchTerm] = useState('');
  const [loanStatusFilter, setLoanStatusFilter] = useState<'all' | 'active' | 'returned'>('active');
  const [selectedPhieuMuon, setSelectedPhieuMuon] = useState<any>(null);
  const [showCreateLoanModal, setShowCreateLoanModal] = useState(false);

  // Phân trang & Tìm kiếm cho Kho sách
  const [bookPage, setBookPage] = useState(1);
  const [bookTotalPages, setBookTotalPages] = useState(1);
  const [bookSearchTerm, setBookSearchTerm] = useState('');
  const [bookPageSize] = useState(6);

  // Phân trang & Tìm kiếm cho Cuốn sách vật lý
  const [copyPage, setCopyPage] = useState(1);
  const [copyTotalPages, setCopyTotalPages] = useState(1);
  const [copyPageSize] = useState(6);

  // Phân trang & Tìm kiếm cho Mượn trả
  const [loanPage, setLoanPage] = useState(1);
  const [loanTotalPages, setLoanTotalPages] = useState(1);
  const [loanPageSize] = useState(6);

  // Phân trang cho Yêu cầu mượn
  const [requestPage, setRequestPage] = useState(1);
  const [requestTotalPages, setRequestTotalPages] = useState(1);
  const [requestPageSize] = useState(6);

  // Phân trang & Tìm kiếm cho Độc giả
  const [readerPage, setReaderPage] = useState(1);
  const [readerTotalPages, setReaderTotalPages] = useState(1);
  const [readerSearchTerm, setReaderSearchTerm] = useState("");
  const [readerPageSize] = useState(6);

  // Phân trang & Tìm kiếm cho Danh mục
  const [categoryPage, setCategoryPage] = useState(1);
  const [categoryTotalPages, setCategoryTotalPages] = useState(1);
  const [categorySearchTerm, setCategorySearchTerm] = useState("");
  const [categoryPageSize] = useState(6);

  // Phân trang & Tìm kiếm cho Tác giả
  const [authorPage, setAuthorPage] = useState(1);
  const [authorTotalPages, setAuthorTotalPages] = useState(1);
  const [authorSearchTerm, setAuthorSearchTerm] = useState("");
  const [authorPageSize] = useState(6);

  // State cho Modal Metadata
  const [isMetadataModalOpen, setIsMetadataModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [metadataModalConfig, setMetadataModalConfig] = useState({
    title: '',
    placeholder: '',
    initialValue: '',
    initialIcon: '',
    type: 'category' as 'category' | 'author'
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UpsertSachDto>({
    tenSach: '', soLuongTon: 0, danhMucId: '', tacGiaId: '', nxbId: '', namXuatBan: new Date().getFullYear()
  });

  const [cuonSachs, setCuonSachs] = useState<any[]>([]);
  const [copySearchTerm, setCopySearchTerm] = useState('');
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [editingCopy, setEditingCopy] = useState<any>(null);
  const [copyFormData, setCopyFormData] = useState({ dauSachId: '', maVach: '', tinhTrang: 'Bình thường', trangThaiMuon: 1 });

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [statsData, overdueData, tacGiasData, nxbsData, dmData] = await Promise.all([
        getThongKeThuThu(),
        GetPhieuMuonQuaHan(),
        GetTacGias(),
        GetNhaXuatBans(),
        GetCategories()
      ]);

      const normalizeData = (data: any) => {
        if (Array.isArray(data)) return data;
        if (data && data.data && Array.isArray(data.data)) return data.data;
        if (data && Array.isArray(data.items)) return data.items;
        return [];
      };

      setStats(statsData);
      setOverdueBooks(normalizeData(overdueData));
      setTacGias(normalizeData(tacGiasData));
      setNhaXuatBans(normalizeData(nxbsData));
      setDanhMucs(normalizeData(dmData));

    } catch (error) {
      console.error("Lỗi khi tải dữ liệu khởi tạo thủ thư:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyên biệt để tải lại danh sách yêu cầu
  const fetchRequests = async () => {
    try {
      const data = await GetAllYeuCauMuon(requestPage, requestPageSize);
      if (data && data.items) {
        setRequests(data.items);
        setRequestTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu cầu:", error);
    }
  };

  // Hàm chuyên biệt để tải lại danh sách mượn trả
  const fetchLoans = async () => {
    try {
      const data = await GetDanhSachPhieuMuon(loanPage, loanPageSize, loanSearchTerm, loanStatusFilter);
      if (data && data.items) {
        setBorrowedBooks(data.items);
        setLoanTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách mượn trả:", error);
    }
  };

  const fetchReaders = async () => {
    try {
      const data = await getAllUsers(3, readerPage, readerPageSize, readerSearchTerm);
      if (data && data.items) {
        setReaders(data.items);
        setReaderTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách độc giả:", error);
    }
  };

  const fetchCategoriesForTab = async () => {
    try {
      const data = await GetPagedCategories(categoryPage, categoryPageSize, categorySearchTerm);
      if (data && data.items) {
        setDanhMucs(data.items);
        setCategoryTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách danh mục:", error);
    }
  };

  const fetchAuthorsForTab = async () => {
    try {
      const data = await GetPagedTacGias(authorPage, authorPageSize, authorSearchTerm);
      if (data && data.items) {
        setTacGias(data.items);
        setAuthorTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách tác giả:", error);
    }
  };

  // Hàm chuyên biệt để tải lại danh sách sách khi đổi trang hoặc tìm kiếm
  const fetchBooks = async () => {
    try {
      const data = await GetDanhSachSach(bookPage, bookPageSize, bookSearchTerm);
      if (data && data.items) {
        setInventoryBooks(data.items);
        setBookTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách sách:", error);
    }
  };

  // Hàm chuyên biệt để tải lại danh sách cuốn sách
  const fetchCopies = async () => {
    try {
      const data = await GetPagedCuonSachs(copyPage, copyPageSize, copySearchTerm);
      if (data && data.items) {
        setCuonSachs(data.items);
        setCopyTotalPages(data.totalPages || 1);
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách cuốn sách:", error);
    }
  };

  // Hàm tổng hợp để làm mới toàn bộ dữ liệu (được gọi từ nút Refresh hoặc sau khi CRUD)
  const fetchData = async () => {
    await fetchInitialData();
    // Tải thêm dữ liệu cho tab hiện tại
    switch (activeTab) {
      case 'dashboard': fetchRequests(); break;
      case 'books': fetchBooks(); break;
      case 'copies': fetchCopies(); break;
      case 'borrow': fetchLoans(); break;
      case 'readers': fetchReaders(); break;
      case 'categories': fetchCategoriesForTab(); break;
      case 'authors': fetchAuthorsForTab(); break;
      default: break;
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (activeTab === 'books') {
      fetchBooks();
    }
  }, [activeTab, bookPage]);

  useEffect(() => {
    if (activeTab === 'copies') {
      fetchCopies();
    }
  }, [activeTab, copyPage]);

  // Debounce tìm kiếm sách
  useEffect(() => {
    if (activeTab !== 'books') return;

    const handler = setTimeout(() => {
      if (bookPage !== 1) {
        setBookPage(1);
      } else {
        fetchBooks();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [bookSearchTerm]);

  // Debounce tìm kiếm cuốn sách
  useEffect(() => {
    if (activeTab !== 'copies') return;

    const handler = setTimeout(() => {
      if (copyPage !== 1) {
        setCopyPage(1);
      } else {
        fetchCopies();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [copySearchTerm]);

  useEffect(() => {
    if (activeTab === 'borrow') {
      fetchLoans();
    }
  }, [activeTab, loanPage, loanStatusFilter]);

  // Debounce tìm kiếm mượn trả
  useEffect(() => {
    if (activeTab !== 'borrow') return;

    const handler = setTimeout(() => {
      if (loanPage !== 1) {
        setLoanPage(1);
      } else {
        fetchLoans();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [loanSearchTerm]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchRequests();
    }
  }, [activeTab, requestPage]);

  useEffect(() => {
    if (activeTab === 'readers') {
      fetchReaders();
    }
  }, [activeTab, readerPage]);

  // Debounce tìm kiếm độc giả
  useEffect(() => {
    if (activeTab !== 'readers') return;

    const handler = setTimeout(() => {
      if (readerPage !== 1) {
        setReaderPage(1);
      } else {
        fetchReaders();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [readerSearchTerm]);

  useEffect(() => {
    if (activeTab === 'categories') {
      fetchCategoriesForTab();
    }
  }, [activeTab, categoryPage]);

  // Debounce tìm kiếm danh mục
  useEffect(() => {
    if (activeTab !== 'categories') return;

    const handler = setTimeout(() => {
      if (categoryPage !== 1) {
        setCategoryPage(1);
      } else {
        fetchCategoriesForTab();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [categorySearchTerm]);

  useEffect(() => {
    if (activeTab === 'authors') {
      fetchAuthorsForTab();
    }
  }, [activeTab, authorPage]);

  // Debounce tìm kiếm tác giả
  useEffect(() => {
    if (activeTab !== 'authors') return;

    const handler = setTimeout(() => {
      if (authorPage !== 1) {
        setAuthorPage(1);
      } else {
        fetchAuthorsForTab();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [authorSearchTerm]);

  // Debounce tìm kiếm mượn trả
  useEffect(() => {
    if (activeTab !== 'borrow') return;

    const handler = setTimeout(() => {
      if (loanPage !== 1) {
        setLoanPage(1);
      } else {
        fetchLoans();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [loanSearchTerm]);

  // Debounce tìm kiếm độc giả
  useEffect(() => {
    if (activeTab !== 'readers') return;

    const handler = setTimeout(() => {
      if (readerPage !== 1) {
        setReaderPage(1);
      } else {
        fetchReaders();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [readerSearchTerm]);

  // Debounce tìm kiếm danh mục
  useEffect(() => {
    if (activeTab !== 'categories') return;

    const handler = setTimeout(() => {
      if (categoryPage !== 1) {
        setCategoryPage(1);
      } else {
        fetchCategoriesForTab();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [categorySearchTerm]);

  // Debounce tìm kiếm tác giả
  useEffect(() => {
    if (activeTab !== 'authors') return;

    const handler = setTimeout(() => {
      if (authorPage !== 1) {
        setAuthorPage(1);
      } else {
        fetchAuthorsForTab();
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [authorSearchTerm]);

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
      alert('Xóa thành công!');
    } catch (error) {
      alert('Lỗi khi xóa sách');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
    try {
      await DeleteCategory(id);
      const dmData = await GetCategories();
      setDanhMucs(Array.isArray(dmData) ? dmData : (dmData as any)?.data || []);
      alert('Xóa thành công!');
    } catch (error) {
      alert('Lỗi khi xóa danh mục');
    }
  };

  const handleDeleteAuthor = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tác giả này?')) return;
    try {
      await DeleteTacGia(id);
      const tacGiasData = await GetTacGias();
      setTacGias(Array.isArray(tacGiasData) ? tacGiasData : (tacGiasData as any)?.data || []);
      alert('Xóa thành công!');
    } catch (error) {
      alert('Lỗi khi xóa tác giả');
    }
  };

  const handleCreateCategory = async (name: string, icon?: string) => {
    try {
      if (editingId) {
        await UpdateCategory(editingId, name, icon);
      } else {
        await CreateCategory(name, icon);
      }
      const dmData = await GetCategories();
      setDanhMucs(Array.isArray(dmData) ? dmData : (dmData as any)?.data || []);
      setEditingId(null);
    } catch (error) {
      alert('Lỗi khi lưu danh mục');
    }
  };

  const handleCreateAuthor = async (name: string) => {
    try {
      if (editingId) {
        await UpdateTacGia(editingId, name);
      } else {
        await CreateTacGia(name);
      }
      const tacGiasData = await GetTacGias();
      setTacGias(Array.isArray(tacGiasData) ? tacGiasData : (tacGiasData as any)?.data || []);
      setEditingId(null);
    } catch (error) {
      alert('Lỗi khi lưu tác giả');
    }
  };

  const handleSaveCopy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCopy) {
        await UpdateCuonSach(editingCopy.id, {
          maVach: copyFormData.maVach,
          tinhTrang: copyFormData.tinhTrang,
          trangThaiMuon: copyFormData.trangThaiMuon
        });
      } else {
        await CreateCuonSach({
          dauSachId: copyFormData.dauSachId,
          maVach: copyFormData.maVach
        });
      }
      setShowCopyModal(false);
      fetchData();
      alert('Lưu thành công!');
    } catch (error) {
      alert('Lỗi khi lưu cuốn sách');
    }
  };

  const handleDeleteCopy = async (id: string) => {
    if (!window.confirm('Xác nhận xóa cuốn sách này?')) return;
    try {
      await DeleteCuonSach(id);
      fetchData();
      alert('Xóa thành công!');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Không thể xóa cuốn sách');
    }
  };

  const openAddCategory = () => {
    setEditingId(null);
    setMetadataModalConfig({
      title: 'Thêm Danh mục Mới',
      placeholder: 'Nhập tên danh mục...',
      initialValue: '',
      initialIcon: '📁',
      type: 'category'
    });
    setIsMetadataModalOpen(true);
  };

  const openEditCategory = (dm: CategoryItem) => {
    setEditingId(dm.id);
    setMetadataModalConfig({
      title: 'Chỉnh sửa Danh mục',
      placeholder: 'Nhập tên danh mục...',
      initialValue: dm.tenDanhMuc,
      initialIcon: dm.icon || '📁',
      type: 'category'
    });
    setIsMetadataModalOpen(true);
  };

  const openAddAuthor = () => {
    setEditingId(null);
    setMetadataModalConfig({
      title: 'Thêm Tác giả Mới',
      placeholder: 'Nhập tên tác giả...',
      initialValue: '',
      initialIcon: '',
      type: 'author'
    });
    setIsMetadataModalOpen(true);
  };

  const openEditAuthor = (tg: TacGiaItem) => {
    setEditingId(tg.id);
    setMetadataModalConfig({
      title: 'Chỉnh sửa Tác giả',
      placeholder: 'Nhập tên tác giả...',
      initialValue: tg.tenTacGia,
      initialIcon: '',
      type: 'author'
    });
    setIsMetadataModalOpen(true);
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


  // Tạo dữ liệu hoạt động nghiệp vụ động từ dữ liệu thực tế
  const getDynamicActivities = () => {
    const activities: any[] = [];

    // Thêm các yêu cầu mượn mới nhất
    requests.slice(0, 3).forEach((req, idx) => {
      activities.push({
        id: `req-${idx}`,
        user: req.tenDocGia,
        action: `vừa gửi yêu cầu mượn "${req.tenCacSach?.[0] || 'Sách'}" qua ứng dụng`,
        time: 'Mới nhận',
        type: 'user'
      });
    });

    // Thêm các sách quá hạn (nhiều hơn)
    overdueBooks.slice(0, 3).forEach((loan, idx) => {
      activities.push({
        id: `overdue-${idx}`,
        user: loan.tenDocGia,
        action: `đã trễ hạn trả cuốn "${loan.tenSach}"`,
        time: 'Cần xử lý gấp',
        type: 'warning'
      });
    });

    // Thêm các phiếu mượn vừa thực hiện
    borrowedBooks.slice(0, 2).forEach((loan, idx) => {
      activities.push({
        id: `loan-${idx}`,
        user: loan.tenDocGia,
        action: `đã nhận sách "${loan.tenSach || 'Sách'}" thành công`,
        time: 'Bàn giao xong',
        type: 'approve'
      });
    });

    if (activities.length === 0) {
      return [
        { id: 1, user: 'Hệ thống', action: 'Tất cả dịch vụ thư viện đang hoạt động tối ưu', time: 'Vừa xong', type: 'system' }
      ];
    }

    return activities.sort((a, b) => {
      const order = { 'warning': 0, 'user': 1, 'approve': 2, 'system': 3 };
      return (order as any)[a.type] - (order as any)[b.type];
    });
  };

  const recentLibrarianActivities = getDynamicActivities();


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg> },
    { id: 'books', label: 'Quản lý Kho Sách', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg> },
    { id: 'copies', label: 'Quản lý Cuốn Sách', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg> },
    { id: 'borrow', label: 'Quản lý Mượn/Trả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><path d="M12 18v-6" /><path d="m9 15 3 3 3-3" /></svg> },
    { id: 'requests', label: 'Yêu Cầu Mượn', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="M12 6v6l4 2" /></svg> },
    { id: 'readers', label: 'Quản lý Độc giả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><circle cx="18" cy="7" r="4" /></svg> },
    { id: 'categories', label: 'Danh mục Sách', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg> },
    { id: 'authors', label: 'Tác giả', icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> },
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
                        {requests.filter(r => r.trangThai === 0).length === 0 ? (
                          <tr><td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>Không có yêu cầu mới cần duyệt</td></tr>
                        ) : (
                          requests.filter(r => r.trangThai === 0).slice(0, 5).map((req) => (
                            <tr key={req.id}>
                              <td>
                                <div className={styles['user-details']}>
                                  <span className={styles['user-name']} style={{ fontSize: '14px', fontWeight: '600' }}>{req.tenDocGia}</span>
                                  <div style={{ fontSize: '11px', color: '#10b981' }}>{req.email}</div>
                                </div>
                              </td>
                              <td style={{ fontSize: '13px', maxWidth: '250px' }}>
                                <div
                                  style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    color: req.tenCacSach && req.tenCacSach.length > 0 ? '#1e293b' : '#9ca3af',
                                    fontWeight: '500'
                                  }}
                                  title={req.tenCacSach?.join(', ')}
                                >
                                  {req.tenCacSach && req.tenCacSach.length > 0 ? req.tenCacSach.join(', ') : 'Sách đang mượn...'}
                                </div>
                              </td>
                              <td style={{ fontSize: '13px' }}>{formatDate(req.ngayHenNhan || '')}</td>
                              <td>
                                <span className={`${styles['status-badge']} ${styles['status-pending']}`} style={{ padding: '4px 10px', fontSize: '11px' }}>
                                  Mới (Chờ duyệt)
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
                        <div className={`${styles['activity-icon-box']} ${styles[activity.type]}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            {activity.type === 'user' ? <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /></> :
                              activity.type === 'approve' ? <polyline points="20 6 9 17 4 12" /> :
                                activity.type === 'warning' ? <><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></> :
                                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                  <h2 className={styles['section-title']}>Kho Sách Thư Viện</h2>
                  <div className={styles['header-search']}>
                    <input
                      type="text"
                      placeholder="Tìm tên sách, tác giả..."
                      className={styles['form-control']}
                      style={{ width: '250px', padding: '8px 12px', fontSize: '13px', borderRadius: '20px' }}
                      value={bookSearchTerm}
                      onChange={(e) => setBookSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
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
                      <tr><td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>Kho sách trống</td></tr>
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

              {/* Pagination UI for Books */}
              {bookTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                  <button
                    disabled={bookPage === 1}
                    onClick={() => setBookPage(prev => prev - 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: bookPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: bookPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Trước</button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[...Array(bookTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setBookPage(i + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                          background: bookPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                          color: bookPage === i + 1 ? 'white' : '#64748b',
                          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={bookPage === bookTotalPages}
                    onClick={() => setBookPage(prev => prev + 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: bookPage === bookTotalPages ? 'not-allowed' : 'pointer',
                      opacity: bookPage === bookTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Sau</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'copies' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']} style={{ flexWrap: 'wrap', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                  <h2 className={styles['section-title']} style={{ margin: 0 }}>Quản lý Cuốn Sách Vật Lý</h2>
                  <div className={styles['header-search']}>
                    <input
                      type="text"
                      placeholder="Tìm mã vạch, tên sách..."
                      className={styles['form-control']}
                      style={{ width: '250px', padding: '8px 12px', fontSize: '13px', borderRadius: '20px' }}
                      value={copySearchTerm}
                      onChange={(e) => setCopySearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <button className={styles['section-action']} onClick={() => {
                  setEditingCopy(null);
                  setCopyFormData({ dauSachId: inventoryBooks[0]?.id || '', maVach: '', tinhTrang: 'Bình thường', trangThaiMuon: 1 });
                  setShowCopyModal(true);
                }}>+ Thêm Cuốn Sách</button>
              </div>

              <div className={styles['table-responsive']}>
                <table className={styles['admin-table']}>
                  <thead>
                    <tr>
                      <th>Mã Vạch</th>
                      <th>Tên Sách</th>
                      <th>Tình Trạng</th>
                      <th>Trạng Thái</th>
                      <th>Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuonSachs.length === 0 ? (
                      <tr><td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Không tìm thấy cuốn sách nào</td></tr>
                    ) : (
                      cuonSachs.map(item => (
                        <tr key={item.id}>
                          <td><strong style={{ color: '#3b82f6' }}>{item.maVach}</strong></td>
                          <td style={{ fontWeight: '600' }}>{item.tenSach}</td>
                          <td>
                            <span style={{
                              fontSize: '12px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: item.tinhTrang === 'Bình thường' ? '#f1f5f9' : '#fff1f2',
                              color: item.tinhTrang === 'Bình thường' ? '#475569' : '#e11d48'
                            }}>
                              {item.tinhTrang}
                            </span>
                          </td>
                          <td>
                            <span className={`${styles['status-badge']} ${item.trangThaiMuon === 1 ? styles['status-active'] :
                              item.trangThaiMuon === 2 ? styles['status-pending'] :
                                styles['status-rejected']
                              }`}>
                              {item.trangThaiMuon === 1 ? 'Sẵn sàng' :
                                item.trangThaiMuon === 2 ? 'Đang mượn' : 'Bảo trì/Mất'}
                            </span>
                          </td>
                          <td>
                            <div className={styles['action-buttons']}>
                              <button className={`${styles['btn-icon']} ${styles['view']}`} onClick={() => {
                                setEditingCopy(item);
                                setCopyFormData({
                                  dauSachId: item.dauSachId,
                                  maVach: item.maVach,
                                  tinhTrang: item.tinhTrang,
                                  trangThaiMuon: item.trangThaiMuon
                                });
                                setShowCopyModal(true);
                              }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                              </button>
                              <button className={`${styles['btn-icon']} ${styles['delete']}`} onClick={() => handleDeleteCopy(item.id)}>
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI for Copies */}
              {copyTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                  <button
                    disabled={copyPage === 1}
                    onClick={() => setCopyPage(prev => prev - 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: copyPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: copyPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Trước</button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[...Array(copyTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCopyPage(i + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                          background: copyPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                          color: copyPage === i + 1 ? 'white' : '#64748b',
                          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={copyPage === copyTotalPages}
                    onClick={() => setCopyPage(prev => prev + 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: copyPage === copyTotalPages ? 'not-allowed' : 'pointer',
                      opacity: copyPage === copyTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Sau</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'borrow' && (
            <div className={styles['admin-dashboard-grid']} style={{ gridTemplateColumns: '1fr' }}>
              {/* Thống kê nhanh cho tab Mượn trả */}
              <div className={styles['dashboard-stats']} style={{ marginBottom: '25px', gap: '15px' }}>
                <div className={styles['stat-card']} style={{ padding: '15px', background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)', border: '1px solid #bfdbfe' }}>
                  <div style={{ color: '#1e40af', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Đang cho mượn</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#1e3a8a' }}>{stats?.booksBorrowed || 0}</div>
                </div>
                <div className={styles['stat-card']} style={{ padding: '15px', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', border: '1px solid #fecaca' }}>
                  <div style={{ color: '#991b1b', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Quá hạn</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#7f1d1d' }}>{stats?.booksOverdue || 0}</div>
                </div>
                <div className={styles['stat-card']} style={{ padding: '15px', background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #bbf7d0' }}>
                  <div style={{ color: '#166534', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '5px' }}>Tỉ lệ đúng hạn</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#14532d' }}>
                    {stats && stats.booksBorrowed > 0
                      ? Math.round(((stats.booksBorrowed - stats.booksOverdue) / stats.booksBorrowed) * 100)
                      : 100}%
                  </div>
                </div>
              </div>

              <div className={styles['admin-section']}>
                <div className={styles['section-header']} style={{ flexWrap: 'wrap', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                    <h2 className={styles['section-title']} style={{ margin: 0 }}>Quản lý Mượn trả</h2>
                    <div className={styles['header-search']}>
                      <input
                        type="text"
                        placeholder="Tìm mã phiếu, độc giả..."
                        className={styles['form-control']}
                        style={{ width: '220px', padding: '8px 12px', fontSize: '13px', borderRadius: '20px' }}
                        value={loanSearchTerm}
                        onChange={(e) => setLoanSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px' }}>
                      <button
                        onClick={() => setLoanStatusFilter('active')}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700',
                          background: loanStatusFilter === 'active' ? 'white' : 'transparent',
                          color: loanStatusFilter === 'active' ? '#3b82f6' : '#64748b',
                          boxShadow: loanStatusFilter === 'active' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          cursor: 'pointer'
                        }}
                      >Đang mượn</button>
                      <button
                        onClick={() => setLoanStatusFilter('returned')}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700',
                          background: loanStatusFilter === 'returned' ? 'white' : 'transparent',
                          color: loanStatusFilter === 'returned' ? '#10b981' : '#64748b',
                          boxShadow: loanStatusFilter === 'returned' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          cursor: 'pointer'
                        }}
                      >Đã trả</button>
                      <button
                        onClick={() => setLoanStatusFilter('all')}
                        style={{
                          padding: '6px 12px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: '700',
                          background: loanStatusFilter === 'all' ? 'white' : 'transparent',
                          color: loanStatusFilter === 'all' ? '#6366f1' : '#64748b',
                          boxShadow: loanStatusFilter === 'all' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          cursor: 'pointer'
                        }}
                      >Tất cả</button>
                    </div>
                    <button className={styles['section-action']} onClick={() => setShowCreateLoanModal(true)} style={{ padding: '8px 16px' }}>+ Mượn tại quầy</button>
                  </div>
                </div>
                <div className={styles['table-responsive']}>
                  <table className={styles['admin-table']}>
                    <thead>
                      <tr>
                        <th>Mã Phiếu</th>
                        <th>Độc Giả</th>
                        <th>Thông tin mượn</th>
                        <th>Thời hạn</th>
                        <th>Trạng thái</th>
                        <th>Thao Tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowedBooks.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Không tìm thấy dữ liệu phù hợp</td></tr>
                      ) : (
                        borrowedBooks.map(item => {
                          const isOverdue = item.trangThai === 1 && new Date(item.hanTra) < new Date();
                          return (
                            <tr key={item.id} style={isOverdue ? { backgroundColor: '#fff1f2' } : {}}>
                              <td>
                                <div style={{ fontWeight: '700', color: '#1e293b' }}>#{String(item.id).substring(0, 8)}</div>
                                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                                  {item.kenhMuon === 2 ? 'Kênh Online' : 'Tại quầy'}
                                </div>
                              </td>
                              <td>
                                <div style={{ fontWeight: '600' }}>{item.tenDocGia}</div>
                              </td>
                              <td>
                                <div style={{ fontSize: '13px', color: '#475569' }}>
                                  <FiBook style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                                  {item.tenSach || "Nhiều sách"}
                                </div>
                                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                                  Mượn ngày: {formatDate(item.ngayMuon)}
                                </div>
                              </td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span style={{ color: isOverdue ? '#ef4444' : '#64748b', fontWeight: '600', fontSize: '13px' }}>
                                    Hạn: {formatDate(item.hanTra)}
                                  </span>
                                  {isOverdue && <span style={{ fontSize: '10px', color: '#b91c1c', fontWeight: '800' }}>⚠️ TRỄ HẠN</span>}
                                </div>
                              </td>
                              <td>
                                <span className={`${styles['status-badge']} ${item.trangThai === 2 ? styles['status-approved'] : (isOverdue ? styles['status-rejected'] : styles['status-pending'])}`}>
                                  {item.trangThai === 2 ? 'Đã trả' : (isOverdue ? 'Quá hạn' : 'Đang mượn')}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {item.trangThai === 1 && (
                                    <button
                                      className={`${styles['status-badge']} ${styles['status-active']}`}
                                      style={{ border: 'none', cursor: 'pointer', padding: '6px 12px', background: '#3b82f6' }}
                                      onClick={() => handleReturnClick(item.id)}
                                    >
                                      Trả sách
                                    </button>
                                  )}
                                  <button
                                    className={styles['action-btn-mini']}
                                    title="Xem chi tiết"
                                    onClick={() => {
                                      setSelectedPhieuMuon(item);
                                      setShowLoanDetailModal(true);
                                    }}
                                  >
                                    <FiSearch size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination UI for Loans */}
                {loanTotalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                    <button
                      disabled={loanPage === 1}
                      onClick={() => setLoanPage(prev => prev - 1)}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        background: 'white', cursor: loanPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: loanPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                      }}
                    >Trước</button>

                    <div style={{ display: 'flex', gap: '5px' }}>
                      {[...Array(loanTotalPages)].map((_, i) => (
                        <button
                          key={i + 1}
                          onClick={() => setLoanPage(i + 1)}
                          style={{
                            width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                            background: loanPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                            color: loanPage === i + 1 ? 'white' : '#64748b',
                            fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                          }}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      disabled={loanPage === loanTotalPages}
                      onClick={() => setLoanPage(prev => prev + 1)}
                      style={{
                        padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                        background: 'white', cursor: loanPage === loanTotalPages ? 'not-allowed' : 'pointer',
                        opacity: loanPage === loanTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                      }}
                    >Sau</button>
                  </div>
                )}
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

              {/* Pagination UI for Requests */}
              {requestTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                  <button
                    disabled={requestPage === 1}
                    onClick={() => setRequestPage(prev => prev - 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: requestPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: requestPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Trước</button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[...Array(requestTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setRequestPage(i + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                          background: requestPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                          color: requestPage === i + 1 ? 'white' : '#64748b',
                          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={requestPage === requestTotalPages}
                    onClick={() => setRequestPage(prev => prev + 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: requestPage === requestTotalPages ? 'not-allowed' : 'pointer',
                      opacity: requestPage === requestTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Sau</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'readers' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Quản lý Danh sách Độc giả</h2>
                <div className={styles['header-search']}>
                  <input
                    type="text"
                    placeholder="Tìm tên, email, số điện thoại..."
                    className={styles['form-control']}
                    style={{ width: '250px' }}
                    value={readerSearchTerm}
                    onChange={(e) => setReaderSearchTerm(e.target.value)}
                  />
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
                    {readers.length === 0 ? (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>Không tìm thấy độc giả phù hợp</td></tr>
                    ) : (
                      readers.map(reader => (
                        <tr key={reader.id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className={styles['author-avatar']} style={{ width: '32px', height: '32px', fontSize: '14px', flexShrink: 0 }}>
                                {reader.hoTen.charAt(0)}
                              </div>
                              <strong>{reader.hoTen}</strong>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '13px' }}>{reader.email}</div>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>{reader.soDienThoai || 'Chưa cập nhật'}</div>
                          </td>
                          <td>
                            <span className={`${styles['status-badge']} ${reader.trangThai === 1 ? styles['status-active'] : styles['status-rejected']}`}>
                              {reader.trangThai === 1 ? 'Hoạt động' : 'Bị khóa'}
                            </span>
                          </td>
                          <td style={{ fontSize: '13px' }}>{formatDate(reader.ngayTao)}</td>
                          <td>
                            {(() => {
                              const joinDate = new Date(reader.ngayTao);
                              const thirtyDaysAgo = new Date();
                              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                              return joinDate > thirtyDaysAgo ? (
                                <span style={{ color: '#10b981', fontWeight: '500', fontSize: '12px' }}>Thành viên mới</span>
                              ) : (
                                <span style={{ color: '#64748b', fontSize: '12px' }}>Đang hoạt động</span>
                              );
                            })()}
                          </td>
                          <td>
                            <button className={styles['action-btn-mini']} title="Xem hồ sơ">Chi tiết</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination UI for Readers */}
              {readerTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                  <button
                    disabled={readerPage === 1}
                    onClick={() => setReaderPage(prev => prev - 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: readerPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: readerPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Trước</button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[...Array(readerTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setReaderPage(i + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                          background: readerPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                          color: readerPage === i + 1 ? 'white' : '#64748b',
                          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={readerPage === readerTotalPages}
                    onClick={() => setReaderPage(prev => prev + 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: readerPage === readerTotalPages ? 'not-allowed' : 'pointer',
                      opacity: readerPage === readerTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Sau</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'categories' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Danh mục Sách</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div className={styles['header-search']}>
                    <input
                      type="text"
                      placeholder="Tìm danh mục..."
                      className={styles['form-control']}
                      style={{ width: '200px' }}
                      value={categorySearchTerm}
                      onChange={(e) => setCategorySearchTerm(e.target.value)}
                    />
                  </div>
                  <button onClick={openAddCategory} className={styles['section-action']} style={{ background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', padding: '8px 16px', borderRadius: '8px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Thêm mới
                  </button>
                </div>
              </div>
              <div className={styles['metadata-grid']}>
                {danhMucs.length === 0 ? (
                  <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: '#64748b' }}>Không tìm thấy danh mục nào</div>
                ) : (
                  danhMucs.map(dm => (
                    <div key={dm.id} className={styles['category-card']}>
                      <div className={styles['category-main']}>
                        <div className={styles['category-icon-wrapper']}>
                          {dm.icon || '📁'}
                        </div>
                        <div className={styles['category-info']}>
                          <h3>{dm.tenDanhMuc}</h3>
                          <p>Phân loại sách hệ thống</p>
                        </div>
                      </div>
                      <div className={styles['category-actions']}>
                        <button onClick={() => openEditCategory(dm)} className={`${styles['btn-icon']} ${styles['edit']}`} title="Chỉnh sửa">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button onClick={() => handleDeleteCategory(dm.id)} className={`${styles['btn-icon']} ${styles['delete']}`} title="Xóa danh mục">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination UI for Categories */}
              {categoryTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                  <button
                    disabled={categoryPage === 1}
                    onClick={() => setCategoryPage(prev => prev - 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: categoryPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: categoryPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Trước</button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[...Array(categoryTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCategoryPage(i + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                          background: categoryPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                          color: categoryPage === i + 1 ? 'white' : '#64748b',
                          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={categoryPage === categoryTotalPages}
                    onClick={() => setCategoryPage(prev => prev + 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: categoryPage === categoryTotalPages ? 'not-allowed' : 'pointer',
                      opacity: categoryPage === categoryTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Sau</button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'authors' && (
            <div className={styles['admin-section']}>
              <div className={styles['section-header']}>
                <h2 className={styles['section-title']}>Tác giả</h2>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  <div className={styles['header-search']}>
                    <input
                      type="text"
                      placeholder="Tìm tác giả..."
                      className={styles['form-control']}
                      style={{ width: '200px' }}
                      value={authorSearchTerm}
                      onChange={(e) => setAuthorSearchTerm(e.target.value)}
                    />
                  </div>
                  <button onClick={openAddAuthor} className={styles['section-action']} style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', padding: '8px 16px', borderRadius: '8px', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: '600' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Thêm mới
                  </button>
                </div>
              </div>
              <div className={styles['author-list']}>
                {tacGias.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b', width: '100%' }}>Không tìm thấy tác giả nào</div>
                ) : (
                  tacGias.map(tg => (
                    <div key={tg.id} className={styles['author-item']}>
                      <div className={styles['author-main']}>
                        <div className={styles['author-avatar']}>
                          {tg.tenTacGia.charAt(0)}
                        </div>
                        <div className={styles['author-info']}>
                          <h3>{tg.tenTacGia}</h3>
                          <p>Tác giả cộng tác</p>
                        </div>
                      </div>
                      <div className={styles['action-buttons']}>
                        <button onClick={() => openEditAuthor(tg)} className={`${styles['btn-icon']} ${styles['edit']}`} title="Chỉnh sửa">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                        </button>
                        <button onClick={() => handleDeleteAuthor(tg.id)} className={`${styles['btn-icon']} ${styles['delete']}`} title="Xóa tác giả">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Pagination UI for Authors */}
              {authorTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '24px', gap: '10px' }}>
                  <button
                    disabled={authorPage === 1}
                    onClick={() => setAuthorPage(prev => prev - 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: authorPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: authorPage === 1 ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Trước</button>

                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[...Array(authorTotalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setAuthorPage(i + 1)}
                        style={{
                          width: '36px', height: '36px', borderRadius: '8px', border: 'none',
                          background: authorPage === i + 1 ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : '#f1f5f9',
                          color: authorPage === i + 1 ? 'white' : '#64748b',
                          fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={authorPage === authorTotalPages}
                    onClick={() => setAuthorPage(prev => prev + 1)}
                    style={{
                      padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                      background: 'white', cursor: authorPage === authorTotalPages ? 'not-allowed' : 'pointer',
                      opacity: authorPage === authorTotalPages ? 0.5 : 1, fontWeight: '600', color: '#64748b'
                    }}
                  >Sau</button>
                </div>
              )}
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
            onSuccess={fetchData}
          />
        )}

        {/* Modal Bàn giao sách */}
        {selectedYeuCau && (
          <DuyetYeuCauModal
            isOpen={showApproveModal}
            onClose={() => setShowApproveModal(false)}
            yeuCau={selectedYeuCau}
            onSuccess={fetchData}
          />
        )}

        <XacNhanTraSachModal
          isOpen={showReturnModal}
          onClose={() => setShowReturnModal(false)}
          onSuccess={fetchData}
          phieuMuon={selectedPhieuMuon}
        />

        <TaoPhieuMuonModal
          isOpen={showCreateLoanModal}
          onClose={() => setShowCreateLoanModal(false)}
          onSuccess={fetchData}
        />

        {showLoanDetailModal && selectedPhieuMuon && (
          <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']} style={{ maxWidth: '700px' }}>
              <div className={styles['modal-header']}>
                <h2>Chi tiết Phiếu Mượn #{String(selectedPhieuMuon.id).substring(0, 8)}</h2>
                <button className={styles['modal-close-btn']} onClick={() => setShowLoanDetailModal(false)}>
                  <FiX size={24} />
                </button>
              </div>
              <div className={styles['modal-body']}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px', padding: '15px', background: '#f8fafc', borderRadius: '12px' }}>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Độc giả</p>
                    <p style={{ margin: 0, fontWeight: '600' }}>{selectedPhieuMuon.tenDocGia}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Kênh mượn</p>
                    <p style={{ margin: 0 }}>{selectedPhieuMuon.kenhMuon === 2 ? '⚡ Online' : '🏢 Tại quầy'}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Ngày mượn</p>
                    <p style={{ margin: 0 }}>{formatDate(selectedPhieuMuon.ngayMuon)}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700' }}>Hạn trả</p>
                    <p style={{ margin: 0, color: (selectedPhieuMuon.trangThai === 1 && new Date(selectedPhieuMuon.hanTra) < new Date()) ? '#ef4444' : 'inherit', fontWeight: '700' }}>
                      {formatDate(selectedPhieuMuon.hanTra)}
                    </p>
                  </div>
                </div>

                <h3 style={{ fontSize: '16px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiBook /> Danh sách sách mượn
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedPhieuMuon.chiTiet && selectedPhieuMuon.chiTiet.map((ct: any) => (
                    <div key={ct.id} style={{ display: 'flex', gap: '15px', padding: '12px', borderRadius: '10px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                      <img src={ct.hinhAnh || 'https://placehold.co/400x600?text=Book'} alt={ct.tenSach} style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: '600', fontSize: '14px' }}>{ct.tenSach}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>Mã vạch: <span style={{ fontFamily: 'monospace', fontWeight: '700', color: '#3b82f6' }}>{ct.maVach}</span></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`${styles['status-badge']} ${ct.ngayTraThucTe ? styles['status-approved'] : (new Date(selectedPhieuMuon.hanTra) < new Date() ? styles['status-rejected'] : styles['status-pending'])}`}>
                          {ct.ngayTraThucTe ? 'Đã trả' : (new Date(selectedPhieuMuon.hanTra) < new Date() ? 'Quá hạn' : 'Đang mượn')}
                        </span>
                        {ct.ngayTraThucTe && (
                          <div style={{ fontSize: '10px', color: '#10b981', marginTop: '4px' }}>Ngày trả: {formatDate(ct.ngayTraThucTe)}</div>
                        )}
                        {ct.tienPhat > 0 && (
                          <div style={{ fontSize: '12px', color: '#ef4444', fontWeight: '700', marginTop: '4px' }}>Phạt: {ct.tienPhat.toLocaleString()} ₫</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles['modal-footer']}>
                <button className={styles['btn-secondary']} onClick={() => setShowLoanDetailModal(false)}>Đóng</button>
                {selectedPhieuMuon.trangThai === 1 && (
                  <button className={styles['btn-primary']} onClick={() => { setShowLoanDetailModal(false); setShowReturnModal(true); }}>Trả sách</button>
                )}
              </div>
            </div>
          </div>
        )}
        {showCopyModal && (
          <div className={styles['modal-overlay']} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className={styles['modal-content']} style={{ maxWidth: '500px', width: '90%', background: 'white', borderRadius: '12px', overflow: 'hidden' }}>
              <div className={styles['modal-header']} style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{editingCopy ? 'Chỉnh sửa Cuốn Sách' : 'Thêm Cuốn Sách Vật Lý'}</h3>
                <button onClick={() => setShowCopyModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}><FiX size={20} /></button>
              </div>
              <form onSubmit={handleSaveCopy} style={{ padding: '20px' }}>
                {!editingCopy && (
                  <div className={styles['form-group']} style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Đầu Sách</label>
                    <select
                      className={styles['form-control']}
                      style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                      value={copyFormData.dauSachId}
                      onChange={(e) => setCopyFormData({ ...copyFormData, dauSachId: e.target.value })}
                      required
                    >
                      <option value="">-- Chọn đầu sách --</option>
                      {inventoryBooks.map(b => (
                        <option key={b.id} value={b.id}>{b.tenSach}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className={styles['form-group']} style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Mã Vạch (Barcode)</label>
                  <input
                    type="text"
                    className={styles['form-control']}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                    value={copyFormData.maVach}
                    onChange={(e) => setCopyFormData({ ...copyFormData, maVach: e.target.value })}
                    placeholder="VD: CS123456"
                    required
                  />
                </div>
                {editingCopy && (
                  <>
                    <div className={styles['form-group']} style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Tình Trạng</label>
                      <select
                        className={styles['form-control']}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={copyFormData.tinhTrang}
                        onChange={(e) => setCopyFormData({ ...copyFormData, tinhTrang: e.target.value })}
                      >
                        <option value="Bình thường">Bình thường</option>
                        <option value="Cũ/Nát">Cũ/Nát</option>
                        <option value="Hỏng">Hỏng</option>
                        <option value="Mất">Mất</option>
                      </select>
                    </div>
                    <div className={styles['form-group']} style={{ marginBottom: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Trạng Thái Mượn</label>
                      <select
                        className={styles['form-control']}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                        value={copyFormData.trangThaiMuon}
                        onChange={(e) => setCopyFormData({ ...copyFormData, trangThaiMuon: parseInt(e.target.value) })}
                      >
                        <option value={1}>Sẵn sàng</option>
                        <option value={2}>Đang mượn</option>
                        <option value={3}>Bảo trì</option>
                        <option value={4}>Đã thanh lý</option>
                      </select>
                    </div>
                  </>
                )}
                <div style={{ marginTop: '25px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="button" onClick={() => setShowCopyModal(false)} className={styles['btn-secondary']} style={{ padding: '10px 20px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}>Hủy</button>
                  <button type="submit" className={styles['btn-primary']} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Lưu thông tin</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <MetadataModal
        isOpen={isMetadataModalOpen}
        onClose={() => setIsMetadataModalOpen(false)}
        onSave={metadataModalConfig.type === 'category' ? handleCreateCategory : handleCreateAuthor}
        title={metadataModalConfig.title}
        placeholder={metadataModalConfig.placeholder}
        initialValue={metadataModalConfig.initialValue}
        initialIcon={metadataModalConfig.initialIcon}
        showIconField={metadataModalConfig.type === 'category'}
      />
    </div>
  );
};

export default LibrarianPage;

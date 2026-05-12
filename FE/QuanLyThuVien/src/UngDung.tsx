import React, { lazy, Suspense } from 'react';
import './UngDung.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './tienIch/ScrollToTop';
import ProtectedRoute from './components/common/ProtectedRoute';

// Lazy loading các trang để cải thiện hiệu suất tải trang đầu tiên
const HomePage = lazy(() => import('./pages/TrangChu'));
const LoginPage = lazy(() => import('./pages/DangNhap'));
const RegisterPage = lazy(() => import('./pages/DangKy'));
const BooksPage = lazy(() => import('./pages/DanhSachSach'));
const BookDetailPage = lazy(() => import('./pages/ChiTietSach'));
const BorrowedBooksPage = lazy(() => import('./pages/SachDaMuon'));
const ProfilePage = lazy(() => import('./pages/TrangCaNhan'));
const AdminPage = lazy(() => import('./pages/TrangAdmin'));
const LibrarianPage = lazy(() => import('./pages/TrangThuThu'));
const CartPage = lazy(() => import('./pages/GioSach'));

// Loading component đơn giản trong khi chờ tải trang
const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
    <div className="spinner"></div>
    <style>{`
      .spinner {
        width: 40px; height: 40px;
        border: 4px solid #f1f5f9; border-top: 4px solid #3b82f6;
        border-radius: 50%; animation: spin 1s linear infinite;
      }
      @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    `}</style>
  </div>
);

function App() {
  return (
    <>
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={<PageLoading />}>
          <Routes>
            {/* Công khai */}
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/books" element={<BooksPage />} />
            <Route path="/book-detail/:id" element={<BookDetailPage />} />

            {/* Yêu cầu đăng nhập (Mọi vai trò) */}
            <Route path="/borrowed-books" element={
              <ProtectedRoute><BorrowedBooksPage /></ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute><ProfilePage /></ProtectedRoute>
            } />
            <Route path="/cart" element={
              <ProtectedRoute><CartPage /></ProtectedRoute>
            } />

            {/* Chỉ dành cho Admin (Vai trò 1) */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={[1]}><AdminPage /></ProtectedRoute>
            } />

            {/* Chỉ dành cho Thủ thư (Vai trò 2) */}
            <Route path="/librarian" element={
              <ProtectedRoute allowedRoles={[2]}><LibrarianPage /></ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  )
}

export default App

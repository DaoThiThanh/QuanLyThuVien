import './UngDung.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/TrangChu';
import LoginPage from './pages/DangNhap';
import RegisterPage from './pages/DangKy';
import BooksPage from './pages/DanhSachSach';
import BookDetailPage from './pages/ChiTietSach';
import BorrowedBooksPage from './pages/SachDaMuon';
import ProfilePage from './pages/TrangCaNhan';
import AdminPage from './pages/TrangAdmin';
import LibrarianPage from './pages/TrangThuThu';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/book-detail/:id" element={<BookDetailPage />} />
          <Route path="/borrowed-books" element={<BorrowedBooksPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/librarian" element={<LibrarianPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


export default App

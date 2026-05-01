import './App.css';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import BorrowedBooksPage from './pages/BorrowedBooksPage';
import BookDetailPage from './pages/BookDetailPage';
import ProfilePage from './pages/ProfilePage';

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
        </Routes>
      </BrowserRouter>
    </>
  )
}


export default App

import './App.css';
import RegisterPage from './pages/RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import BorrowedBooksPage from './pages/BorrowedBooksPage';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/book-detail" element={<BooksPage />} />
          <Route path="/borrowed-books" element={<BorrowedBooksPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

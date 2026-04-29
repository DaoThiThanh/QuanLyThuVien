import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { loginApi } from '../services/modules/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    matkhau: '',
  });

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // loginApi now natively saves tokens, role, and userId!
      await loginApi(formData, remember);

      // Navigate to homepage after successful login
      navigate('/');
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Decorative background circles */}
      <div className="bg-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="login-container">
        <div className="login-card">
          {/* Left side (Information/Welcome) */}
          <div className="login-left">
            <div className="brand-logo-login">
              <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <span className="brand-text">UniLibrary</span>
            </div>

            <h1 className="login-title">
              Chào mừng <br /> <span className="highlight-text">trở lại!</span>
            </h1>
            <p className="login-description">
              Đăng nhập để xem các sách đang mượn, quản lý yêu cầu mượn sách trực tuyến và nhận các thông báo từ thư viện trung tâm.
            </p>

            <div className="stats-container">
              <div className="stat-item">
                <span className="stat-value">1,200+</span>
                <span className="stat-label">Đầu sách</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">24/7</span>
                <span className="stat-label">Truy cập</span>
              </div>
            </div>
          </div>

          {/* Right side (Form) */}
          <div className="login-right">
            <h2 className="form-title">Đăng nhập</h2>
            <p className="form-subtitle">
              Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký ngay</Link>
            </p>

            {error && (
              <div className="error-message" style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <div className="input-with-icon">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <div className="input-with-icon">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                  <input
                    type="password"
                    id="matkhau"
                    name="matkhau"
                    placeholder="••••••••"
                    value={formData.matkhau}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-options">
                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                </div>
                <a href="#" className="forgot-password">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="btn-login" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

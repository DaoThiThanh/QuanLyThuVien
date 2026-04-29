import React, { useState } from 'react';
import './RegisterPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { registerApi } from '../services/modules/authService';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    hoTen: '',
    email: '',
    soDienThoai: '',
    matKhau: '',
    xacNhanMatKhau: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (formData.matKhau !== formData.xacNhanMatKhau) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    try {
      setLoading(true);
      await registerApi({
        hoten: formData.hoTen,
        email: formData.email,
        sodienthoai: formData.soDienThoai,
        matkhau: formData.matKhau
      });
      alert('Đăng ký thành công! Vui lòng đăng nhập.');
      navigate('/login');
    } catch (error: any) {
      setErrorMsg(error.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      {/* Decorative background circles */}
      <div className="bg-circles">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>

      <div className="register-container">
        <div className="register-card">
          {/* Left side (Information/Welcome) */}
          <div className="register-left">
            <div className="brand-logo-register">
              <div className="logo-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <span className="brand-text">UniLibrary</span>
            </div>

            <h1 className="register-title">
              Tham gia <br /> <span className="highlight-text">Thư viện sinh viên</span>
            </h1>
            <p className="register-description">
              Tạo tài khoản để khám phá hàng ngàn đầu sách, tài liệu học tập và quản lý quá trình mượn sách của bạn một cách dễ dàng.
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon icon-blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <span>Mượn sách trực tuyến nhanh chóng</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon icon-purple">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <span>Theo dõi lịch sử và gia hạn</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon icon-green">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <span>Nhận thông báo sách mới</span>
              </div>
            </div>
          </div>

          {/* Right side (Form) */}
          <div className="register-right">
            <h2 className="form-title">Tạo tài khoản</h2>
            <p className="form-subtitle">
              Đã có tài khoản? <Link to="/login" className="login-link">Đăng nhập ngay</Link>
            </p>

            {errorMsg && <div className="error-message" style={{ color: '#dc3545', marginBottom: '15px', padding: '10px', backgroundColor: '#f8d7da', borderRadius: '5px', border: '1px solid #f5c6cb' }}>{errorMsg}</div>}

            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="hoTen">Họ và tên</label>
                <div className="input-with-icon">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <input
                    type="text"
                    id="hoTen"
                    name="hoTen"
                    placeholder="Nguyễn Văn A"
                    value={formData.hoTen}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="soDienThoai">Số điện thoại</label>
                <div className="input-with-icon">
                  <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <input
                    type="tel"
                    id="soDienThoai"
                    name="soDienThoai"
                    placeholder="VD: 0912345678"
                    value={formData.soDienThoai}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="matKhau">Mật khẩu</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input
                      type="password"
                      id="matKhau"
                      name="matKhau"
                      placeholder="••••••••"
                      value={formData.matKhau}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="xacNhanMatKhau">Xác nhận MK</label>
                  <div className="input-with-icon">
                    <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    <input
                      type="password"
                      id="xacNhanMatKhau"
                      name="xacNhanMatKhau"
                      placeholder="••••••••"
                      value={formData.xacNhanMatKhau}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="form-terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">Tôi đồng ý với các <a href="#">Điều khoản sử dụng</a> và <a href="#">Chính sách bảo mật</a></label>
              </div>

              <button type="submit" className="btn-register" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

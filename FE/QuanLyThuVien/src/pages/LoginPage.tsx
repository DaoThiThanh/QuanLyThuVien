import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginApi } from '../services/modules/authService';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

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

      // Navigate back to where they were, or home
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['login-page']}>
      {/* Decorative background circles */}
      <div className={styles['bg-circles']}>
        <div className={`${styles['circle']} ${styles['circle-1']}`}></div>
        <div className={`${styles['circle']} ${styles['circle-2']}`}></div>
        <div className={`${styles['circle']} ${styles['circle-3']}`}></div>
      </div>

      <div className={styles['login-container']}>
        <div className={styles['login-card']}>
          {/* Left side (Information/Welcome) */}
          <div className={styles['login-left']}>
            <div className={styles['brand-logo-login']}>
              <div className={styles['logo-icon']}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              </div>
              <span className={styles['brand-text']}>UniLibrary</span>
            </div>

            <h1 className={styles['login-title']}>
              Chào mừng <br /> <span className={styles['highlight-text']}>trở lại!</span>
            </h1>
            <p className={styles['login-description']}>
              Đăng nhập để xem các sách đang mượn, quản lý yêu cầu mượn sách trực tuyến và nhận các thông báo từ thư viện trung tâm.
            </p>

            <div className={styles['stats-container']}>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>1,200+</span>
                <span className={styles['stat-label']}>Đầu sách</span>
              </div>
              <div className={styles['stat-item']}>
                <span className={styles['stat-value']}>24/7</span>
                <span className={styles['stat-label']}>Truy cập</span>
              </div>
            </div>
          </div>

          {/* Right side (Form) */}
          <div className={styles['login-right']}>
            <h2 className={styles['form-title']}>Đăng nhập</h2>

            {error && (
              <div className={styles['error-message']} style={{ color: '#d32f2f', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' }}>
                {error}
              </div>
            )}

            <form className={styles['login-form']} onSubmit={handleSubmit}>
              <div className={styles['form-group']}>
                <label htmlFor="email">Email</label>
                <div className={styles['input-with-icon']}>
                  <svg className={styles['input-icon']} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" /></svg>
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

              <div className={styles['form-group']}>
                <label htmlFor="password">Mật khẩu</label>
                <div className={styles['input-with-icon']}>
                  <svg className={styles['input-icon']} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
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

              <div className={styles['form-options']}>
                <div className={styles['remember-me']}>
                  <input
                    type="checkbox"
                    id="remember"
                    checked={remember}
                    onChange={handleCheckboxChange}
                  />
                  <label htmlFor="remember">Ghi nhớ đăng nhập</label>
                </div>
                <a href="#" className={styles['forgot-password']}>Quên mật khẩu?</a>
              </div>

              <button type="submit" className={styles['btn-login']} disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            <p className={styles['form-subtitle']}>
              Chưa có tài khoản? <Link to="/register" className={styles['register-link']}>Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginPage;

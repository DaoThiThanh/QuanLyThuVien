import React, { useState } from 'react';
import styles from './CaiDatBaoMat.module.css';
import { changePasswordApi, getUserId } from '../../dichVu/modules/dichVuXacThuc';

const SecuritySettings: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setErrorMsg('Vui lòng điền đầy đủ thông tin.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Mật khẩu xác nhận không khớp.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    const userId = getUserId();
    if (!userId) {
      setErrorMsg('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi({
        userId,
        oldPassword,
        newPassword
      });
      setSuccessMsg('Đổi mật khẩu thành công!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setShowForm(false), 2000);
    } catch (error: any) {
      setErrorMsg(error.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['profile-card']}>
      <h3 className={styles['profile-card-title']}>Bảo mật</h3>
      <p className={styles['security-description']}>Quản lý mật khẩu và bảo mật tài khoản</p>
      
      {!showForm ? (
        <button 
          className={styles['btn-change-password']}
          onClick={() => {
            setShowForm(true);
            setErrorMsg('');
            setSuccessMsg('');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
          </svg>
          Đổi mật khẩu
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={styles['password-form']}>
          {errorMsg && <div className={styles['alert-error']}>{errorMsg}</div>}
          {successMsg && <div className={styles['alert-success']}>{successMsg}</div>}

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Mật khẩu hiện tại</label>
            <input 
              type="password" 
              className={styles['form-input']}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Nhập mật khẩu hiện tại"
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Mật khẩu mới</label>
            <input 
              type="password" 
              className={styles['form-input']}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nhập mật khẩu mới"
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']}>Xác nhận mật khẩu mới</label>
            <input 
              type="password" 
              className={styles['form-input']}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
            />
          </div>

          <div className={styles['form-actions']}>
            <button type="submit" className={styles['btn-save']} disabled={loading}>
              {loading ? 'Đang xử lý...' : 'Lưu thay đổi'}
            </button>
            <button 
              type="button" 
              className={styles['btn-cancel']}
              onClick={() => {
                setShowForm(false);
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
              }}
            >
              Hủy
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SecuritySettings;

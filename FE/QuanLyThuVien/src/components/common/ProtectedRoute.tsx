import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getToken, getRole } from '../../dichVu/modules/dichVuXacThuc';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: number[];
}

/**
 * Component bảo vệ đường dẫn, kiểm tra đăng nhập và phân quyền
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = getToken();
  const role = getRole();
  const location = useLocation();

  // Nếu chưa đăng nhập, chuyển về trang login và lưu lại trang đang muốn vào
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu có yêu cầu quyền cụ thể, kiểm tra xem user có quyền đó không
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = Number(role);
    if (!allowedRoles.includes(userRole)) {
      // Nếu không đủ quyền, chuyển về trang chủ hoặc trang thông báo lỗi
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;

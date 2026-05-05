import axios from "axios";
const CauHinhApi = axios.create({
  baseURL: 'https://localhost:7272/gateway',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
CauHinhApi.interceptors.request.use(
  (config) => {
    // Không đính kèm token nếu đang gọi API đăng nhập
    if (config.url && config.url.includes('/auth/login')) {
      return config;
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

CauHinhApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const isOnLoginPage = window.location.pathname === '/login';
      if (!isOnLoginPage) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userId');
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userRole');
        sessionStorage.removeItem('userId');
        // Tuỳ chọn: window.location.href = '/login';
      }
    }
    
    // Ưu tiên đọc message lỗi từ backend (lỗi 401 của server thường có body { message: "..." })
    const message = error.response?.data?.message ??
      error.message ??
      'Có lỗi xảy ra, vui lòng thử lại';
      
    return Promise.reject(new Error(message));
  }
);

export default CauHinhApi;
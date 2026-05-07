import CauHinhApi from '../api/CauHinhApi';

export interface UserItem {
  id: string;
  hoTen: string;
  email: string;
  soDienThoai: string | null;
  vaiTro: number;
  trangThai: number;
  ngayTao: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Lấy danh sách người dùng (hỗ trợ phân trang, tìm kiếm và lọc theo vai trò)
export const getAllUsers = async (role?: number, page: number = 1, pageSize: number = 10, searchTerm: string = ""): Promise<any> => {
  try {
    let url = `/user?page=${page}&pageSize=${pageSize}&searchTerm=${searchTerm}`;
    if (role) url += `&role=${role}`;
    
    const response = await CauHinhApi.get<ApiResponse<any>>(url);
    if (response.data && response.data.success) {
        return response.data.data;
    }
    return null;
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    return null;
  }
};

// Cập nhật quyền người dùng
export const updateUserRole = async (userId: string, newRole: number): Promise<boolean> => {
  try {
    const response = await CauHinhApi.put<ApiResponse<any>>(`/user/${userId}/role`, { newRole });
    return response.data.success;
  } catch (error) {
    console.error("Lỗi cập nhật quyền người dùng:", error);
    return false;
  }
};

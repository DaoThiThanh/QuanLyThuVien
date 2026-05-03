import axiosClient from '../api/axiosClient';

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

// Lấy danh sách người dùng (tuỳ chọn lọc theo vai trò: 1=Admin, 2=Thủ thư, 3=Độc giả)
export const getAllUsers = async (role?: number): Promise<UserItem[]> => {
  try {
    const url = role ? `/user?role=${role}` : `/user`;
    const response = await axiosClient.get<ApiResponse<UserItem[]>>(url);
    if (response.data && response.data.success) {
        return response.data.data;
    }
    return [];
  } catch (error) {
    console.error("Lỗi lấy danh sách người dùng:", error);
    return [];
  }
};

// Cập nhật quyền người dùng
export const updateUserRole = async (userId: string, newRole: number): Promise<boolean> => {
  try {
    const response = await axiosClient.put<ApiResponse<any>>(`/user/${userId}/role`, { newRole });
    return response.data.success;
  } catch (error) {
    console.error("Lỗi cập nhật quyền người dùng:", error);
    return false;
  }
};

import axiosClient from '../api/axiosClient';

export interface ThongKeThuThuDto {
  booksBorrowed: number;
  booksOverdue: number;
  pendingRequests: number;
  totalBooks: number;
}

export const getThongKeThuThu = async (): Promise<ThongKeThuThuDto> => {
  try {
    const response = await axiosClient.get('/ThongKe/thuthu');
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê thủ thư:", error);
    // Return mock data fallback if BE is not ready
    return {
      booksBorrowed: 0,
      booksOverdue: 0,
      pendingRequests: 0,
      totalBooks: 0
    };
  }
};

import CauHinhApi from '../api/CauHinhApi';

export interface ThongKeThuThuDto {
  booksBorrowed: number;
  booksOverdue: number;
  pendingRequests: number;
  totalBooks: number;
}

export const getThongKeThuThu = async (): Promise<ThongKeThuThuDto> => {
  try {
    const response = await CauHinhApi.get('/ThongKe/thuthu');
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

export interface RecentActivityDto {
  user: string;
  action: string;
  time: string;
  type: 'approve' | 'user' | 'warning' | 'system';
}

export interface ThongKeAdminDto {
  totalReaders: number;
  totalLibrarians: number;
  totalRevenue: number;
  activeLoans: number;
  systemStatus: string;
  recentActivities: RecentActivityDto[];
  borrowTrends: ChartDataDto[];
  categoryDistribution: ChartDataDto[];
  memberGrowth: ChartDataDto[];
}

export interface ChartDataDto {
  name: string;
  value: number;
}

export const getThongKeAdmin = async (): Promise<ThongKeAdminDto> => {
  try {
    const response = await CauHinhApi.get('/ThongKe/admin');
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy thống kê admin:", error);
    return {
      totalReaders: 0,
      totalLibrarians: 0,
      totalRevenue: 0,
      activeLoans: 0,
      systemStatus: "Lỗi kết nối",
      recentActivities: [],
      borrowTrends: [],
      categoryDistribution: [],
      memberGrowth: []
    };
  }
};

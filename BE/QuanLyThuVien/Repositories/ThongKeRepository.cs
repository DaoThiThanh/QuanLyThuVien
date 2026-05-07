using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IThongKeRepository
    {
        Task<ThongKeThuThuDto> GetThongKeThuThuAsync();
        Task<ThongKeAdminDto> GetThongKeAdminAsync();
    }

    public class ThongKeRepository : IThongKeRepository
    {
        private readonly IConfiguration _configuration;

        public ThongKeRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<ThongKeThuThuDto> GetThongKeThuThuAsync()
        {
            var result = new ThongKeThuThuDto();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // 1. Sách Đang Mượn (Số lượng cuốn sách có TrangThaiMuon = 2)
                var queryBorrowed = "SELECT COUNT(*) FROM CuonSach WHERE TrangThaiMuon = 2";
                using (var cmd = new SqlCommand(queryBorrowed, connection))
                {
                    result.BooksBorrowed = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                // 2. Yêu cầu chờ duyệt (TrangThai = 0 trong YeuCauMuon)
                var queryPending = "SELECT COUNT(*) FROM YeuCauMuon WHERE TrangThai = 0";
                using (var cmd = new SqlCommand(queryPending, connection))
                {
                    result.PendingRequests = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                // 3. Sách Trễ Hạn (PhieuMuon có HanTra < GETDATE() và TrangThai = 1)
                var queryOverdue = "SELECT COUNT(*) FROM PhieuMuon WHERE HanTra < CAST(GETDATE() AS DATE) AND TrangThai = 1";
                using (var cmd = new SqlCommand(queryOverdue, connection))
                {
                    result.BooksOverdue = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                // 4. Tổng Kho Sách (Số lượng cuốn sách sẵn sàng hoặc tổng cộng)
                var queryTotal = "SELECT COUNT(*) FROM CuonSach";
                using (var cmd = new SqlCommand(queryTotal, connection))
                {
                    result.TotalBooks = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }
            }

            return result;
        }

        public async Task<ThongKeAdminDto> GetThongKeAdminAsync()
        {
            var result = new ThongKeAdminDto();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // 1. Tổng Độc giả (VaiTro = 3)
                var queryReaders = "SELECT COUNT(*) FROM NguoiDung WHERE VaiTro = 3";
                using (var cmd = new SqlCommand(queryReaders, connection))
                {
                    result.TotalReaders = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                // 2. Tổng Thủ thư (VaiTro = 2)
                var queryLibrarians = "SELECT COUNT(*) FROM NguoiDung WHERE VaiTro = 2";
                using (var cmd = new SqlCommand(queryLibrarians, connection))
                {
                    result.TotalLibrarians = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                // 3. Doanh Thu Phạt (Tổng SoTienThu trong PhieuThuPhat)
                var queryRevenue = "SELECT ISNULL(SUM(SoTienThu), 0) FROM PhieuThuPhat";
                using (var cmd = new SqlCommand(queryRevenue, connection))
                {
                    result.TotalRevenue = Convert.ToDecimal(await cmd.ExecuteScalarAsync());
                }

                // 4. Sách đang mượn
                var queryActive = "SELECT COUNT(*) FROM PhieuMuon WHERE TrangThai = 1";
                using (var cmd = new SqlCommand(queryActive, connection))
                {
                    result.ActiveLoans = Convert.ToInt32(await cmd.ExecuteScalarAsync());
                }

                // 5. Hoạt động gần đây (Top 5)
                var queryActivities = @"
                    SELECT TOP 5 [User], [Action], [Time], [Type] FROM (
                        SELECT HoTen as [User], N'đã đăng ký tài khoản' as [Action], NgayTao as [Time], 'user' as [Type] FROM NguoiDung
                        UNION ALL
                        SELECT n.HoTen as [User], N'đã mượn sách' as [Action], pm.NgayMuon as [Time], 'approve' as [Type] FROM PhieuMuon pm JOIN NguoiDung n ON pm.DocGiaId = n.Id
                        UNION ALL
                        SELECT n.HoTen as [User], N'đã gửi yêu cầu mượn' as [Action], y.NgayYeuCau as [Time], 'warning' as [Type] FROM YeuCauMuon y JOIN NguoiDung n ON y.DocGiaId = n.Id
                    ) as Activities ORDER BY [Time] DESC";

                using (var cmd = new SqlCommand(queryActivities, connection))
                {
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var time = reader.GetDateTime(reader.GetOrdinal("Time"));
                            var diff = DateTime.Now - time;
                            string timeStr;
                            if (diff.TotalMinutes < 60) timeStr = $"{(int)diff.TotalMinutes} phút trước";
                            else if (diff.TotalHours < 24) timeStr = $"{(int)diff.TotalHours} giờ trước";
                            else timeStr = time.ToString("dd/MM/yyyy");

                            result.RecentActivities.Add(new RecentActivityDto
                            {
                                User = reader.GetString(reader.GetOrdinal("User")),
                                Action = reader.GetString(reader.GetOrdinal("Action")),
                                Time = timeStr,
                                Type = reader.GetString(reader.GetOrdinal("Type"))
                            });
                        }
                    }
                }

                // 6. Dữ liệu biểu đồ mượn sách (6 tháng gần nhất)
                var queryBorrowTrends = @"
                    SELECT TOP 6 FORMAT(NgayMuon, 'MM/yyyy') as MonthYear, COUNT(*) as Count, MAX(NgayMuon) as LastDate
                    FROM PhieuMuon 
                    GROUP BY FORMAT(NgayMuon, 'MM/yyyy')
                    ORDER BY LastDate ASC";
                using (var cmd = new SqlCommand(queryBorrowTrends, connection))
                {
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.BorrowTrends.Add(new ChartDataDto { Name = reader.GetString(0), Value = reader.GetInt32(1) });
                        }
                    }
                }

                // 7. Dữ liệu phân bổ theo danh mục
                var queryCategoryDist = @"
                    SELECT dm.TenDanhMuc, COUNT(ds.Id) as Count
                    FROM DanhMucSach dm
                    LEFT JOIN DauSach ds ON dm.Id = ds.DanhMucId
                    GROUP BY dm.TenDanhMuc";
                using (var cmd = new SqlCommand(queryCategoryDist, connection))
                {
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.CategoryDistribution.Add(new ChartDataDto { Name = reader.GetString(0), Value = reader.GetInt32(1) });
                        }
                    }
                }

                // 8. Tăng trưởng độc giả
                var queryGrowth = @"
                    SELECT TOP 6 FORMAT(NgayTao, 'MM/yyyy') as MonthYear, COUNT(*) as Count, MAX(NgayTao) as LastDate
                    FROM NguoiDung
                    WHERE VaiTro = 3
                    GROUP BY FORMAT(NgayTao, 'MM/yyyy')
                    ORDER BY LastDate ASC";
                using (var cmd = new SqlCommand(queryGrowth, connection))
                {
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.MemberGrowth.Add(new ChartDataDto { Name = reader.GetString(0), Value = reader.GetInt32(1) });
                        }
                    }
                }

                // Dữ liệu giả lập nếu DB trống
                if (result.BorrowTrends.Count == 0)
                {
                    result.BorrowTrends.AddRange(new[] {
                        new ChartDataDto { Name = "01/2026", Value = 45 },
                        new ChartDataDto { Name = "02/2026", Value = 52 },
                        new ChartDataDto { Name = "03/2026", Value = 38 },
                        new ChartDataDto { Name = "04/2026", Value = 65 },
                        new ChartDataDto { Name = "05/2026", Value = 48 }
                    });
                }
                if (result.CategoryDistribution.Count == 0)
                {
                    result.CategoryDistribution.AddRange(new[] {
                        new ChartDataDto { Name = "Văn học", Value = 120 },
                        new ChartDataDto { Name = "Kỹ thuật", Value = 85 },
                        new ChartDataDto { Name = "Kinh tế", Value = 45 },
                        new ChartDataDto { Name = "Ngoại ngữ", Value = 30 }
                    });
                }
                if (result.MemberGrowth.Count == 0)
                {
                    result.MemberGrowth.AddRange(new[] {
                        new ChartDataDto { Name = "01/2026", Value = 10 },
                        new ChartDataDto { Name = "02/2026", Value = 15 },
                        new ChartDataDto { Name = "03/2026", Value = 8 },
                        new ChartDataDto { Name = "04/2026", Value = 22 },
                        new ChartDataDto { Name = "05/2026", Value = 12 }
                    });
                }
            }

            return result;
        }
    }
}

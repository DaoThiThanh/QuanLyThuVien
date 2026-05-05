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
            }

            return result;
        }
    }
}

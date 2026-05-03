using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IThongKeRepository
    {
        Task<ThongKeThuThuDto> GetThongKeThuThuAsync();
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
                    result.BooksBorrowed = (int)await cmd.ExecuteScalarAsync();
                }

                // 2. Yêu cầu chờ duyệt (TrangThai = 0 trong YeuCauMuon)
                var queryPending = "SELECT COUNT(*) FROM YeuCauMuon WHERE TrangThai = 0";
                using (var cmd = new SqlCommand(queryPending, connection))
                {
                    result.PendingRequests = (int)await cmd.ExecuteScalarAsync();
                }

                // 3. Sách Trễ Hạn (PhieuMuon có HanTra < GETDATE() và TrangThai = 1)
                var queryOverdue = "SELECT COUNT(*) FROM PhieuMuon WHERE HanTra < CAST(GETDATE() AS DATE) AND TrangThai = 1";
                using (var cmd = new SqlCommand(queryOverdue, connection))
                {
                    result.BooksOverdue = (int)await cmd.ExecuteScalarAsync();
                }

                // 4. Tổng Kho Sách (Số lượng cuốn sách sẵn sàng hoặc tổng cộng)
                var queryTotal = "SELECT COUNT(*) FROM CuonSach";
                using (var cmd = new SqlCommand(queryTotal, connection))
                {
                    result.TotalBooks = (int)await cmd.ExecuteScalarAsync();
                }
            }

            return result;
        }
    }
}

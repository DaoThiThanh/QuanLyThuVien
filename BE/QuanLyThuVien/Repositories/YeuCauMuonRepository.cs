using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IYeuCauMuonRepository
    {
        Task<bool> CreateYeuCauMuonAsync(CreateYeuCauMuonRequest request);
        Task<List<YeuCauMuonDto>> GetYeuCauByDocGiaAsync(Guid docGiaId);
        Task<List<YeuCauMuonDto>> GetAllYeuCauMuonAsync();
        Task<bool> UpdateTrangThaiAsync(Guid id, int trangThai);
        Task<object> GetBorrowingLimitStatusAsync(Guid docGiaId);
    }

    public class YeuCauMuonRepository : IYeuCauMuonRepository
    {
        private readonly IConfiguration _configuration;

        public YeuCauMuonRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<bool> CreateYeuCauMuonAsync(CreateYeuCauMuonRequest request)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // 1. Lấy quy định về số sách mượn tối đa
                int soSachToiDa = 5; // Mặc định
                var tsQuery = "SELECT TOP 1 SoSachMuonToiDa FROM ThamSoQuyDinh ORDER BY NgayCapNhat DESC";
                using (var tsCommand = new SqlCommand(tsQuery, connection))
                {
                    var val = await tsCommand.ExecuteScalarAsync();
                    if (val != null && val != DBNull.Value) soSachToiDa = (int)val;
                }

                // 2. Kiểm tra số lượng sách đang mượn và đang yêu cầu của độc giả
                int dangMuon = 0;
                var countQuery = @"
                    SELECT 
                        (SELECT COUNT(*) FROM ChiTietPhieuMuon ct JOIN PhieuMuon pm ON ct.PhieuMuonId = pm.Id WHERE pm.DocGiaId = @DocGiaId AND pm.TrangThai = 1) +
                        (SELECT COUNT(*) FROM ChiTietYeuCau ct JOIN YeuCauMuon yc ON ct.YeuCauId = yc.Id WHERE yc.DocGiaId = @DocGiaId AND yc.TrangThai = 0)";
                
                using (var countCommand = new SqlCommand(countQuery, connection))
                {
                    countCommand.Parameters.AddWithValue("@DocGiaId", request.DocGiaId);
                    dangMuon = (int)await countCommand.ExecuteScalarAsync();
                }

                // 3. Kiểm tra nếu tổng số sách vượt quá quy định
                if (dangMuon + request.DauSachIds.Count > soSachToiDa)
                {
                    throw new Exception($"Bạn chỉ được mượn tối đa {soSachToiDa} cuốn. Hiện tại bạn đang có {dangMuon} cuốn (đang mượn/chờ duyệt).");
                }

                // 4. Kiểm tra tính khả dụng của từng đầu sách
                foreach (var dauSachId in request.DauSachIds)
                {
                    var checkStockQuery = "SELECT SoLuongTon FROM DauSach WHERE Id = @Id";
                    using (var checkStockCommand = new SqlCommand(checkStockQuery, connection))
                    {
                        checkStockCommand.Parameters.AddWithValue("@Id", dauSachId);
                        var stock = (int)await checkStockCommand.ExecuteScalarAsync();
                        if (stock <= 0)
                        {
                            var nameQuery = "SELECT TenSach FROM DauSach WHERE Id = @Id";
                            using (var nameCmd = new SqlCommand(nameQuery, connection))
                            {
                                nameCmd.Parameters.AddWithValue("@Id", dauSachId);
                                var tenSach = await nameCmd.ExecuteScalarAsync();
                                throw new Exception($"Sách '{tenSach}' hiện đã hết trong kho.");
                            }
                        }
                    }
                }

                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var yeuCauId = Guid.NewGuid();

                        // Insert YeuCauMuon
                        var ycQuery = @"
                            INSERT INTO YeuCauMuon (Id, DocGiaId, NgayYeuCau, NgayHenNhan, TrangThai)
                            VALUES (@Id, @DocGiaId, GETDATE(), @NgayHenNhan, 0)";

                        using (var command = new SqlCommand(ycQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@Id", yeuCauId);
                            command.Parameters.AddWithValue("@DocGiaId", request.DocGiaId);
                            command.Parameters.AddWithValue("@NgayHenNhan", (object)request.NgayHenNhan ?? DBNull.Value);

                            await command.ExecuteNonQueryAsync();
                        }

                        // Insert ChiTietYeuCau
                        foreach (var dauSachId in request.DauSachIds)
                        {
                            var ctQuery = @"
                                INSERT INTO ChiTietYeuCau (YeuCauId, DauSachId)
                                VALUES (@YeuCauId, @DauSachId)";

                            using (var command = new SqlCommand(ctQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@YeuCauId", yeuCauId);
                                command.Parameters.AddWithValue("@DauSachId", dauSachId);

                                await command.ExecuteNonQueryAsync();
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        throw;
                    }
                }
            }
        }

        public async Task<List<YeuCauMuonDto>> GetYeuCauByDocGiaAsync(Guid docGiaId)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var result = new List<YeuCauMuonDto>();

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        yc.Id, 
                        yc.DocGiaId, 
                        yc.NgayYeuCau, 
                        yc.NgayHenNhan, 
                        yc.TrangThai,
                        nd.HoTen as TenDocGia,
                        nd.Email
                    FROM YeuCauMuon yc
                    JOIN NguoiDung nd ON yc.DocGiaId = nd.Id
                    WHERE yc.DocGiaId = @DocGiaId
                    ORDER BY yc.NgayYeuCau DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DocGiaId", docGiaId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new YeuCauMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.GetString(reader.GetOrdinal("TenDocGia")),
                                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString(reader.GetOrdinal("Email")),
                                NgayYeuCau = reader.GetDateTime(reader.GetOrdinal("NgayYeuCau")),
                                NgayHenNhan = reader.IsDBNull(reader.GetOrdinal("NgayHenNhan")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayHenNhan")),
                                TrangThai = reader.GetInt32(reader.GetOrdinal("TrangThai"))
                            });
                        }
                    }
                }

                foreach (var yc in result)
                {
                    yc.TenCacSach = await GetTenSachByYeuCauIdAsync(yc.Id, connection);
                }
            }

            return result;
        }

        public async Task<List<YeuCauMuonDto>> GetAllYeuCauMuonAsync()
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var result = new List<YeuCauMuonDto>();

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        yc.Id, 
                        yc.DocGiaId, 
                        yc.NgayYeuCau, 
                        yc.NgayHenNhan, 
                        yc.TrangThai,
                        nd.HoTen as TenDocGia,
                        nd.Email
                    FROM YeuCauMuon yc
                    JOIN NguoiDung nd ON yc.DocGiaId = nd.Id
                    ORDER BY yc.NgayYeuCau DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            var dto = new YeuCauMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.GetString(reader.GetOrdinal("TenDocGia")),
                                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString(reader.GetOrdinal("Email")),
                                NgayYeuCau = reader.GetDateTime(reader.GetOrdinal("NgayYeuCau")),
                                NgayHenNhan = reader.IsDBNull(reader.GetOrdinal("NgayHenNhan")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayHenNhan")),
                                TrangThai = reader.GetInt32(reader.GetOrdinal("TrangThai"))
                            };
                            // Note: If you want to add Email to DTO, update the DTO model first. 
                            // For now I'll just focus on getting book titles.
                            result.Add(dto);
                        }
                    }
                }

                foreach (var yc in result)
                {
                    yc.TenCacSach = await GetTenSachByYeuCauIdAsync(yc.Id, connection);
                }
            }

            return result;
        }

        private async Task<List<string>> GetTenSachByYeuCauIdAsync(Guid yeuCauId, SqlConnection connection)
        {
            var tenSachs = new List<string>();
            var query = @"
                SELECT ds.TenSach 
                FROM ChiTietYeuCau ctyc
                JOIN DauSach ds ON ctyc.DauSachId = ds.Id
                WHERE ctyc.YeuCauId = @YeuCauId";

            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@YeuCauId", yeuCauId);
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        tenSachs.Add(reader.GetString(0));
                    }
                }
            }
            return tenSachs;
        }

        public async Task<bool> UpdateTrangThaiAsync(Guid id, int trangThai)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = "UPDATE YeuCauMuon SET TrangThai = @TrangThai WHERE Id = @Id";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@TrangThai", trangThai);
                    var result = await command.ExecuteNonQueryAsync();
                    return result > 0;
                }
            }
        }
        public async Task<object> GetBorrowingLimitStatusAsync(Guid docGiaId)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // Lấy quy định
                int soSachToiDa = 5;
                var tsQuery = "SELECT TOP 1 SoSachMuonToiDa FROM ThamSoQuyDinh ORDER BY NgayCapNhat DESC";
                using (var tsCommand = new SqlCommand(tsQuery, connection))
                {
                    var val = await tsCommand.ExecuteScalarAsync();
                    if (val != null && val != DBNull.Value) soSachToiDa = (int)val;
                }

                // Tính số sách đang mượn + đang chờ duyệt
                var countQuery = @"
                    SELECT 
                        (SELECT COUNT(*) FROM ChiTietPhieuMuon ct JOIN PhieuMuon pm ON ct.PhieuMuonId = pm.Id WHERE pm.DocGiaId = @DocGiaId AND pm.TrangThai = 1) +
                        (SELECT COUNT(*) FROM ChiTietYeuCau ct JOIN YeuCauMuon yc ON ct.YeuCauId = yc.Id WHERE yc.DocGiaId = @DocGiaId AND yc.TrangThai = 0)";
                
                int dangMuon = 0;
                using (var countCommand = new SqlCommand(countQuery, connection))
                {
                    countCommand.Parameters.AddWithValue("@DocGiaId", docGiaId);
                    dangMuon = (int)await countCommand.ExecuteScalarAsync();
                }

                return new { 
                    CurrentCount = dangMuon, 
                    MaxLimit = soSachToiDa, 
                    CanBorrowMore = soSachToiDa - dangMuon 
                };
            }
        }
    }
}

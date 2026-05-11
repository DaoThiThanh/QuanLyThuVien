using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IYeuCauMuonRepository
    {
        Task<bool> CreateYeuCauMuonAsync(CreateYeuCauMuonRequest request);
        Task<List<YeuCauMuonDto>> GetYeuCauByDocGiaAsync(Guid docGiaId);
        Task<PagedResult<YeuCauMuonDto>> GetAllYeuCauMuonAsync(int page, int pageSize);
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

                // 4. Kiểm tra tính khả dụng của từng đầu sách (Đếm bản vật lý thực tế)
                foreach (var dauSachId in request.DauSachIds)
                {
                    var checkStockQuery = "SELECT COUNT(*) FROM CuonSach WHERE DauSachId = @Id AND TrangThaiMuon = 1";
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
                    await PopulateChiTietYeuCauAsync(yc, connection);
                }
            }

            return result;
        }

        public async Task<PagedResult<YeuCauMuonDto>> GetAllYeuCauMuonAsync(int page, int pageSize)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            var result = new PagedResult<YeuCauMuonDto>
            {
                CurrentPage = page,
                PageSize = pageSize,
                Items = new List<YeuCauMuonDto>()
            };

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // 1. Count total
                var countQuery = "SELECT COUNT(*) FROM YeuCauMuon";
                using (var countCmd = new SqlCommand(countQuery, connection))
                {
                    result.TotalItems = Convert.ToInt32(await countCmd.ExecuteScalarAsync());
                }
                result.TotalPages = (int)Math.Ceiling(result.TotalItems / (double)pageSize);

                // 2. Get paged items
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
                    ORDER BY yc.NgayYeuCau DESC
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                    command.Parameters.AddWithValue("@PageSize", pageSize);

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
                            result.Items.Add(dto);
                        }
                    }
                }

                // 3. Get book titles and ids for each request
                foreach (var yc in result.Items)
                {
                    var bookQuery = @"
                        SELECT ds.Id, ds.TenSach 
                        FROM ChiTietYeuCau ct
                        JOIN DauSach ds ON ct.DauSachId = ds.Id
                        WHERE ct.YeuCauId = @YeuCauId";

                    using (var command = new SqlCommand(bookQuery, connection))
                    {
                        command.Parameters.AddWithValue("@YeuCauId", yc.Id);
                        var books = new List<string>();
                        using (var bookReader = await command.ExecuteReaderAsync())
                        {
                            while (await bookReader.ReadAsync())
                            {
                                yc.DauSachIds.Add(bookReader.GetGuid(0));
                                books.Add(bookReader.GetString(1));
                            }
                        }
                        yc.TenCacSach = books;
                    }
                }
            }

            return result;
        }

        private async Task PopulateChiTietYeuCauAsync(YeuCauMuonDto yc, SqlConnection connection)
        {
            var query = @"
                SELECT ds.Id, ds.TenSach 
                FROM ChiTietYeuCau ctyc
                JOIN DauSach ds ON ctyc.DauSachId = ds.Id
                WHERE ctyc.YeuCauId = @YeuCauId";

            using (var command = new SqlCommand(query, connection))
            {
                command.Parameters.AddWithValue("@YeuCauId", yc.Id);
                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        yc.DauSachIds.Add(reader.GetGuid(0));
                        yc.TenCacSach.Add(reader.GetString(1));
                    }
                }
            }
        }

        public async Task<bool> UpdateTrangThaiAsync(Guid id, int trangThai)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // Nếu là duyệt (trangThai = 1), kiểm tra xem còn sách vật lý không
                if (trangThai == 1)
                {
                    var checkQuery = @"
                        SELECT ds.TenSach, 
                               (SELECT COUNT(*) FROM CuonSach cs WHERE cs.DauSachId = ds.Id AND cs.TrangThaiMuon = 1) as AvailableCount
                        FROM ChiTietYeuCau ctyc
                        JOIN DauSach ds ON ctyc.DauSachId = ds.Id
                        WHERE ctyc.YeuCauId = @Id";
                    
                    using (var command = new SqlCommand(checkQuery, connection))
                    {
                        command.Parameters.AddWithValue("@Id", id);
                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                var tenSach = reader.GetString(0);
                                var available = reader.GetInt32(1);
                                if (available <= 0)
                                {
                                    throw new Exception($"Sách '{tenSach}' đã hết bản vật lý sẵn sàng. Không thể duyệt yêu cầu.");
                                }
                            }
                        }
                    }
                }

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
 
                // Tính số sách đang mượn (PM trangThai 1) + đang chờ duyệt online (YC trangThai 0, 1)
                var countQuery = @"
                    SELECT 
                        (SELECT COUNT(*) FROM ChiTietPhieuMuon ct JOIN PhieuMuon pm ON ct.PhieuMuonId = pm.Id WHERE pm.DocGiaId = @DocGiaId AND pm.TrangThai = 1 AND ct.NgayTraThucTe IS NULL) +
                        (SELECT COUNT(*) FROM ChiTietYeuCau ct JOIN YeuCauMuon yc ON ct.YeuCauId = yc.Id WHERE yc.DocGiaId = @DocGiaId AND (yc.TrangThai = 0 OR yc.TrangThai = 1))";
                
                int dangMuon = 0;
                using (var countCommand = new SqlCommand(countQuery, connection))
                {
                    countCommand.Parameters.AddWithValue("@DocGiaId", docGiaId);
                    dangMuon = (int)await countCommand.ExecuteScalarAsync();
                }

                // Kiểm tra có sách quá hạn không
                var overdueQuery = "SELECT COUNT(*) FROM PhieuMuon pm JOIN ChiTietPhieuMuon ct ON pm.Id = ct.PhieuMuonId WHERE pm.DocGiaId = @DocGiaId AND pm.TrangThai = 1 AND ct.NgayTraThucTe IS NULL AND pm.HanTra < GETDATE()";
                bool hasOverdue = false;
                using (var overdueCommand = new SqlCommand(overdueQuery, connection))
                {
                    overdueCommand.Parameters.AddWithValue("@DocGiaId", docGiaId);
                    hasOverdue = (int)await overdueCommand.ExecuteScalarAsync() > 0;
                }
 
                // Lấy danh sách ID các đầu sách đang giữ
                var bookIdsQuery = @"
                    SELECT DauSachId FROM ChiTietYeuCau ct JOIN YeuCauMuon yc ON ct.YeuCauId = yc.Id WHERE yc.DocGiaId = @DocGiaId AND (yc.TrangThai = 0 OR yc.TrangThai = 1)
                    UNION
                    SELECT cs.DauSachId FROM ChiTietPhieuMuon ct JOIN PhieuMuon pm ON ct.PhieuMuonId = pm.Id JOIN CuonSach cs ON ct.CuonSachId = cs.Id WHERE pm.DocGiaId = @DocGiaId AND pm.TrangThai = 1 AND ct.NgayTraThucTe IS NULL";
                
                var currentBookIds = new List<Guid>();
                using (var bookCommand = new SqlCommand(bookIdsQuery, connection))
                {
                    bookCommand.Parameters.AddWithValue("@DocGiaId", docGiaId);
                    using (var reader = await bookCommand.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            currentBookIds.Add(reader.GetGuid(0));
                        }
                    }
                }
 
                // Tính tổng số sách đã mượn từ trước đến nay
                var totalQuery = "SELECT COUNT(*) FROM ChiTietPhieuMuon ct JOIN PhieuMuon pm ON ct.PhieuMuonId = pm.Id WHERE pm.DocGiaId = @DocGiaId";
                int totalBorrowed = 0;
                using (var totalCommand = new SqlCommand(totalQuery, connection))
                {
                    totalCommand.Parameters.AddWithValue("@DocGiaId", docGiaId);
                    totalBorrowed = (int)await totalCommand.ExecuteScalarAsync();
                }

                // Tính số sách đã trả
                var returnedQuery = "SELECT COUNT(*) FROM ChiTietPhieuMuon ct JOIN PhieuMuon pm ON ct.PhieuMuonId = pm.Id WHERE pm.DocGiaId = @DocGiaId AND ct.NgayTraThucTe IS NOT NULL";
                int returnedCount = 0;
                using (var returnedCommand = new SqlCommand(returnedQuery, connection))
                {
                    returnedCommand.Parameters.AddWithValue("@DocGiaId", docGiaId);
                    returnedCount = (int)await returnedCommand.ExecuteScalarAsync();
                }
 
                return new { 
                    CurrentCount = dangMuon, 
                    MaxLimit = soSachToiDa, 
                    CanBorrowMore = soSachToiDa - dangMuon,
                    HasOverdue = hasOverdue,
                    CurrentBookIds = currentBookIds,
                    TotalBorrowed = totalBorrowed,
                    ReturnedCount = returnedCount
                };
            }
        }
    }
}

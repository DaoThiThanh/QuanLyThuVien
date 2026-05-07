using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IPhieuMuonRepository
    {
        Task<PagedResult<PhieuMuonDto>> GetDanhSachPhieuMuonAsync(int page, int pageSize, string searchTerm = "", string statusFilter = "all");
        Task<PhieuMuonDto> GetPhieuMuonByIdAsync(Guid id);
        Task<bool> CreatePhieuMuonAsync(CreatePhieuMuonRequest request);
        Task<List<PhieuMuonDto>> GetPhieuMuonQuaHanAsync();
        Task<bool> TraSachAsync(Guid phieuMuonId, Guid cuonSachId, string tinhTrang);
        Task<List<PhieuMuonDto>> GetPhieuMuonByDocGiaAsync(Guid docGiaId);
    }

    public class PhieuMuonRepository : IPhieuMuonRepository
    {
        private readonly IConfiguration _configuration;

        public PhieuMuonRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<PagedResult<PhieuMuonDto>> GetDanhSachPhieuMuonAsync(int page, int pageSize, string searchTerm = "", string statusFilter = "all")
        {
            var result = new PagedResult<PhieuMuonDto>
            {
                CurrentPage = page,
                PageSize = pageSize,
                Items = new List<PhieuMuonDto>()
            };

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var whereClause = "WHERE (@SearchTerm = '' OR nd.HoTen LIKE @SearchPattern OR CAST(pm.Id AS NVARCHAR(36)) LIKE @SearchPattern) ";
                if (statusFilter == "active") whereClause += "AND pm.TrangThai = 1 ";
                else if (statusFilter == "returned") whereClause += "AND pm.TrangThai = 2 ";

                var countQuery = $@"
                    SELECT COUNT(*) 
                    FROM PhieuMuon pm
                    LEFT JOIN NguoiDung nd ON pm.DocGiaId = nd.Id
                    {whereClause}";

                using (var countCommand = new SqlCommand(countQuery, connection))
                {
                    countCommand.Parameters.AddWithValue("@SearchTerm", searchTerm ?? "");
                    countCommand.Parameters.AddWithValue("@SearchPattern", $"%{(searchTerm ?? "")}%");
                    result.TotalItems = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
                }

                result.TotalPages = (int)Math.Ceiling(result.TotalItems / (double)pageSize);

                var query = $@"
                    SELECT 
                        pm.Id, 
                        pm.DocGiaId, 
                        nd.HoTen as TenDocGia, 
                        pm.ThuThuId, 
                        pm.KenhMuon, 
                        pm.NgayMuon, 
                        pm.HanTra, 
                        pm.TrangThai,
                        (SELECT TOP 1 ds.TenSach FROM ChiTietPhieuMuon ct 
                         JOIN CuonSach cs ON ct.CuonSachId = cs.Id 
                         JOIN DauSach ds ON cs.DauSachId = ds.Id 
                         WHERE ct.PhieuMuonId = pm.Id) as TenSach
                    FROM PhieuMuon pm
                    LEFT JOIN NguoiDung nd ON pm.DocGiaId = nd.Id
                    {whereClause}
                    ORDER BY pm.NgayMuon DESC
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                    command.Parameters.AddWithValue("@PageSize", pageSize);
                    command.Parameters.AddWithValue("@SearchTerm", searchTerm ?? "");
                    command.Parameters.AddWithValue("@SearchPattern", $"%{(searchTerm ?? "")}%");

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var items = new List<PhieuMuonDto>();
                        while (await reader.ReadAsync())
                        {
                            var dto = new PhieuMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.IsDBNull(reader.GetOrdinal("TenDocGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenDocGia")),
                                ThuThuId = reader.IsDBNull(reader.GetOrdinal("ThuThuId")) ? null : reader.GetGuid(reader.GetOrdinal("ThuThuId")),
                                KenhMuon = reader.IsDBNull(reader.GetOrdinal("KenhMuon")) ? 1 : reader.GetInt32(reader.GetOrdinal("KenhMuon")),
                                NgayMuon = reader.IsDBNull(reader.GetOrdinal("NgayMuon")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("NgayMuon")),
                                HanTra = reader.IsDBNull(reader.GetOrdinal("HanTra")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("HanTra")),
                                TrangThai = reader.IsDBNull(reader.GetOrdinal("TrangThai")) ? 1 : reader.GetInt32(reader.GetOrdinal("TrangThai")),
                                TenSach = reader.IsDBNull(reader.GetOrdinal("TenSach")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenSach"))
                            };
                            
                            items.Add(dto);
                        }
                        result.Items = items;
                    }
                }
            }

            return result;
        }

        public async Task<PhieuMuonDto> GetPhieuMuonByIdAsync(Guid id)
        {
            PhieuMuonDto phieuMuon = null;
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        pm.Id, 
                        pm.DocGiaId, 
                        nd.HoTen as TenDocGia, 
                        pm.ThuThuId, 
                        pm.KenhMuon, 
                        pm.NgayMuon, 
                        pm.HanTra, 
                        pm.TrangThai
                    FROM PhieuMuon pm
                    LEFT JOIN NguoiDung nd ON pm.DocGiaId = nd.Id
                    WHERE pm.Id = @Id";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            phieuMuon = new PhieuMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.IsDBNull(reader.GetOrdinal("TenDocGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenDocGia")),
                                ThuThuId = reader.IsDBNull(reader.GetOrdinal("ThuThuId")) ? null : reader.GetGuid(reader.GetOrdinal("ThuThuId")),
                                KenhMuon = reader.IsDBNull(reader.GetOrdinal("KenhMuon")) ? 1 : reader.GetInt32(reader.GetOrdinal("KenhMuon")),
                                NgayMuon = reader.IsDBNull(reader.GetOrdinal("NgayMuon")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("NgayMuon")),
                                HanTra = reader.IsDBNull(reader.GetOrdinal("HanTra")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("HanTra")),
                                TrangThai = reader.IsDBNull(reader.GetOrdinal("TrangThai")) ? 1 : reader.GetInt32(reader.GetOrdinal("TrangThai"))
                            };
                        }
                    }
                }

                if (phieuMuon != null)
                {
                    var ctQuery = @"
                        SELECT 
                            ct.Id, 
                            ct.CuonSachId, 
                            ct.NgayTraThucTe, 
                            ct.TinhTrangKhiTra, 
                            ct.TienPhat,
                            cs.MaVach, 
                            ds.TenSach
                        FROM ChiTietPhieuMuon ct
                        JOIN CuonSach cs ON ct.CuonSachId = cs.Id
                        JOIN DauSach ds ON cs.DauSachId = ds.Id
                        WHERE ct.PhieuMuonId = @PhieuMuonId";

                    using (var command = new SqlCommand(ctQuery, connection))
                    {
                        command.Parameters.AddWithValue("@PhieuMuonId", id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                phieuMuon.ChiTiet.Add(new ChiTietPhieuMuonDto
                                {
                                    Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                    CuonSachId = reader.GetGuid(reader.GetOrdinal("CuonSachId")),
                                    TenSach = reader.IsDBNull(reader.GetOrdinal("TenSach")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenSach")),
                                    MaVach = reader.IsDBNull(reader.GetOrdinal("MaVach")) ? string.Empty : reader.GetString(reader.GetOrdinal("MaVach")),
                                    NgayTraThucTe = reader.IsDBNull(reader.GetOrdinal("NgayTraThucTe")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayTraThucTe")),
                                    TinhTrangKhiTra = reader.IsDBNull(reader.GetOrdinal("TinhTrangKhiTra")) ? null : reader.GetString(reader.GetOrdinal("TinhTrangKhiTra")),
                                    TienPhat = reader.IsDBNull(reader.GetOrdinal("TienPhat")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TienPhat"))
                                });
                            }
                        }
                    }
                }
            }

            return phieuMuon;
        }

        public async Task<bool> CreatePhieuMuonAsync(CreatePhieuMuonRequest request)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        var phieuMuonId = Guid.NewGuid();

                        // Insert PhieuMuon
                        var pmQuery = @"
                            INSERT INTO PhieuMuon (Id, DocGiaId, ThuThuId, KenhMuon, NgayMuon, HanTra, TrangThai, YeuCauId)
                            VALUES (@Id, @DocGiaId, @ThuThuId, @KenhMuon, GETDATE(), @HanTra, 1, @YeuCauId)";

                        using (var command = new SqlCommand(pmQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@Id", phieuMuonId);
                            command.Parameters.AddWithValue("@DocGiaId", request.DocGiaId);
                            command.Parameters.AddWithValue("@ThuThuId", (object)request.ThuThuId ?? DBNull.Value);
                            command.Parameters.AddWithValue("@KenhMuon", request.KenhMuon);
                            command.Parameters.AddWithValue("@HanTra", request.HanTra);
                            command.Parameters.AddWithValue("@YeuCauId", (object)request.YeuCauId ?? DBNull.Value);

                            await command.ExecuteNonQueryAsync();
                        }

                        // Nếu có YeuCauId, cập nhật trạng thái yêu cầu mượn sang "Đã xử lý/Hoàn thành" (status 3)
                        if (request.YeuCauId.HasValue)
                        {
                            var updateYcQuery = "UPDATE YeuCauMuon SET TrangThai = 3 WHERE Id = @YeuCauId";
                            using (var command = new SqlCommand(updateYcQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@YeuCauId", request.YeuCauId.Value);
                                await command.ExecuteNonQueryAsync();
                            }
                        }

                        // Insert ChiTietPhieuMuon & Update CuonSach & DauSach
                        foreach (var cuonSachId in request.CuonSachIds)
                        {
                            var ctId = Guid.NewGuid();
                            var ctQuery = @"
                                INSERT INTO ChiTietPhieuMuon (Id, PhieuMuonId, CuonSachId)
                                VALUES (@Id, @PhieuMuonId, @CuonSachId)";

                            using (var command = new SqlCommand(ctQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@Id", ctId);
                                command.Parameters.AddWithValue("@PhieuMuonId", phieuMuonId);
                                command.Parameters.AddWithValue("@CuonSachId", cuonSachId);

                                await command.ExecuteNonQueryAsync();
                            }

                            var updateCsQuery = @"UPDATE CuonSach SET TrangThaiMuon = 2 WHERE Id = @Id";
                            using (var command = new SqlCommand(updateCsQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@Id", cuonSachId);
                                await command.ExecuteNonQueryAsync();
                            }

                            var updateDsQuery = @"
                                UPDATE DauSach 
                                SET SoLuongTon = SoLuongTon - 1 
                                WHERE Id = (SELECT DauSachId FROM CuonSach WHERE Id = @Id)";
                            using (var command = new SqlCommand(updateDsQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@Id", cuonSachId);
                                await command.ExecuteNonQueryAsync();
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        return false;
                    }
                }
            }
        }

        public async Task<List<PhieuMuonDto>> GetPhieuMuonQuaHanAsync()
        {
            var result = new List<PhieuMuonDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        pm.Id, 
                        pm.DocGiaId, 
                        nd.HoTen as TenDocGia, 
                        pm.ThuThuId, 
                        pm.KenhMuon, 
                        pm.NgayMuon, 
                        pm.HanTra, 
                        pm.TrangThai
                    FROM PhieuMuon pm
                    LEFT JOIN NguoiDung nd ON pm.DocGiaId = nd.Id
                    WHERE pm.HanTra < CAST(GETDATE() AS DATE) AND pm.TrangThai = 1
                    ORDER BY pm.HanTra ASC";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new PhieuMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.IsDBNull(reader.GetOrdinal("TenDocGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenDocGia")),
                                ThuThuId = reader.IsDBNull(reader.GetOrdinal("ThuThuId")) ? null : reader.GetGuid(reader.GetOrdinal("ThuThuId")),
                                KenhMuon = reader.IsDBNull(reader.GetOrdinal("KenhMuon")) ? 1 : reader.GetInt32(reader.GetOrdinal("KenhMuon")),
                                NgayMuon = reader.IsDBNull(reader.GetOrdinal("NgayMuon")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("NgayMuon")),
                                HanTra = reader.IsDBNull(reader.GetOrdinal("HanTra")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("HanTra")),
                                TrangThai = reader.IsDBNull(reader.GetOrdinal("TrangThai")) ? 1 : reader.GetInt32(reader.GetOrdinal("TrangThai"))
                            });
                        }
                    }
                }
            }

            return result;
        }
        public async Task<bool> TraSachAsync(Guid phieuMuonId, Guid cuonSachId, string tinhTrang)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // 1. Lấy thông tin hạn trả và phí phạt từ tham số
                        DateTime hanTra = DateTime.MinValue;
                        decimal phiMoiNgay = 5000;

                        var infoQuery = @"
                            SELECT pm.HanTra, 
                                   ISNULL((SELECT TOP 1 PhiPhatTreHanMoiNgay FROM ThamSoQuyDinh ORDER BY NgayCapNhat DESC), 5000) as PhiPhat
                            FROM PhieuMuon pm WHERE pm.Id = @PhieuMuonId";
                        
                        using (var command = new SqlCommand(infoQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@PhieuMuonId", phieuMuonId);
                            using (var reader = await command.ExecuteReaderAsync())
                            {
                                if (await reader.ReadAsync())
                                {
                                    hanTra = reader.GetDateTime(0);
                                    phiMoiNgay = reader.GetDecimal(1);
                                }
                            }
                        }

                        // 2. Tính tiền phạt
                        decimal tienPhat = 0;
                        if (DateTime.Now.Date > hanTra.Date)
                        {
                            int trễ = (int)(DateTime.Now.Date - hanTra.Date).TotalDays;
                            tienPhat = trễ * phiMoiNgay;
                        }

                        // 3. Cập nhật ChiTietPhieuMuon
                        var updateCtQuery = @"
                            UPDATE ChiTietPhieuMuon 
                            SET NgayTraThucTe = GETDATE(), 
                                TinhTrangKhiTra = @TinhTrang,
                                TienPhat = @TienPhat
                            WHERE PhieuMuonId = @PhieuMuonId AND CuonSachId = @CuonSachId";
                        
                        using (var command = new SqlCommand(updateCtQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@PhieuMuonId", phieuMuonId);
                            command.Parameters.AddWithValue("@CuonSachId", cuonSachId);
                            command.Parameters.AddWithValue("@TinhTrang", tinhTrang);
                            command.Parameters.AddWithValue("@TienPhat", tienPhat);
                            await command.ExecuteNonQueryAsync();
                        }

                        // 4. Cập nhật trạng thái CuonSach sang 1 (Sẵn sàng)
                        var updateCsQuery = "UPDATE CuonSach SET TrangThaiMuon = 1 WHERE Id = @CuonSachId";
                        using (var command = new SqlCommand(updateCsQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@CuonSachId", cuonSachId);
                            await command.ExecuteNonQueryAsync();
                        }

                        // 5. Cập nhật SoLuongTon trong DauSach
                        var updateDsQuery = @"
                            UPDATE DauSach SET SoLuongTon = SoLuongTon + 1 
                            WHERE Id = (SELECT DauSachId FROM CuonSach WHERE Id = @CuonSachId)";
                        using (var command = new SqlCommand(updateDsQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@CuonSachId", cuonSachId);
                            await command.ExecuteNonQueryAsync();
                        }

                        // 6. Kiểm tra xem tất cả sách trong phiếu đã trả chưa
                        var checkAllQuery = @"
                            SELECT COUNT(*) FROM ChiTietPhieuMuon 
                            WHERE PhieuMuonId = @PhieuMuonId AND NgayTraThucTe IS NULL";
                        
                        bool allReturned = false;
                        using (var command = new SqlCommand(checkAllQuery, connection, transaction))
                        {
                            command.Parameters.AddWithValue("@PhieuMuonId", phieuMuonId);
                            allReturned = (int)await command.ExecuteScalarAsync() == 0;
                        }

                        if (allReturned)
                        {
                            var updatePmQuery = "UPDATE PhieuMuon SET TrangThai = 2 WHERE Id = @PhieuMuonId"; // 2 = Đã trả
                            using (var command = new SqlCommand(updatePmQuery, connection, transaction))
                            {
                                command.Parameters.AddWithValue("@PhieuMuonId", phieuMuonId);
                                await command.ExecuteNonQueryAsync();
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (Exception)
                    {
                        transaction.Rollback();
                        return false;
                    }
                }
            }
        }

        public async Task<List<PhieuMuonDto>> GetPhieuMuonByDocGiaAsync(Guid docGiaId)
        {
            var result = new List<PhieuMuonDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        pm.Id, 
                        pm.DocGiaId, 
                        nd.HoTen as TenDocGia, 
                        pm.ThuThuId, 
                        pm.KenhMuon, 
                        pm.NgayMuon, 
                        pm.HanTra, 
                        pm.TrangThai
                    FROM PhieuMuon pm
                    LEFT JOIN NguoiDung nd ON pm.DocGiaId = nd.Id
                    WHERE pm.DocGiaId = @DocGiaId
                    ORDER BY pm.NgayMuon DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DocGiaId", docGiaId);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new PhieuMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.IsDBNull(reader.GetOrdinal("TenDocGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenDocGia")),
                                ThuThuId = reader.IsDBNull(reader.GetOrdinal("ThuThuId")) ? null : reader.GetGuid(reader.GetOrdinal("ThuThuId")),
                                KenhMuon = reader.IsDBNull(reader.GetOrdinal("KenhMuon")) ? 1 : reader.GetInt32(reader.GetOrdinal("KenhMuon")),
                                NgayMuon = reader.IsDBNull(reader.GetOrdinal("NgayMuon")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("NgayMuon")),
                                HanTra = reader.IsDBNull(reader.GetOrdinal("HanTra")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("HanTra")),
                                TrangThai = reader.IsDBNull(reader.GetOrdinal("TrangThai")) ? 1 : reader.GetInt32(reader.GetOrdinal("TrangThai")),
                                ChiTiet = new List<ChiTietPhieuMuonDto>()
                            });
                        }
                    }
                }

                // Lấy chi tiết cho từng phiếu
                foreach (var pm in result)
                {
                    var ctQuery = @"
                        SELECT 
                            ct.Id, 
                            ct.CuonSachId, 
                            ct.NgayTraThucTe, 
                            ct.TinhTrangKhiTra, 
                            ct.TienPhat,
                            cs.MaVach, 
                            ds.TenSach,
                            ds.HinhAnh,
                            tg.TenTacGia
                        FROM ChiTietPhieuMuon ct
                        JOIN CuonSach cs ON ct.CuonSachId = cs.Id
                        JOIN DauSach ds ON cs.DauSachId = ds.Id
                        LEFT JOIN TacGia tg ON ds.TacGiaId = tg.Id
                        WHERE ct.PhieuMuonId = @PhieuMuonId";

                    using (var command = new SqlCommand(ctQuery, connection))
                    {
                        command.Parameters.AddWithValue("@PhieuMuonId", pm.Id);

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                pm.ChiTiet.Add(new ChiTietPhieuMuonDto
                                {
                                    Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                    CuonSachId = reader.GetGuid(reader.GetOrdinal("CuonSachId")),
                                    TenSach = reader.IsDBNull(reader.GetOrdinal("TenSach")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenSach")),
                                    MaVach = reader.IsDBNull(reader.GetOrdinal("MaVach")) ? string.Empty : reader.GetString(reader.GetOrdinal("MaVach")),
                                    NgayTraThucTe = reader.IsDBNull(reader.GetOrdinal("NgayTraThucTe")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayTraThucTe")),
                                    TinhTrangKhiTra = reader.IsDBNull(reader.GetOrdinal("TinhTrangKhiTra")) ? null : reader.GetString(reader.GetOrdinal("TinhTrangKhiTra")),
                                    TienPhat = reader.IsDBNull(reader.GetOrdinal("TienPhat")) ? 0 : reader.GetDecimal(reader.GetOrdinal("TienPhat")),
                                    HinhAnh = reader.IsDBNull(reader.GetOrdinal("HinhAnh")) ? string.Empty : reader.GetString(reader.GetOrdinal("HinhAnh")),
                                    TenTacGia = reader.IsDBNull(reader.GetOrdinal("TenTacGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenTacGia"))
                                });
                            }
                        }
                    }
                }
            }

            return result;
        }
    }
}

using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface ISachRepository
    {
        Task<IEnumerable<SachNoiBatDto>> GetSachNoiBatAsync(int top);
        Task<IEnumerable<SachMoiBoSungDto>> GetSachMoiBoSungAsync(int top);
        Task<PagedResult<SachDto>> GetDanhSachSachAsync(int page, int pageSize);
        Task<SachDto> GetSachByIdAsync(Guid id);
        Task<Guid> CreateSachAsync(UpsertSachDto dto);
        Task<bool> UpdateSachAsync(Guid id, UpsertSachDto dto);
        Task<bool> DeleteSachAsync(Guid id);
        Task<IEnumerable<TacGiaDto>> GetTacGiasAsync();
        Task<IEnumerable<NhaXuatBanDto>> GetNhaXuatBansAsync();
        Task<object> GetCuonSachByBarcodeAsync(string barcode);
        Task<IEnumerable<object>> GetAvailableCuonSachsByDauSachAsync(Guid dauSachId);
    }
    
    public class SachRepository : ISachRepository
    {
        private readonly IConfiguration _configuration;

        public SachRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<SachNoiBatDto>> GetSachNoiBatAsync(int top)
        {
            var result = new List<SachNoiBatDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT TOP (@Top) 
                        ds.Id, 
                        ds.TenSach, 
                        ds.HinhAnh, 
                        ds.SoLuongTon, 
                        COUNT(ct.Id) as SoLuotMuon
                    FROM DauSach ds
                    JOIN CuonSach cs ON ds.Id = cs.DauSachId
                    JOIN ChiTietPhieuMuon ct ON cs.Id = ct.CuonSachId
                    GROUP BY ds.Id, ds.TenSach, ds.HinhAnh, ds.SoLuongTon
                    ORDER BY SoLuotMuon DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Top", top);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new SachNoiBatDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                TenSach = reader.GetString(reader.GetOrdinal("TenSach")),
                                HinhAnh = reader.IsDBNull(reader.GetOrdinal("HinhAnh")) ? null : reader.GetString(reader.GetOrdinal("HinhAnh")),
                                SoLuongTon = reader.IsDBNull(reader.GetOrdinal("SoLuongTon")) ? 0 : reader.GetInt32(reader.GetOrdinal("SoLuongTon")),
                                SoLuotMuon = reader.IsDBNull(reader.GetOrdinal("SoLuotMuon")) ? 0 : reader.GetInt32(reader.GetOrdinal("SoLuotMuon"))
                            });
                        }
                    }
                }
            }

            return result;
        }

        public async Task<IEnumerable<SachMoiBoSungDto>> GetSachMoiBoSungAsync(int top)
        {
            var result = new List<SachMoiBoSungDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT TOP (@Top) 
                        Id, 
                        TenSach, 
                        HinhAnh, 
                        SoLuongTon, 
                        NamXuatBan
                    FROM DauSach
                    ORDER BY NamXuatBan DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Top", top);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new SachMoiBoSungDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                TenSach = reader.GetString(reader.GetOrdinal("TenSach")),
                                HinhAnh = reader.IsDBNull(reader.GetOrdinal("HinhAnh")) ? null : reader.GetString(reader.GetOrdinal("HinhAnh")),
                                SoLuongTon = reader.IsDBNull(reader.GetOrdinal("SoLuongTon")) ? 0 : reader.GetInt32(reader.GetOrdinal("SoLuongTon")),
                                NamXuatBan = reader.IsDBNull(reader.GetOrdinal("NamXuatBan")) ? 0 : reader.GetInt32(reader.GetOrdinal("NamXuatBan"))
                            });
                        }
                    }
                }
            }

            return result;
        }

        public async Task<PagedResult<SachDto>> GetDanhSachSachAsync(int page, int pageSize)
        {
            var result = new PagedResult<SachDto>
            {
                CurrentPage = page,
                PageSize = pageSize,
                Items = new List<SachDto>()
            };

            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var countQuery = "SELECT COUNT(*) FROM DauSach";
                using (var countCommand = new SqlCommand(countQuery, connection))
                {
                    result.TotalItems = Convert.ToInt32(await countCommand.ExecuteScalarAsync());
                }

                result.TotalPages = (int)Math.Ceiling(result.TotalItems / (double)pageSize);

                var query = @"
                    SELECT 
                        ds.Id, 
                        ds.TenSach, 
                        ds.HinhAnh, 
                        ds.SoLuongTon, 
                        dm.TenDanhMuc,
                        tg.TenTacGia
                    FROM DauSach ds
                    LEFT JOIN DanhMucSach dm ON ds.DanhMucId = dm.Id
                    LEFT JOIN TacGia tg ON ds.TacGiaId = tg.Id
                    ORDER BY ds.TenSach
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                    command.Parameters.AddWithValue("@PageSize", pageSize);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        var items = new List<SachDto>();
                        while (await reader.ReadAsync())
                        {
                            items.Add(new SachDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                TenSach = reader.GetString(reader.GetOrdinal("TenSach")),
                                HinhAnh = reader.IsDBNull(reader.GetOrdinal("HinhAnh")) ? null : reader.GetString(reader.GetOrdinal("HinhAnh")),
                                SoLuongTon = reader.IsDBNull(reader.GetOrdinal("SoLuongTon")) ? 0 : reader.GetInt32(reader.GetOrdinal("SoLuongTon")),
                                TenDanhMuc = reader.IsDBNull(reader.GetOrdinal("TenDanhMuc")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenDanhMuc")),
                                TenTacGia = reader.IsDBNull(reader.GetOrdinal("TenTacGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenTacGia"))
                            });
                        }
                        result.Items = items;
                    }
                }
            }

            return result;
        }

        public async Task<SachDto> GetSachByIdAsync(Guid id)
        {
            SachDto sach = null;
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT 
                        ds.Id, 
                        ds.TenSach, 
                        ds.HinhAnh, 
                        ds.SoLuongTon, 
                        ds.NamXuatBan,
                        dm.TenDanhMuc,
                        tg.TenTacGia,
                        nxb.TenNXB,
                        '' as MoTa,
                        '' as Isbn,
                        (SELECT COUNT(*) FROM CuonSach WHERE DauSachId = ds.Id) as TongSoLuong
                    FROM DauSach ds
                    LEFT JOIN DanhMucSach dm ON ds.DanhMucId = dm.Id
                    LEFT JOIN TacGia tg ON ds.TacGiaId = tg.Id
                    LEFT JOIN NhaXuatBan nxb ON ds.NxbId = nxb.Id
                    WHERE ds.Id = @Id";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);

                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            sach = new SachDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                TenSach = reader.GetString(reader.GetOrdinal("TenSach")),
                                HinhAnh = reader.IsDBNull(reader.GetOrdinal("HinhAnh")) ? null : reader.GetString(reader.GetOrdinal("HinhAnh")),
                                SoLuongTon = reader.IsDBNull(reader.GetOrdinal("SoLuongTon")) ? 0 : reader.GetInt32(reader.GetOrdinal("SoLuongTon")),
                                TenDanhMuc = reader.IsDBNull(reader.GetOrdinal("TenDanhMuc")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenDanhMuc")),
                                TenTacGia = reader.IsDBNull(reader.GetOrdinal("TenTacGia")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenTacGia")),
                                NamXuatBan = reader.IsDBNull(reader.GetOrdinal("NamXuatBan")) ? 0 : reader.GetInt32(reader.GetOrdinal("NamXuatBan")),
                                TenNhaXuatBan = reader.IsDBNull(reader.GetOrdinal("TenNXB")) ? string.Empty : reader.GetString(reader.GetOrdinal("TenNXB")),
                                MoTa = reader.IsDBNull(reader.GetOrdinal("MoTa")) ? string.Empty : reader.GetString(reader.GetOrdinal("MoTa")),
                                Isbn = reader.IsDBNull(reader.GetOrdinal("Isbn")) ? string.Empty : reader.GetString(reader.GetOrdinal("Isbn")),
                                TongSoLuong = reader.IsDBNull(reader.GetOrdinal("TongSoLuong")) ? 0 : reader.GetInt32(reader.GetOrdinal("TongSoLuong"))
                            };
                        }
                    }
                }
            }

            return sach;
        }

        public async Task<Guid> CreateSachAsync(UpsertSachDto dto)
        {
            var id = Guid.NewGuid();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = @"
                    INSERT INTO DauSach (Id, TenSach, DanhMucId, TacGiaId, NxbId, NamXuatBan, HinhAnh, SoLuongTon)
                    VALUES (@Id, @TenSach, @DanhMucId, @TacGiaId, @NxbId, @NamXuatBan, @HinhAnh, @SoLuongTon)";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@TenSach", dto.TenSach);
                    command.Parameters.AddWithValue("@DanhMucId", dto.DanhMucId);
                    command.Parameters.AddWithValue("@TacGiaId", dto.TacGiaId);
                    command.Parameters.AddWithValue("@NxbId", dto.NxbId);
                    command.Parameters.AddWithValue("@NamXuatBan", dto.NamXuatBan);
                    command.Parameters.AddWithValue("@HinhAnh", (object?)dto.HinhAnh ?? DBNull.Value);
                    command.Parameters.AddWithValue("@SoLuongTon", dto.SoLuongTon);

                    await command.ExecuteNonQueryAsync();
                }
            }
            return id;
        }

        public async Task<bool> UpdateSachAsync(Guid id, UpsertSachDto dto)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            int rowsAffected = 0;

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = @"
                    UPDATE DauSach 
                    SET TenSach = @TenSach, 
                        DanhMucId = @DanhMucId, 
                        TacGiaId = @TacGiaId, 
                        NxbId = @NxbId, 
                        NamXuatBan = @NamXuatBan, 
                        HinhAnh = @HinhAnh, 
                        SoLuongTon = @SoLuongTon
                    WHERE Id = @Id";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@TenSach", dto.TenSach);
                    command.Parameters.AddWithValue("@DanhMucId", dto.DanhMucId);
                    command.Parameters.AddWithValue("@TacGiaId", dto.TacGiaId);
                    command.Parameters.AddWithValue("@NxbId", dto.NxbId);
                    command.Parameters.AddWithValue("@NamXuatBan", dto.NamXuatBan);
                    command.Parameters.AddWithValue("@HinhAnh", (object?)dto.HinhAnh ?? DBNull.Value);
                    command.Parameters.AddWithValue("@SoLuongTon", dto.SoLuongTon);

                    rowsAffected = await command.ExecuteNonQueryAsync();
                }
            }
            return rowsAffected > 0;
        }

        public async Task<bool> DeleteSachAsync(Guid id)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            int rowsAffected = 0;

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                
                // Note: In a real app, we should check for foreign key constraints 
                // (e.g. if books exist in CuonSach or are borrowed).
                // For simplicity, we just try to delete DauSach.
                var query = "DELETE FROM DauSach WHERE Id = @Id";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    try {
                        rowsAffected = await command.ExecuteNonQueryAsync();
                    } catch (SqlException) {
                        // Might throw if there are CuonSach references
                        return false;
                    }
                }
            }
            return rowsAffected > 0;
        }

        public async Task<IEnumerable<TacGiaDto>> GetTacGiasAsync()
        {
            var result = new List<TacGiaDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = "SELECT Id, TenTacGia FROM TacGia ORDER BY TenTacGia";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new TacGiaDto
                            {
                                Id = reader.GetGuid(0),
                                TenTacGia = reader.GetString(1)
                            });
                        }
                    }
                }
            }
            return result;
        }

        public async Task<IEnumerable<NhaXuatBanDto>> GetNhaXuatBansAsync()
        {
            var result = new List<NhaXuatBanDto>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = "SELECT Id, TenNXB FROM NhaXuatBan ORDER BY TenNXB";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new NhaXuatBanDto
                            {
                                Id = reader.GetGuid(0),
                                TenNXB = reader.GetString(1)
                            });
                        }
                    }
                }
            }
            return result;
        }
        public async Task<object> GetCuonSachByBarcodeAsync(string barcode)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = @"
                    SELECT cs.Id, cs.MaVach, cs.TinhTrangVatLy, cs.TrangThaiMuon, ds.TenSach, ds.Id as DauSachId
                    FROM CuonSach cs
                    JOIN DauSach ds ON cs.DauSachId = ds.Id
                    WHERE cs.MaVach = @MaVach";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@MaVach", barcode);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            return new
                            {
                                Id = reader.GetGuid(0),
                                MaVach = reader.GetString(1),
                                TinhTrangVatLy = reader.GetString(2),
                                TrangThaiMuon = reader.GetInt32(3),
                                TenSach = reader.GetString(4),
                                DauSachId = reader.GetGuid(5)
                            };
                        }
                    }
                }
            }
            return null;
        }

        public async Task<IEnumerable<object>> GetAvailableCuonSachsByDauSachAsync(Guid dauSachId)
        {
            var result = new List<object>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");
            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = @"
                    SELECT Id, MaVach, TinhTrangVatLy 
                    FROM CuonSach 
                    WHERE DauSachId = @DauSachId AND TrangThaiMuon = 1"; // 1 = Sẵn sàng

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@DauSachId", dauSachId);
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new
                            {
                                Id = reader.GetGuid(0),
                                MaVach = reader.GetString(1),
                                TinhTrangVatLy = reader.GetString(2)
                            });
                        }
                    }
                }
            }
            return result;
        }
    }
}

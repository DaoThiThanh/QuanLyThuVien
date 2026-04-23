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
                    result.TotalItems = (int)await countCommand.ExecuteScalarAsync();
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
    }
}

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
                        return false;
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
                        nd.HoTen as TenDocGia
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
                                NgayYeuCau = reader.GetDateTime(reader.GetOrdinal("NgayYeuCau")),
                                NgayHenNhan = reader.IsDBNull(reader.GetOrdinal("NgayHenNhan")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayHenNhan")),
                                TrangThai = reader.GetInt32(reader.GetOrdinal("TrangThai"))
                            });
                        }
                    }
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
                        nd.HoTen as TenDocGia
                    FROM YeuCauMuon yc
                    JOIN NguoiDung nd ON yc.DocGiaId = nd.Id
                    ORDER BY yc.NgayYeuCau DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new YeuCauMuonDto
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                DocGiaId = reader.GetGuid(reader.GetOrdinal("DocGiaId")),
                                TenDocGia = reader.GetString(reader.GetOrdinal("TenDocGia")),
                                NgayYeuCau = reader.GetDateTime(reader.GetOrdinal("NgayYeuCau")),
                                NgayHenNhan = reader.IsDBNull(reader.GetOrdinal("NgayHenNhan")) ? null : reader.GetDateTime(reader.GetOrdinal("NgayHenNhan")),
                                TrangThai = reader.GetInt32(reader.GetOrdinal("TrangThai"))
                            });
                        }
                    }
                }
            }

            return result;
        }
    }
}

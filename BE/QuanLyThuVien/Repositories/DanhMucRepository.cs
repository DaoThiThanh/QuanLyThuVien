using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IDanhMucRepository
    {
        Task<IEnumerable<DanhMucSach>> GetAllDanhMucAsync();
        Task<Guid> CreateDanhMucAsync(string tenDanhMuc, string? icon);
        Task<bool> UpdateDanhMucAsync(Guid id, string tenDanhMuc, string? icon);
        Task<bool> DeleteDanhMucAsync(Guid id);
    }
    public class DanhMucRepository : IDanhMucRepository
    {
        private readonly IConfiguration _configuration;

        public DanhMucRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<IEnumerable<DanhMucSach>> GetAllDanhMucAsync()
        {
            var result = new List<DanhMucSach>();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = "SELECT Id, TenDanhMuc, ICON FROM DanhMucSach";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Add(new DanhMucSach
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                TenDanhMuc = reader.GetString(reader.GetOrdinal("TenDanhMuc")),
                                icon = reader.IsDBNull(reader.GetOrdinal("ICON")) ? string.Empty : reader.GetString(reader.GetOrdinal("ICON"))
                            });
                        }
                    }
                }
            }

            return result;
        }
        public async Task<Guid> CreateDanhMucAsync(string tenDanhMuc, string? icon)
        {
            var id = Guid.NewGuid();
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = "INSERT INTO DanhMucSach (Id, TenDanhMuc, ICON) VALUES (@Id, @TenDanhMuc, @Icon)";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@TenDanhMuc", tenDanhMuc);
                    command.Parameters.AddWithValue("@Icon", (object?)icon ?? DBNull.Value);
                    await command.ExecuteNonQueryAsync();
                }
            }
            return id;
        }

        public async Task<bool> UpdateDanhMucAsync(Guid id, string tenDanhMuc, string? icon)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                var query = "UPDATE DanhMucSach SET TenDanhMuc = @TenDanhMuc, ICON = @Icon WHERE Id = @Id";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    command.Parameters.AddWithValue("@TenDanhMuc", tenDanhMuc);
                    command.Parameters.AddWithValue("@Icon", (object?)icon ?? DBNull.Value);
                    var rows = await command.ExecuteNonQueryAsync();
                    return rows > 0;
                }
            }
        }

        public async Task<bool> DeleteDanhMucAsync(Guid id)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();
                
                // Kiểm tra xem có sách nào thuộc danh mục này không
                var checkQuery = "SELECT COUNT(1) FROM DauSach WHERE DanhMucId = @Id";
                using (var checkCommand = new SqlCommand(checkQuery, connection))
                {
                    checkCommand.Parameters.AddWithValue("@Id", id);
                    var count = (int)await checkCommand.ExecuteScalarAsync();
                    if (count > 0) return false;
                }

                var query = "DELETE FROM DanhMucSach WHERE Id = @Id";
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", id);
                    var rows = await command.ExecuteNonQueryAsync();
                    return rows > 0;
                }
            }
        }
    }
}

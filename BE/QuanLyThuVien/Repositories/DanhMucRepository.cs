using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Repositories
{
    public interface IDanhMucRepository
    {
        Task<IEnumerable<DanhMucSach>> GetAllDanhMucAsync();
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
    }
}

using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using QuanLyThuVien.Models;
using System;
using System.Threading.Tasks;

namespace QuanLyThuVien.Repositories
{
    public class QuyDinhRepository : IQuyDinhRepository
    {
        private readonly IConfiguration _configuration;

        public QuyDinhRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<ThamSoQuyDinh> GetQuyDinhAsync()
        {
            ThamSoQuyDinh result = null;
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                var query = @"
                    SELECT TOP 1 Id, SoSachMuonToiDa, SoNgayMuonToiDa, PhiPhatTreHanMoiNgay, NgayCapNhat
                    FROM ThamSoQuyDinh
                    ORDER BY NgayCapNhat DESC";

                using (var command = new SqlCommand(query, connection))
                {
                    using (var reader = await command.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            result = new ThamSoQuyDinh
                            {
                                Id = reader.GetGuid(reader.GetOrdinal("Id")),
                                SoSachMuonToiDa = reader.GetInt32(reader.GetOrdinal("SoSachMuonToiDa")),
                                SoNgayMuonToiDa = reader.GetInt32(reader.GetOrdinal("SoNgayMuonToiDa")),
                                PhiPhatTreHanMoiNgay = reader.GetDecimal(reader.GetOrdinal("PhiPhatTreHanMoiNgay")),
                                NgayCapNhat = reader.GetDateTime(reader.GetOrdinal("NgayCapNhat"))
                            };
                        }
                    }
                }

                // If no record exists, return default
                if (result == null)
                {
                    result = new ThamSoQuyDinh
                    {
                        Id = Guid.NewGuid(),
                        SoSachMuonToiDa = 3,
                        SoNgayMuonToiDa = 10,
                        PhiPhatTreHanMoiNgay = 5000,
                        NgayCapNhat = DateTime.Now
                    };
                }
            }

            return result;
        }

        public async Task<bool> UpdateQuyDinhAsync(ThamSoQuyDinh quyDinh)
        {
            var connectionString = _configuration.GetConnectionString("DefaultConnection");

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                // We insert a new record to keep history, but just updating the existing one is also fine.
                // The requirements say SELECT TOP 1 ORDER BY NgayCapNhat DESC. So inserting is the intended way.
                var query = @"
                    INSERT INTO ThamSoQuyDinh (Id, SoSachMuonToiDa, SoNgayMuonToiDa, PhiPhatTreHanMoiNgay, NgayCapNhat)
                    VALUES (@Id, @SoSachMuonToiDa, @SoNgayMuonToiDa, @PhiPhatTreHanMoiNgay, GETDATE())";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Id", Guid.NewGuid());
                    command.Parameters.AddWithValue("@SoSachMuonToiDa", quyDinh.SoSachMuonToiDa);
                    command.Parameters.AddWithValue("@SoNgayMuonToiDa", quyDinh.SoNgayMuonToiDa);
                    command.Parameters.AddWithValue("@PhiPhatTreHanMoiNgay", quyDinh.PhiPhatTreHanMoiNgay);

                    int rows = await command.ExecuteNonQueryAsync();
                    return rows > 0;
                }
            }
        }
    }
}

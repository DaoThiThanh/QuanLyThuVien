using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using QuanLyThuVien.Models.DTOs;
using System.Data;

namespace QuanLyThuVien.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SachController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("noi-bat")]
        public async Task<IActionResult> GetSachNoiBat([FromQuery] int top = 10)
        {
            try
            {
                if (top <= 0) top = 10;

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

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Repositories;
using QuanLyThuVien.Models.DTOs;

namespace QuanLyThuVien.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongKeController : ControllerBase
    {
        private readonly IThongKeRepository _thongKeRepository;

        public ThongKeController(IThongKeRepository thongKeRepository)
        {
            _thongKeRepository = thongKeRepository;
        }

        [HttpGet("thuthu")]
        public async Task<ActionResult<ThongKeThuThuDto>> GetThongKeThuThu()
        {
            try
            {
                var result = await _thongKeRepository.GetThongKeThuThuAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        [HttpGet("admin")]
        public async Task<ActionResult<ThongKeAdminDto>> GetThongKeAdmin()
        {
            try
            {
                var result = await _thongKeRepository.GetThongKeAdminAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Models.DTOs;
using QuanLyThuVien.Repositories;

namespace QuanLyThuVien.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SachController : ControllerBase
    {
        private readonly ISachRepository _sachRepository;

        public SachController(ISachRepository sachRepository)
        {
            _sachRepository = sachRepository;
        }

        [HttpGet("noi-bat")]
        public async Task<IActionResult> GetSachNoiBat([FromQuery] int top = 10)
        {
            try
            {
                if (top <= 0) top = 10;

                var result = await _sachRepository.GetSachNoiBatAsync(top);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("moi-bo-sung")]
        public async Task<IActionResult> GetSachMoiBoSung([FromQuery] int top = 10)
        {
            try
            {
                if (top <= 0) top = 10;

                var result = await _sachRepository.GetSachMoiBoSungAsync(top);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetDanhSach([FromQuery] int page = 1, [FromQuery] int pageSize = 12)
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 12;

                var result = await _sachRepository.GetDanhSachSachAsync(page, pageSize);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }
}

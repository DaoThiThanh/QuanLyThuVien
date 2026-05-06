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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var result = await _sachRepository.GetSachByIdAsync(id);
                if (result == null) return NotFound("Không tìm thấy sách.");

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] UpsertSachDto dto)
        {
            try
            {
                var id = await _sachRepository.CreateSachAsync(dto);
                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpsertSachDto dto)
        {
            try
            {
                var success = await _sachRepository.UpdateSachAsync(id, dto);
                if (!success) return NotFound("Không tìm thấy sách để cập nhật.");

                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            try
            {
                var success = await _sachRepository.DeleteSachAsync(id);
                if (!success) return BadRequest("Không thể xóa sách (Có thể do sách đang được sử dụng).");

                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("tac-gia")]
        public async Task<IActionResult> GetTacGias()
        {
            try
            {
                var result = await _sachRepository.GetTacGiasAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("nha-xuat-ban")]
        public async Task<IActionResult> GetNhaXuatBans()
        {
            try
            {
                var result = await _sachRepository.GetNhaXuatBansAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }
}

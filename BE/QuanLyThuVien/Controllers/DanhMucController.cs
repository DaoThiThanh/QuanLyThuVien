using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Models.DTOs;
using QuanLyThuVien.Repositories;

namespace QuanLyThuVien.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucController : ControllerBase
    {
        private readonly IDanhMucRepository _danhMucRepository;

        public DanhMucController(IDanhMucRepository danhMucRepository)
        {
            _danhMucRepository = danhMucRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var result = await _danhMucRepository.GetAllDanhMucAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpGet("paged")]
        public async Task<IActionResult> GetPaged([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string searchTerm = "")
        {
            try
            {
                var result = await _danhMucRepository.GetPagedDanhMucAsync(page, pageSize, searchTerm);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateDanhMucDto dto)
        {
            try
            {
                var id = await _danhMucRepository.CreateDanhMucAsync(dto.TenDanhMuc, dto.Icon);
                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(Guid id, [FromBody] CreateDanhMucDto dto)
        {
            try
            {
                var success = await _danhMucRepository.UpdateDanhMucAsync(id, dto.TenDanhMuc, dto.Icon);
                if (!success) return NotFound();
                return Ok();
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
                var success = await _danhMucRepository.DeleteDanhMucAsync(id);
                if (!success) return BadRequest("Không thể xóa danh mục (Có thể do danh mục đang chứa sách).");
                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
    }

    public class CreateDanhMucDto
    {
        public string TenDanhMuc { get; set; } = string.Empty;
        public string? Icon { get; set; }
    }
}

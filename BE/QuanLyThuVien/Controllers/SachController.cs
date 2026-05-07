using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Models.DTOs;
using QuanLyThuVien.Repositories;
using System;

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
        public async Task<IActionResult> GetDanhSach([FromQuery] int page = 1, [FromQuery] int pageSize = 12, [FromQuery] string searchTerm = "")
        {
            try
            {
                if (page <= 0) page = 1;
                if (pageSize <= 0) pageSize = 12;

                var result = await _sachRepository.GetDanhSachSachAsync(page, pageSize, searchTerm);

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
        [HttpGet("cuon-sach/barcode/{barcode}")]
        public async Task<IActionResult> GetByBarcode(string barcode)
        {
            var result = await _sachRepository.GetCuonSachByBarcodeAsync(barcode);
            if (result == null) return NotFound(new { message = "Không tìm thấy cuốn sách với mã vạch này." });
            return Ok(result);
        }

        [HttpGet("cuon-sach/available/{dauSachId}")]
        public async Task<IActionResult> GetAvailableCopies(Guid dauSachId)
        {
            var result = await _sachRepository.GetAvailableCuonSachsByDauSachAsync(dauSachId);
            return Ok(result);
        }
        [HttpPost("tac-gia")]
        public async Task<IActionResult> CreateTacGia([FromBody] CreateTacGiaDto dto)
        {
            try
            {
                var id = await _sachRepository.CreateTacGiaAsync(dto.TenTacGia);
                return Ok(new { Id = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpPut("tac-gia/{id}")]
        public async Task<IActionResult> UpdateTacGia(Guid id, [FromBody] CreateTacGiaDto dto)
        {
            try
            {
                var success = await _sachRepository.UpdateTacGiaAsync(id, dto.TenTacGia);
                if (!success) return NotFound();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }

        [HttpDelete("tac-gia/{id}")]
        public async Task<IActionResult> DeleteTacGia(Guid id)
        {
            try
            {
                var success = await _sachRepository.DeleteTacGiaAsync(id);
                if (!success) return BadRequest("Không thể xóa tác giả (Có thể do tác giả đang có sách trong thư viện).");
                return Ok(new { Success = true });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi server: {ex.Message}");
            }
        }
        [HttpGet("cuon-sach/paged")]
        public async Task<IActionResult> GetPagedCuonSachs([FromQuery] int page = 1, [FromQuery] int pageSize = 12, [FromQuery] string searchTerm = "")
        {
            var result = await _sachRepository.GetPagedCuonSachsAsync(page, pageSize, searchTerm);
            return Ok(result);
        }

        [HttpPut("cuon-sach/{id}")]
        public async Task<IActionResult> UpdateCuonSach(Guid id, [FromBody] UpdateCuonSachDto dto)
        {
            var success = await _sachRepository.UpdateCuonSachAsync(id, dto.MaVach, dto.TinhTrang, dto.TrangThaiMuon);
            if (!success) return BadRequest("Không thể cập nhật cuốn sách.");
            return Ok(new { Success = true });
        }

        [HttpDelete("cuon-sach/{id}")]
        public async Task<IActionResult> DeleteCuonSach(Guid id)
        {
            var success = await _sachRepository.DeleteCuonSachAsync(id);
            if (!success) return BadRequest("Không thể xóa cuốn sách (có thể do sách đang được mượn).");
            return Ok(new { Success = true });
        }

        [HttpPost("cuon-sach")]
        public async Task<IActionResult> CreateCuonSach([FromBody] CreateCuonSachDto dto)
        {
            var success = await _sachRepository.CreateCuonSachAsync(dto.DauSachId, dto.MaVach);
            if (!success) return BadRequest("Không thể thêm cuốn sách.");
            return Ok(new { Success = true });
        }
    }

    public class CreateTacGiaDto
    {
        public string TenTacGia { get; set; } = string.Empty;
    }

    public class UpdateCuonSachDto
    {
        public string MaVach { get; set; } = string.Empty;
        public string TinhTrang { get; set; } = string.Empty;
        public int TrangThaiMuon { get; set; }
    }

    public class CreateCuonSachDto
    {
        public Guid DauSachId { get; set; }
        public string MaVach { get; set; } = string.Empty;
    }
}

using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Models.DTOs;
using QuanLyThuVien.Repositories;

namespace QuanLyThuVien.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YeuCauMuonController : ControllerBase
    {
        private readonly IYeuCauMuonRepository _yeuCauMuonRepository;

        public YeuCauMuonController(IYeuCauMuonRepository yeuCauMuonRepository)
        {
            _yeuCauMuonRepository = yeuCauMuonRepository;
        }

        [HttpPost]
        public async Task<IActionResult> CreateYeuCau([FromBody] CreateYeuCauMuonRequest request)
        {
            if (request == null || request.DauSachIds == null || request.DauSachIds.Count == 0)
            {
                return BadRequest("Thông tin yêu cầu mượn không hợp lệ.");
            }

            var result = await _yeuCauMuonRepository.CreateYeuCauMuonAsync(request);
            if (result)
            {
                return Ok(new { message = "Gửi yêu cầu mượn sách thành công!" });
            }

            return StatusCode(500, "Đã xảy ra lỗi khi gửi yêu cầu mượn sách.");
        }

        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetYeuCauByUser(Guid userId)
        {
            var result = await _yeuCauMuonRepository.GetYeuCauByDocGiaAsync(userId);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllYeuCau()
        {
            var result = await _yeuCauMuonRepository.GetAllYeuCauMuonAsync();
            return Ok(result);
        }

        [HttpPut("{id}/duyet")]
        public async Task<IActionResult> DuyetYeuCau(Guid id)
        {
            var result = await _yeuCauMuonRepository.UpdateTrangThaiAsync(id, 1);
            if (result) return Ok(new { message = "Đã duyệt yêu cầu mượn sách!" });
            return BadRequest("Không thể duyệt yêu cầu.");
        }

        [HttpPut("{id}/tu-choi")]
        public async Task<IActionResult> TuChoiYeuCau(Guid id)
        {
            var result = await _yeuCauMuonRepository.UpdateTrangThaiAsync(id, 2);
            if (result) return Ok(new { message = "Đã từ chối yêu cầu mượn sách." });
            return BadRequest("Không thể từ chối yêu cầu.");
        }
    }
}

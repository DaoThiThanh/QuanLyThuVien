using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Models.DTOs;
using QuanLyThuVien.Repositories;

namespace QuanLyThuVien.Controllers
{
    [Route("api/phieu-muon")]
    [ApiController]
    public class PhieuMuonController : ControllerBase
    {
        private readonly IPhieuMuonRepository _phieuMuonRepository;

        public PhieuMuonController(IPhieuMuonRepository phieuMuonRepository)
        {
            _phieuMuonRepository = phieuMuonRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetDanhSach([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var result = await _phieuMuonRepository.GetDanhSachPhieuMuonAsync(page, pageSize);
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var result = await _phieuMuonRepository.GetPhieuMuonByIdAsync(id);
            if (result == null)
            {
                return NotFound();
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreatePhieuMuonRequest request)
        {
            if (request.CuonSachIds == null || request.CuonSachIds.Count == 0)
            {
                return BadRequest(new { Message = "Danh sách cuốn sách không được trống" });
            }

            var success = await _phieuMuonRepository.CreatePhieuMuonAsync(request);
            if (success)
            {
                return Ok(new { Message = "Tạo phiếu mượn thành công" });
            }
            return BadRequest(new { Message = "Lỗi khi tạo phiếu mượn, vui lòng kiểm tra lại ID độc giả và sách." });
        }

        [HttpGet("qua-han")]
        public async Task<IActionResult> GetQuaHan()
        {
            var result = await _phieuMuonRepository.GetPhieuMuonQuaHanAsync();
            return Ok(result);
        }
    }
}

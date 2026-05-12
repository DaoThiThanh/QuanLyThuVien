using Microsoft.AspNetCore.Mvc;
using QuanLyThuVien.Models;
using QuanLyThuVien.Repositories;
using System.Threading.Tasks;

namespace QuanLyThuVien.Controllers
{
    [Route("api/quy-dinh")]
    [ApiController]
    public class QuyDinhController : ControllerBase
    {
        private readonly IQuyDinhRepository _quyDinhRepository;

        public QuyDinhController(IQuyDinhRepository quyDinhRepository)
        {
            _quyDinhRepository = quyDinhRepository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var result = await _quyDinhRepository.GetQuyDinhAsync();
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] ThamSoQuyDinh quyDinh)
        {
            if (quyDinh.SoSachMuonToiDa <= 0 || quyDinh.SoNgayMuonToiDa <= 0 
                || quyDinh.PhiPhatTreHanMoiNgay < 0 
                || quyDinh.PhiPhatHongNhe < 0 
                || quyDinh.PhiPhatHongNang < 0 
                || quyDinh.PhiPhatMatSach < 0)
            {
                return BadRequest(new { Message = "Các thông số không hợp lệ. Vui lòng nhập số dương." });
            }

            var success = await _quyDinhRepository.UpdateQuyDinhAsync(quyDinh);
            if (success)
            {
                return Ok(new { Message = "Cập nhật quy định thành công." });
            }
            return BadRequest(new { Message = "Lỗi khi cập nhật quy định." });
        }
    }
}

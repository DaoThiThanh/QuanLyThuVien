using IdentityService.Models;
using IdentityService.Repositories;
using IdentityService.Services;
using Microsoft.AspNetCore.Mvc;
namespace IdentityService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserRepository _userRepo;
        private readonly TokenGenerator _tokenGen;

        public AuthController(UserRepository userRepository, TokenGenerator tokenGen)
        {
            _userRepo = userRepository;
            _tokenGen = tokenGen;
        }
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            bool isValid = _userRepo.ValidateUser(request.Email, request.MatKhau, out int role, out Guid userid, out string hoten);

            if (!isValid)
            {
                return Unauthorized(ResultRepository<object>.Fail("Sai email, mật khẩu hoặc tài khoản bị khóa!"));
            }

            // 2. Nếu đúng, tạo Token
            string tokenString =  _tokenGen.GenerateToken(userid, request.Email, role, hoten);
            // string token = _tokenGen.GenerateToken(request.Username, "Candidate");

            var responseData = new { 
                token = tokenString,
                userid = userid,
                role = role,
                HoTen = hoten
            };
            return Ok(ResultRepository<object>.Ok(responseData, "Đăng nhập thành công!"));
        }
        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            // 1. Kiểm tra đầu vào cơ bản (Validation)
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.MatKhau))
            {
                return BadRequest(ResultRepository<object>.Fail("Email và mật khẩu không được để trống!"));
            }

            // 2. Gọi Repo để xử lý logic (Kiểm tra trùng Email + Insert)
            // Giả sử hàm RegisterUser trả về bool và thông báo (out message)
            bool isSuccess = _userRepo.RegisterUser(request.HoTen, request.Email, request.MatKhau, request.SoDienThoai, out string message);

            if (!isSuccess)
            {
                // Trả về lỗi 400 (BadRequest) nếu email đã tồn tại hoặc lỗi hệ thống
                return BadRequest(ResultRepository<object>.Fail(message));
            }

            // 3. Trả về thành công
            return Ok(ResultRepository<object>.Ok(null, "Đăng ký tài khoản thành công!"));
        }

        [HttpGet("profile/{id}")]
        public IActionResult GetProfile(Guid id)
        {
            var user = _userRepo.GetUserById(id);
            if (user == null)
            {
                return NotFound(ResultRepository<object>.Fail("Không tìm thấy người dùng"));
            }
            return Ok(ResultRepository<object>.Ok(user, "Lấy thông tin thành công"));
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] ChangePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.OldPassword) || string.IsNullOrEmpty(request.NewPassword))
            {
                return BadRequest(ResultRepository<object>.Fail("Mật khẩu không được để trống!"));
            }

            bool isSuccess = _userRepo.ChangePassword(request.UserId, request.OldPassword, request.NewPassword, out string message);

            if (!isSuccess)
            {
                return BadRequest(ResultRepository<object>.Fail(message));
            }

            return Ok(ResultRepository<object>.Ok(null, message));
        }
    }
}

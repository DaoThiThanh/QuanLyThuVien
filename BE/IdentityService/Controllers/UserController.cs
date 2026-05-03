using IdentityService.Models;
using IdentityService.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IdentityService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserRepository _userRepo;

        public UserController(UserRepository userRepository)
        {
            _userRepo = userRepository;
        }

        // GET: api/User?role=1
        [HttpGet]
        public IActionResult GetAllUsers([FromQuery] int? role)
        {
            try
            {
                var users = _userRepo.GetAllUsers(role);
                return Ok(ResultRepository<object>.Ok(users, "Lấy danh sách người dùng thành công"));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ResultRepository<object>.Fail("Lỗi server: " + ex.Message));
            }
        }

        // PUT: api/User/{id}/role
        [HttpPut("{id}/role")]
        public IActionResult UpdateUserRole(Guid id, [FromBody] UpdateRoleRequest request)
        {
            if (request.NewRole < 1 || request.NewRole > 3)
            {
                return BadRequest(ResultRepository<object>.Fail("Vai trò không hợp lệ. (1: Admin, 2: Thủ thư, 3: Độc giả)"));
            }

            bool isSuccess = _userRepo.UpdateUserRole(id, request.NewRole, out string message);

            if (!isSuccess)
            {
                return BadRequest(ResultRepository<object>.Fail(message));
            }

            return Ok(ResultRepository<object>.Ok(null, message));
        }
    }

    public class UpdateRoleRequest
    {
        public int NewRole { get; set; }
    }
}

using Microsoft.Data.SqlClient;
using System.Data.SqlTypes;
using IdentityService.Models;
namespace IdentityService.Repositories
{
    public class UserRepository
    {
        private readonly string _connectionString;

        public UserRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }
        //ktra đăng nhập
        public bool ValidateUser(string email, string matkhau, out int role, out Guid userid, out string hoten)
        {
            bool isValid = false;
            role = 0;
            userid = Guid.Empty;
            hoten = "";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {

                string query = "SELECT Id, VaiTro, HoTen FROM NguoiDung WHERE Email = @Email AND MatKhau = @MatKhau  AND TrangThai = 1;";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@MatKhau", matkhau);
                conn.Open();
                using(SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        isValid = true;
                        userid = reader.GetGuid(reader.GetOrdinal("Id"));
                        role = reader.GetInt32(reader.GetOrdinal("VaiTro"));
                        hoten = reader["HoTen"].ToString() ?? "";
                    }
                }
            }
            return isValid;
        }

        // Lấy thông tin người dùng theo ID
        public object GetUserById(Guid id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT Id, HoTen, Email, SoDienThoai, VaiTro, TrangThai, NgayTao FROM NguoiDung WHERE Id = @Id";
                SqlCommand cmd = new SqlCommand(query, conn);
                cmd.Parameters.AddWithValue("@Id", id);
                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    if (reader.Read())
                    {
                        return new
                        {
                            Id = reader.GetGuid(0),
                            HoTen = reader.GetString(1),
                            Email = reader.GetString(2),
                            SoDienThoai = reader.IsDBNull(3) ? null : reader.GetString(3),
                            VaiTro = reader.GetInt32(4),
                            TrangThai = reader.GetInt32(5),
                            NgayTao = reader.GetDateTime(6)
                        };
                    }
                }
            }
            return null;
        }

        //Đăng ký
        public bool RegisterUser(string hoten,string email, string matkhau, string sodienthoai, out string message)
        {
            bool isSuccess = false;
            message = "";
            using(SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();
                // 1. Kiểm tra xem Email đã tồn tại trong hệ thống chưa
                string checkQuery = "SELECT COUNT(1) FROM NguoiDung WHERE Email = @Email";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@Email", email);
                    int count = (int)checkCmd.ExecuteScalar();

                    if (count > 0)
                    {
                        message = "Email này đã được sử dụng bởi một tài khoản khác.";
                        return false;
                    }
                }

                // 2. Nếu Email chưa tồn tại, tiến hành thêm mới (Insert)
                // Lưu ý: Tôi giả định Id là kiểu UNIQUEIDENTIFIER (Guid) và tự động tạo mới bằng NEWID()
                string insertQuery = @"INSERT INTO NguoiDung (Id, HoTen, Email, MatKhau, SoDienThoai, VaiTro, TrangThai) 
                               VALUES (NEWID(),@HoTen, @Email, @MatKhau, @SoDienThoai, 3, 1);";

                using (SqlCommand insertCmd = new SqlCommand(insertQuery, conn))
                {
                    insertCmd.Parameters.AddWithValue("@HoTen", hoten);
                    insertCmd.Parameters.AddWithValue("@Email", email);
                    insertCmd.Parameters.AddWithValue("@MatKhau", matkhau); // Nên mã hóa Hash mật khẩu trước khi truyền vào đây
                    insertCmd.Parameters.AddWithValue("@SoDienThoai", sodienthoai);
                    

                    int rowsAffected = insertCmd.ExecuteNonQuery();
                    if (rowsAffected > 0)
                    {
                        isSuccess = true;
                        message = "Đăng ký tài khoản thành công!";
                    }
                    else
                    {
                        message = "Đã xảy ra lỗi trong quá trình lưu dữ liệu.";
                    }
                }
            }

            return isSuccess;
        }

        // Lấy danh sách người dùng (hỗ trợ lọc theo VaiTro, phân trang và tìm kiếm)
        public async Task<PagedResult<object>> GetPagedUsersAsync(int page, int pageSize, int? role = null, string searchTerm = "")
        {
            var result = new PagedResult<object>
            {
                CurrentPage = page,
                PageSize = pageSize,
                Items = new List<object>()
            };

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                var whereClause = "WHERE (@SearchTerm = '' OR HoTen LIKE @SearchPattern OR Email LIKE @SearchPattern OR SoDienThoai LIKE @SearchPattern) ";
                if (role.HasValue)
                {
                    whereClause += "AND VaiTro = @Role ";
                }

                // 1. Count total
                var countQuery = $"SELECT COUNT(*) FROM NguoiDung {whereClause}";
                using (var countCmd = new SqlCommand(countQuery, conn))
                {
                    countCmd.Parameters.AddWithValue("@SearchTerm", searchTerm ?? "");
                    countCmd.Parameters.AddWithValue("@SearchPattern", $"%{(searchTerm ?? "")}%");
                    if (role.HasValue) countCmd.Parameters.AddWithValue("@Role", role.Value);
                    
                    result.TotalItems = Convert.ToInt32(await countCmd.ExecuteScalarAsync());
                }
                result.TotalPages = (int)Math.Ceiling(result.TotalItems / (double)pageSize);

                // 2. Get items
                var query = $@"
                    SELECT Id, HoTen, Email, SoDienThoai, VaiTro, TrangThai, NgayTao 
                    FROM NguoiDung
                    {whereClause}
                    ORDER BY NgayTao DESC
                    OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY";

                using (var cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Offset", (page - 1) * pageSize);
                    cmd.Parameters.AddWithValue("@PageSize", pageSize);
                    cmd.Parameters.AddWithValue("@SearchTerm", searchTerm ?? "");
                    cmd.Parameters.AddWithValue("@SearchPattern", $"%{(searchTerm ?? "")}%");
                    if (role.HasValue) cmd.Parameters.AddWithValue("@Role", role.Value);

                    using (SqlDataReader reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            result.Items.Add(new
                            {
                                Id = reader.GetGuid(0),
                                HoTen = reader.GetString(1),
                                Email = reader.GetString(2),
                                SoDienThoai = reader.IsDBNull(3) ? null : reader.GetString(3),
                                VaiTro = reader.GetInt32(4),
                                TrangThai = reader.GetInt32(5),
                                NgayTao = reader.GetDateTime(6)
                            });
                        }
                    }
                }
            }

            return result;
        }

        // Giữ lại GetAllUsers cho khả năng tương thích cũ (nếu cần)
        public object GetAllUsers(int? role = null)
        {
            var users = new List<object>();
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT Id, HoTen, Email, SoDienThoai, VaiTro, TrangThai, NgayTao FROM NguoiDung";
                if (role.HasValue)
                {
                    query += " WHERE VaiTro = @Role";
                }
                query += " ORDER BY NgayTao DESC";

                SqlCommand cmd = new SqlCommand(query, conn);
                if (role.HasValue)
                {
                    cmd.Parameters.AddWithValue("@Role", role.Value);
                }

                conn.Open();
                using (SqlDataReader reader = cmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        users.Add(new
                        {
                            Id = reader.GetGuid(0),
                            HoTen = reader.GetString(1),
                            Email = reader.GetString(2),
                            SoDienThoai = reader.IsDBNull(3) ? null : reader.GetString(3),
                            VaiTro = reader.GetInt32(4),
                            TrangThai = reader.GetInt32(5),
                            NgayTao = reader.GetDateTime(6)
                        });
                    }
                }
            }
            return users;
        }

        // Phân quyền người dùng (Cập nhật VaiTro)
        public bool UpdateUserRole(Guid id, int newRole, out string message)
        {
            bool isSuccess = false;
            message = "";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                string query = "UPDATE NguoiDung SET VaiTro = @VaiTro WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@VaiTro", newRole);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = cmd.ExecuteNonQuery();
                    if (rowsAffected > 0)
                    {
                        isSuccess = true;
                        message = "Cập nhật phân quyền thành công!";
                    }
                    else
                    {
                        message = "Không tìm thấy người dùng hoặc cập nhật thất bại.";
                    }
                }
            }
            return isSuccess;
        }

        // Cập nhật trạng thái người dùng (Khóa/Mở khóa)
        public async Task<(bool, string)> UpdateUserStatusAsync(Guid id, int status)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                await conn.OpenAsync();

                string query = "UPDATE NguoiDung SET TrangThai = @TrangThai WHERE Id = @Id";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@TrangThai", status);
                    cmd.Parameters.AddWithValue("@Id", id);

                    int rowsAffected = await cmd.ExecuteNonQueryAsync();
                    if (rowsAffected > 0)
                    {
                        string message = status == 1 ? "Đã mở khóa tài khoản thành công!" : "Đã khóa tài khoản thành công!";
                        return (true, message);
                    }
                    else
                    {
                        return (false, "Không tìm thấy người dùng hoặc cập nhật thất bại.");
                    }
                }
            }
        }

        // Đổi mật khẩu
        public bool ChangePassword(Guid userId, string oldPassword, string newPassword, out string message)
        {
            message = "";
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                conn.Open();

                // Kiểm tra mật khẩu cũ
                string checkQuery = "SELECT COUNT(1) FROM NguoiDung WHERE Id = @Id AND MatKhau = @OldPassword";
                using (SqlCommand checkCmd = new SqlCommand(checkQuery, conn))
                {
                    checkCmd.Parameters.AddWithValue("@Id", userId);
                    checkCmd.Parameters.AddWithValue("@OldPassword", oldPassword);
                    int count = (int)checkCmd.ExecuteScalar();

                    if (count == 0)
                    {
                        message = "Mật khẩu hiện tại không chính xác.";
                        return false;
                    }
                }

                // Cập nhật mật khẩu mới
                string updateQuery = "UPDATE NguoiDung SET MatKhau = @NewPassword WHERE Id = @Id";
                using (SqlCommand updateCmd = new SqlCommand(updateQuery, conn))
                {
                    updateCmd.Parameters.AddWithValue("@NewPassword", newPassword);
                    updateCmd.Parameters.AddWithValue("@Id", userId);

                    int rowsAffected = updateCmd.ExecuteNonQuery();
                    if (rowsAffected > 0)
                    {
                        message = "Đổi mật khẩu thành công!";
                        return true;
                    }
                    else
                    {
                        message = "Có lỗi xảy ra khi cập nhật mật khẩu.";
                        return false;
                    }
                }
            }
        }
    }
}

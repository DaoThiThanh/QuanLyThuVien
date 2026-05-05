namespace QuanLyThuVien.Models.DTOs
{
    public class ThongKeAdminDto
    {
        public int TotalReaders { get; set; }
        public int TotalLibrarians { get; set; }
        public decimal TotalRevenue { get; set; }
        public int ActiveLoans { get; set; }
        public string SystemStatus { get; set; } = "Hoạt động";
    }
}

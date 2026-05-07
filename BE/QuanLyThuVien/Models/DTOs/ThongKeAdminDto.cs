using System.Collections.Generic;

namespace QuanLyThuVien.Models.DTOs
{
    public class ThongKeAdminDto
    {
        public int TotalReaders { get; set; }
        public int TotalLibrarians { get; set; }
        public decimal TotalRevenue { get; set; }
        public int ActiveLoans { get; set; }
        public string SystemStatus { get; set; } = "Hoạt động";
        public List<RecentActivityDto> RecentActivities { get; set; } = new List<RecentActivityDto>();
    }

    public class RecentActivityDto
    {
        public string User { get; set; }
        public string Action { get; set; }
        public string Time { get; set; }
        public string Type { get; set; } // 'approve', 'user', 'warning', 'system'
    }
}

using System;

namespace QuanLyThuVien.Models.DTOs
{
    public class UpsertSachDto
    {
        public string TenSach { get; set; } = string.Empty;
        public string? HinhAnh { get; set; }
        public int SoLuongTon { get; set; }
        public Guid DanhMucId { get; set; }
        public Guid TacGiaId { get; set; }
        public Guid NxbId { get; set; }
        public int NamXuatBan { get; set; }
        public string? MoTa { get; set; }
        public string? Isbn { get; set; }
    }
}

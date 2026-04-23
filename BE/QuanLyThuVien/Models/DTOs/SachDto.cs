using System;

namespace QuanLyThuVien.Models.DTOs
{
    public class SachDto
    {
        public Guid Id { get; set; }
        public string TenSach { get; set; } = string.Empty;
        public string? HinhAnh { get; set; }
        public int SoLuongTon { get; set; }
        public string TenDanhMuc { get; set; } = string.Empty;
        public string TenTacGia { get; set; } = string.Empty;
    }
}

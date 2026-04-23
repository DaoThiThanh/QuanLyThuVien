using System;

namespace QuanLyThuVien.Models.DTOs
{
    public class SachNoiBatDto
    {
        public Guid Id { get; set; }
        public string TenSach { get; set; } = string.Empty;
        public string? HinhAnh { get; set; }
        public int SoLuongTon { get; set; }
        public int SoLuotMuon { get; set; }
    }
}

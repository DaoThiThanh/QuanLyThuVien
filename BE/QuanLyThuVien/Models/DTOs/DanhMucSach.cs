using System;

namespace QuanLyThuVien.Models.DTOs
{
    public class DanhMucSach
    {
        public Guid Id { get; set; }
        public string TenDanhMuc { get; set; } = string.Empty;
        public string icon { get; set; } = string.Empty;
    }
}

using System;
using System.Collections.Generic;

namespace QuanLyThuVien.Models.DTOs
{
    public class YeuCauMuonDto
    {
        public Guid Id { get; set; }
        public Guid DocGiaId { get; set; }
        public string TenDocGia { get; set; }
        public DateTime NgayYeuCau { get; set; }
        public DateTime? NgayHenNhan { get; set; }
        public int TrangThai { get; set; }
        public List<Guid> DauSachIds { get; set; } = new List<Guid>();
    }

    public class CreateYeuCauMuonRequest
    {
        public Guid DocGiaId { get; set; }
        public DateTime? NgayHenNhan { get; set; }
        public List<Guid> DauSachIds { get; set; }
    }
}

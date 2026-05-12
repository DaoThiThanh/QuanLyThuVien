using System;

namespace QuanLyThuVien.Models
{
    public class ThamSoQuyDinh
    {
        public Guid Id { get; set; }
        public int SoSachMuonToiDa { get; set; }
        public int SoNgayMuonToiDa { get; set; }
        public decimal PhiPhatTreHanMoiNgay { get; set; }
        public decimal PhiPhatHongNhe { get; set; }
        public decimal PhiPhatHongNang { get; set; }
        public decimal PhiPhatMatSach { get; set; }
        public DateTime NgayCapNhat { get; set; }
    }
}

namespace QuanLyThuVien.Models.DTOs
{
    public class ChiTietPhieuMuonDto
    {
        public Guid Id { get; set; }
        public Guid CuonSachId { get; set; }
        public string TenSach { get; set; }
        public string MaVach { get; set; }
        public DateTime? NgayTraThucTe { get; set; }
        public string TinhTrangKhiTra { get; set; }
        public decimal TienPhat { get; set; }
    }
}

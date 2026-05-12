namespace QuanLyThuVien.Models.DTOs
{
    public class PhieuMuonDto
    {
        public Guid Id { get; set; }
        public Guid DocGiaId { get; set; }
        public string TenDocGia { get; set; }
        public Guid? ThuThuId { get; set; }
        public string? TenThuThu { get; set; }
        public int KenhMuon { get; set; }
        public DateTime NgayMuon { get; set; }
        public DateTime HanTra { get; set; }
        public int TrangThai { get; set; }
        public string? TenSach { get; set; }
        public List<ChiTietPhieuMuonDto> ChiTiet { get; set; } = new List<ChiTietPhieuMuonDto>();
    }
}

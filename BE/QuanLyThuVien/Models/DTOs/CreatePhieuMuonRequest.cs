namespace QuanLyThuVien.Models.DTOs
{
    public class CreatePhieuMuonRequest
    {
        public Guid DocGiaId { get; set; }
        public Guid? ThuThuId { get; set; }
        public int KenhMuon { get; set; } = 1;
        public DateTime HanTra { get; set; }
        public List<Guid> CuonSachIds { get; set; } = new List<Guid>();
    }
}

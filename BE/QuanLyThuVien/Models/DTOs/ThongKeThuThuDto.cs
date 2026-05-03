namespace QuanLyThuVien.Models.DTOs
{
    public class ThongKeThuThuDto
    {
        public int BooksBorrowed { get; set; }
        public int BooksOverdue { get; set; }
        public int PendingRequests { get; set; }
        public int TotalBooks { get; set; }
    }
}

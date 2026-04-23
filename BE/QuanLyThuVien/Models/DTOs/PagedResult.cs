using System.Collections.Generic;

namespace QuanLyThuVien.Models.DTOs
{
    public class PagedResult<T>
    {
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public IEnumerable<T> Items { get; set; } = new List<T>();
    }
}

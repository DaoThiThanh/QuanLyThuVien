using QuanLyThuVien.Models;

namespace QuanLyThuVien.Repositories
{
    public interface IQuyDinhRepository
    {
        Task<ThamSoQuyDinh> GetQuyDinhAsync();
        Task<bool> UpdateQuyDinhAsync(ThamSoQuyDinh quyDinh);
    }
}

CREATE DATABASE QuanLyThuVien;
GO
USE QuanLyThuVien;
GO

-- ==========================================
-- NHÓM 1: CẤU HÌNH & NGƯỜI DÙNG
-- ==========================================

-- 1. Bảng Tham số (Lưu quy định để dễ thay đổi mà không cần sửa code)
CREATE TABLE ThamSoQuyDinh (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    SoSachMuonToiDa INT NOT NULL DEFAULT 5,
    SoNgayMuonToiDa INT NOT NULL DEFAULT 14,
    PhiPhatTreHanMoiNgay DECIMAL(10, 2) NOT NULL DEFAULT 5000,
    NgayCapNhat DATETIME DEFAULT GETDATE()
);

-- 2. Bảng Người dùng
CREATE TABLE NguoiDung (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    HoTen NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    MatKhau VARCHAR(255) NOT NULL,
    SoDienThoai VARCHAR(15),
    VaiTro INT NOT NULL, -- 1: Admin, 2: Thủ thư, 3: Độc giả
    TrangThai INT NOT NULL DEFAULT 1, -- 1: Hoạt động, 0: Khóa
    NgayTao DATETIME DEFAULT GETDATE()
);

-- ==========================================
-- NHÓM 2: QUẢN LÝ ĐẦU SÁCH & KHO SÁCH
-- ==========================================

-- 3. Tác giả
CREATE TABLE TacGia (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    TenTacGia NVARCHAR(100) NOT NULL,
    TieuSu NVARCHAR(MAX)
);

-- 4. Nhà xuất bản
CREATE TABLE NhaXuatBan (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    TenNXB NVARCHAR(100) NOT NULL
);

-- 5. Danh mục
CREATE TABLE DanhMucSach (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    TenDanhMuc NVARCHAR(100) NOT NULL
);

-- 6. Đầu sách (Thông tin chung - Title)
CREATE TABLE DauSach (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    TenSach NVARCHAR(255) NOT NULL,
    DanhMucId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES DanhMucSach(Id),
    TacGiaId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES TacGia(Id),
    NxbId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES NhaXuatBan(Id),
    NamXuatBan INT,
    HinhAnh VARCHAR(255),
    SoLuongTon INT DEFAULT 0
);

-- 7. Cuốn sách (Thực thể vật lý - Copy)
CREATE TABLE CuonSach (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    DauSachId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES DauSach(Id),
    MaVach VARCHAR(50) UNIQUE NOT NULL, -- Quét mã này để mượn/trả
    TinhTrangVatLy NVARCHAR(100) NOT NULL, -- Mới, Cũ, Hỏng
    TrangThaiMuon INT NOT NULL DEFAULT 1 -- 1: Sẵn sàng, 2: Đang mượn, 3: Đã mất
);

-- ==========================================
-- NHÓM 3: MƯỢN TRẢ ONLINE & TRỰC TIẾP (CÁCH 1)
-- ==========================================

-- 8. Yêu cầu mượn (Dành cho đăng ký ONLINE trên web)
CREATE TABLE YeuCauMuon (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    DocGiaId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES NguoiDung(Id),
    NgayYeuCau DATETIME DEFAULT GETDATE(),
    NgayHenNhan DATE,
    TrangThai INT DEFAULT 0 -- 0: Chờ duyệt, 1: Đã duyệt, 2: Đã hủy
);

-- 9. Chi tiết yêu cầu (Độc giả đăng ký mượn đầu sách nào)
CREATE TABLE ChiTietYeuCau (
    YeuCauId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES YeuCauMuon(Id),
    DauSachId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES DauSach(Id),
    PRIMARY KEY (YeuCauId, DauSachId)
);

-- 10. Phiếu mượn (Bảng trung tâm quản lý giao dịch)
CREATE TABLE PhieuMuon (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    DocGiaId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES NguoiDung(Id),
    ThuThuId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES NguoiDung(Id),
    YeuCauId UNIQUEIDENTIFIER NULL FOREIGN KEY REFERENCES YeuCauMuon(Id), -- NULL nế mượn tại quầy
    KenhMuon INT DEFAULT 1, -- 1: Tại quầy (Direct), 2: Online (Web)
    NgayMuon DATETIME DEFAULT GETDATE(),
    HanTra DATE NOT NULL,
    TrangThai INT DEFAULT 1 -- 1: Đang mượn, 2: Hoàn thành, 3: Quá hạn
);

-- 11. Chi tiết phiếu mượn (Ghi nhận Cuốn sách cụ thể nào được lấy đi)
CREATE TABLE ChiTietPhieuMuon (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    PhieuMuonId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES PhieuMuon(Id),
    CuonSachId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES CuonSach(Id),
    NgayTraThucTe DATETIME NULL,
    TinhTrangKhiTra NVARCHAR(255),
    TienPhat DECIMAL(10, 2) DEFAULT 0
);

-- 12. Phiếu thu tiền phạt
CREATE TABLE PhieuThuPhat (
    Id UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
    DocGiaId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES NguoiDung(Id),
    PhieuMuonId UNIQUEIDENTIFIER FOREIGN KEY REFERENCES PhieuMuon(Id),
    SoTienThu DECIMAL(10, 2) NOT NULL,
    NgayThu DATETIME DEFAULT GETDATE(),
    NoiDung NVARCHAR(255)
);
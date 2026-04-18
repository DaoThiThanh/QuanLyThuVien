USE QuanLyThuVien;
GO

-- ==========================================
-- 1. BẢNG THAM SỐ QUY ĐỊNH
-- ==========================================
INSERT INTO ThamSoQuyDinh (SoSachMuonToiDa, SoNgayMuonToiDa, PhiPhatTreHanMoiNgay, NgayCapNhat)
VALUES 
(3, 7, 2000, '2023-01-01'),
(4, 10, 3000, '2023-06-01'),
(5, 14, 5000, GETDATE());
GO

-- ==========================================
-- 2. BẢNG NGƯỜI DÙNG (Tự động sinh NEWID)
-- ==========================================
INSERT INTO NguoiDung (HoTen, Email, MatKhau, SoDienThoai, VaiTro, TrangThai)
VALUES 
(N'Trần Quản Trị', 'admin@thuvien.com', '123456', '0901111111', 1, 1),
(N'Nguyễn Thị Thu', 'thuthu@thuvien.com', '123456', '0902222222', 2, 1),
(N'Lê Độc Giả Một', 'docgia1@gmail.com', '123456', '0903333333', 3, 1),
(N'Phạm Độc Giả Hai', 'docgia2@gmail.com', '123456', '0904444444', 3, 1),
(N'Hoàng Độc Giả Ba', 'docgia3@gmail.com', '123456', '0905555555', 3, 0);
GO

-- ==========================================
-- 3. BẢNG TÁC GIẢ
-- ==========================================
INSERT INTO TacGia (TenTacGia, TieuSu)
VALUES 
(N'Nam Cao', N'Nhà văn hiện thực xuất sắc của Việt Nam'),
(N'Vũ Trọng Phụng', N'Ông vua phóng sự đất Bắc'),
(N'Ngô Tất Tố', N'Nhà văn, nhà báo, học giả hàng đầu'),
(N'Nguyễn Nhật Ánh', N'Nhà văn chuyên viết cho tuổi thơ');
GO

-- ==========================================
-- 4. BẢNG NHÀ XUẤT BẢN
-- ==========================================
INSERT INTO NhaXuatBan (TenNXB)
VALUES 
(N'NXB Trẻ'), (N'NXB Kim Đồng'), (N'NXB Văn Học'), (N'NXB Hội Nhà Văn');
GO

-- ==========================================
-- 5. BẢNG DANH MỤC SÁCH
-- ==========================================
INSERT INTO DanhMucSach (TenDanhMuc)
VALUES 
(N'Văn học Việt Nam'), (N'Tiểu thuyết'), (N'Truyện ngắn'), (N'Truyện thiếu nhi');
GO

-- ==========================================
-- 6. BẢNG ĐẦU SÁCH (Dùng Sub-query để móc nối Khóa ngoại tự động)
-- ==========================================
INSERT INTO DauSach (TenSach, DanhMucId, TacGiaId, NxbId, NamXuatBan, SoLuongTon)
VALUES 
(N'Chí Phèo', 
    (SELECT TOP 1 Id FROM DanhMucSach WHERE TenDanhMuc = N'Truyện ngắn'), 
    (SELECT TOP 1 Id FROM TacGia WHERE TenTacGia = N'Nam Cao'), 
    (SELECT TOP 1 Id FROM NhaXuatBan WHERE TenNXB = N'NXB Văn Học'), 2015, 2),
(N'Số Đỏ', 
    (SELECT TOP 1 Id FROM DanhMucSach WHERE TenDanhMuc = N'Tiểu thuyết'), 
    (SELECT TOP 1 Id FROM TacGia WHERE TenTacGia = N'Vũ Trọng Phụng'), 
    (SELECT TOP 1 Id FROM NhaXuatBan WHERE TenNXB = N'NXB Văn Học'), 2018, 1),
(N'Tắt Đèn', 
    (SELECT TOP 1 Id FROM DanhMucSach WHERE TenDanhMuc = N'Tiểu thuyết'), 
    (SELECT TOP 1 Id FROM TacGia WHERE TenTacGia = N'Ngô Tất Tố'), 
    (SELECT TOP 1 Id FROM NhaXuatBan WHERE TenNXB = N'NXB Hội Nhà Văn'), 2020, 1),
(N'Kính Vạn Hoa', 
    (SELECT TOP 1 Id FROM DanhMucSach WHERE TenDanhMuc = N'Truyện thiếu nhi'), 
    (SELECT TOP 1 Id FROM TacGia WHERE TenTacGia = N'Nguyễn Nhật Ánh'), 
    (SELECT TOP 1 Id FROM NhaXuatBan WHERE TenNXB = N'NXB Kim Đồng'), 2022, 1);
GO

-- ==========================================
-- 7. BẢNG CUỐN SÁCH (Bản vật lý)
-- ==========================================
INSERT INTO CuonSach (DauSachId, MaVach, TinhTrangVatLy, TrangThaiMuon)
VALUES 
((SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Chí Phèo'), 'CP-001', N'Mới', 2),
((SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Chí Phèo'), 'CP-002', N'Bình thường', 1),
((SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Số Đỏ'), 'SD-001', N'Cũ', 2),
((SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Tắt Đèn'), 'TD-001', N'Mới', 1),
((SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Kính Vạn Hoa'), 'KVH-001', N'Rách bìa', 3);
GO

-- ==========================================
-- 8 & 9. BẢNG YÊU CẦU MƯỢN & CHI TIẾT
-- Dùng DECLARE @Id để đảm bảo cha - con link đúng ID với nhau
-- ==========================================
DECLARE @YeuCau1 UNIQUEIDENTIFIER = NEWID();
DECLARE @YeuCau2 UNIQUEIDENTIFIER = NEWID();
DECLARE @YeuCau3 UNIQUEIDENTIFIER = NEWID();

-- Thêm Yêu cầu mượn
INSERT INTO YeuCauMuon (Id, DocGiaId, NgayYeuCau, NgayHenNhan, TrangThai) VALUES 
(@YeuCau1, (SELECT TOP 1 Id FROM NguoiDung WHERE Email = 'docgia1@gmail.com'), '2023-10-01', '2023-10-03', 1),
(@YeuCau2, (SELECT TOP 1 Id FROM NguoiDung WHERE Email = 'docgia2@gmail.com'), '2023-10-05', '2023-10-07', 0),
(@YeuCau3, (SELECT TOP 1 Id FROM NguoiDung WHERE Email = 'docgia1@gmail.com'), '2023-10-10', '2023-10-12', 2);

-- Thêm Chi tiết yêu cầu
INSERT INTO ChiTietYeuCau (YeuCauId, DauSachId) VALUES 
(@YeuCau1, (SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Chí Phèo')),
(@YeuCau1, (SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Số Đỏ')),
(@YeuCau2, (SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Tắt Đèn')),
(@YeuCau3, (SELECT TOP 1 Id FROM DauSach WHERE TenSach = N'Kính Vạn Hoa'));
GO

-- ==========================================
-- 10, 11 & 12. PHIẾU MƯỢN, CHI TIẾT & PHIẾU THU PHẠT
-- ==========================================
DECLARE @PhieuMuon1 UNIQUEIDENTIFIER = NEWID();
DECLARE @PhieuMuon2 UNIQUEIDENTIFIER = NEWID();
DECLARE @PhieuMuon3 UNIQUEIDENTIFIER = NEWID();

DECLARE @ThuThuId UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM NguoiDung WHERE Email = 'thuthu@thuvien.com');
DECLARE @DocGia1 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM NguoiDung WHERE Email = 'docgia1@gmail.com');
DECLARE @DocGia2 UNIQUEIDENTIFIER = (SELECT TOP 1 Id FROM NguoiDung WHERE Email = 'docgia2@gmail.com');

-- 10. Thêm Phiếu mượn
INSERT INTO PhieuMuon (Id, DocGiaId, ThuThuId, KenhMuon, NgayMuon, HanTra, TrangThai) VALUES 
(@PhieuMuon1, @DocGia1, @ThuThuId, 2, '2023-10-03', '2023-10-17', 1), -- Đang mượn
(@PhieuMuon2, @DocGia2, @ThuThuId, 1, '2023-09-01', '2023-09-15', 2), -- Đã hoàn thành
(@PhieuMuon3, @DocGia1, @ThuThuId, 1, '2023-08-01', '2023-08-15', 3); -- Quá hạn

-- 11. Thêm Chi tiết phiếu mượn
INSERT INTO ChiTietPhieuMuon (PhieuMuonId, CuonSachId, NgayTraThucTe, TinhTrangKhiTra, TienPhat) VALUES 
(@PhieuMuon1, (SELECT TOP 1 Id FROM CuonSach WHERE MaVach = 'CP-001'), NULL, NULL, 0),
(@PhieuMuon1, (SELECT TOP 1 Id FROM CuonSach WHERE MaVach = 'SD-001'), NULL, NULL, 0),
(@PhieuMuon2, (SELECT TOP 1 Id FROM CuonSach WHERE MaVach = 'CP-002'), '2023-09-10', N'Bình thường', 0),
(@PhieuMuon3, (SELECT TOP 1 Id FROM CuonSach WHERE MaVach = 'KVH-001'), '2023-08-20', N'Đã mất', 50000);

-- 12. Thêm Phiếu thu phạt (Dành cho Phiếu 2 và Phiếu 3 ở trên)
INSERT INTO PhieuThuPhat (DocGiaId, PhieuMuonId, SoTienThu, NgayThu, NoiDung) VALUES 
(@DocGia1, @PhieuMuon3, 50000, '2023-08-20', N'Phạt làm mất sách Kính Vạn Hoa (Mã: KVH-001)'),
(@DocGia2, @PhieuMuon2, 10000, '2023-09-10', N'Phạt làm rách trang sách (Thu thêm)'),
(@DocGia1, @PhieuMuon3, 25000, '2023-08-20', N'Phạt trả trễ hạn 5 ngày');
GO
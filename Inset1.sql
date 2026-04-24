USE QuanLyThuVien;
GO

-- ==========================================
-- 1. BỔ SUNG THÊM TÁC GIẢ CHUYÊN NGÀNH
-- ==========================================
INSERT INTO TacGia (TenTacGia, TieuSu)
VALUES 
(N'Martin Fowler', N'Chuyên gia về kiến trúc phần mềm và Refactoring'),
(N'Thomas H. Cormen', N'Tác giả chính của bộ giáo trình Thuật toán kinh điển CLRS'),
(N'Benjamin Graham', N'Cha đẻ của đầu tư giá trị'),
(N'Ray Dalio', N'Tỷ phú, nhà sáng lập Bridgewater Associates'),
(N'Jared Diamond', N'Nhà khoa học và tác giả đạt giải Pulitzer'),
(N'Gilbert Strang', N'Giáo sư Toán học nổi tiếng tại MIT'),
(N'Neil deGrasse Tyson', N'Nhà vật lý thiên văn truyền cảm hứng'),
(N'Daniel Kahneman', N'Chủ nhân giải Nobel Kinh tế');
GO

-- ==========================================
-- 2. CHÈN 20 ĐẦU SÁCH CHUYÊN NGÀNH (LINK ẢNH THỰC TẾ)
-- ==========================================
INSERT INTO DauSach (TenSach, DanhMucId, TacGiaId, NxbId, NamXuatBan, HinhAnh, SoLuongTon)
VALUES 
-- Nhóm Công nghệ thông tin (5 cuốn)
(N'The Pragmatic Programmer', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Công nghệ thông tin'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Robert C. Martin'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Bách Khoa Hà Nội'), 2021, 'https://images.nxbxaydung.com.vn/Picture/2020/cong-nghe-thong-tin-1109144546.jpg', 10),
(N'Introduction to Algorithms', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Công nghệ thông tin'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Thomas H. Cormen'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Giáo dục Việt Nam'), 2018, 'https://cdn.hstatic.net/products/200000122283/_nh_s_n_ph_m_f580c63e2cb14b648a29762a0caa3c72_grande.png', 5),
(N'Refactoring', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Công nghệ thông tin'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Martin Fowler'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Bách Khoa Hà Nội'), 2019, 'https://vista.gov.vn/vn-uploads/science-technology/2023_10/biakhcn2022.png', 8),
(N'Design Patterns', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Công nghệ thông tin'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Robert C. Martin'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Đại học Quốc gia'), 2020, 'https://thuquan.ou.edu.vn/cover//2021/02/22/CNTT-TLHT-I14-Lap-trinh-web-30122020-xin-gpxb-eb-01.jpg', 6),
(N'Code Complete', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Công nghệ thông tin'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Robert C. Martin'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Bách Khoa Hà Nội'), 2017, 'https://cdn0166.cdn4s.com/media/nxb%20dhsp/1-giao-trinh-lap-trinh-python_1.jpg', 4),

-- Nhóm Kinh tế & Tài chính (5 cuốn)
(N'Nhà Đầu Tư Thông Minh', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Kinh tế & Quản trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Benjamin Graham'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Trẻ'), 2022, 'https://cdn1.fahasa.com/media/catalog/product/9/7/9786326031430.jpg', 15),
(N'Nguyên tắc (Principles)', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Kinh tế & Quản trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Ray Dalio'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Trẻ'), 2021, 'https://hevobooks.com/wp-content/uploads/2022/01/Bia-Gt-KT-va-quan-tri-KD-Duoc_bia_1-scaled.jpg', 12),
(N'Tư Duy Nhanh và Chậm', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Kinh tế & Quản trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Daniel Kahneman'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Thế Giới'), 2020, 'https://product.hstatic.net/200000692705/product/logistics_17f3b4e16be547afa9371c99b72eafd1.jpg', 9),
(N'Chiến Lược Đại Dương Xanh', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Kinh tế & Quản trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Philip Kotler'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Đại học Quốc gia'), 2019, 'https://sachweb.com/Upload/sach/giaotrinhquantritacnghiep.jpg', 7),
(N'Zero to One', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Kinh tế & Quản trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Ray Dalio'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Trẻ'), 2018, '', 11),

-- Nhóm Khoa học & Toán học (5 cuốn)
(N'Đại số tuyến tính', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Khoa học tự nhiên'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Gilbert Strang'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Đại học Quốc gia'), 2021, 'https://salt.tikicdn.com/cache/750x750/ts/product/f9/30/56/d5b0fa7172288b41c706e549f827bf68.jpg.webp', 25),
(N'Vật lý đại cương', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Khoa học tự nhiên'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Stephen Hawking'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Bách Khoa Hà Nội'), 2019, 'https://nhathuocngocanh.com/wp-content/uploads/2024/11/hoa-hoc-dai-cuong.jpg', 20),
(N'Giải tích I & II', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Khoa học tự nhiên'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Gilbert Strang'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Giáo dục Việt Nam'), 2020, 'https://bizweb.dktcdn.net/thumb/1024x1024/100/362/945/products/0ad0b6f825adf010b368529a380b1c9f-1751278461392.jpg?v=1752343568313', 30),
(N'Nguồn gốc các loài', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Khoa học tự nhiên'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Stephen Hawking'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Thế Giới'), 2022, 'https://downloadsachyhoc.com/wp-content/uploads/2023/08/hoa-sinh-y-ha-noi-2020.jpg', 5),
(N'Vật lý thiên văn cho người vội vã', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Khoa học tự nhiên'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Neil deGrasse Tyson'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Trẻ'), 2020, 'https://minhkhai.com.vn/hinhlon/109973.jpg', 13),

-- Nhóm Lịch sử & Xã hội (5 cuốn)
(N'Súng, Vi trùng và Thép', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Lịch sử & Chính trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Jared Diamond'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Thế Giới'), 2018, 'https://www.netabooks.vn/Data/Sites/1/Product/76511/lich-su-viet-nam-truyen-thong-va-hien-dai.jpg', 6),
(N'Lược sử loài người (Graphic)', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Lịch sử & Chính trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Yuval Noah Harari'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Thế Giới'), 2021, 'https://cdn.luatminhkhue.vn/lmk/article/Sach-luat/Giao-trinh-kinh-te-chinh-tri-Mac-Lenin.jpg', 10),
(N'Lịch sử văn minh thế giới', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Lịch sử & Chính trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Yuval Noah Harari'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Giáo dục Việt Nam'), 2017, 'https://cdn.luatminhkhue.vn/lmk/article/Sach-luat/Giao-trinh-Lich-su-Dang-cong-san-Viet-Nam.jpg', 4),
(N'Chính trị luận', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Lịch sử & Chính trị'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Adam Smith'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Chính trị Quốc gia Sự thật'), 2020, 'https://hoc247.net/fckeditorimg/upload/images/2019-05-11_104122.png?enablejsapi=1', 3),
(N'Tâm lý học đám đông', (SELECT Id FROM DanhMucSach WHERE TenDanhMuc = N'Tâm lý học & Giáo dục'), (SELECT Id FROM TacGia WHERE TenTacGia = N'Daniel Kahneman'), (SELECT Id FROM NhaXuatBan WHERE TenNXB = N'NXB Thế Giới'), 2019, 'https://cdn.luatminhkhue.vn/lmk/article/Sach-luat/Giao-trinh-Triet-hoc-Mac-Lenin.jpg', 11);
GO

-- ==========================================
-- 3. TẠO CUỐN SÁCH VẬT LÝ TƯƠNG ỨNG
-- (Tự động tạo mỗi đầu sách 2 bản sao để sinh viên mượn)
-- ==========================================
INSERT INTO CuonSach (DauSachId, MaVach, TinhTrangVatLy, TrangThaiMuon)
SELECT Id, 'BK-' + LEFT(CAST(Id AS VARCHAR(36)), 4) + '-A', N'Mới', 1 FROM DauSach WHERE TenSach NOT IN (N'Chí Phèo', N'Số Đỏ', N'Tắt Đèn', N'Kính Vạn Hoa', N'Clean Code - Mã Sạch');
INSERT INTO CuonSach (DauSachId, MaVach, TinhTrangVatLy, TrangThaiMuon)
SELECT Id, 'BK-' + LEFT(CAST(Id AS VARCHAR(36)), 4) + '-B', N'Bình thường', 1 FROM DauSach WHERE TenSach NOT IN (N'Chí Phèo', N'Số Đỏ', N'Tắt Đèn', N'Kính Vạn Hoa', N'Clean Code - Mã Sạch');
GO
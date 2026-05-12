-- ==========================================
-- MIGRATION: Thêm các cột phí phạt vào ThamSoQuyDinh
-- Chạy script này nếu CSDL của bạn đã được tạo từ QuanLyThuVien.sql
-- mà chưa có các cột PhiPhatHongNhe, PhiPhatHongNang, PhiPhatMatSach
-- ==========================================
USE QuanLyThuVien;
GO

-- Kiểm tra và thêm cột PhiPhatHongNhe nếu chưa có
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'ThamSoQuyDinh' AND COLUMN_NAME = 'PhiPhatHongNhe'
)
BEGIN
    ALTER TABLE ThamSoQuyDinh ADD PhiPhatHongNhe DECIMAL(10, 2) NOT NULL DEFAULT 20000;
    PRINT 'Đã thêm cột PhiPhatHongNhe';
END
ELSE
    PRINT 'Cột PhiPhatHongNhe đã tồn tại';

-- Kiểm tra và thêm cột PhiPhatHongNang nếu chưa có
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'ThamSoQuyDinh' AND COLUMN_NAME = 'PhiPhatHongNang'
)
BEGIN
    ALTER TABLE ThamSoQuyDinh ADD PhiPhatHongNang DECIMAL(10, 2) NOT NULL DEFAULT 50000;
    PRINT 'Đã thêm cột PhiPhatHongNang';
END
ELSE
    PRINT 'Cột PhiPhatHongNang đã tồn tại';

-- Kiểm tra và thêm cột PhiPhatMatSach nếu chưa có
IF NOT EXISTS (
    SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'ThamSoQuyDinh' AND COLUMN_NAME = 'PhiPhatMatSach'
)
BEGIN
    ALTER TABLE ThamSoQuyDinh ADD PhiPhatMatSach DECIMAL(10, 2) NOT NULL DEFAULT 100000;
    PRINT 'Đã thêm cột PhiPhatMatSach';
END
ELSE
    PRINT 'Cột PhiPhatMatSach đã tồn tại';

GO
PRINT 'Migration hoàn thành!';

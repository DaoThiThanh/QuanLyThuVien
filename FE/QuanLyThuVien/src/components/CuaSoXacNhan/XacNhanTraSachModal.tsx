
import React, { useState } from 'react';
import styles from './XacNhanTraSachModal.module.css';
import { ReturnBook } from '../../dichVu/modules/dichVuMuonSach';

interface XacNhanTraSachModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    phieuMuon: any;
}

const XacNhanTraSachModal: React.FC<XacNhanTraSachModalProps> = ({ isOpen, onClose, onSuccess, phieuMuon }) => {
    const [tinhTrang, setTinhTrang] = useState('Bình thường');
    const [loading, setLoading] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<string>('');

    if (!isOpen || !phieuMuon) return null;

    // Lọc những sách chưa trả trong phiếu
    const unreturnedBooks = phieuMuon.chiTiet?.filter((ct: any) => !ct.ngayTraThucTe) || [];

    const handleReturn = async () => {
        if (!selectedBookId && unreturnedBooks.length > 1) {
            alert('Vui lòng chọn cuốn sách cần trả');
            return;
        }

        const bookId = selectedBookId || unreturnedBooks[0]?.cuonSachId;
        if (!bookId) return;

        setLoading(true);
        try {
            await ReturnBook({
                phieuMuonId: phieuMuon.id,
                cuonSachId: bookId,
                tinhTrang: tinhTrang
            });
            alert('Xử lý trả sách thành công!');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xử lý trả sách'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles['modal-overlay']}>
            <div className={styles['modal-content']}>
                <div className={styles['modal-header']}>
                    <h2>Xác Nhận Trả Sách</h2>
                    <button className={styles['close-btn']} onClick={onClose}>&times;</button>
                </div>
                
                <div className={styles['modal-body']}>
                    <div className={styles['loan-info']}>
                        <p><strong>Mã phiếu:</strong> #{phieuMuon.id.substring(0, 8)}</p>
                        <p><strong>Độc giả:</strong> {phieuMuon.tenDocGia}</p>
                        <p><strong>Hạn trả:</strong> {new Date(phieuMuon.hanTra).toLocaleDateString('vi-VN')}</p>
                    </div>

                    <div className={styles['form-group']}>
                        <label>Chọn sách trả:</label>
                        <select 
                            className={styles['form-control']} 
                            value={selectedBookId} 
                            onChange={(e) => setSelectedBookId(e.target.value)}
                        >
                            <option value="">-- Chọn cuốn sách --</option>
                            {unreturnedBooks.map((ct: any) => (
                                <option key={ct.cuonSachId} value={ct.cuonSachId}>
                                    {ct.tenSach} ({ct.maVach})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles['form-group']}>
                        <label>Tình trạng sách khi trả:</label>
                        <select 
                            className={styles['form-control']} 
                            value={tinhTrang} 
                            onChange={(e) => setTinhTrang(e.target.value)}
                        >
                            <option value="Bình thường">Bình thường</option>
                            <option value="Cũ/Trầy xước">Cũ/Trầy xước</option>
                            <option value="Hỏng nhẹ">Hỏng nhẹ (Rách trang...)</option>
                            <option value="Hỏng nặng">Hỏng nặng</option>
                            <option value="Mất">Mất sách</option>
                        </select>
                    </div>

                    {new Date() > new Date(phieuMuon.hanTra) && (
                        <div className={styles['warning-box']}>
                            <p>⚠️ <strong>Sách quá hạn!</strong></p>
                            <p>Hệ thống sẽ tự động tính phí phạt dựa trên số ngày trễ.</p>
                        </div>
                    )}
                </div>

                <div className={styles['modal-footer']}>
                    <button className={styles['btn-secondary']} onClick={onClose}>Hủy</button>
                    <button 
                        className={styles['btn-primary']} 
                        onClick={handleReturn}
                        disabled={loading || unreturnedBooks.length === 0}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận trả'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default XacNhanTraSachModal;

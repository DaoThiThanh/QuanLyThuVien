
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
    const allBooks = phieuMuon.chiTiet || [];
    const unreturnedBooks = allBooks.filter((ct: any) => !ct.ngayTraThucTe);

    const handleReturn = async (returnAll: boolean = false) => {
        if (!returnAll && !selectedBookId && unreturnedBooks.length > 1) {
            alert('Vui lòng chọn cuốn sách cần trả');
            return;
        }

        const booksToReturn = returnAll ? unreturnedBooks : [unreturnedBooks.find((b: any) => b.cuonSachId === selectedBookId) || unreturnedBooks[0]];
        
        if (booksToReturn.length === 0) return;

        setLoading(true);
        try {
            for (const book of booksToReturn) {
                await ReturnBook({
                    phieuMuonId: phieuMuon.id,
                    cuonSachId: book.cuonSachId,
                    tinhTrang: tinhTrang
                });
            }
            alert(returnAll ? 'Đã trả tất cả sách trong phiếu!' : 'Xử lý trả sách thành công!');
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
            <div className={styles['modal-content']} style={{ maxWidth: '600px' }}>
                <div className={styles['modal-header']}>
                    <div>
                        <h2 style={{ margin: 0 }}>Xử lý Trả sách</h2>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Độc giả: <strong>{phieuMuon.tenDocGia}</strong></p>
                    </div>
                    <button className={styles['close-btn']} onClick={onClose}>&times;</button>
                </div>
                
                <div className={styles['modal-body']}>
                    <div className={styles['loan-info']} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
                        <div>
                            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Mã phiếu</span>
                            <strong style={{ fontSize: '14px' }}>#{phieuMuon.id.substring(0, 8)}</strong>
                        </div>
                        <div>
                            <span style={{ fontSize: '12px', color: '#64748b', display: 'block' }}>Hạn trả</span>
                            <strong style={{ fontSize: '14px', color: new Date() > new Date(phieuMuon.hanTra) ? '#ef4444' : '#1e293b' }}>
                                {new Date(phieuMuon.hanTra).toLocaleDateString('vi-VN')}
                            </strong>
                        </div>
                    </div>

                    <div className={styles['form-group']}>
                        <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Danh sách sách trong phiếu ({allBooks.length}):</label>
                        <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '5px' }}>
                            {allBooks.map((ct: any) => {
                                const isReturned = !!ct.ngayTraThucTe;
                                return (
                                    <div 
                                        key={ct.cuonSachId} 
                                        style={{ 
                                            padding: '10px 12px', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            background: isReturned ? '#f1f5f9' : (selectedBookId === ct.cuonSachId ? '#eff6ff' : 'white'),
                                            cursor: isReturned ? 'default' : 'pointer',
                                            borderRadius: '6px',
                                            marginBottom: '4px',
                                            border: selectedBookId === ct.cuonSachId ? '1px solid #3b82f6' : '1px solid transparent',
                                            opacity: isReturned ? 0.7 : 1
                                        }}
                                        onClick={() => !isReturned && setSelectedBookId(ct.cuonSachId)}
                                    >
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: isReturned ? '#64748b' : '#1e293b' }}>
                                                {ct.tenSach}
                                            </span>
                                            <small style={{ color: '#94a3b8' }}>Mã vạch: {ct.maVach}</small>
                                        </div>
                                        <div>
                                            {isReturned ? (
                                                <span style={{ fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                                                    ĐÃ TRẢ
                                                </span>
                                            ) : (
                                                <span style={{ fontSize: '11px', background: '#fee2e2', color: '#ef4444', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                                                    CHƯA TRẢ
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {!unreturnedBooks.length ? (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#10b981', fontWeight: '600' }}>
                            ✅ Tất cả sách đã được hoàn trả!
                        </div>
                    ) : (
                        <div className={styles['form-group']} style={{ marginTop: '15px' }}>
                            <label style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>Tình trạng khi trả:</label>
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
                    )}

                    {unreturnedBooks.length > 0 && new Date() > new Date(phieuMuon.hanTra) && (
                        <div style={{ marginTop: '15px', padding: '12px', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#b91c1c' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700', fontSize: '14px' }}>
                                <span>⚠️ CẢNH BÁO QUÁ HẠN</span>
                            </div>
                            <p style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
                                Độc giả trả trễ hạn. Hệ thống sẽ ghi nhận và tính phí phạt theo quy định.
                            </p>
                        </div>
                    )}
                </div>

                <div className={styles['modal-footer']} style={{ display: 'flex', gap: '10px' }}>
                    <button className={styles['btn-secondary']} onClick={onClose} style={{ flex: 1 }}>Đóng</button>
                    {unreturnedBooks.length > 1 && (
                        <button 
                            className={styles['btn-primary']} 
                            style={{ background: '#6366f1', flex: 1 }}
                            onClick={() => handleReturn(true)}
                            disabled={loading}
                        >
                            Trả tất cả
                        </button>
                    )}
                    {unreturnedBooks.length > 0 && (
                        <button 
                            className={styles['btn-primary']} 
                            style={{ flex: 1.5 }}
                            onClick={() => handleReturn(false)}
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Xác nhận trả'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default XacNhanTraSachModal;

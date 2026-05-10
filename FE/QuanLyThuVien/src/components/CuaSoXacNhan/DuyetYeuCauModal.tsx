
import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheck, FiBook } from 'react-icons/fi';
import styles from './DuyetYeuCauModal.module.css';
import { GetAvailableCopies, GetCuonSachByBarcode } from '../../dichVu/modules/dichVuSach';
import { CreatePhieuMuon, CheckBorrowingLimit } from '../../dichVu/modules/dichVuMuonSach';
import { getUserId } from '../../dichVu/modules/dichVuXacThuc';

interface DuyetYeuCauModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    yeuCau: any; // DTO YeuCauMuon
}

interface PhysicalAssignment {
    dauSachId: string;
    tenSach: string;
    cuonSachId: string | null;
    maVach: string | null;
    availableCount: number;
    availableCopies: any[];
}

const DuyetYeuCauModal: React.FC<DuyetYeuCauModalProps> = ({ isOpen, onClose, onSuccess, yeuCau }) => {
    const [assignments, setAssignments] = useState<PhysicalAssignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [borrowLimit, setBorrowLimit] = useState<any>(null);
    const [barcodeInputs, setBarcodeInputs] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if (isOpen && yeuCau && yeuCau.dauSachIds) {
            const fetchStatus = async () => {
                // Kiểm tra hạn mức & quá hạn
                const limit = await CheckBorrowingLimit(yeuCau.docGiaId);
                setBorrowLimit(limit);

                const initialAssignments = await Promise.all(yeuCau.dauSachIds.map(async (id: string, index: number) => {
                    const copies = await GetAvailableCopies(id);
                    return {
                        dauSachId: id,
                        tenSach: yeuCau.tenCacSach[index],
                        cuonSachId: null, // Bắt buộc quét thủ công
                        maVach: null,
                        availableCount: copies.length,
                        availableCopies: copies
                    };
                }));
                setAssignments(initialAssignments);
            };
            fetchStatus();
        }
    }, [isOpen, yeuCau]);

    const handleBarcodeSearch = async (index: number) => {
        const barcode = barcodeInputs[index];
        if (!barcode) return;

        try {
            const copy = await GetCuonSachByBarcode(barcode);
            if (copy) {
                // Kiểm tra xem cuốn sách này có thuộc đầu sách đang cần không
                const assignment = assignments[index];
                
                if (copy.dauSachId.toLowerCase() !== yeuCau.dauSachIds[index].toLowerCase()) {
                    alert(`Mã vạch này thuộc sách '${copy.tenSach}', không phải '${assignment.tenSach}'. Vui lòng quét đúng sách.`);
                    return;
                }

                if (copy.trangThaiMuon !== 1) {
                    alert('Cuốn sách này hiện không sẵn sàng để mượn (Đang mượn hoặc Đã mất).');
                    return;
                }

                const newAssignments = [...assignments];
                newAssignments[index].cuonSachId = copy.id;
                newAssignments[index].maVach = copy.maVach;
                setAssignments(newAssignments);
                
                // Clear input after successful scan
                setBarcodeInputs({...barcodeInputs, [index]: ''});
            }
        } catch (error) {
            alert('Không tìm thấy mã vạch này trong hệ thống.');
        }
    };

    const handleConfirm = async () => {
        const thuThuId = getUserId();
        if (!thuThuId) return;

        const allAssigned = assignments.every(a => a.cuonSachId);
        if (!allAssigned) {
            alert('Vui lòng quét mã vạch cho tất cả các cuốn sách trước khi bàn giao.');
            return;
        }

        setLoading(true);
        try {
            await CreatePhieuMuon({
                docGiaId: yeuCau.docGiaId,
                thuThuId: thuThuId,
                kenhMuon: 2, // Online
                hanTra: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                cuonSachIds: assignments.map(a => a.cuonSachId),
                yeuCauId: yeuCau.id
            });
            
            alert('Đã tạo phiếu mượn và bàn giao sách thành công!');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Lỗi: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>Bàn giao sách vật lý</h2>
                    <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.readerInfo}>
                        <div>
                            <span className={styles.infoLabel}>Độc giả</span>
                            <span className={styles.infoValue}>{yeuCau.tenDocGia}</span>
                        </div>
                        <div>
                            <span className={styles.infoLabel}>Email</span>
                            <span className={styles.infoValue}>{yeuCau.email}</span>
                        </div>
                    </div>

                    {borrowLimit?.hasOverdue && (
                        <div style={{ padding: '12px', background: '#fff1f2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '20px', color: '#b91c1c' }}>
                            <div style={{ fontWeight: '700', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span>⚠️ KHÔNG THỂ BÀN GIAO SÁCH</span>
                            </div>
                            <p style={{ fontSize: '12px', margin: '5px 0 0 0' }}>
                                Độc giả này đang có sách quá hạn chưa trả. Theo quy định, hệ thống đã tạm khóa chức năng mượn mới.
                            </p>
                        </div>
                    )}

                    <h3 style={{fontSize: '15px', marginBottom: '12px', color: '#64748b', fontWeight: '600'}}>QUÉT MÃ VẠCH SÁCH ĐỂ CẤP</h3>
                    
                    <div className={styles.bookList}>
                        {assignments.map((assignment, index) => (
                            <div key={index} className={styles.bookRow}>
                                <div className={styles.bookHeader}>
                                    <div style={{color: '#3b82f6'}}><FiBook size={24} /></div>
                                    <div className={styles.bookTitle}>{assignment.tenSach}</div>
                                </div>

                                <div className={styles.assignmentArea}>
                                    <div className={styles.searchGroup}>
                                        <input 
                                            type="text" 
                                            className={styles.inputField} 
                                            placeholder="Quét mã vạch cuốn sách này..." 
                                            value={barcodeInputs[index] || ''}
                                            onChange={(e) => setBarcodeInputs({...barcodeInputs, [index]: e.target.value})}
                                            onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch(index)}
                                            autoFocus={index === assignments.findIndex(a => !a.cuonSachId)}
                                        />
                                        <button className={styles.scanBtn} onClick={() => handleBarcodeSearch(index)}>
                                            <FiSearch /> Gán mã
                                        </button>
                                    </div>

                                    {assignment.cuonSachId ? (
                                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '14px', fontWeight: '700', background: '#f0fdf4', padding: '8px', borderRadius: '6px', marginTop: '8px'}}>
                                            <FiCheck /> Đã chọn cuốn: {assignment.maVach}
                                        </div>
                                    ) : (
                                        <div style={{marginTop: '12px'}}>
                                            <div style={{color: '#64748b', fontSize: '13px', fontStyle: 'italic', marginBottom: '8px'}}>
                                                (Hiện có {assignment.availableCount} bản sẵn sàng trong kho)
                                            </div>
                                            {assignment.availableCopies && assignment.availableCopies.length > 0 && (
                                                <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                                    {assignment.availableCopies.map((copy, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            onClick={() => {
                                                                setBarcodeInputs({...barcodeInputs, [index]: copy.maVach});
                                                            }}
                                                            style={{
                                                                background: '#f8fafc', 
                                                                padding: '6px 10px', 
                                                                borderRadius: '6px', 
                                                                fontSize: '13px', 
                                                                fontWeight: '600', 
                                                                color: '#3b82f6',
                                                                cursor: 'pointer',
                                                                border: '1px dashed #cbd5e1',
                                                                transition: 'all 0.2s'
                                                            }}
                                                            title="Nhấn để điền mã vạch này"
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = '#eff6ff';
                                                                e.currentTarget.style.borderColor = '#93c5fd';
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = '#f8fafc';
                                                                e.currentTarget.style.borderColor = '#cbd5e1';
                                                            }}
                                                        >
                                                            {copy.maVach}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.btnCancel} onClick={onClose}>Hủy</button>
                    <button 
                        className={styles.btnConfirm} 
                        onClick={handleConfirm}
                        disabled={loading || !assignments.every(a => a.cuonSachId) || borrowLimit?.hasOverdue}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận & Hoàn tất bàn giao'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuyetYeuCauModal;

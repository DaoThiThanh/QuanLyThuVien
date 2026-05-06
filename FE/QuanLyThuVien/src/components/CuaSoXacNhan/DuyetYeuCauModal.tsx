
import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiCheck, FiBook } from 'react-icons/fi';
import styles from './DuyetYeuCauModal.module.css';
import { GetAvailableCopies, GetCuonSachByBarcode } from '../../dichVu/modules/dichVuSach';
import { CreatePhieuMuon } from '../../dichVu/modules/dichVuMuonSach';
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
}

const DuyetYeuCauModal: React.FC<DuyetYeuCauModalProps> = ({ isOpen, onClose, onSuccess, yeuCau }) => {
    const [assignments, setAssignments] = useState<PhysicalAssignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [barcodeInputs, setBarcodeInputs] = useState<{[key: string]: string}>({});

    useEffect(() => {
        if (isOpen && yeuCau && yeuCau.dauSachIds) {
            const fetchStatus = async () => {
                const initialAssignments = await Promise.all(yeuCau.dauSachIds.map(async (id: string, index: number) => {
                    const copies = await GetAvailableCopies(id);
                    return {
                        dauSachId: id,
                        tenSach: yeuCau.tenCacSach[index],
                        cuonSachId: copies.length > 0 ? copies[0].id : null,
                        maVach: copies.length > 0 ? copies[0].maVach : null,
                        availableCount: copies.length
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
                // (Logic này cần khớp tên hoặc ID)
                const newAssignments = [...assignments];
                newAssignments[index].cuonSachId = copy.id;
                newAssignments[index].maVach = copy.maVach;
                setAssignments(newAssignments);
            }
        } catch (error) {
            alert('Không tìm thấy mã vạch này hoặc sách không sẵn sàng.');
        }
    };

    const handleConfirm = async () => {
        const thuThuId = getUserId();
        if (!thuThuId) return;

        const allAssigned = assignments.every(a => a.cuonSachId);
        if (!allAssigned) {
            alert('Vui lòng gán mã vạch cho tất cả các cuốn sách trước khi duyệt.');
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
            
            alert('Đã duyệt và tạo phiếu mượn thành công!');
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
                    <h2>Duyệt Yêu Cầu & Cấp Sách</h2>
                    <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.readerInfo}>
                        <div>
                            <span className={styles.infoLabel}>Độc giả</span>
                            <span className={styles.infoValue}>{yeuCau.tenDocGia}</span>
                        </div>
                        <div>
                            <span className={styles.infoLabel}>Ngày hẹn nhận</span>
                            <span className={styles.infoValue}>
                                {yeuCau.ngayHenNhan ? new Date(yeuCau.ngayHenNhan).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                        </div>
                    </div>

                    <h3 style={{fontSize: '15px', marginBottom: '12px', color: '#64748b'}}>DANH SÁCH SÁCH CẦN CẤP</h3>
                    
                    <div className={styles.bookList}>
                        {assignments.map((assignment, index) => (
                            <div key={index} className={styles.bookRow}>
                                <div className={styles.bookHeader}>
                                    <div style={{color: '#3b82f6'}}><FiBook size={24} /></div>
                                    <div className={styles.bookTitle}>{assignment.tenSach}</div>
                                </div>

                                <div className={styles.assignmentArea}>
                                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div style={{fontSize: '14px'}}>
                                            Trạng thái kho: 
                                            <span style={{ 
                                                marginLeft: '8px', 
                                                fontWeight: '700', 
                                                color: assignment.availableCount > 0 ? '#10b981' : '#ef4444' 
                                            }}>
                                                {assignment.availableCount > 0 ? `${assignment.availableCount} cuốn sẵn sàng` : 'Hết sách'}
                                            </span>
                                        </div>
                                        {assignment.cuonSachId && (
                                            <div style={{fontSize: '13px', color: '#64748b'}}>
                                                Sẽ cấp mã: <strong>{assignment.maVach}</strong>
                                            </div>
                                        )}
                                    </div>
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
                        disabled={loading || !assignments.every(a => a.cuonSachId)}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận & Tạo phiếu mượn'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DuyetYeuCauModal;

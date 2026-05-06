
import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiBook } from 'react-icons/fi';
import styles from './DuyetYeuCauModal.module.css';
import { GetAvailableCopies } from '../../dichVu/modules/dichVuSach';
import { DuyetYeuCauMuon, TuChoiYeuCauMuon } from '../../dichVu/modules/dichVuMuonSach';

interface KiemTraKhoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    yeuCau: any;
}

const KiemTraKhoModal: React.FC<KiemTraKhoModalProps> = ({ isOpen, onClose, onSuccess, yeuCau }) => {
    const [bookStatus, setBookStatus] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && yeuCau && yeuCau.dauSachIds) {
            const checkStock = async () => {
                setLoading(true);
                try {
                    const statuses = await Promise.all(yeuCau.dauSachIds.map(async (id: string, index: number) => {
                        const copies = await GetAvailableCopies(id);
                        return {
                            tenSach: yeuCau.tenCacSach[index],
                            availableCount: copies.length
                        };
                    }));
                    setBookStatus(statuses);
                } catch (error) {
                    console.error("Lỗi kiểm tra kho:", error);
                } finally {
                    setLoading(false);
                }
            };
            checkStock();
        }
    }, [isOpen, yeuCau]);

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            await DuyetYeuCauMuon(yeuCau.id);
            alert('Đã duyệt yêu cầu thành công!');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    const handleReject = async () => {
        if (!window.confirm('Bạn có chắc muốn từ chối yêu cầu này?')) return;
        setSubmitting(true);
        try {
            await TuChoiYeuCauMuon(yeuCau.id);
            alert('Đã từ chối yêu cầu.');
            onSuccess();
            onClose();
        } catch (error: any) {
            alert('Lỗi: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const allAvailable = bookStatus.every(s => s.availableCount > 0);

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{maxWidth: '600px'}}>
                <div className={styles.header}>
                    <h2>Kiểm tra tình trạng sách</h2>
                    <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.readerInfo} style={{gridTemplateColumns: '1fr'}}>
                        <div>
                            <span className={styles.infoLabel}>Độc giả yêu cầu mượn:</span>
                            <span className={styles.infoValue}>{yeuCau.tenDocGia} ({yeuCau.email})</span>
                        </div>
                    </div>

                    <div className={styles.bookList}>
                        {loading ? (
                            <div style={{textAlign: 'center', padding: '20px'}}>Đang kiểm tra kho...</div>
                        ) : (
                            bookStatus.map((status, index) => (
                                <div key={index} className={styles.bookRow} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                    <div style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                                        <FiBook color="#64748b" />
                                        <span style={{fontWeight: '500'}}>{status.tenSach}</span>
                                    </div>
                                    <div style={{display: 'flex', alignItems: 'center', gap: '6px'}}>
                                        {status.availableCount > 0 ? (
                                            <>
                                                <FiCheckCircle color="#10b981" />
                                                <span style={{color: '#10b981', fontSize: '14px', fontWeight: '600'}}>Còn {status.availableCount} bản</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiAlertCircle color="#ef4444" />
                                                <span style={{color: '#ef4444', fontSize: '14px', fontWeight: '600'}}>Hết sách</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {!loading && !allAvailable && (
                        <div style={{marginTop: '16px', padding: '12px', background: '#fff1f2', borderRadius: '8px', color: '#991b1b', fontSize: '14px', display: 'flex', gap: '8px'}}>
                            <FiAlertCircle size={18} />
                            <span>Có sách đã hết bản vật lý. Bạn nên từ chối hoặc yêu cầu độc giả đổi sách khác.</span>
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.btnCancel} onClick={handleReject} disabled={submitting} style={{background: '#fee2e2', color: '#991b1b', border: 'none'}}>
                        Từ chối yêu cầu
                    </button>
                    <button 
                        className={styles.btnConfirm} 
                        onClick={handleApprove}
                        disabled={loading || submitting || !allAvailable}
                    >
                        {submitting ? 'Đang xử lý...' : 'Duyệt yêu cầu'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KiemTraKhoModal;

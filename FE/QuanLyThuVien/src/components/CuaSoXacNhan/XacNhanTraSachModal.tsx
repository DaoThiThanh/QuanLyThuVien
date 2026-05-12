import React, { useState, useEffect } from 'react';
import styles from './XacNhanTraSachModal.module.css';
import { ReturnBook } from '../../dichVu/modules/dichVuMuonSach';
import { getQuyDinh, type ThamSoQuyDinhDto } from '../../dichVu/modules/dichVuQuyDinh';

// ───────────────────────────────────────────
// CONSTANTS
// ───────────────────────────────────────────
export type TinhTrangTra =
    | 'Bình thường'
    | 'Cũ/Trầy xước'
    | 'Hỏng nhẹ'
    | 'Hỏng nặng'
    | 'Mất';

const TINH_TRANG_OPTIONS: { value: TinhTrangTra; label: string; icon: string; key: keyof ThamSoQuyDinhDto | null }[] = [
    { value: 'Bình thường',   label: 'Bình thường',       icon: '✅', key: null },
    { value: 'Cũ/Trầy xước', label: 'Cũ / Trầy xước',   icon: '🟡', key: null },
    { value: 'Hỏng nhẹ',     label: 'Hỏng nhẹ',          icon: '🟠', key: 'phiPhatHongNhe' },
    { value: 'Hỏng nặng',    label: 'Hỏng nặng',         icon: '🔴', key: 'phiPhatHongNang' },
    { value: 'Mất',          label: 'Mất sách',           icon: '⛔', key: 'phiPhatMatSach' },
];

function calcFineForBook(
    book: any,
    tinhTrang: TinhTrangTra,
    phieuHanTra: string,
    quyDinh: ThamSoQuyDinhDto | null
): number {
    let fine = 0;

    // 1. Phí trễ hạn
    if (!book.ngayTraThucTe) {
        const today = new Date();
        const hanTra = new Date(phieuHanTra);
        if (today > hanTra) {
            const days = Math.ceil((today.getTime() - hanTra.getTime()) / (1000 * 60 * 60 * 24));
            fine += days * (quyDinh?.phiPhatTreHanMoiNgay ?? 5000);
        }
    }

    // 2. Phí hư hỏng / mất
    const opt = TINH_TRANG_OPTIONS.find(o => o.value === tinhTrang);
    if (opt?.key) {
        fine += (quyDinh?.[opt.key] as number) ?? 0;
    }

    return fine;
}

// ───────────────────────────────────────────
// PROPS
// ───────────────────────────────────────────
interface XacNhanTraSachModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    phieuMuon: any;
}

// ───────────────────────────────────────────
// COMPONENT
// ───────────────────────────────────────────
const XacNhanTraSachModal: React.FC<XacNhanTraSachModalProps> = ({ isOpen, onClose, onSuccess, phieuMuon }) => {
    const [tinhTrangMap, setTinhTrangMap] = useState<Record<string, TinhTrangTra>>({});
    const [loading, setLoading] = useState(false);
    const [quyDinh, setQuyDinh] = useState<ThamSoQuyDinhDto | null>(null);

    // Load quy định khi mở modal
    useEffect(() => {
        if (isOpen) {
            getQuyDinh().then(setQuyDinh);
        }
    }, [isOpen]);

    // Khởi tạo trạng thái mặc định cho tất cả sách chưa trả
    useEffect(() => {
        if (phieuMuon) {
            const initial: Record<string, TinhTrangTra> = {};
            (phieuMuon.chiTiet || []).forEach((ct: any) => {
                if (!ct.ngayTraThucTe) {
                    initial[ct.cuonSachId] = 'Bình thường';
                }
            });
            setTinhTrangMap(initial);
        }
    }, [phieuMuon]);

    if (!isOpen || !phieuMuon) return null;

    const allBooks: any[] = phieuMuon.chiTiet || [];
    const unreturnedBooks = allBooks.filter((ct: any) => !ct.ngayTraThucTe);
    const isOverdue = new Date() > new Date(phieuMuon.hanTra);
    const overdueDays = isOverdue
        ? Math.ceil((new Date().getTime() - new Date(phieuMuon.hanTra).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    // Tính phí phạt cho từng cuốn chưa trả
    const finePerBook: Record<string, number> = {};
    unreturnedBooks.forEach((ct: any) => {
        finePerBook[ct.cuonSachId] = calcFineForBook(ct, tinhTrangMap[ct.cuonSachId] ?? 'Bình thường', phieuMuon.hanTra, quyDinh);
    });
    const totalFine = Object.values(finePerBook).reduce((s, v) => s + v, 0);

    const handleSetTinhTrang = (cuonSachId: string, val: TinhTrangTra) => {
        setTinhTrangMap(prev => ({ ...prev, [cuonSachId]: val }));
    };

    const handleReturnAll = async () => {
        setLoading(true);
        try {
            for (const book of unreturnedBooks) {
                await ReturnBook({
                    phieuMuonId: phieuMuon.id,
                    cuonSachId: book.cuonSachId,
                    tinhTrang: tinhTrangMap[book.cuonSachId] ?? 'Bình thường',
                });
            }
            alert(`✅ Hoàn tất trả sách!\nTổng phí phạt: ${totalFine.toLocaleString('vi-VN')} đ`);
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
            <div className={styles['modal-content']} style={{ maxWidth: '700px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

                {/* ── HEADER ── */}
                <div className={styles['modal-header']}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px' }}>📋 Xử lý Trả Sách</h2>
                        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>
                            Độc giả: <strong>{phieuMuon.tenDocGia}</strong>
                        </p>
                    </div>
                    <button className={styles['close-btn']} onClick={onClose}>✕</button>
                </div>

                {/* ── BODY (scrollable) ── */}
                <div className={styles['modal-body']} style={{ overflowY: 'auto', flex: 1 }}>

                    {/* Thông tin phiếu */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                        <InfoCell label="Mã phiếu" value={`#${phieuMuon.id.substring(0, 8).toUpperCase()}`} />
                        <InfoCell
                            label="Hạn trả"
                            value={new Date(phieuMuon.hanTra).toLocaleDateString('vi-VN')}
                            color={isOverdue ? '#ef4444' : undefined}
                        />
                        <InfoCell
                            label={isOverdue ? `Trễ hạn (${overdueDays} ngày)` : 'Còn hạn'}
                            value={isOverdue ? `${(overdueDays * (quyDinh?.phiPhatTreHanMoiNgay ?? 5000)).toLocaleString('vi-VN')} đ/cuốn` : '—'}
                            color={isOverdue ? '#ef4444' : '#10b981'}
                        />
                    </div>

                    {/* Bảng quy định phí */}
                    {quyDinh && (
                        <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '10px', fontSize: '12px' }}>
                            <p style={{ margin: '0 0 8px', fontWeight: 700, color: '#92400e', fontSize: '13px' }}>📌 Biểu phí phạt áp dụng</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 16px', color: '#78350f' }}>
                                <span>⏱ Trễ hạn: <strong>{quyDinh.phiPhatTreHanMoiNgay.toLocaleString('vi-VN')} đ/ngày</strong></span>
                                <span>🟠 Hỏng nhẹ: <strong>{quyDinh.phiPhatHongNhe.toLocaleString('vi-VN')} đ</strong></span>
                                <span>🔴 Hỏng nặng: <strong>{quyDinh.phiPhatHongNang.toLocaleString('vi-VN')} đ</strong></span>
                                <span>⛔ Mất sách: <strong>{quyDinh.phiPhatMatSach.toLocaleString('vi-VN')} đ</strong></span>
                            </div>
                        </div>
                    )}

                    {/* Danh sách sách đã trả */}
                    {allBooks.filter((b: any) => b.ngayTraThucTe).length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
                                Đã trả ({allBooks.filter((b: any) => b.ngayTraThucTe).length})
                            </p>
                            {allBooks.filter((b: any) => b.ngayTraThucTe).map((ct: any) => (
                                <div key={ct.cuonSachId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '6px', opacity: 0.7 }}>
                                    <div>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{ct.tenSach}</span>
                                        <span style={{ fontSize: '11px', color: '#94a3b8', marginLeft: '8px' }}>Mã: {ct.maVach}</span>
                                    </div>
                                    <span style={{ fontSize: '11px', background: '#dcfce7', color: '#16a34a', padding: '2px 8px', borderRadius: '10px', fontWeight: 700 }}>ĐÃ TRẢ</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Danh sách sách chưa trả – chọn tình trạng từng cuốn */}
                    {unreturnedBooks.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#10b981', fontWeight: 700, background: '#f0fdf4', borderRadius: '12px', border: '1px solid #d1fae5' }}>
                            ✅ Tất cả sách trong phiếu đã được hoàn trả!
                        </div>
                    ) : (
                        <>
                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 10px' }}>
                                Chưa trả ({unreturnedBooks.length}) — Chọn tình trạng từng cuốn
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {unreturnedBooks.map((ct: any) => {
                                    const tinhTrang = tinhTrangMap[ct.cuonSachId] ?? 'Bình thường';
                                    const fine = finePerBook[ct.cuonSachId] ?? 0;
                                    const opt = TINH_TRANG_OPTIONS.find(o => o.value === tinhTrang)!;

                                    return (
                                        <div key={ct.cuonSachId} style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            background: fine > 0 ? '#fffbf0' : 'white',
                                            transition: 'all 0.2s',
                                        }}>
                                            {/* Book header */}
                                            <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                                <div>
                                                    <p style={{ margin: 0, fontWeight: 700, fontSize: '14px', color: '#1e293b' }}>{ct.tenSach}</p>
                                                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#94a3b8' }}>Mã vạch: {ct.maVach}</p>
                                                </div>
                                                <div style={{ textAlign: 'right' }}>
                                                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>Phí phạt</div>
                                                    <div style={{ fontSize: '18px', fontWeight: 800, color: fine > 0 ? '#e11d48' : '#10b981' }}>
                                                        {fine > 0 ? `${fine.toLocaleString('vi-VN')} đ` : 'Miễn phí'}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tình trạng selector */}
                                            <div style={{ padding: '12px 14px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                {TINH_TRANG_OPTIONS.map(o => {
                                                    const active = tinhTrang === o.value;
                                                    return (
                                                        <button
                                                            key={o.value}
                                                            onClick={() => handleSetTinhTrang(ct.cuonSachId, o.value)}
                                                            style={{
                                                                padding: '6px 12px',
                                                                borderRadius: '20px',
                                                                border: active ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                                background: active ? '#eff6ff' : 'white',
                                                                color: active ? '#1d4ed8' : '#475569',
                                                                fontWeight: active ? 700 : 500,
                                                                fontSize: '12px',
                                                                cursor: 'pointer',
                                                                transition: 'all 0.15s',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '4px',
                                                            }}
                                                        >
                                                            <span>{o.icon}</span>
                                                            <span>{o.label}</span>
                                                            {o.key && quyDinh && (
                                                                <span style={{ opacity: 0.7, fontSize: '10px' }}>
                                                                    +{((quyDinh[o.key] as number) ?? 0).toLocaleString('vi-VN')}đ
                                                                </span>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Breakdown phí */}
                                            {fine > 0 && (
                                                <div style={{ padding: '6px 14px 12px', fontSize: '12px', color: '#b45309' }}>
                                                    {isOverdue && (
                                                        <span>⏱ Trễ {overdueDays} ngày: <strong>{(overdueDays * (quyDinh?.phiPhatTreHanMoiNgay ?? 5000)).toLocaleString('vi-VN')} đ</strong></span>
                                                    )}
                                                    {opt.key && quyDinh && (
                                                        <span style={{ marginLeft: isOverdue ? '12px' : 0 }}>
                                                            {opt.icon} {opt.label}: <strong>{((quyDinh[opt.key] as number) ?? 0).toLocaleString('vi-VN')} đ</strong>
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>

                {/* ── FOOTER ── */}
                <div className={styles['modal-footer']} style={{ flexDirection: 'column', gap: '12px', alignItems: 'stretch' }}>
                    {/* Tổng phí */}
                    {unreturnedBooks.length > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: totalFine > 0 ? '#fff1f2' : '#f0fdf4', border: `1px solid ${totalFine > 0 ? '#fecaca' : '#d1fae5'}` }}>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: totalFine > 0 ? '#b91c1c' : '#065f46' }}>
                                {totalFine > 0 ? '💰 Tổng phí phạt phải thu:' : '✅ Không có phí phạt'}
                            </span>
                            {totalFine > 0 && (
                                <span style={{ fontSize: '22px', fontWeight: 800, color: '#e11d48' }}>
                                    {totalFine.toLocaleString('vi-VN')} đ
                                </span>
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className={styles['btn-secondary']} onClick={onClose} style={{ flex: 1 }}>
                            Đóng
                        </button>
                        {unreturnedBooks.length > 0 && (
                            <button
                                className={styles['btn-primary']}
                                onClick={handleReturnAll}
                                disabled={loading}
                                style={{ flex: 2 }}
                            >
                                {loading ? '⏳ Đang xử lý...' : `✅ Xác nhận trả ${unreturnedBooks.length} cuốn${totalFine > 0 ? ` · Thu ${totalFine.toLocaleString('vi-VN')} đ` : ''}`}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ───────────────────────────────────────────
// HELPER
// ───────────────────────────────────────────
function InfoCell({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: color ?? '#1e293b', marginTop: '2px' }}>{value}</div>
        </div>
    );
}

export default XacNhanTraSachModal;

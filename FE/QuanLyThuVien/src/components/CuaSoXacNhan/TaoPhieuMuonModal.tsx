
import React, { useState, useEffect } from 'react';
import { FiX, FiSearch, FiUser, FiBook, FiPlus, FiTrash2, FiCalendar, FiCheck } from 'react-icons/fi';
import styles from './DuyetYeuCauModal.module.css';
import { getAllUsers, type UserItem } from '../../dichVu/modules/dichVuNguoiDung';
import { GetDanhSachSach, GetCuonSachByBarcode } from '../../dichVu/modules/dichVuSach';
import { CreatePhieuMuon, CheckBorrowingLimit } from '../../dichVu/modules/dichVuMuonSach';
import { getUserId } from '../../dichVu/modules/dichVuXacThuc';

interface TaoPhieuMuonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface SelectedBook {
    id: string; // dauSachId
    tenSach: string;
    cuonSachId: string | null;
    maVach: string | null;
}

interface BorrowLimitStatus {
    currentCount: number;
    maxLimit: number;
    canBorrowMore: number;
    hasOverdue: boolean;
    currentBookIds: string[];
}

const TaoPhieuMuonModal: React.FC<TaoPhieuMuonModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [searchTermUser, setSearchTermUser] = useState('');
    const [searchTermBook, setSearchTermBook] = useState('');
    const [userResults, setUserResults] = useState<UserItem[]>([]);
    const [bookResults, setBookResults] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
    const [selectedBooks, setSelectedBooks] = useState<SelectedBook[]>([]);
    const [loading, setLoading] = useState(false);
    const [barcodeInputs, setBarcodeInputs] = useState<{[key: string]: string}>({});
    const [borrowLimit, setBorrowLimit] = useState<BorrowLimitStatus | null>(null);
    const [searchingUser, setSearchingUser] = useState(false);
    const [searchingBook, setSearchingBook] = useState(false);

    // Search Users
    useEffect(() => {
        if (searchTermUser.length >= 1) {
            setSearchingUser(true);
            const delayDebounceFn = setTimeout(async () => {
                try {
                    const users = await getAllUsers(3); // Role Độc giả
                    const filtered = (users || []).filter(u => 
                        u.hoTen.toLowerCase().includes(searchTermUser.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchTermUser.toLowerCase())
                    );
                    setUserResults(filtered.slice(0, 5));
                } finally {
                    setSearchingUser(false);
                }
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setUserResults([]);
            setSearchingUser(false);
        }
    }, [searchTermUser]);

    // Search Books
    useEffect(() => {
        if (searchTermBook.length >= 1) {
            setSearchingBook(true);
            const delayDebounceFn = setTimeout(async () => {
                try {
                    const booksData = await GetDanhSachSach(1, 50); // Lấy nhiều hơn để lọc chính xác
                    const filtered = (booksData?.items || []).filter((b: any) => 
                        b.tenSach.toLowerCase().includes(searchTermBook.toLowerCase())
                    );
                    setBookResults(filtered.slice(0, 5));
                } finally {
                    setSearchingBook(false);
                }
            }, 300);
            return () => clearTimeout(delayDebounceFn);
        } else {
            setBookResults([]);
            setSearchingBook(false);
        }
    }, [searchTermBook]);

    const handleAddBook = (book: any) => {
        if (borrowLimit?.hasOverdue) {
            alert('Độc giả đang nợ sách quá hạn. Phải trả hết sách quá hạn mới có thể mượn tiếp.');
            return;
        }
        if (borrowLimit && borrowLimit.canBorrowMore <= selectedBooks.length) {
            alert(`Độc giả này chỉ có thể mượn thêm tối đa ${borrowLimit.canBorrowMore} cuốn theo quy định.`);
            return;
        }
        if (selectedBooks.length >= 5) {
            alert('Mỗi phiếu mượn tối đa 5 cuốn sách.');
            return;
        }
        if (book.soLuongTon <= 0) {
            alert(`Sách "${book.tenSach}" đã hết trong kho. Không thể cho mượn.`);
            return;
        }
        if (borrowLimit && borrowLimit.currentBookIds.includes(book.id)) {
            alert(`Độc giả đang mượn cuốn sách "${book.tenSach}" và chưa trả. Không thể mượn thêm cùng một đầu sách.`);
            return;
        }
        if (selectedBooks.find(b => b.id === book.id)) {
            alert('Sách này đã có trong danh sách chọn.');
            return;
        }
        setSelectedBooks([...selectedBooks, {
            id: book.id,
            tenSach: book.tenSach,
            cuonSachId: null,
            maVach: null
        }]);
        setSearchTermBook('');
        setBookResults([]);
    };

    const handleRemoveBook = (id: string) => {
        setSelectedBooks(selectedBooks.filter(b => b.id !== id));
    };

    const handleBarcodeSearch = async (index: number) => {
        const barcode = barcodeInputs[index];
        if (!barcode) return;

        try {
            const copy = await GetCuonSachByBarcode(barcode);
            if (copy) {
                if (copy.dauSachId.toLowerCase() !== selectedBooks[index].id.toLowerCase()) {
                    alert(`Sách này không đúng tiêu đề. Vui lòng kiểm tra lại.`);
                    return;
                }
                if (copy.trangThaiMuon !== 1) {
                    alert('Cuốn sách này hiện không sẵn sàng.');
                    return;
                }

                const newBooks = [...selectedBooks];
                newBooks[index].cuonSachId = copy.id;
                newBooks[index].maVach = copy.maVach;
                setSelectedBooks(newBooks);
                setBarcodeInputs({...barcodeInputs, [index]: ''});
            }
        } catch (error) {
            alert('Mã vạch không hợp lệ hoặc không tồn tại.');
        }
    };

    const handleConfirm = async () => {
        const thuThuId = getUserId();
        if (!thuThuId || !selectedUser || selectedBooks.length === 0) return;

        const allAssigned = selectedBooks.every(b => b.cuonSachId);
        if (!allAssigned) {
            alert('Vui lòng quét mã vạch cho tất cả sách.');
            return;
        }

        setLoading(true);
        try {
            await CreatePhieuMuon({
                docGiaId: selectedUser.id,
                thuThuId: thuThuId,
                kenhMuon: 1, // Offline
                hanTra: new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                cuonSachIds: selectedBooks.map(b => b.cuonSachId)
            });
            alert('Tạo phiếu mượn thành công!');
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
            <div className={styles.modal} style={{maxWidth: '850px'}}>
                <div className={styles.header}>
                    <h2>Lập phiếu mượn tại chỗ (Offline)</h2>
                    <button className={styles.closeBtn} onClick={onClose}><FiX size={20} /></button>
                </div>

                <div className={styles.content}>
                    {/* Step 1: Select User */}
                    <div className={styles.readerInfo} style={{gridTemplateColumns: '1fr', background: '#f0f9ff', border: '1px solid #bae6fd'}}>
                        {!selectedUser ? (
                            <div className={styles.searchGroup} style={{margin: 0}}>
                                <div style={{position: 'relative', width: '100%'}}>
                                    <div style={{display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px'}}>
                                        <FiSearch color="#64748b" />
                                        <input 
                                            type="text" 
                                            className={styles.inputField} 
                                            placeholder="Tìm độc giả theo tên hoặc email..." 
                                            style={{border: 'none'}}
                                            value={searchTermUser}
                                            onChange={(e) => setSearchTermUser(e.target.value)}
                                        />
                                    </div>
                                    {(searchingUser || (searchTermUser.length >= 1 && userResults.length === 0)) && (
                                        <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', zIndex: 100, padding: '12px', textAlign: 'center', fontSize: '13px', color: '#64748b'}}>
                                            {searchingUser ? 'Đang tìm kiếm...' : 'Không tìm thấy độc giả nào'}
                                        </div>
                                    )}
                                    {userResults.length > 0 && (
                                        <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', zIndex: 100, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'}}>
                                            {userResults.map(u => (
                                                <div 
                                                    key={u.id} 
                                                    style={{padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px'}}
                                                    onClick={async () => { 
                                                        setSelectedUser(u); 
                                                        setUserResults([]); 
                                                        setSearchTermUser('');
                                                        const limit = await CheckBorrowingLimit(u.id);
                                                        setBorrowLimit(limit);
                                                    }}
                                                    onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                                >
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px' }}>
                                                        {u.hoTen.charAt(0)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                                                            {u.hoTen}
                                                            {u.trangThai !== 1 && <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px' }}>ĐÃ KHÓA</span>}
                                                        </div>
                                                        <div style={{fontSize: '12px', color: '#64748b'}}>{u.email}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '18px', boxShadow: '0 4px 10px rgba(59, 130, 246, 0.3)' }}>
                                        {selectedUser.hoTen.charAt(0)}
                                    </div>
                                    <div>
                                        <div className={styles.infoValue} style={{color: '#0369a1', fontSize: '16px'}}>{selectedUser.hoTen}</div>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <span className={styles.infoLabel} style={{ marginBottom: 0 }}>{selectedUser.email}</span>
                                            {borrowLimit && (
                                                <div style={{ fontSize: '12px', marginTop: '10px', padding: '10px', background: borrowLimit.hasOverdue ? '#fff1f2' : '#f0f9ff', borderRadius: '8px', border: borrowLimit.hasOverdue ? '1px solid #fecaca' : '1px solid #bae6fd' }}>
                                                    <div style={{ color: borrowLimit.hasOverdue ? '#b91c1c' : '#0369a1', fontWeight: '700', marginBottom: '5px' }}>
                                                        {borrowLimit.hasOverdue ? '⚠️ CẢNH BÁO: NỢ SÁCH QUÁ HẠN' : 'THÔNG TIN HẠN MỨC'}
                                                    </div>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', textAlign: 'center' }}>
                                                        <div style={{ background: 'white', padding: '5px', borderRadius: '4px' }}>
                                                            <div style={{ color: '#64748b', fontSize: '10px' }}>ĐANG GIỮ*</div>
                                                            <div style={{ fontWeight: '700', fontSize: '14px' }}>{borrowLimit.currentCount}</div>
                                                        </div>
                                                        <div style={{ background: 'white', padding: '5px', borderRadius: '4px' }}>
                                                            <div style={{ color: '#64748b', fontSize: '10px' }}>TỐI ĐA</div>
                                                            <div style={{ fontWeight: '700', fontSize: '14px' }}>{borrowLimit.maxLimit}</div>
                                                        </div>
                                                        <div style={{ background: (borrowLimit.canBorrowMore > 0 && !borrowLimit.hasOverdue) ? '#dcfce7' : '#fee2e2', padding: '5px', borderRadius: '4px' }}>
                                                            <div style={{ color: (borrowLimit.canBorrowMore > 0 && !borrowLimit.hasOverdue) ? '#059669' : '#b91c1c', fontSize: '10px' }}>CÒN LẠI</div>
                                                            <div style={{ fontWeight: '700', fontSize: '14px', color: (borrowLimit.canBorrowMore > 0 && !borrowLimit.hasOverdue) ? '#059669' : '#b91c1c' }}>
                                                                {borrowLimit.hasOverdue ? 0 : borrowLimit.canBorrowMore}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '5px', fontStyle: 'italic' }}>
                                                        *Đang giữ bao gồm cả các yêu cầu đang chờ/đã duyệt online.
                                                    </div>
                                                    {borrowLimit.hasOverdue && (
                                                        <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '8px', fontWeight: '600', textAlign: 'center' }}>
                                                            Tài khoản bị tạm khóa do có sách quá hạn.
                                                        </div>
                                                    )}
                                                    {!borrowLimit.hasOverdue && borrowLimit.canBorrowMore <= 0 && (
                                                        <div style={{ color: '#ef4444', fontSize: '11px', marginTop: '8px', fontWeight: '600', textAlign: 'center' }}>
                                                            ⚠️ Đã đạt giới hạn mượn. Cần trả sách trước khi mượn mới.
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => { setSelectedUser(null); setBorrowLimit(null); }}
                                    style={{background: '#f1f5f9', border: 'none', color: '#64748b', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600'}}
                                >
                                    Đổi độc giả
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Step 2: Select Books */}
                    <div style={{marginBottom: '20px'}}>
                        <h3 style={{fontSize: '15px', fontWeight: '700', marginBottom: '12px', color: '#1e293b'}}>CHỌN SÁCH MƯỢN</h3>
                        <div className={styles.searchGroup}>
                            <div style={{position: 'relative', width: '100%'}}>
                                <div style={{display: 'flex', alignItems: 'center', background: 'white', borderRadius: '8px', border: '1px solid #cbd5e1', padding: '0 12px'}}>
                                    <FiBook color="#64748b" />
                                    <input 
                                        type="text" 
                                        className={styles.inputField} 
                                        placeholder="Tìm tên sách..." 
                                        style={{border: 'none'}}
                                        value={searchTermBook}
                                        onChange={(e) => setSearchTermBook(e.target.value)}
                                    />
                                </div>
                                {(searchingBook || (searchTermBook.length >= 1 && bookResults.length === 0)) && (
                                    <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', zIndex: 100, padding: '12px', textAlign: 'center', fontSize: '13px', color: '#64748b'}}>
                                        {searchingBook ? 'Đang tìm kiếm...' : 'Không tìm thấy sách nào'}
                                    </div>
                                )}
                                {bookResults.length > 0 && (
                                    <div style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '0 0 8px 8px', zIndex: 100, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)'}}>
                                        {bookResults.map(b => (
                                            <div 
                                                key={b.id} 
                                                style={{padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}
                                                onClick={() => handleAddBook(b)}
                                                onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                                                onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                                            >
                                                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                                    <div style={{ width: '40px', height: '56px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <img src={b.hinhAnh || 'https://via.placeholder.com/40x56?text=Book'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{fontWeight: '700', fontSize: '14px', color: '#1e293b'}}>{b.tenSach}</div>
                                                        <div style={{fontSize: '12px', color: '#64748b'}}>{b.tenTacGia} • {b.tenDanhMuc}</div>
                                                        <div style={{ fontSize: '11px', marginTop: '2px', color: b.soLuongTon > 0 ? '#10b981' : '#ef4444', fontWeight: '600' }}>
                                                            {b.soLuongTon > 0 ? `Còn ${b.soLuongTon} cuốn khả dụng` : 'Hết sách vật lý'}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <FiPlus />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.bookList}>
                            {selectedBooks.length === 0 ? (
                                <div style={{textAlign: 'center', padding: '30px', border: '2px dashed #e2e8f0', borderRadius: '12px', color: '#94a3b8'}}>
                                    Chưa có sách nào được chọn
                                </div>
                            ) : (
                                selectedBooks.map((book, index) => (
                                    <div key={book.id} className={styles.bookRow}>
                                        <div className={styles.bookHeader} style={{justifyContent: 'space-between'}}>
                                            <div style={{display: 'flex', gap: '12px'}}>
                                                <div style={{color: '#3b82f6'}}><FiBook size={20} /></div>
                                                <div className={styles.bookTitle}>{book.tenSach}</div>
                                            </div>
                                            <button onClick={() => handleRemoveBook(book.id)} style={{background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer'}}><FiTrash2 /></button>
                                        </div>
                                        <div className={styles.assignmentArea}>
                                            <div className={styles.searchGroup}>
                                                <input 
                                                    type="text" 
                                                    className={styles.inputField} 
                                                    placeholder="Quét mã vạch cho cuốn sách này..." 
                                                    value={barcodeInputs[index] || ''}
                                                    onChange={(e) => setBarcodeInputs({...barcodeInputs, [index]: e.target.value})}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleBarcodeSearch(index)}
                                                />
                                                <button className={styles.scanBtn} onClick={() => handleBarcodeSearch(index)}>Xác nhận</button>
                                            </div>
                                            {book.cuonSachId ? (
                                                <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontSize: '13px', fontWeight: '700', background: '#f0fdf4', padding: '6px 12px', borderRadius: '6px', width: 'fit-content'}}>
                                                    <FiCheck /> Đã gán: {book.maVach}
                                                </div>
                                            ) : (
                                                <div style={{color: '#ef4444', fontSize: '12px', fontWeight: '600'}}>Vui lòng quét mã vạch vật lý</div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={{background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b'}}>
                            <FiCalendar />
                            <span style={{fontSize: '14px'}}>Hạn trả dự kiến: <strong>{new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')}</strong> (14 ngày)</span>
                        </div>
                    </div>
                </div>

                <div className={styles.footer}>
                    <button className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
                    <button 
                        className={styles.btnConfirm} 
                        onClick={handleConfirm}
                        disabled={loading || !selectedUser || selectedBooks.length === 0 || !selectedBooks.every(b => b.cuonSachId)}
                    >
                        {loading ? 'Đang tạo...' : 'Lập phiếu mượn'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaoPhieuMuonModal;

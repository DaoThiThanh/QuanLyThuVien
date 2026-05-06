
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiArrowLeft, FiCalendar, FiInfo } from 'react-icons/fi';
import Header from '../components/GiaoDienChinh/DauTrang';
import Footer from '../components/GiaoDienChinh/CuoiTrang';
import styles from './GioSach.module.css';
import { getGioSach, xoaKhoiGioSach, xoaHetGioSach } from '../dichVu/modules/dichVuGioSach';
import type { ItemGioSach } from '../kieuDuLieu/sach';
import { getUserId, getToken } from '../dichVu/modules/dichVuXacThuc';
import { CreateYeuCauMuon } from '../dichVu/modules/dichVuMuonSach';

const CartPage: React.FC = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<ItemGioSach[]>([]);
    const [henNhan, setHenNhan] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!getToken()) {
            navigate('/login');
            return;
        }
        setCartItems(getGioSach());

        // Mặc định hẹn 2 ngày sau
        const date = new Date();
        date.setDate(date.getDate() + 2);
        setHenNhan(date.toISOString().split('T')[0]);
    }, [navigate]);

    const handleRemove = (id: string) => {
        xoaKhoiGioSach(id);
        setCartItems(getGioSach());
    };

    const handleSubmit = async () => {
        const userId = getUserId();
        if (!userId) return;

        if (cartItems.length === 0) {
            alert('Vui lòng chọn ít nhất một cuốn sách.');
            return;
        }

        setSubmitting(true);
        try {
            await CreateYeuCauMuon({
                docGiaId: userId,
                dauSachIds: cartItems.map(i => i.id),
                ngayHenNhan: new Date(henNhan).toISOString()
            });

            alert('Yêu cầu mượn sách đã được gửi thành công!');
            xoaHetGioSach();
            navigate('/borrowed-books');
        } catch (error: any) {
            alert(error.message || 'Có lỗi xảy ra khi gửi yêu cầu.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.cartPage}>
            <Header />
            <main className={styles.container}>
                <h1 className={styles.title}>Danh sách mượn tạm thời</h1>
                <p className={styles.subtitle}>Kiểm tra lại các cuốn sách bạn muốn mượn trước khi gửi yêu cầu.</p>

                <div className={styles.cartGrid}>
                    <div className={styles.itemList}>
                        {cartItems.length === 0 ? (
                            <div className={styles.emptyState}>
                                <FiShoppingBag className={styles.emptyIcon} />
                                <h3>Danh sách đang trống</h3>
                                <p>Hãy quay lại kho sách để chọn những cuốn sách yêu thích nhé.</p>
                                <Link to="/books" className={styles.btnBack}>
                                    <FiArrowLeft /> Quay lại kho sách
                                </Link>
                            </div>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className={styles.cartItem}>
                                    <img src={item.hinhAnh || 'https://via.placeholder.com/150'} alt={item.tenSach} className={styles.bookImg} />
                                    <div className={styles.itemInfo}>
                                        <h3 className={styles.bookTitle}>{item.tenSach}</h3>
                                        <p className={styles.bookAuthor}>{item.tenTacGia}</p>
                                    </div>
                                    <button className={styles.removeBtn} onClick={() => handleRemove(item.id)} title="Xóa khỏi danh sách">
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {cartItems.length > 0 && (
                        <div className={styles.summaryCard}>
                            <h2 className={styles.summaryTitle}>Thông tin yêu cầu</h2>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Số lượng sách:</span>
                                <span className={styles.summaryValue}>{cartItems.length} cuốn</span>
                            </div>
                            <div className={styles.summaryRow}>
                                <span className={styles.summaryLabel}>Thời hạn mượn:</span>
                                <span className={styles.summaryValue}>14 ngày (theo quy định)</span>
                            </div>

                            <div className={styles.dateInputGroup}>
                                <label className={styles.dateLabel}>
                                    <FiCalendar style={{ marginRight: '8px' }} /> Ngày hẹn đến nhận sách
                                </label>
                                <input
                                    type="date"
                                    className={styles.dateInput}
                                    value={henNhan}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setHenNhan(e.target.value)}
                                />
                                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <FiInfo /> Thư viện sẽ giữ sách cho bạn trong 2 ngày kể từ ngày hẹn.
                                </p>
                            </div>

                            <button
                                className={styles.submitBtn}
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu mượn'}
                            </button>

                            <Link to="/books" className={styles.btnBack} style={{ justifyContent: 'center', display: 'flex' }}>
                                <FiArrowLeft /> Chọn thêm sách khác
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default CartPage;

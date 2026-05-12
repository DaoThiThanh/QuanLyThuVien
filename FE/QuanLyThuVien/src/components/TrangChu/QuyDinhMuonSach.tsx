import React, { useEffect, useState } from 'react';
import styles from './QuyDinhMuonSach.module.css';
import { FiCalendar, FiBook, FiDollarSign, FiSearch } from 'react-icons/fi';
import { getQuyDinh, type ThamSoQuyDinhDto } from '../../dichVu/modules/dichVuQuyDinh';

const BorrowingRules: React.FC = () => {
    const [quyDinh, setQuyDinh] = useState<ThamSoQuyDinhDto | null>(null);

    useEffect(() => {
        const fetchQuyDinh = async () => {
            const data = await getQuyDinh();
            setQuyDinh(data);
        };
        fetchQuyDinh();
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
    };

    return (
        <section className={styles['borrowing-rules-section']}>
            <div className={styles['section-header']}>
                <div className={styles['header-left']}>
                    <div className={styles['icon-fire']} style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className={styles['header-titles']}>
                        <h2 className={styles['section-title']}>Quy định mượn sách</h2>
                        <p className={styles['section-subtitle']}>Một số lưu ý quan trọng</p>
                    </div>
                </div>
            </div>

            <div className={styles['rules-grid']}>
                <div className={styles['rule-card']}>
                    <div className={styles['rule-icon-wrapper']} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                        <FiCalendar className={styles['rule-icon']} />
                    </div>
                    <h3 className={styles['rule-title']}>Thời gian mượn</h3>
                    <p className={styles['rule-desc']}>
                        Mỗi thẻ mượn được tối đa <strong>{quyDinh?.soSachMuonToiDa || 3} sách</strong>. Thời gian mượn tối đa <strong>{quyDinh?.soNgayMuonToiDa || 14} ngày</strong> (không tính ngày lễ, cuối tuần).
                    </p>
                </div>

                <div className={styles['rule-card']}>
                    <div className={styles['rule-icon-wrapper']} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                        <FiBook className={styles['rule-icon']} />
                    </div>
                    <h3 className={styles['rule-title']}>Số sách mượn</h3>
                    <p className={styles['rule-desc']}>
                        Một lần mượn được mượn tối đa <strong>{quyDinh?.soSachMuonToiDa || 3} sách</strong>. Bạn không thể mượn thêm nếu chưa trả sách đang mượn.
                    </p>
                </div>

                <div className={styles['rule-card']}>
                    <div className={styles['rule-icon-wrapper']} style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                        <FiDollarSign className={styles['rule-icon']} />
                    </div>
                    <h3 className={styles['rule-title']}>Phí trễ hạn</h3>
                    <p className={styles['rule-desc']}>
                        <strong>{formatCurrency(quyDinh?.phiPhatTreHanMoiNgay || 5000)}/ngày/quyển</strong> nếu trả sách trễ. Số tiền phạt sẽ được đóng góp vào quỹ mua sách mới.
                    </p>
                </div>

                <div className={styles['rule-card']}>
                    <div className={styles['rule-icon-wrapper']} style={{ backgroundColor: '#faf5ff', color: '#a855f7' }}>
                        <FiSearch className={styles['rule-icon']} />
                    </div>
                    <h3 className={styles['rule-title']}>Tìm kiếm sách</h3>
                    <p className={styles['rule-desc']}>
                        Thẻ thư viện điện tử sẽ tự động được gửi qua email sau khi bạn hoàn tất thủ tục đăng ký làm thẻ.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default BorrowingRules;

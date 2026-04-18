import React from 'react';
import './BorrowingRules.css';
import { FiCalendar, FiBook, FiDollarSign, FiSearch } from 'react-icons/fi';

const BorrowingRules: React.FC = () => {
    return (
        <section className="borrowing-rules-section">
            <div className="section-header">
                <div className="header-left">
                    <div className="icon-fire" style={{ backgroundColor: '#fff7ed', color: '#f97316' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    </div>
                    <div className="header-titles">
                        <h2 className="section-title">Quy định mượn sách</h2>
                        <p className="section-subtitle">Một số lưu ý quan trọng</p>
                    </div>
                </div>
            </div>

            <div className="rules-grid">
                <div className="rule-card">
                    <div className="rule-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                        <FiCalendar className="rule-icon" />
                    </div>
                    <h3 className="rule-title">Thời gian mượn</h3>
                    <p className="rule-desc">Mỗi thẻ mượn được tối đa 5 cuốn sách. Thời gian mượn tối đa 14 ngày (không tính ngày lễ, cuối tuần).</p>
                </div>

                <div className="rule-card">
                    <div className="rule-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                        <FiBook className="rule-icon" />
                    </div>
                    <h3 className="rule-title">Số sách mượn</h3>
                    <p className="rule-desc">Một lần mượn được mượn tối đa 3 sách. Bạn không thể mượn thêm nếu chưa trả sách đang mượn.</p>
                </div>

                <div className="rule-card">
                    <div className="rule-icon-wrapper" style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                        <FiDollarSign className="rule-icon" />
                    </div>
                    <h3 className="rule-title">Phí trễ hạn</h3>
                    <p className="rule-desc">5.000đ/ngày/quyển nếu trả sách trễ. Số tiền phạt sẽ được đóng góp vào quỹ mua sách mới.</p>
                </div>

                <div className="rule-card">
                    <div className="rule-icon-wrapper" style={{ backgroundColor: '#faf5ff', color: '#a855f7' }}>
                        <FiSearch className="rule-icon" />
                    </div>
                    <h3 className="rule-title">Tìm kiếm sách</h3>
                    <p className="rule-desc">Thẻ thư viện điện tử sẽ tự động được gửi qua email sau khi bạn hoàn tất thủ tục đăng ký làm thẻ.</p>
                </div>
            </div>
        </section>
    );
};

export default BorrowingRules;

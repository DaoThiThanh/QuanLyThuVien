import React from 'react';
import "./PromotionProgram.css";
import { FiPercent, FiArrowRight } from 'react-icons/fi';

const PromotionProgram: React.FC = () => {
    return (
        <section className="promotion-program-section">
            <div className="promotion-container">
                <div className="promotion-content">
                    <div className="promotion-badge">
                        <FiPercent className="promotion-icon" />
                        <span>CHƯƠNG TRÌNH MƯỢN SÁCH THÁNG 3</span>
                    </div>
                    <h2 className="promotion-title">Mượn 3 sách, nhận ưu đãi gia hạn!</h2>
                    <p className="promotion-description">
                        Sinh viên mượn từ 3 quyển sách trong tháng 3 sẽ được gia hạn thêm 7 ngày thời gian trả cho mỗi cuốn sách.
                    </p>
                </div>
                <div className="promotion-action">
                    <button className="promotion-btn">
                        Nhận mã ngay
                        <FiArrowRight />
                    </button>
                    {/* Watermark "M" */}
                    <div className="promotion-watermark">M</div>
                </div>
            </div>
        </section>
    );
}

export default PromotionProgram;
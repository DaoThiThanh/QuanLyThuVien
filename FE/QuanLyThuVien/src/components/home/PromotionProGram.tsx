import React from 'react';
import styles from "./PromotionProgram.module.css";
import { FiPercent, FiArrowRight } from 'react-icons/fi';

const PromotionProgram: React.FC = () => {
    return (
        <section className={styles['promotion-program-section']}>
            <div className={styles['promotion-container']}>
                <div className={styles['promotion-content']}>
                    <div className={styles['promotion-badge']}>
                        <FiPercent className={styles['promotion-icon']} />
                        <span>CHƯƠNG TRÌNH MƯỢN SÁCH THÁNG 3</span>
                    </div>
                    <h2 className={styles['promotion-title']}>Mượn 3 sách, nhận ưu đãi gia hạn!</h2>
                    <p className={styles['promotion-description']}>
                        Sinh viên mượn từ 3 quyển sách trong tháng 3 sẽ được gia hạn thêm 7 ngày thời gian trả cho mỗi cuốn sách.
                    </p>
                </div>
                <div className={styles['promotion-action']}>
                    <button className={styles['promotion-btn']}>
                        Nhận mã ngay
                        <FiArrowRight />
                    </button>
                    {/* Watermark "M" */}
                    <div className={styles['promotion-watermark']}>M</div>
                </div>
            </div>
        </section>
    );
}

export default PromotionProgram;
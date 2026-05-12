import styles from "./BannerCanhBaoQuaHan.module.css";
import { FiAlertTriangle } from "react-icons/fi";
type OverdueWarningBannerProps = {
    overdueCount: number;
};
function OverdueWarningBanner({ overdueCount }: OverdueWarningBannerProps) {
    return (
        <div>
            <div className={styles['overdue-warning-banner']}>
                <FiAlertTriangle size={22} />
                <div>
                    <p className={styles['overdue-warning-title']}>Bạn có {overdueCount} cuốn sách đã quá hạn trả!</p>
                    <p className={styles['overdue-warning-desc']}>Vui lòng trả sách ngay để tránh bị phạt thêm. Phí phạt: 5.000đ/ngày/cuốn.</p>
                </div>
            </div>
        </div>
    );
}
export default OverdueWarningBanner;

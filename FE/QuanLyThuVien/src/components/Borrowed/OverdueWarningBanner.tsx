import "./OverdueWarningBanner.css";
import { FiAlertTriangle } from "react-icons/fi";
type OverdueWarningBannerProps = {
    overdueCount: number;
};
function OverdueWarningBanner({ overdueCount }: OverdueWarningBannerProps) {
    return (
        <div>
            <div className="overdue-warning-banner">
                <FiAlertTriangle size={22} />
                <div>
                    <p className="overdue-warning-title">Bạn có {overdueCount} cuốn sách đã quá hạn trả!</p>
                    <p className="overdue-warning-desc">Vui lòng trả sách ngay để tránh bị phạt thêm. Phí phạt: 5.000đ/ngày/cuốn.</p>
                </div>
            </div>
        </div>
    );
}
export default OverdueWarningBanner;

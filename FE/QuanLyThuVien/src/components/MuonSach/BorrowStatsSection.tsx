import React from "react";
import styles from "./BorrowStatsSection.module.css";

import { FiBook, FiClock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";

type StatItemProps = {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: string;
};

const StatItem = ({ icon, label, value, color }: StatItemProps) => (
    <div className={styles['stat-card']}>
        <div className={styles['stat-icon']} style={{ backgroundColor: `${color}15`, color: color }}>
            {icon}
        </div>
        <div className={styles['stat-info']}>
            <span className={styles['stat-value']}>{value}</span>
            <span className={styles['stat-label']}>{label}</span>
        </div>
    </div>
);

function BorrowStatsSection() {
    return (
        <div className={styles['borrow-stats-section']}>
            <StatItem 
                icon={<FiBook size={20} />} 
                label="Tổng số sách" 
                value={12} 
                color="#3b82f6" 
            />
            <StatItem 
                icon={<FiClock size={20} />} 
                label="Đang mượn" 
                value={4} 
                color="#f59e0b" 
            />
            <StatItem 
                icon={<FiCheckCircle size={20} />} 
                label="Đã trả" 
                value={7} 
                color="#10b981" 
            />
            <StatItem 
                icon={<FiAlertCircle size={20} />} 
                label="Quá hạn" 
                value={1} 
                color="#ef4444" 
            />
        </div>
    );
}

export default BorrowStatsSection;

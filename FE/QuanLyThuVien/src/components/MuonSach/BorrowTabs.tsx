import styles from "./BorrowTabs.module.css";


type TabOption = "all" | "borrowing" | "returned" | "overdue";

type BorrowTabsProps = {
    activeTab: TabOption;
    onTabChange: (tab: TabOption) => void;
};

function BorrowTabs({ activeTab, onTabChange }: BorrowTabsProps) {
    const tabs: { id: TabOption; label: string }[] = [
        { id: "all", label: "Tất cả" },
        { id: "borrowing", label: "Đang mượn" },
        { id: "returned", label: "Đã trả" },
        { id: "overdue", label: "Quá hạn" },
    ];

    return (
        <div className={styles['borrow-tabs-container']}>
            <div className={styles['borrow-tabs']}>
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        className={`${styles['borrow-tab']} ${activeTab === tab.id ? styles['active'] : ""}`}
                        onClick={() => onTabChange(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className={styles['borrow-search']}>
                <input type="text" placeholder="Tìm kiếm sách đã mượn..." className={styles['borrow-search-input']} />
            </div>
        </div>
    );
}

export default BorrowTabs;

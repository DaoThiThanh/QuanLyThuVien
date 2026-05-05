import styles from "./CategoryTab.module.css";
type CategoryTabProps = {
    categories: string[];
    activeCategory: string;
    onChange: (category: string) => void;
};

function CategoryTab(props: CategoryTabProps) {
    return (
        <div className={styles['category-tabs']}>
            {props.categories.map((category) => {
                const isActive = props.activeCategory === category;

                return (
                    <button
                        key={category}
                        className={
                            isActive
                                ? `${styles['category-tab']} ${styles['category-tab-active']}`
                                : styles['category-tab']
                        }
                        onClick={() => props.onChange(category)} // gửi lên cha
                    >
                        {category} {/* 👈 phải hiển thị text */}
                    </button>
                );
            })}
        </div>
    );
}

export default CategoryTab;
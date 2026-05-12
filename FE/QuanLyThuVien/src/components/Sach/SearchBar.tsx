import { FiSearch, FiFilter } from "react-icons/fi";
import styles from "./SearchBar.module.css";

type SearchBarProps = {
    value: string;
    onChange: (value: string) => void;
    onFilterClick?: () => void;
    hideFilter?: boolean;
};

function SearchBar(props: SearchBarProps) {
    return (
        <div className={`${styles['search-bar-container']} ${props.hideFilter ? styles['compact'] : ''}`}>
            <div className={styles['search-input-wrapper']}>
                <FiSearch className={styles['search-icon']} size={20} />
                <input
                    className={styles['search-bar-input']}
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onChange(e.target.value)}
                    placeholder="Tìm kiếm sách, tác giả..."
                />
            </div>
            {!props.hideFilter && (
                <button className={styles['filter-button']} onClick={() => props.onFilterClick && props.onFilterClick()}>
                    <FiFilter size={18} />
                    <span>Bộ lọc</span>
                </button>
            )}
        </div>
    )
}
export default SearchBar;
import { FiSearch, FiFilter } from "react-icons/fi";
import "./SearchBar.css";

type SearchBarProps = {
    value: string;
    onchange: (value: string) => void;
    onFilterClick: () => void;
};

function SearchBar(props: SearchBarProps) {
    return (
        <div className="search-bar-container">
            <div className="search-input-wrapper">
                <FiSearch className="search-icon" size={20} />
                <input 
                    className="search-bar-input" 
                    type="text"
                    value={props.value}
                    onChange={(e) => props.onchange(e.target.value)}
                    placeholder="Tìm kiếm sách, tác giả..." 
                />
            </div>
            <button className="filter-button" onClick={(e) => props.onFilterClick()}>
                <FiFilter size={18} />
                <span>Bộ lọc</span>
            </button>
        </div>
    )
}
export default SearchBar;
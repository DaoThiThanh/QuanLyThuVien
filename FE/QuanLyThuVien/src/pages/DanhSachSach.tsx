import Header from "../components/GiaoDienChinh/DauTrang";
import Footer from "../components/GiaoDienChinh/CuoiTrang";
import PageTitle from "../components/Sach/PageTitle";
import SearchBar from "../components/Sach/SearchBar";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import BookGrid from "../components/Sach/BookGrid";
import { GetDanhSachSach, GetCategories } from "../dichVu/modules/dichVuSach";
import styles from "./DanhSachSach.module.css";
import {
    FiGrid, FiLayers, FiSearch, FiChevronLeft, FiChevronRight, FiFilter
} from "react-icons/fi";
import type { CategoryItem } from "../kieuDuLieu/sach";
import type { BookItem } from "../components/Sach/BookGrid";

function BooksPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "Tất cả");

    const [categories, setCategories] = useState<CategoryItem[]>([]);

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setActiveCategory(searchParams.get("category") || "Tất cả");
    }, [searchParams]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await GetCategories();
                let fetchedCats: CategoryItem[] = [];
                if (Array.isArray(res)) {
                    fetchedCats = res;
                } else if (res && (res as any).data) {
                    fetchedCats = (res as any).data;
                }

                const allCategory: CategoryItem = {
                    id: "all",
                    tenDanhMuc: "Tất cả",
                    icon: "📚",
                    soLuongSach: 0
                };

                setCategories([allCategory, ...fetchedCats]);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCats();
    }, []);

    const [booksData, setBooksData] = useState<BookItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 12;

    useEffect(() => {
        const fetchBooks = async () => {
            setLoading(true);
            try {
                const response = await GetDanhSachSach(1, 100);
                if (response && response.items) {
                    const mappedBooks: BookItem[] = response.items.map(item => ({
                        id: item.id,
                        title: item.tenSach,
                        author: item.tenTacGia || "Đang cập nhật",
                        year: new Date().getFullYear(),
                        category: item.tenDanhMuc || "Khác",
                        status: item.soLuongTon > 0 ? "available" : "unavailable",
                        image: item.hinhAnh || "https://placehold.co/400x600/e2e8f0/1e293b?text=No+Cover"
                    }));
                    setBooksData(mappedBooks);
                    setTotalItems(response.totalItems);
                }
            } catch (error) {
                console.error("Lỗi khi tải danh sách sách:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const filteredBooks = booksData.filter(book => {
        const matchSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());
        const matchCategory = activeCategory === "Tất cả" || book.category === activeCategory;
        return matchSearch && matchCategory;
    });

    useEffect(() => {
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [search, activeCategory]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage]);

    const totalPages = Math.ceil(filteredBooks.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);

    const handleViewDetail = (book: BookItem) => {
        navigate(`/book-detail/${book.id}`);
    }

    return (
        <div className={styles['books-container']}>
            <Header />
            <main className={styles['main-content']}>
                <div className={styles['layout-wrapper']}>
                    {/* Sidebar Filter */}
                    <aside className={styles['sidebar']}>
                        {/* Search in Sidebar */}
                        <div className={styles['sidebar-section']}>
                            <h3 className={styles['section-title']}>
                                <FiSearch /> Tìm kiếm sách
                            </h3>
                            <div className={styles['sidebar-search-box']}>
                                <SearchBar
                                    value={search}
                                    onChange={setSearch}
                                    hideFilter={true}
                                />
                            </div>
                        </div>

                        {/* Categories in Sidebar */}
                        <div className={styles['sidebar-section']}>
                            <h3 className={styles['section-title']}>
                                <FiFilter /> Danh mục sách
                            </h3>
                            <div className={styles['category-list']}>
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        className={`${styles['category-item']} ${activeCategory === cat.tenDanhMuc ? styles['active'] : ''}`}
                                        onClick={() => setActiveCategory(cat.tenDanhMuc)}
                                    >
                                        <span className={styles['category-icon-api']}>
                                            {cat.icon ? (
                                                <span className={styles['icon-text']}>{cat.icon}</span>
                                            ) : (
                                                <FiLayers />
                                            )}
                                        </span>
                                        <span className={styles['category-name']}>{cat.tenDanhMuc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles['sidebar-section']} style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white' }}>
                            <h3 className={styles['section-title']} style={{ color: 'white' }}>
                                📚 Ưu đãi đọc sách
                            </h3>
                            <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '16px' }}>
                                Mượn sách miễn phí hoàn toàn khi là thành viên của thư viện.
                            </p>
                            <button style={{
                                background: 'white',
                                color: '#3b82f6',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '10px',
                                fontWeight: '700',
                                width: '100%',
                                cursor: 'pointer'
                            }}>
                                Đăng ký ngay
                            </button>
                        </div>
                    </aside>

                    {/* Main Results */}
                    <div className={styles['content-area']}>
                        <div className={styles['results-header']}>
                            <PageTitle
                                title="Kho sách trí thức"
                                subtitle={`Tìm thấy ${filteredBooks.length} cuốn sách dành cho bạn`}
                            />
                        </div>

                        <div className={styles['results-summary']}>
                            <div className={styles['results-count']}>
                                Hiển thị <b>{paginatedBooks.length}</b> trong <b>{filteredBooks.length}</b> sách phù hợp
                            </div>
                            <div className={styles['pagination-info']}>
                                Trang {currentPage} / {totalPages || 1}
                            </div>
                        </div>

                        <div className={styles['books-grid-container']}>
                            {loading ? (
                                <div className={styles['loading-state']}>
                                    <div className={styles['spinner']}></div>
                                    <p>Đang tải kho sách...</p>
                                </div>
                            ) : filteredBooks.length === 0 ? (
                                <div className={styles['empty-results']}>
                                    <FiSearch size={48} />
                                    <p>Không tìm thấy cuốn sách nào phù hợp.</p>
                                </div>
                            ) : (
                                <>
                                    <BookGrid
                                        books={paginatedBooks}
                                        onViewDetail={handleViewDetail}
                                    />

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className={styles['pagination']}>
                                            <button
                                                className={styles['page-btn']}
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                            >
                                                <FiChevronLeft /> Trước
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                <button
                                                    key={page}
                                                    className={`${styles['page-btn']} ${currentPage === page ? styles['active'] : ''}`}
                                                    onClick={() => setCurrentPage(page)}
                                                >
                                                    {page}
                                                </button>
                                            ))}

                                            <button
                                                className={styles['page-btn']}
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                            >
                                                Sau <FiChevronRight />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default BooksPage;

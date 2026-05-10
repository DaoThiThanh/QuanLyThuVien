import Header from "../components/GiaoDienChinh/DauTrang";
import Footer from "../components/GiaoDienChinh/CuoiTrang";
import PageTitle from "../components/Sach/PageTitle";
import SearchBar from "../components/Sach/SearchBar";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CategoryTab from "../components/Sach/CategoryTab";
import ResultInfor from "../components/Sach/ResultInfor";
import type { BookItem } from "../components/Sach/BookGrid";
import BookGrid from "../components/Sach/BookGrid";
import { GetDanhSachSach, GetCategories } from "../dichVu/modules/dichVuSach";
import type { CategoryItem } from "../kieuDuLieu/sach";

function BooksPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "Tất cả");
    
    const [categoriesList, setCategoriesList] = useState<string[]>(["Tất cả"]);

    useEffect(() => {
        setSearch(searchParams.get("search") || "");
        setActiveCategory(searchParams.get("category") || "Tất cả");
    }, [searchParams]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await GetCategories();
                let fetchedCats: string[] = [];
                if (Array.isArray(res)) {
                    fetchedCats = res.map(c => c.tenDanhMuc);
                } else if (res && (res as any).data) {
                    fetchedCats = (res as any).data.map((c: any) => c.tenDanhMuc);
                }
                setCategoriesList(["Tất cả", ...fetchedCats]);
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
                const response = await GetDanhSachSach(1, 100); // Lấy 100 sách
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
    }, [search, activeCategory]);

    const totalPages = Math.ceil(filteredBooks.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedBooks = filteredBooks.slice(startIndex, startIndex + pageSize);
    const handleViewDetail = (book: BookItem) => {
        navigate(`/book-detail/${book.id}`);
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <PageTitle
                    title="Danh sách sách"
                    subtitle={`Tìm kiếm trong ${totalItems} đầu sách của thư viện`}
                />
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onFilterClick={() => { }}
                />
                <CategoryTab
                    categories={categoriesList}
                    activeCategory={activeCategory}
                    onChange={setActiveCategory}
                />
                <ResultInfor
                    count={filteredBooks.length}
                />
                <div>
                    <h1 style={{ marginBottom: '20px' }}>Danh sách sách</h1>
                    {loading ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>Đang tải sách...</div>
                    ) : filteredBooks.length === 0 ? (
                        <div style={{ padding: '40px 0', textAlign: 'center' }}>Không tìm thấy cuốn sách nào phù hợp.</div>
                    ) : (
                        <>
                            <BookGrid
                                books={paginatedBooks}
                                onViewDetail={handleViewDetail}
                            />

                            {/* Phân trang */}
                            {totalPages > 1 && (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '40px' }}>
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            background: currentPage === 1 ? '#f8fafc' : 'white',
                                            color: currentPage === 1 ? '#94a3b8' : '#1e293b',
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                            fontWeight: 500
                                        }}
                                    >
                                        Trước
                                    </button>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            style={{
                                                padding: '8px 16px',
                                                borderRadius: '8px',
                                                border: '1px solid',
                                                borderColor: currentPage === page ? '#3b82f6' : '#e2e8f0',
                                                background: currentPage === page ? '#3b82f6' : 'white',
                                                color: currentPage === page ? 'white' : '#1e293b',
                                                cursor: 'pointer',
                                                fontWeight: 500
                                            }}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '8px',
                                            border: '1px solid #e2e8f0',
                                            background: currentPage === totalPages ? '#f8fafc' : 'white',
                                            color: currentPage === totalPages ? '#94a3b8' : '#1e293b',
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                            fontWeight: 500
                                        }}
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default BooksPage

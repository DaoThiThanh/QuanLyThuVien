import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageTitle from "../components/Books/PageTitle";
import SearchBar from "../components/Books/SearchBar";
import { useState } from "react";
import CategoryTab from "../components/Books/CategoryTab";
import ResultInfor from "../components/Books/ResultInfor";
import type { BookItem } from "../components/Books/BookGrid";
import BookCard from "../components/Books/BookCard";
import BookGrid from "../components/Books/BookGrid";
function BooksPage() {
    const [search, setSearch] = useState("");
    const categories = ["Tất cả", "Công nghệ thông tin", "Toán học", "Kinh tế", "Văn học", "Trí tuệ nhân tạo", "Lịch sử", "Khoa học"];
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const [booksData] = useState<BookItem[]>([
        {
            id: "S1",
            title: "Lập trình C++ cơ bản",
            author: "Nguyễn Văn Anh",
            year: 2024,
            category: "Công nghệ thông tin",
            status: "available",
            image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: "S2",
            title: "Giải tích 1",
            author: "Trần Thị Bình",
            year: 2023,
            category: "Toán học",
            status: "available",
            image: "https://images.unsplash.com/photo-1512820200504-f5ce90bfcee6?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: "S3",
            title: "Kinh tế vi mô",
            author: "Hoàng Văn Đức",
            year: 2022,
            category: "Kinh tế",
            status: "unavailable",
            image: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?auto=format&fit=crop&q=80&w=800",
        },
        {
            id: "S4",
            title: "Nhập môn Trí tuệ nhân tạo",
            author: "Trần Thị Linh",
            year: 2024,
            category: "Trí tuệ nhân tạo",
            status: "available",
            image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
        },
    ]);
    const [filteredBooks] = useState<BookItem[]>(booksData)
    const handleViewDetail = (book: BookItem) => {
        console.log("Sách được chọn: ", book);
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <PageTitle
                    title="Danh sách sách"
                    subtitle="Tìm kiếm trong 12 đầu sách của thư viện"
                />
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    onFilterClick={() => { }}
                />
                <CategoryTab
                    categories={categories}
                    activeCategory={activeCategory}
                    onChange={setActiveCategory}
                />
                <ResultInfor
                    count={filteredBooks.length}
                />
                <div>
                    <h1>Danh sách sách</h1>
                    <BookGrid
                        books={booksData}
                        onViewDetail={handleViewDetail}
                    ></BookGrid>
                </div>
            </main>
            <Footer />
        </div>
    )
}
export default BooksPage
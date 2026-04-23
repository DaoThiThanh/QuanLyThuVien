import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageTitle from "../components/Books/PageTitle";
import SearchBar from "../components/Books/SearchBar";
import { useState } from "react";
import CategoryTab from "../components/Books/CategoryTab";
import ResultInfor from "../components/Books/ResultInfor";
function BooksPage() {
    const [search, setSearch] = useState("");
    const categories = ["Tất cả", "Công nghệ thông tin", "Toán học", "Kinh tế", "Văn học", "Trí tuệ nhân tạo", "Lịch sử", "Khoa học"];
    const [activeCategory, setActiveCategory] = useState("Tất cả");
    const books = [
        { id: 1, title: "C++", Category: "Công nghệ thông tin", Author: "" },
        { id: 2, title: "Giải tích", Category: "Toán học", Author: "" },
        { id: 3, title: "Vật lý đại cương", Category: "Vật lý", Author: "" },
    ]
    const [filteredBooks] = useState(books)
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
                    onchange={setSearch}
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
            </main>
            <Footer />
        </div>
    )
}
export default BooksPage
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageTitle from "../components/Books/PageTitle";
import SearchBar from "../components/Books/SearchBar";
import { useState } from "react";
import CategoryTab from "../components/Books/CategoryTab";

function BooksPage() {
    const [search, setSearch] = useState("");
    const categories = ["Tất cả", "Lập trình", "Toán học", "Kinh tế", "Văn học", "Trí tuệ nhân tạo", "Công nghệ thông tin", "Lịch sử", "Khoa học", "Kinh tế"];
    const [activeCategory, setActiveCategory] = useState("Tất cả");
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
            </main>
            <Footer />
        </div>
    )
}
export default BooksPage
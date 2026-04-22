import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PageTitle from "../components/Books/PageTitle";

function BooksPage() {
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            <Header />
            <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <PageTitle 
                    title="Danh sách sách" 
                    subtitle="Tìm kiếm trong 12 đầu sách của thư viện" 
                />
            </main>
            <Footer />
        </div>
    )
}
export default BooksPage
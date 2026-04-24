import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function BorrowedBooksPage() {
    return (
        <div>
            <Header />
            <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <h1>Trang sách đã mượn</h1>
            </main>
            <Footer />
        </div>
    );
}
export default BorrowedBooksPage;
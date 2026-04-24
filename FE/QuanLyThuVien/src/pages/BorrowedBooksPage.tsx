import React, { useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BorrowedTitle from "../components/Borrowed/BorrowedTitle";
import OverdueWarningBanner from "../components/Borrowed/OverdueWarningBanner";

function BorrowedBooksPage() {
    const [overdueCount, setOverdueCount] = useState(1);

    return (
        <div>
            <Header />
            <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <BorrowedTitle title="Lịch sử mượn"
                    subtitle="Danh sách sách bạn đã mượn và đang mượn" />
                <OverdueWarningBanner overdueCount={overdueCount} />
            </main>
            <Footer />
        </div>
    );
}
export default BorrowedBooksPage;
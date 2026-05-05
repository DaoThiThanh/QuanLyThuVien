import React, { useState } from "react";
import Header from "../components/GiaoDienChinh/DauTrang";
import Footer from "../components/GiaoDienChinh/CuoiTrang";
import BorrowedTitle from "../components/MuonSach/BorrowedTitle";
import OverdueWarningBanner from "../components/MuonSach/OverdueWarningBanner";
import BorrowStatsSection from "../components/MuonSach/BorrowStatsSection";
import BorrowTabs from "../components/MuonSach/BorrowTabs";
import BorrowedBookList from "../components/MuonSach/BorrowedBookList";
import type { BorrowedBook } from "../components/MuonSach/BorrowedBookList";


function BorrowedBooksPage() {
    const [overdueCount] = useState(1);
    const [activeTab, setActiveTab] = useState<"all" | "borrowing" | "returned" | "overdue">("all");

    const mockBooks: BorrowedBook[] = [
        {
            id: "1",
            title: "Đắc Nhân Tâm",
            author: "Dale Carnegie",
            borrowDate: "15/04/2026",
            dueDate: "29/04/2026",
            status: "overdue",
            coverImage: "https://vnn-imgs-f.vgcloud.vn/2020/03/17/14/dac-nhan-tam.jpg"
        },
        {
            id: "2",
            title: "Nhà Giả Kim",
            author: "Paulo Coelho",
            borrowDate: "20/04/2026",
            dueDate: "04/05/2026",
            status: "borrowing",
            coverImage: "https://salt.tikicdn.com/cache/w1200/ts/product/45/3d/e3/0eb667db5e0a303038a35f71822ad35e.jpg"
        },
        {
            id: "3",
            title: "Tuổi Trẻ Đáng Giá Bao Nhiêu",
            author: "Rosie Nguyễn",
            borrowDate: "01/04/2026",
            dueDate: "15/04/2026",
            returnDate: "14/04/2026",
            status: "returned",
            coverImage: "https://salt.tikicdn.com/cache/w1200/ts/product/ee/3d/89/3e3f05f426214151778939c381c8f13c.jpg"
        }
    ];

    const filteredBooks = mockBooks.filter(book => {
        if (activeTab === "all") return true;
        return book.status === activeTab;
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f9fafb' }}>
            <Header />
            <main style={{ flex: 1, padding: '40px 24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <BorrowedTitle 
                    title="Lịch sử mượn"
                    subtitle="Danh sách sách bạn đã mượn và đang mượn" 
                />
                
                {overdueCount > 0 && <OverdueWarningBanner overdueCount={overdueCount} />}
                
                <BorrowStatsSection />
                
                <BorrowTabs activeTab={activeTab} onTabChange={setActiveTab} />
                
                <BorrowedBookList books={filteredBooks} />
            </main>
            <Footer />
        </div>
    );
}

export default BorrowedBooksPage;

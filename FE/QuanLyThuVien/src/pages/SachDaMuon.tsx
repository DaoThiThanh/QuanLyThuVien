import { useState } from "react";
import Header from "../components/GiaoDienChinh/DauTrang";
import Footer from "../components/GiaoDienChinh/CuoiTrang";
import BorrowedTitle from "../components/MuonSach/BorrowedTitle";
import OverdueWarningBanner from "../components/MuonSach/OverdueWarningBanner";
import BorrowStatsSection from "../components/MuonSach/BorrowStatsSection";
import BorrowTabs from "../components/MuonSach/BorrowTabs";
import BorrowedBookList from "../components/MuonSach/BorrowedBookList";
import type { BorrowedBook } from "../components/MuonSach/BorrowedBookList";
import { GetYeuCauByDocGiaAsync, GetDanhSachPhieuMuon, TuChoiYeuCauMuon } from "../dichVu/modules/dichVuMuonSach";
import { getUserId } from "../dichVu/modules/dichVuXacThuc";
import { useEffect } from "react";


function BorrowedBooksPage() {
    const [overdueCount, setOverdueCount] = useState(0);
    const [activeTab, setActiveTab] = useState<any>("all");
    const [books, setBooks] = useState<BorrowedBook[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        const userId = getUserId();
        if (!userId) return;

        setLoading(true);
        try {
            const [requests, loans] = await Promise.all([
                GetYeuCauByDocGiaAsync(userId),
                GetDanhSachPhieuMuon(1, 50) // Giả định reader chỉ lấy 50 cuốn gần nhất
            ]);

            const mappedData: BorrowedBook[] = [];

            // Mapping Yêu cầu mượn (Online)
            if (Array.isArray(requests)) {
                requests.forEach(yc => {
                    const status: any = yc.trangThai === 0 ? "pending" : (yc.trangThai === 2 ? "rejected" : "approved");
                    
                    // Gom tất cả sách trong 1 yêu cầu thành 1 dòng duy nhất để hủy theo "Phiếu"
                    mappedData.push({
                        id: yc.id, 
                        title: yc.tenCacSach && yc.tenCacSach.length > 0 ? yc.tenCacSach.join(", ") : "Chưa rõ tên sách",
                        author: `Số lượng: ${yc.tenCacSach ? yc.tenCacSach.length : 0} cuốn`,
                        borrowDate: new Date(yc.ngayYeuCau).toLocaleDateString('vi-VN'),
                        dueDate: yc.ngayHenNhan ? new Date(yc.ngayHenNhan).toLocaleDateString('vi-VN') : "Chưa xác định",
                        status: status,
                        coverImage: "https://cdn-icons-png.flaticon.com/512/2232/2232688.png", // Icon tập hồ sơ/phiếu
                        isRequest: true
                    });
                });
            }

            // Mapping Phiếu mượn thực tế
            if (loans && loans.items) {
                let overdue = 0;
                loans.items.forEach((item: any) => {
                    const isOverdue = new Date(item.hanTra) < new Date() && !item.ngayTra;
                    if (isOverdue) overdue++;

                    mappedData.push({
                        id: item.id,
                        title: item.tenSach || "Nhiều sách",
                        author: item.tenTacGia || "Thư viện",
                        borrowDate: new Date(item.ngayMuon).toLocaleDateString('vi-VN'),
                        dueDate: new Date(item.hanTra).toLocaleDateString('vi-VN'),
                        returnDate: item.ngayTra ? new Date(item.ngayTra).toLocaleDateString('vi-VN') : undefined,
                        status: item.ngayTra ? "returned" : (isOverdue ? "overdue" : "borrowing"),
                        coverImage: item.hinhAnh || "https://placehold.co/400x600/e2e8f0/1e293b?text=Book"
                    });
                });
                setOverdueCount(overdue);
            }

            setBooks(mappedData);
        } catch (error) {
            console.error("Lỗi khi tải lịch sử mượn:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCancelRequest = async (id: string) => {
        if (!window.confirm('Bạn có chắc chắn muốn hủy yêu cầu mượn này?')) return;
        try {
            await TuChoiYeuCauMuon(id);
            alert('Đã hủy yêu cầu mượn thành công.');
            fetchData();
        } catch (error: any) {
            alert('Lỗi: ' + (error.message || 'Không thể hủy yêu cầu'));
        }
    };

    const filteredBooks = books.filter(book => {
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
                
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải lịch sử mượn...</div>
                ) : (
                    <BorrowedBookList books={filteredBooks} onCancelRequest={handleCancelRequest} />
                )}
            </main>
            <Footer />
        </div>
    );
}

export default BorrowedBooksPage;

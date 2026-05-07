import { useState } from "react";
import Header from "../components/GiaoDienChinh/DauTrang";
import Footer from "../components/GiaoDienChinh/CuoiTrang";
import BorrowedTitle from "../components/MuonSach/BorrowedTitle";
import OverdueWarningBanner from "../components/MuonSach/OverdueWarningBanner";
import BorrowStatsSection from "../components/MuonSach/BorrowStatsSection";
import BorrowTabs from "../components/MuonSach/BorrowTabs";
import BorrowedBookList from "../components/MuonSach/BorrowedBookList";
import type { BorrowedBook } from "../components/MuonSach/BorrowedBookList";
import { GetYeuCauByDocGiaAsync, GetPhieuMuonByUser, TuChoiYeuCauMuon } from "../dichVu/modules/dichVuMuonSach";
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
                GetPhieuMuonByUser(userId)
            ]);

            const mappedData: BorrowedBook[] = [];

            // Mapping Yêu cầu mượn (Online)
            if (Array.isArray(requests)) {
                requests.forEach(yc => {
                    const status: any = yc.trangThai === 0 ? "pending" : (yc.trangThai === 2 ? "rejected" : "approved");
                    
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
            if (Array.isArray(loans)) {
                let overdue = 0;
                loans.forEach((pm: any) => {
                    pm.chiTiet.forEach((ct: any) => {
                        const isOverdue = new Date(pm.hanTra) < new Date() && !ct.ngayTraThucTe;
                        if (isOverdue) overdue++;

                        mappedData.push({
                            id: ct.id,
                            title: ct.tenSach || "Chưa rõ tên sách",
                            author: ct.tenTacGia || "Thư viện",
                            borrowDate: new Date(pm.ngayMuon).toLocaleDateString('vi-VN'),
                            dueDate: new Date(pm.hanTra).toLocaleDateString('vi-VN'),
                            returnDate: ct.ngayTraThucTe ? new Date(ct.ngayTraThucTe).toLocaleDateString('vi-VN') : undefined,
                            status: ct.ngayTraThucTe ? "returned" : (isOverdue ? "overdue" : "borrowing"),
                            coverImage: ct.hinhAnh || "https://placehold.co/400x600/e2e8f0/1e293b?text=Book"
                        });
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
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh', 
            backgroundColor: '#f8fafc',
            backgroundImage: 'radial-gradient(at 0% 0%, hsla(210,100%,98%,1) 0, transparent 50%), radial-gradient(at 50% 0%, hsla(220,100%,97%,1) 0, transparent 50%)'
        }}>
            <Header />
            <main style={{ 
                flex: 1, 
                padding: '60px 24px', 
                maxWidth: '1280px', 
                margin: '0 auto', 
                width: '100%',
                animation: 'fadeIn 0.6s ease-out'
            }}>
                <div style={{ marginBottom: '40px' }}>
                    <BorrowedTitle 
                        title="Lịch sử mượn sách"
                        subtitle="Theo dõi quá trình mượn trả và trạng thái các yêu cầu của bạn" 
                    />
                </div>
                
                {overdueCount > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <OverdueWarningBanner overdueCount={overdueCount} />
                    </div>
                )}
                
                <div style={{ 
                    background: 'white', 
                    borderRadius: '24px', 
                    padding: '32px', 
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                    border: '1px solid rgba(226, 232, 240, 0.8)'
                }}>
                    <div style={{ marginBottom: '32px' }}>
                        <BorrowStatsSection 
                            total={books.filter(b => !b.isRequest).length}
                            borrowing={books.filter(b => b.status === 'borrowing').length}
                            returned={books.filter(b => b.status === 'returned').length}
                            overdue={overdueCount}
                        />
                    </div>
                    
                    <div style={{ borderBottom: '1px solid #f1f5f9', marginBottom: '32px' }}>
                        <BorrowTabs activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>
                    
                    {loading ? (
                        <div style={{ 
                            textAlign: 'center', 
                            padding: '100px 0',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '16px'
                        }}>
                            <div className="loading-spinner" style={{
                                width: '40px',
                                height: '40px',
                                border: '3px solid #f3f4f6',
                                borderTop: '3px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                            <span style={{ color: '#64748b', fontWeight: 500 }}>Đang tải dữ liệu lịch sử...</span>
                        </div>
                    ) : (
                        <BorrowedBookList books={filteredBooks} onCancelRequest={handleCancelRequest} />
                    )}
                </div>
            </main>
            <Footer />
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}

export default BorrowedBooksPage;

import React, { useState, useEffect } from "react";
import styles from "./DanhSachSachDaMuon.module.css";

// ===== INTERFACES =====
export interface BorrowedBookInSlip {
    id: string;
    title: string;
    author: string;
    coverImage: string;
    status: "borrowing" | "returned" | "overdue" | "pending" | "rejected" | "approved";
    returnDate?: string;
    tienPhat?: number;
}

export interface BorrowedSlip {
    id: string;
    borrowDate: string;
    dueDate: string;
    status: "borrowing" | "returned" | "overdue" | "pending" | "rejected" | "approved";
    books: BorrowedBookInSlip[];
    isRequest?: boolean;
    type?: "request" | "loan";
}

export interface BorrowedBook {
    id: string;
    title: string;
    author: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: "borrowing" | "returned" | "overdue" | "pending" | "rejected" | "approved";
    coverImage: string;
    isRequest?: boolean;
}

// ===== HELPERS =====
const getStatusLabel = (status: BorrowedBookInSlip["status"]) => {
    switch (status) {
        case "borrowing": return "Đang mượn";
        case "returned": return "Đã trả";
        case "overdue": return "Quá hạn";
        case "pending": return "Chờ duyệt";
        case "rejected": return "Đã hủy";
        case "approved": return "Đã duyệt";
        default: return "";
    }
};

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
    borrowing: { bg: "#ecfdf5", color: "#059669", border: "#d1fae5" },
    returned: { bg: "#f8fafc", color: "#64748b", border: "#f1f5f9" },
    overdue: { bg: "#fff1f2", color: "#e11d48", border: "#ffe4e6" },
    pending: { bg: "#fffbeb", color: "#d97706", border: "#fef3c7" },
    rejected: { bg: "#fef2f2", color: "#dc2626", border: "#fee2e2" },
    approved: { bg: "#f0f9ff", color: "#0284c7", border: "#e0f2fe" },
};

function StatusBadge({ status }: { status: BorrowedBookInSlip["status"] }) {
    const c = STATUS_COLORS[status] ?? STATUS_COLORS.borrowing;
    return (
        <span style={{
            display: "inline-flex", alignItems: "center",
            padding: "4px 12px", borderRadius: "20px",
            fontSize: "12px", fontWeight: 700,
            background: c.bg, color: c.color, border: `1px solid ${c.border}`,
            whiteSpace: "nowrap",
        }}>
            {getStatusLabel(status)}
        </span>
    );
}

// ===== DETAIL DIALOG =====
function SlipDetailDialog({ slip, onClose, onCancel }: {
    slip: BorrowedSlip;
    onClose: () => void;
    onCancel?: (id: string) => void;
}) {
    const totalFine = slip.books.reduce((s, b) => s + (b.tienPhat ?? 0), 0);
    const isRequest = slip.type === "request";

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 1000,
                background: "rgba(15,23,42,0.55)",
                backdropFilter: "blur(4px)",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "16px",
                animation: "fadeIn 0.18s ease-out",
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: "white", borderRadius: "20px",
                    width: "100%", maxWidth: "680px",
                    maxHeight: "90vh", display: "flex", flexDirection: "column",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
                    animation: "slideUp 0.22s ease-out",
                    overflow: "hidden",
                }}
            >
                {/* Header */}
                <div style={{
                    padding: "24px 28px 20px",
                    borderBottom: "1px solid #f1f5f9",
                    display: "flex", alignItems: "flex-start", justifyContent: "space-between",
                    background: isRequest
                        ? "linear-gradient(135deg,#eff6ff 0%,#f8faff 100%)"
                        : "linear-gradient(135deg,#f0fdf4 0%,#f8fffb 100%)",
                    flexShrink: 0,
                }}>
                    <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <span style={{
                                fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em",
                                padding: "3px 10px", borderRadius: "20px",
                                background: isRequest ? "#dbeafe" : "#d1fae5",
                                color: isRequest ? "#1d4ed8" : "#065f46",
                                textTransform: "uppercase",
                            }}>
                                {isRequest ? "Yêu cầu mượn" : "Phiếu mượn"}
                            </span>
                            <StatusBadge status={slip.status} />
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "4px" }}>
                            <InfoItem label={isRequest ? "Ngày đặt" : "Ngày mượn"} value={slip.borrowDate} />
                            <InfoItem label={isRequest ? "Ngày hẹn" : "Hạn trả"} value={slip.dueDate} />
                            <InfoItem label="Số lượng" value={`${slip.books.length} cuốn`} />
                            {totalFine > 0 && (
                                <InfoItem label="Tổng phạt" value={`${totalFine.toLocaleString("vi-VN")} đ`} color="#e11d48" />
                            )}
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            width: "36px", height: "36px", borderRadius: "10px",
                            border: "1px solid #e2e8f0", background: "white",
                            fontSize: "18px", cursor: "pointer", color: "#64748b",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
                    >
                        ✕
                    </button>
                </div>

                {/* Body – scrollable */}
                <div style={{ overflowY: "auto", flex: 1, padding: "20px 28px" }}>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 14px" }}>
                        Danh sách sách ({slip.books.length})
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {slip.books.map((book, idx) => (
                            <div key={book.id} style={{
                                display: "flex", alignItems: "center", gap: "14px",
                                padding: "14px 16px", borderRadius: "14px",
                                border: "1px solid #f1f5f9",
                                background: idx % 2 === 0 ? "#fafbff" : "white",
                                transition: "box-shadow 0.2s",
                            }}>
                                <div style={{
                                    width: "52px", height: "74px", flexShrink: 0,
                                    borderRadius: "8px", overflow: "hidden",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}>
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/52x74/e2e8f0/1e293b?text=Book"; }}
                                    />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.title}</p>
                                    <p style={{ margin: "3px 0 8px", fontSize: "12px", color: "#64748b" }}>{book.author}</p>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
                                        <StatusBadge status={book.status} />
                                        {book.returnDate && (
                                            <span style={{ fontSize: "12px", color: "#64748b" }}>Trả: <strong>{book.returnDate}</strong></span>
                                        )}
                                        {book.tienPhat && book.tienPhat > 0 && (
                                            <span style={{
                                                fontSize: "12px", fontWeight: 700, color: "#e11d48",
                                                padding: "2px 8px", borderRadius: "8px", background: "#fff1f2",
                                            }}>
                                                Phạt: {book.tienPhat.toLocaleString("vi-VN")} đ
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div style={{
                    padding: "16px 28px", borderTop: "1px solid #f1f5f9",
                    display: "flex", justifyContent: "flex-end", gap: "10px",
                    background: "#fafbff", flexShrink: 0,
                }}>
                    {isRequest && slip.status === "pending" && onCancel && (
                        <button
                            onClick={() => { onCancel(slip.id); onClose(); }}
                            style={{
                                padding: "9px 20px", borderRadius: "10px",
                                border: "1px solid #ffe4e6", background: "#fff1f2",
                                color: "#e11d48", fontWeight: 700, fontSize: "13px",
                                cursor: "pointer", transition: "all 0.2s",
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ffe4e6"; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff1f2"; }}
                        >
                            Hủy yêu cầu
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        style={{
                            padding: "9px 24px", borderRadius: "10px",
                            border: "1px solid #e2e8f0", background: "white",
                            color: "#475569", fontWeight: 700, fontSize: "13px",
                            cursor: "pointer", transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f8fafc"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
                    >
                        Đóng
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
                @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
            `}</style>
        </div>
    );
}

function InfoItem({ label, value, color }: { label: string; value: string; color?: string }) {
    return (
        <div>
            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
            <p style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 700, color: color ?? "#1e293b" }}>{value}</p>
        </div>
    );
}

// ===== PAGINATION COMPONENT =====
const PAGE_SIZE = 5;

function Pagination({ current, total, onChange, slips }: {
    current: number;
    total: number;
    onChange: (p: number) => void;
    slips: BorrowedSlip[];
}) {
    if (total <= 1) return null;
    const pages = Array.from({ length: total }, (_, i) => i + 1);
    const btnBase: React.CSSProperties = {
        minWidth: "36px", height: "36px", padding: "0 10px",
        borderRadius: "9px", border: "1px solid #e2e8f0",
        background: "white", color: "#475569",
        fontSize: "13px", fontWeight: 600,
        cursor: "pointer", transition: "all 0.18s",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
    };
    const activeBtn: React.CSSProperties = {
        ...btnBase,
        background: "linear-gradient(135deg,#3b82f6,#2563eb)",
        color: "white", border: "1px solid #2563eb",
        boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
    };
    const disabledBtn: React.CSSProperties = {
        ...btnBase,
        opacity: 0.4, cursor: "not-allowed",
    };

    return (
        <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "6px", marginTop: "24px", flexWrap: "wrap",
        }}>
            <button
                style={current === 1 ? disabledBtn : btnBase}
                disabled={current === 1}
                onClick={() => onChange(current - 1)}
                onMouseEnter={e => { if (current !== 1) (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"; }}
                onMouseLeave={e => { if (current !== 1) (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
            >
                ‹
            </button>

            {pages.map(p => (
                <button
                    key={p}
                    style={p === current ? activeBtn : btnBase}
                    onClick={() => onChange(p)}
                    onMouseEnter={e => { if (p !== current) (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"; }}
                    onMouseLeave={e => { if (p !== current) (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
                >
                    {p}
                </button>
            ))}

            <button
                style={current === total ? disabledBtn : btnBase}
                disabled={current === total}
                onClick={() => onChange(current + 1)}
                onMouseEnter={e => { if (current !== total) (e.currentTarget as HTMLButtonElement).style.background = "#f1f5f9"; }}
                onMouseLeave={e => { if (current !== total) (e.currentTarget as HTMLButtonElement).style.background = "white"; }}
            >
                ›
            </button>

            <span style={{ fontSize: "13px", color: "#94a3b8", marginLeft: "8px" }}>
                Trang {current}/{total} · {slips.length > 0 ? `${slips.length} phiếu` : ""}
            </span>
        </div>
    );
}

// ===== SLIP LIST COMPONENT =====
type BorrowedSlipListProps = {
    slips: BorrowedSlip[];
    onCancelRequest?: (id: string) => void;
};

export function BorrowedSlipList({ slips, onCancelRequest }: BorrowedSlipListProps) {
    const [selectedSlip, setSelectedSlip] = useState<BorrowedSlip | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Reset về trang 1 khi danh sách thay đổi (lọc tab)
    useEffect(() => { setCurrentPage(1); }, [slips]);

    const totalPages = Math.max(1, Math.ceil(slips.length / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);
    const pagedSlips = slips.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    if (slips.length === 0) {
        return (
            <div style={{ textAlign: "center", padding: "80px 0", color: "#94a3b8" }}>
                <div style={{ fontSize: "56px", marginBottom: "16px" }}>📚</div>
                <p style={{ fontSize: "17px", fontWeight: 700, margin: 0, color: "#64748b" }}>Không có lịch sử mượn nào</p>
                <p style={{ fontSize: "14px", margin: "8px 0 0", color: "#94a3b8" }}>Hãy mượn sách đầu tiên của bạn!</p>
            </div>
        );
    }

    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {pagedSlips.map((slip) => {
                    const isRequest = slip.type === "request";
                    const c = STATUS_COLORS[slip.status] ?? STATUS_COLORS.borrowing;
                    const totalFine = slip.books.reduce((s, b) => s + (b.tienPhat ?? 0), 0);

                    return (
                        <div
                            key={slip.id}
                            style={{
                                borderRadius: "16px", overflow: "hidden",
                                border: "1px solid #e2e8f0",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                transition: "box-shadow 0.2s, transform 0.2s",
                                background: "white",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                                (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                            }}
                        >
                            {/* Card header */}
                            <div style={{
                                display: "flex", justifyContent: "space-between", alignItems: "center",
                                padding: "14px 20px",
                                background: isRequest
                                    ? "linear-gradient(90deg,#eff6ff,#f8faff)"
                                    : "linear-gradient(90deg,#f0fdf4,#f8fffb)",
                                borderBottom: "1px solid #e2e8f0",
                                flexWrap: "wrap", gap: "8px",
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                                    <span style={{
                                        fontSize: "11px", fontWeight: 800, letterSpacing: "0.08em",
                                        padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase",
                                        background: isRequest ? "#dbeafe" : "#d1fae5",
                                        color: isRequest ? "#1d4ed8" : "#065f46",
                                    }}>
                                        {isRequest ? "Yêu cầu" : "Phiếu mượn"}
                                    </span>
                                    <span style={{ fontSize: "13px", color: "#475569" }}>
                                        {isRequest ? "Đặt ngày" : "Mượn ngày"}: <strong>{slip.borrowDate}</strong>
                                    </span>
                                    <span style={{ fontSize: "13px", color: "#475569" }}>
                                        {isRequest ? "Hẹn ngày" : "Hạn trả"}: <strong>{slip.dueDate}</strong>
                                    </span>
                                    <span style={{ fontSize: "13px", color: "#94a3b8" }}>
                                        {slip.books.length} cuốn sách
                                    </span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{
                                        display: "inline-flex", alignItems: "center",
                                        padding: "4px 12px", borderRadius: "20px",
                                        fontSize: "12px", fontWeight: 700,
                                        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
                                    }}>
                                        {getStatusLabel(slip.status)}
                                    </span>
                                    {totalFine > 0 && (
                                        <span style={{
                                            fontSize: "12px", fontWeight: 700, color: "#e11d48",
                                            padding: "4px 10px", borderRadius: "20px",
                                            background: "#fff1f2", border: "1px solid #ffe4e6",
                                        }}>
                                            Phạt: {totalFine.toLocaleString("vi-VN")} đ
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Book previews (max 2) */}
                            <div style={{ padding: "14px 20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {slip.books.slice(0, 2).map(book => {
                                        const bc = STATUS_COLORS[book.status] ?? STATUS_COLORS.borrowing;
                                        return (
                                            <div key={book.id} style={{
                                                display: "flex", alignItems: "center", gap: "12px",
                                                padding: "8px 12px", borderRadius: "10px",
                                                background: "#f8fafc",
                                            }}>
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    style={{ width: "36px", height: "50px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }}
                                                    onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/36x50/e2e8f0/94a3b8?text=📖"; }}
                                                />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <p style={{ margin: 0, fontSize: "13px", fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{book.title}</p>
                                                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94a3b8" }}>{book.author}</p>
                                                </div>
                                                <span style={{
                                                    fontSize: "11px", fontWeight: 700,
                                                    padding: "3px 8px", borderRadius: "8px", flexShrink: 0,
                                                    background: bc.bg, color: bc.color, border: `1px solid ${bc.border}`,
                                                }}>
                                                    {getStatusLabel(book.status)}
                                                </span>
                                            </div>
                                        );
                                    })}
                                    {slip.books.length > 2 && (
                                        <p style={{ margin: 0, fontSize: "12px", color: "#94a3b8", paddingLeft: "12px" }}>
                                            +{slip.books.length - 2} cuốn khác...
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Footer actions */}
                            <div style={{
                                display: "flex", justifyContent: "flex-end", alignItems: "center",
                                gap: "8px", padding: "12px 20px",
                                borderTop: "1px solid #f1f5f9", background: "#fafbff",
                            }}>
                                {isRequest && slip.status === "pending" && (
                                    <button
                                        onClick={() => onCancelRequest && onCancelRequest(slip.id)}
                                        style={{
                                            padding: "7px 16px", borderRadius: "9px",
                                            border: "1px solid #ffe4e6", background: "#fff1f2",
                                            color: "#e11d48", fontWeight: 700, fontSize: "12px",
                                            cursor: "pointer", transition: "all 0.2s",
                                        }}
                                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ffe4e6"; }}
                                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff1f2"; }}
                                    >
                                        Hủy yêu cầu
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedSlip(slip)}
                                    style={{
                                        padding: "7px 18px", borderRadius: "9px",
                                        border: "1px solid #e2e8f0", background: "white",
                                        color: "#475569", fontWeight: 700, fontSize: "12px",
                                        cursor: "pointer", transition: "all 0.2s",
                                        display: "inline-flex", alignItems: "center", gap: "5px",
                                    }}
                                    onMouseEnter={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = "#eff6ff";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#bfdbfe";
                                        (e.currentTarget as HTMLButtonElement).style.color = "#1d4ed8";
                                    }}
                                    onMouseLeave={e => {
                                        (e.currentTarget as HTMLButtonElement).style.background = "white";
                                        (e.currentTarget as HTMLButtonElement).style.borderColor = "#e2e8f0";
                                        (e.currentTarget as HTMLButtonElement).style.color = "#475569";
                                    }}
                                >
                                    🔍 Xem chi tiết
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            <Pagination
                current={safePage}
                total={totalPages}
                onChange={(p) => setCurrentPage(p)}
                slips={slips}
            />

            {/* Detail Dialog */}
            {selectedSlip && (
                <SlipDetailDialog
                    slip={selectedSlip}
                    onClose={() => setSelectedSlip(null)}
                    onCancel={onCancelRequest}
                />
            )}
        </>
    );
}

// ===== LEGACY DEFAULT EXPORT =====
type BorrowedBookListProps = {
    books: BorrowedBook[];
    onCancelRequest?: (id: string) => void;
};

function BorrowedBookList({ books, onCancelRequest }: BorrowedBookListProps) {
    return (
        <div className={styles["borrowed-book-list-container"]}>
            <table className={styles["borrowed-book-table"]}>
                <thead>
                    <tr>
                        <th>Sách</th>
                        <th>Ngày mượn</th>
                        <th>Hạn trả</th>
                        <th>Ngày trả</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>
                                <div className={styles["book-info-cell"]}>
                                    <img src={book.coverImage} alt={book.title} className={styles["book-cover-mini"]} />
                                    <div>
                                        <p className={styles["book-title-cell"]}>{book.title}</p>
                                        <p className={styles["book-author-cell"]}>{book.author}</p>
                                    </div>
                                </div>
                            </td>
                            <td>{book.borrowDate}</td>
                            <td>{book.dueDate}</td>
                            <td>{book.returnDate || "—"}</td>
                            <td>
                                <StatusBadge status={book.status} />
                            </td>
                            <td>
                                {book.status === "pending" && (
                                    <button
                                        className={`${styles["action-btn"]} ${styles["cancel-btn"]}`}
                                        onClick={() => onCancelRequest && onCancelRequest(book.id)}
                                    >
                                        Hủy yêu cầu
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BorrowedBookList;

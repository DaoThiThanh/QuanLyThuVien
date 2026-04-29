import React from "react";
import "./BorrowedBookList.css";


// Component to display the list of borrowed books
export interface BorrowedBook {

    id: string;
    title: string;
    author: string;
    borrowDate: string;
    dueDate: string;
    returnDate?: string;
    status: "borrowing" | "returned" | "overdue";
    coverImage: string;
}

type BorrowedBookListProps = {
    books: BorrowedBook[];
};

function BorrowedBookList({ books }: BorrowedBookListProps) {
    const getStatusLabel = (status: BorrowedBook["status"]) => {
        switch (status) {
            case "borrowing": return "Đang mượn";
            case "returned": return "Đã trả";
            case "overdue": return "Quá hạn";
            default: return "";
        }
    };

    return (
        <div className="borrowed-book-list-container">
            <table className="borrowed-book-table">
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
                                <div className="book-info-cell">
                                    <img src={book.coverImage} alt={book.title} className="book-cover-mini" />
                                    <div>
                                        <p className="book-title-cell">{book.title}</p>
                                        <p className="book-author-cell">{book.author}</p>
                                    </div>
                                </div>
                            </td>
                            <td>{book.borrowDate}</td>
                            <td>{book.dueDate}</td>
                            <td>{book.returnDate || "-"}</td>
                            <td>
                                <span className={`status-badge ${book.status}`}>
                                    {getStatusLabel(book.status)}
                                </span>
                            </td>
                            <td>
                                <button className="action-btn">Chi tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default BorrowedBookList;

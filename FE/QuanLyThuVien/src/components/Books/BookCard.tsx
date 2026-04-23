import './BookCard.css'
import type { BookItem } from './BookGrid';
import { FiEye } from "react-icons/fi";

type BookCardProps = {
    book: BookItem;
    onViewDetail: (book: BookItem) => void;
};

function BookCard(props: BookCardProps) {
    const { book, onViewDetail } = props;
    return (
        <div className='book-card'>
            <div className='book-card-image-wrapper'>
                <img className='book-card-image'
                    src={book.image}
                    alt={book.title} />
                <span className={
                    book.status === "available"
                        ? "book-card-status book-card-status-available"
                        : "book-card-status book-card-status-unavailable"
                }
                >
                    <span className="status-dot"></span>
                    {book.status === "available" ? "Có sẵn" : "Hết sách"}
                </span>
            </div>
            <div className="book-card-content">
                <div className="book-card-category">{book.category}</div>

                <h3 className="book-card-title">{book.title}</h3>

                <p className="book-card-author">{book.author}</p>

                <div className="book-card-footer">
                    <span className="book-card-year">{book.year}</span>
                    <button
                        className="book-card-button"
                        onClick={() => onViewDetail(book)}
                    >
                        <FiEye size={16} />
                        Xem chi tiết
                    </button>
                </div>
            </div>
        </div>
    )
}
export default BookCard;

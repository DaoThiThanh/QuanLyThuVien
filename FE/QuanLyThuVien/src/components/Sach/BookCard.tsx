import styles from './BookCard.module.css'
import type { BookItem } from './BookGrid';
import { FiEye } from "react-icons/fi";

type BookCardProps = {
    book: BookItem;
    onViewDetail: (book: BookItem) => void;
};

function BookCard(props: BookCardProps) {
    const { book, onViewDetail } = props;
    return (
        <div className={styles['book-card']}>
            <div className={styles['book-card-image-wrapper']}>
                <img className={styles['book-card-image']}
                    src={book.image}
                    alt={book.title} />
                <span className={
                    book.status === "available"
                        ? `${styles['book-card-status']} ${styles['book-card-status-available']}`
                        : `${styles['book-card-status']} ${styles['book-card-status-unavailable']}`
                }
                >
                    <span className={styles['status-dot']}></span>
                    {book.status === "available" ? "Có sẵn" : "Hết sách"}
                </span>
            </div>
            <div className={styles['book-card-content']}>
                <div className={styles['book-card-category']}>{book.category}</div>

                <h3 className={styles['book-card-title']}>{book.title}</h3>

                <p className={styles['book-card-author']}>{book.author}</p>

                <div className={styles['book-card-footer']}>
                    <span className={styles['book-card-year']}>{book.year}</span>
                    <button
                        className={styles['book-card-button']}
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

import "./BookGrid.css";
import BookCard from "./BookCard";
export type BookItem = {
    id: string;
    title: string;
    author: string;
    year: number;
    category: string;
    status: "available" | "unavailable"
    image: string;
}
type BookGridProps = {
    books: BookItem[]; //mảng ds sách
    onViewDetail: (book: BookItem) => void; //hàm gửi sách
}
function BookGrid(props: BookGridProps) {
    return (
        <div className="book-grid">
            {props.books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    onViewDetail={props.onViewDetail}
                />
            ))}
        </div>
    )
}
export default BookGrid;


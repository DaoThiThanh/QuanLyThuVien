import "./BorrowedTitle.css";
type BorrowedTitleProps = {
    title: string;
    subtitle: string;
};
function BorrowedTitle(props: BorrowedTitleProps) {
    const title = props.title;
    const subtitle = props.subtitle;
    return (
        <div className="borrowed-title">
            <h1 className="borrowed-title-text">{title}</h1>
            <p className="borrowed-title-subtitle">{subtitle}</p>
        </div>
    );
}
export default BorrowedTitle;
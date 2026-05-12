import styles from "./TieuDeMuonSach.module.css";
type BorrowedTitleProps = {
    title: string;
    subtitle: string;
};
function BorrowedTitle(props: BorrowedTitleProps) {
    const title = props.title;
    const subtitle = props.subtitle;
    return (
        <div className={styles['borrowed-title']}>
            <h1 className={styles['borrowed-title-text']}>{title}</h1>
            <p className={styles['borrowed-title-subtitle']}>{subtitle}</p>
        </div>
    );
}
export default BorrowedTitle;
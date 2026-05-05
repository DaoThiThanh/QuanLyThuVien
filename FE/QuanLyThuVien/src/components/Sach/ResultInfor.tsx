import styles from "./ResultInfor.module.css";
type ResultInforProps = {
    count: number;
}
function ResultInfor(props: ResultInforProps) {
    return (
        <div className={styles['result-infor-container']}>
            <p className={styles['result-infor-text']}>
                Hiển thị: <strong>{props.count}</strong> kết quả
            </p>
        </div>
    )
}
export default ResultInfor;
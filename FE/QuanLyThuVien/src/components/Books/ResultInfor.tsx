import "./ResultInfor.css";
type ResultInforProps = {
    count: number;
}
function ResultInfor(props: ResultInforProps) {
    return (
        <div className="result-infor-container">
            <p className="result-infor-text">
                Hiển thị: <strong>{props.count}</strong> kết quả
            </p>
        </div>
    )
}
export default ResultInfor;
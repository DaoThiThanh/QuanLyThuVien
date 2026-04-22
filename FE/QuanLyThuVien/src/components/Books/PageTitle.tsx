
import './PageTitle.css';
type PageTitleProps = {
    title: string;
    subtitle: string;
};
function PageTitle(props: PageTitleProps) {
    const title = props.title;
    const subtitle = props.subtitle;
    return (
        <div className="page-title">
            <h1 className="page-title-text">{title}</h1>
            <p className="page-title-subtitle">{subtitle}</p>
        </div>
    );

}
export default PageTitle;
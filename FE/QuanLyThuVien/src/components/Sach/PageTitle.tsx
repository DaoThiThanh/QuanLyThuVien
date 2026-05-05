
import styles from './PageTitle.module.css';
type PageTitleProps = {
    title: string;
    subtitle: string;
};
function PageTitle(props: PageTitleProps) {
    const title = props.title;
    const subtitle = props.subtitle;
    return (
        <div className={styles['page-title']}>
            <h1 className={styles['page-title-text']}>{title}</h1>
            <p className={styles['page-title-subtitle']}>{subtitle}</p>
        </div>
    );

}
export default PageTitle;
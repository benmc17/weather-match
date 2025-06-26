import styles from "./PageHeader.module.css";

const PageHeader = ({ headerText }: { headerText: string }) => (
    <div className={styles.pageHeader}>
        <h1>{ headerText }</h1>
    </div>
)
export default PageHeader
import styles from "./PageHeader.module.css";

export default ({ headerText }: { headerText: string }) => (
    <div className={styles.pageHeader}>
        <h1>{ headerText }</h1>
    </div>
)
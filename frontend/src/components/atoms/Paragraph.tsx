import styles from "./Paragraph.module.css";

const Paragraph = ({ children }: { children: React.ReactNode }) => (
    <p className={styles.paragraph}>
        {children}
    </p>
)
export default Paragraph
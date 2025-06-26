import { ReactNode } from "react";
import styles from "./MainTemplate.module.css";

const MainTemplate = ({ children }: { children: ReactNode}) => (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
            {children}
        </div>
      </main>
    </div>
)
export default MainTemplate
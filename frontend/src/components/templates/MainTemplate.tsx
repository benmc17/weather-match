import { ReactNode } from "react";
import styles from "./MainTemplate.module.css";

export default ({ children }: { children: ReactNode}) => (
    <div className={styles.page}>
      <main className={styles.main}>
        <div>
            {children}
        </div>
      </main>
    </div>
)
import styles from "./ResultsBox.module.css";

export type Result = {
  displayValue: string;
  rank: number;
  score: number;
};

const ResultsBox = ({ result }: { result: Result }) => (
    <div key={result.rank} className={styles.resultBox}>
      <div className={styles.rank}>#{result.rank}</div>
      <div className={styles.name}>{result.displayValue}</div>
      <div className={styles.score}>Score: {result.score.toFixed(2)}</div>
    </div>
)
export default ResultsBox
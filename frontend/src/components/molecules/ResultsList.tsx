import ResultsBox, { Result } from "../atoms/ResultsBox";
import styles from "./ResultsList.module.css";

const ResultsList = ({ results }: { results: Result[] }) => {
  const sorted = [...results].sort((a, b) => a.rank - b.rank);

  return (
    <div className={styles.resultsList}>
      {sorted.map((result) => (
        <ResultsBox key={result.rank} result={result} />
      ))}
    </div>
  );
}
export default ResultsList
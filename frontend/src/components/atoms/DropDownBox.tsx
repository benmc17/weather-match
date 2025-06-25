import styles from "./DropDownBox.module.css";

export type Option = { id: number, display: string, value: string, meta: any }

export default ({ onSelect, options }: { onSelect: (option: Option) => void, options: Option[] }) => (
    <ul className={styles.dropdown}>
        {options.map(option => (
            <li
                key={option.id}
                className={styles.dropdownItem}
                onClick={() => onSelect(option)}
            >
                {option.display}
            </li>
        ))}
    </ul>
)


import styles from "./TextBox.module.css";

const TextBox = ({ 
    value, 
    placeholder = "Enter text...", 
    onChange 
}: { 
    value?: string
    placeholder?: string
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void 
}) => {
    
    return (
        <div className={styles.textBox}>
            <input
                className={styles.input}
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                autoComplete="off"
            />
        </div>
    )
}
export default TextBox
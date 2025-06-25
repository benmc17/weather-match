import styles from "./DropDownSelector.module.css";
import TextBox from "../atoms/TextBox"
import { useCallback, useEffect, useState } from "react";
import DropDownBox, { Option } from "../atoms/DropDownBox";

export default ({ placeholder, options, onChange, onSelect } : { placeholder: string, options: Option[], onChange: (newValue: string) => void, onSelect: (selected: Option) => void }) => {
    const [value, setValue] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        setShowDropdown(options.length > 0);
    }, [options])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setValue(val);
        onChange(val)
    }, [onChange]);

    const handleSelect = useCallback((option: Option) => {
        setValue(option.value);
        setShowDropdown(false);
        onSelect(option)
    }, [onSelect]);

    return (
        <div className={styles.dropDownSelector}>
            <TextBox value={value} placeholder={placeholder} onChange={handleChange} />
            {showDropdown && (
                <DropDownBox options={options} onSelect={handleSelect}/>
            )}
        </div>
    )
}
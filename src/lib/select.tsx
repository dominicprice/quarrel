import { ReactNode } from "react";

interface SelectProps {
    onChange?: (value: string) => void;
    disabled?: boolean;
    value?: string;
    children?: ReactNode | ReactNode[];
}

const Select = ({ onChange, disabled, value, children }: SelectProps) => {
    return (
        <div className="relative cursor-pointer">
            <select
                className="w-48 p-2 bg-white border shadow"
                onChange={(e) => onChange && onChange(e.target.value)}
                disabled={disabled}
                value={value}
                style={{ WebkitAppearance: "none" }}
            >
                {children}
            </select>
            <img
                src="/assets/chevron-down.svg"
                className="absolute right-1 w-4 h-4 top-3"
            />
        </div>
    );
};

export default Select;

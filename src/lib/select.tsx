import { ReactNode, useId } from "react";
import { twMerge } from "tailwind-merge";

interface SelectProps {
	onChange?: (value: string) => void;
	disabled?: boolean;
	value?: string;
	children?: ReactNode | ReactNode[];
	className?: string;
	chevronSize?: number;
}

const Select = ({
	onChange,
	disabled,
	value,
	children,
	className,
	chevronSize,
}: SelectProps) => {
	const id = useId();
	return (
		<div
			className={twMerge(
				"flex flex-row justify-between items-center cursor-pointer w-48 p-2 bg-white border border-neutral-200 rounded shadow-sm",
				className,
			)}
		>
			<select
				onChange={(e) => onChange && onChange(e.target.value)}
				className="cursor-[inherit] w-full"
				disabled={disabled}
				value={value}
				style={{ WebkitAppearance: "none" }}
				id={id}
			>
				{children}
			</select>
			<label
				htmlFor={id}
				className="material-symbols-outlined w-4 h-4 cursor-pointer"
				style={{ fontSize: chevronSize || 20 }}
			>
				keyboard_arrow_down
			</label>
		</div>
	);
};

export default Select;

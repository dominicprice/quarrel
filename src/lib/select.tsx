import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface SelectProps {
	onChange?: (value: string) => void;
	disabled?: boolean;
	value?: string;
	children?: ReactNode | ReactNode[];
	className?: string;
}

const Select = ({
	onChange,
	disabled,
	value,
	children,
	className,
}: SelectProps) => {
	return (
		<div
			className={twMerge(
				"flex flex-row justify-between items-center cursor-pointer w-48 p-2 bg-white border border-neutral-200 rounded shadow-sm",
				className,
			)}
		>
			<select
				onChange={(e) => onChange && onChange(e.target.value)}
				className="cursor-[inherit]"
				disabled={disabled}
				value={value}
				style={{ WebkitAppearance: "none" }}
			>
				{children}
			</select>
			<img src="/assets/chevron-down.svg" className="w-4 h-4" />
		</div>
	);
};

export default Select;

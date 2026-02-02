import classNames from "classnames";
import { ReactNode, memo } from "react";

interface MenuItemProps {
	label: string;
	level: number;
	onClick?: () => void;
	children?: ReactNode | ReactNode[];
}

function menuClass(level: number): string {
	switch (level) {
		case 0:
			return "group/level0 px-4";
		case 1:
			return "group/level1 pl-4 w-full";
		case 2:
			return "w-full px-4";
		default:
			throw new Error("too many levels of menu nesting");
	}
}

function subMenuClass(level: number): string {
	switch (level) {
		case 0:
			return "group-hover/level0:flex min-w-36 top-8 left-0";
		case 1:
			return "group-hover/level1:flex min-w-36 left-full top-0";
		default:
			throw new Error("too many levels of menu nesting");
	}
}

const MenuItem = memo(({ label, onClick, children, level }: MenuItemProps) => {
	return (
		<div
			onClick={onClick}
			className={classNames(
				"flex",
				"items-center",
				{
					"justify-center": level === 0,
					"justify-between": level !== 0,
				},
				"relative",
				"text-xs",
				"select-none",
				"group/item",
				"py-2",
				"cursor-pointer",
				"hover:bg-neutral-700",
				"transition",
				"text-neutral-200",
				"whitespace-nowrap",
				"z-30",
				menuClass(level),
			)}
		>
			<div className="select-none flex flex-row justify-between items-center w-full">
				{label}
				{level === 1 && children && (
					<div className="material-symbols-outlined" style={{ fontSize: 16 }}>
						keyboard_arrow_right
					</div>
				)}
			</div>
			{children ? (
				<div
					className={classNames(
						"bg-radial",
						"to-neutral-800",
						"from-neutral-700",
						"absolute",
						subMenuClass(level),
						"flex-col",
						"hidden",
						"items-start",
						"shadow-sm",
					)}
				>
					{children}
				</div>
			) : (
				<></>
			)}
		</div>
	);
});

export default MenuItem;

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
            return "group/level0";
        case 1:
            return "group/level1 w-full";
        case 2:
            return "w-full";
        default:
            throw new Error("too many levels of menu nesting");
    }
}

function subMenuClass(level: number): string {
    switch (level) {
        case 0:
            return "group-hover/level0:flex w-36 top-10 left-0";
        case 1:
            return "group-hover/level1:flex w-36 left-36 top-0";
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
                "align-center",
                {
                    "justify-center": level === 0,
                    "justify-between": level !== 0,
                },
                "relative",
                "select-none",
                "group/item",
                "px-4",
                "py-2",
                "cursor-pointer",
                "hover:bg-neutral-700",
                "transition",
                "whitespace-nowrap",
                "z-30",
                menuClass(level),
            )}
        >
            <div className="select-none flex flex-row">{label}</div>
            {level === 1 && children && (
                <img className="w-4 h-4 invert" src="/chevron-right.svg" />
            )}
            {children ? (
                <div
                    className={classNames(
                        "bg-neutral-800",
                        "absolute",
                        subMenuClass(level),
                        "flex-col",
                        "items-start",
                        "hidden",
                        "shadow",
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

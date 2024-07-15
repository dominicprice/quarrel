import classNames from "classnames";
import { ReactNode, memo } from "react";

interface MenuItemProps {
    label: string;
    onClick?: () => void;
    children?: ReactNode | ReactNode[];
}

const MenuItem = memo(({ label, onClick, children }: MenuItemProps) => {
    return (
        <div
            onClick={onClick}
            className={classNames(
                "flex",
                "align-center",
                "justify-center",
                "relative",
                "select-none",
                "group/item",
                "px-2",
                "cursor-pointer",
                "hover:bg-neutral-700",
                "transition",
            )}
        >
            <div className="select-none flex flex-row">{label}</div>
            {children ? (
                <div
                    className={classNames(
                        "border-l",
                        "border-black",
                        "bg-neutral-800",
                        "absolute",
                        "top-6",
                        "left-0",
                        "w-64",
                        "flex-col",
                        "items-start",
                        "hidden",
                        "group-hover/item:flex",
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

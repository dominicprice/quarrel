import classNames from "classnames";
import { ReactNode } from "react";

type MenuBarProps = {
    children: ReactNode[];
};

const MenuBar = ({ children }: MenuBarProps) => {
    return (
        <div
            className={classNames(
                "w-full",
                "bg-neutral-800",
                "text-white",
                "flex",
                "flex-row",
            )}
        >
            {children}
            <div className="order-2 ml-auto flex items-center pr-1">
                <img className="w-8 h-8" src="/logo.svg" />
            </div>
        </div>
    );
};

export default MenuBar;

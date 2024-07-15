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
            <div className="order-2 ml-auto">
                <img className="w-6 h-6" src="/logo.svg" />
            </div>
        </div>
    );
};

export default MenuBar;

import classNames from "classnames";
import { ReactNode, memo } from "react";
import { intersperse } from "../lib/utils";

interface MenuCellProps {
    letter: string;
    hasSpace?: boolean;
}

function toCellProps(word: string): MenuCellProps[] {
    const res = [];
    for (let i = 0; i < word.length; ++i) {
        if (word[i] !== " ")
            res.push({ letter: word[i], hasSpace: word[i + 1] === " " });
    }
    return res;
}

const MenuCell = memo(({ letter, hasSpace }: MenuCellProps) => {
    return (
        <div
            className={classNames(
                "w-6",
                "h-6",
                { "bg-white": letter !== "" },
                { "bg-neutral-800": letter == "" },
                "text-neutral-800",
                "flex",
                "justify-center",
                "items-center",
                { "border-r": letter !== "" && !hasSpace },
                { "border-r-2": hasSpace },
                "border-b",
                "border-t",
                "border-black",
                "uppercase",
                "font-bold",
                "text-sm",
                { "group-hover/label:bg-amber-100": letter !== "" },
                "transition",
                { "cursor-pointer": letter !== "" },
            )}
        >
            {letter}
        </div>
    );
});

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
            )}
        >
            <div className="select-none flex flex-row group/label">
                {toCellProps(label).map((props, i) => (
                    <MenuCell key={i} {...props} />
                ))}
            </div>
            {children ? (
                <div
                    className={classNames(
                        "border-l",
                        "border-black",
                        "bg-neutral-800",
                        "block",
                        "absolute",
                        "top-6",
                        "left-0",
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
                "border-b",
                "border-t",
                "border-black",
            )}
        >
            {intersperse(children, <MenuCell letter="" />)}
            <div className="order-2 ml-auto">
                <MenuItem label="Quarrel" />
            </div>
        </div>
    );
};

export { MenuItem };
export default MenuBar;

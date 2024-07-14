import classNames from "classnames";
import { memo } from "react";

interface ModalHeaderCellProps {
    letter: string;
    hasSpace?: boolean;
}

function toCellProps(word: string): ModalHeaderCellProps[] {
    const res = [];
    for (let i = 0; i < word.length; ++i) {
        if (word[i] !== " ")
            res.push({ letter: word[i], hasSpace: word[i + 1] === " " });
    }
    return res;
}

const ModalHeaderCell = memo(({ letter, hasSpace }: ModalHeaderCellProps) => {
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

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
}

const ModalHeader = ({ title, onClose }: ModalHeaderProps) => {
    return (
        <div
            className={classNames(
                "flex",
                "content-between",
                "h-10",
                "p-2",
                "rounded-t",
                "bg-neutral-800",
                "border-b-1",
            )}
        >
            {toCellProps(title).map((props, i) => (
                <ModalHeaderCell key={i} {...props} />
            ))}
            <div className="ml-auto order-2">
                <button
                    className={classNames(
                        "w-6",
                        "h-6",
                        "bg-red-600",
                        "text-white",
                        "flex",
                        "justify-center",
                        "items-center",
                        "border",
                        "border-black",
                        "font-bold",
                        "text-sm",
                    )}
                    onClick={onClose}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

interface ModalProps {
    title: string;
    children: JSX.Element;
    show: boolean;
    onClose: () => void;
}

const Modal = ({ title, children, show, onClose }: ModalProps) => {
    return (
        <div
            className={classNames(
                "z-50",
                "justify-center",
                "items-center",
                "shadow",
                "w-[100vw]",
                "h-[100vh]",
                "fixed",
                "bg-black",
                "bg-opacity-50",
                { flex: show, hidden: !show },
            )}
        >
            <div
                className={classNames(
                    "flex",
                    "flex-col",
                    "w-[50vw]",
                    "h-[50vh]",
                    "bg-white",
                    "rounded",
                )}
            >
                <ModalHeader title={title} onClose={onClose} />
                <div className={classNames("overflow-y-scroll")}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;

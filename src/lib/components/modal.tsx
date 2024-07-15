import classNames from "classnames";
import { memo } from "react";

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
            <div className="text-neutral-300 font-bold">{title}</div>
            <div className="ml-auto order-2">
                <button
                    className="text-white font-bold text-lg"
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

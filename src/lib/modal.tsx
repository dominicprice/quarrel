import classNames from "classnames";

type ModalSize = "sm" | "lg";

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
                "bg-neutral-800",
                "border-b-1",
            )}
        >
            <div className="text-neutral-300 font-bold">{title}</div>
            <div className="ml-auto order-2">
                <button
                    className="text-white font-bold text-xl leading-3"
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
    size?: ModalSize;
    onClose: () => void;
}

const Modal = ({ title, children, show, onClose, size }: ModalProps) => {
    if (!show) return null;

    return (
        <div
            className={classNames(
                "z-50",
                "justify-center",
                "items-center",
                "w-[100vw]",
                "h-[100vh]",
                "fixed",
                "bg-black",
                "bg-opacity-50",
                "flex",
            )}
        >
            <div
                className={classNames(
                    "flex",
                    "flex-col",
                    "w-[90vw]",
                    "h-[90vh]",
                    {
                        "md:w-[684px]": size === "lg",
                        "md:h-[70vh]": size === "lg",
                    },
                    "bg-white",
                    "shadow",
                )}
            >
                <ModalHeader title={title} onClose={onClose} />
                <div className="p-2 overflow-y-scroll flex-1">{children}</div>
            </div>
        </div>
    );
};

export default Modal;
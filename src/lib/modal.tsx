import classNames from "classnames";
import { JSX, useEffect } from "react";

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
				"rounded-t-lg",
			)}
		>
			<div className="text-neutral-300 font-bold">{title}</div>
			<div className="ml-auto order-2">
				<button
					className="text-white font-bold text-xl leading-3"
					onClick={onClose}
				>
					<div className="material-symbols-outlined w-6 h-6 cursor-pointer">
						close
					</div>
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
	useEffect(() => {
		const bodyTags = document.getElementsByTagName("body");
		if (bodyTags.length <= 0) return;
		const body = bodyTags[0];
		if (show) {
			body.classList.add("modal-open");
		} else {
			body.classList.remove("modal-open");
		}
	}, [show]);

	if (!show) return null;

	return (
		<div
			className={classNames(
				"z-50",
				"justify-center",
				"items-center",
				"w-screen",
				"h-screen",
				"fixed",
				"bg-black/50",
				"flex",
				"backdrop-blur-xs",
			)}
		>
			<div
				className={classNames(
					"flex",
					"flex-col",
					"w-[90vw]",
					"max-h-[90vh]",
					"lg:w-2/3",
					"xl:w-1/2",
				)}
			>
				<ModalHeader title={title} onClose={onClose} />
				<div className="p-2 lg:p-4 bg-white rounded-b-lg overflow-y-scroll flex-1 border-2 border-neutral-800">
					{children}
				</div>
			</div>
		</div>
	);
};

export default Modal;

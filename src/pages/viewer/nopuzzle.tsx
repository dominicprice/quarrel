import classNames from "classnames";

interface NoPuzzleProps {
	title: string;
	message?: string;
	iconName: string;
	iconSpin?: boolean;
}
const NoPuzzle = ({ title, message, iconName, iconSpin }: NoPuzzleProps) => {
	return (
		<div className="flex-1 flex flex-col items-center justify-center">
			<div className="flex flex-col items-center justify-center gap-4">
				{iconName && (
					<div
						className={classNames("material-symbols-outlined", {
							"animate-spin": iconSpin,
						})}
						style={{ fontSize: 64 }}
					>
						{iconName}
					</div>
				)}
				<h1 className="text-2xl text-neutral-800">{title}</h1>
				{message && <p>{message}</p>}
			</div>
		</div>
	);
};

export default NoPuzzle;

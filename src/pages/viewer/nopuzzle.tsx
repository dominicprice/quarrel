import classNames from "classnames";

interface NoPuzzleProps {
    title: string;
    message?: string;
    iconUrl?: string;
    iconSpin?: boolean;
}
const NoPuzzle = ({ title, message, iconUrl, iconSpin }: NoPuzzleProps) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4">
                {iconUrl && (
                    <img
                        src={iconUrl}
                        className={classNames("w-16 h-16", {
                            "animate-spin": iconSpin,
                        })}
                    />
                )}
                <h1 className="text-2xl text-neutral-800">{title}</h1>
                {message && <p>{message}</p>}
            </div>
        </div>
    );
};

export default NoPuzzle;

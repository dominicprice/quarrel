import classNames from "classnames";

interface CompletionProps {
    word: string;
    onSelect?: (completion: string) => void;
}

const Completion = ({ word, onSelect }: CompletionProps) => {
    return (
        <button
            className={classNames(
                "py-1",
                "px-8",
                "w-full",
                "block",
                { "hover:bg-amber-50": onSelect !== undefined },
                "border-b",
                "border-neutral-50",
                "text-xs",
            )}
            disabled={onSelect === undefined}
            onClick={onSelect && (() => onSelect(word))}
        >
            {word}
        </button>
    );
};

export default Completion;

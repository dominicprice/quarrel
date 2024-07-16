import classNames from "classnames";

interface CompletionProps {
    word: string;
    onSelect: (completion: string) => void;
}

const Completion = ({ word, onSelect }: CompletionProps) => {
    return (
        <button
            className={classNames(
                "py-1",
                "px-8",
                "w-full",
                "block",
                "hover:bg-amber-50",
                "border-b",
                "border-neutral-50",
                "text-xs",
            )}
            onClick={() => onSelect(word)}
        >
            {word}
        </button>
    );
};

export default Completion;

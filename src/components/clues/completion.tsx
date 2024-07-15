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
                "hover:bg-neutral-100",
            )}
            onClick={() => onSelect(word)}
        >
            {word}
        </button>
    );
};

export default Completion;

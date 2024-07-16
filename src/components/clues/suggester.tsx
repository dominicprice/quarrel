import classNames from "classnames";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import completeWord, { isWord } from "#/lib/complete";
import CompletionList from "./completionlist";

type SuggesterProps = {
    pattern: string;
    onSelect: (selectedOption: string) => void;
};

const Suggester = ({ pattern, onSelect }: SuggesterProps) => {
    const [show, setShow] = useState(false);

    const ref = useRef(null);
    useOnClickOutside([ref], () => setShow(false));

    const onWordSuggestered = (word: string) => {
        setShow(false);
        onSelect(word);
    };

    const hasMissingLetters = pattern.indexOf("?") >= 0;
    const isCorrect = hasMissingLetters ? false : isWord(pattern);

    return (
        <div className={classNames("relative", "inline-block")}>
            <button
                disabled={!hasMissingLetters}
                className={classNames(
                    {
                        "bg-blue-600 text-white": hasMissingLetters,
                        "bg-green-600 text-white":
                            !hasMissingLetters && isCorrect,
                        "bg-red-600 text-white":
                            !hasMissingLetters && !isCorrect,
                    },
                    "transition",
                    "text-xs",
                    "rounded-full",
                    "w-4",
                    "h-4",
                    "black",
                    "text-md",
                    "font-bold",
                )}
                onClick={() => setShow(!show)}
            >
                {hasMissingLetters ? "?" : isCorrect ? "✓" : "x"}
            </button>
            {show && (
                <CompletionList
                    ref={ref}
                    completions={completeWord(pattern, 100)}
                    onSelect={onWordSuggestered}
                />
            )}
        </div>
    );
};

export default Suggester;

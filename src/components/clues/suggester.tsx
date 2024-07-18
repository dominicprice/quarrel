import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { checkWord, completeWord } from "#/lib/dictionary";
import CompletionList from "./completionlist";

enum SuggestMode {
    Unknown = 0,
    Incomplete = 1,
    Correct = 2,
    Incorrect = 3,
}

function modeIndicator(mode: SuggestMode): [string, string] {
    switch (mode) {
        case SuggestMode.Unknown:
            return ["", "hidden"];
        case SuggestMode.Incomplete:
            return ["/search.svg", "bg-blue-600"];
        case SuggestMode.Correct:
            return ["/tick.svg", "bg-green-600"];
        case SuggestMode.Incorrect:
            return ["/cross.svg", "bg-red-600"];
    }
}

type SuggesterProps = {
    pattern: string;
    onSelect: (selectedOption: string) => void;
};

const Suggester = ({ pattern, onSelect }: SuggesterProps) => {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState(SuggestMode.Unknown);
    const [completions, setCompletions] = useState<string[] | null>(null);

    useEffect(() => {
        const hasMissingLetters = pattern.indexOf("?") >= 0;
        if (hasMissingLetters) {
            setMode(SuggestMode.Incomplete);
            return;
        }
        checkWord(pattern)
            .then((v) =>
                setMode(v ? SuggestMode.Correct : SuggestMode.Incorrect),
            )
            .catch(() => setMode(SuggestMode.Unknown));
    }, [pattern]);

    useEffect(() => {
        if (show) {
            completeWord(pattern, 100)
                .then((c) => setCompletions(c))
                .catch(() => setCompletions(null));
        } else {
            setCompletions(null);
        }
    }, [show]);

    const ref = useRef(null);
    useOnClickOutside([ref], () => setShow(false));

    const onWordSuggestered = (word: string) => {
        setShow(false);
        onSelect(word);
    };

    const [value, className] = modeIndicator(mode);

    return (
        <div className={classNames("relative", "inline-block")}>
            <button
                disabled={mode !== SuggestMode.Incomplete}
                className={classNames(
                    className,
                    "transition",
                    "text-xs",
                    "rounded-full",
                    "w-4",
                    "h-4",
                    "black",
                    "text-md",
                    "font-bold",
                    "flex",
                    "justify-center",
                    "content-center",
                    "align-center",
                    "items-center",
                )}
                onClick={() => setShow(!show)}
            >
                <img src={value} className="invert w-3 h-3" />
            </button>
            {show && (
                <CompletionList
                    ref={ref}
                    completions={completions}
                    onSelect={onWordSuggestered}
                />
            )}
        </div>
    );
};

export default Suggester;

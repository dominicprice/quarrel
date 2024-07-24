import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import anagramWord from "#/lib/dictionary/anagram";
import CompletionList from "./completionlist";

enum AnagramMode {
    Incomplete = 1,
    Complete = 2,
}

function modeIndicator(mode: AnagramMode): [string, string] {
    switch (mode) {
        case AnagramMode.Incomplete:
            return ["/assets/shuffle.svg", "bg-neutral-600"];
        case AnagramMode.Complete:
            return ["/assets/shuffle.svg", "bg-purple-600"];
    }
}

type AnagrammerProps = {
    pattern: string;
};

const Anagrammer = ({ pattern }: AnagrammerProps) => {
    const [show, setShow] = useState(false);
    const [mode, setMode] = useState(AnagramMode.Incomplete);
    const [completions, setCompletions] = useState<string[] | null>(null);

    useEffect(() => {
        setMode(
            pattern.indexOf("?") >= 0
                ? AnagramMode.Incomplete
                : AnagramMode.Complete,
        );
    }, [pattern]);

    useEffect(() => {
        if (show) {
            anagramWord(pattern)
                .then((c) => setCompletions(c))
                .catch(() => setCompletions(null));
        } else {
            setCompletions(null);
        }
    }, [show]);

    const ref = useRef(null);
    useOnClickOutside([ref], () => setShow(false));

    const [value, className] = modeIndicator(mode);

    return (
        <div className={classNames("relative", "inline-block")}>
            <button
                disabled={mode === AnagramMode.Incomplete}
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
                    "items-center",
                    "justify-center",
                )}
                onClick={() => setShow(!show)}
            >
                <img src={value} className="invert w-3 h-3" />
            </button>
            {show && <CompletionList ref={ref} completions={completions} />}
        </div>
    );
};

export default Anagrammer;

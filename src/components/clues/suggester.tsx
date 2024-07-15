import classNames from "classnames";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import completeWord from "#/lib/complete";
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

    const disabled = pattern.indexOf("?") < 0;

    return (
        <div className={classNames("relative", "inline-block")}>
            <button
                disabled={disabled}
                className={classNames(
                    {
                        "bg-neutral-200 text-black": disabled,
                        "bg-green-600 text-white": !disabled,
                    },
                    "transition",
                    "text-xs",
                    "rounded-full",
                    "w-4",
                    "h-4",
                    "black",
                    "text-md",
                    { "cursor-pointer": !disabled },
                )}
                onClick={() => setShow(!show)}
            >
                ?
            </button>
            {show && (
                <CompletionList
                    ref={ref}
                    completions={completeWord(pattern)}
                    onSelect={onWordSuggestered}
                />
            )}
        </div>
    );
};

export default Suggester;

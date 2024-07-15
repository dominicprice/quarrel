import classNames from "classnames";
import { forwardRef } from "react";
import Completion from "./completion";

interface CompletionListProps {
    completions: string[];
    onSelect: (completion: string) => void;
}

const CompletionList = forwardRef<HTMLDivElement | null, CompletionListProps>(
    ({ completions, onSelect }: CompletionListProps, ref) => {
        return (
            <div
                ref={ref}
                className={classNames(
                    "flex-col",
                    "absolute",
                    "right-2",
                    "top-8",
                    "bg-white",
                    "shadow",
                    "border-1",
                    "z-10",
                    "h-32",
                    "overflow-y-scroll",
                )}
            >
                {completions.length > 0 ? (
                    completions.map((word) => (
                        <Completion
                            key={word}
                            word={word}
                            onSelect={onSelect}
                        />
                    ))
                ) : (
                    <div className="italic py-1 px-2 text-neutral-600">
                        No completions
                    </div>
                )}
            </div>
        );
    },
);

export default CompletionList;

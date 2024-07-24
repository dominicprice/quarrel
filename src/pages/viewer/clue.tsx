import classNames from "classnames";
import { useEffect, useRef } from "react";

interface ClueProps {
    num: number;
    clue: string;
    active: boolean;
    onSelected: () => void;
}

const Clue = ({ clue, num, active, onSelected }: ClueProps) => {
    const ref = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        if (!active) return;
        const { current: el } = ref;
        if (!el) return;

        console.log("scrolling", el.closest("div"));
        el.parentElement!.scrollTop = el.offsetTop;
    });
    return (
        <div
            ref={ref}
            className={classNames("p-1", "cursor-pointer", {
                "bg-amber-50": active,
            })}
            onClick={onSelected}
        >
            {num}. {clue}
        </div>
    );
};

export default Clue;

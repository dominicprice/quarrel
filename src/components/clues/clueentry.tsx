import Clue from "#/lib/clue";
import Suggester from "./suggester";

interface ClueEntryProps {
    clue: Clue;
    onClueChanged: (value: string) => void;
    onAnswerChanged: (value: string) => void;
}

const ClueEntry = ({
    clue,
    onClueChanged,
    onAnswerChanged,
}: ClueEntryProps) => {
    return (
        <div key={clue.num} className="p-2 flex gap-2 items-center">
            <span className="w-8">{clue.num}. </span>
            <textarea
                value={clue.clue}
                onInput={(e) => onClueChanged(e.currentTarget.value)}
                placeholder={clue.answer}
                className="w-64 border resize-none p-1"
            ></textarea>
            <Suggester pattern={clue.answer} onSelect={onAnswerChanged} />
            <span>
                (
                {clue.answer
                    .split(" ")
                    .map((w) => w.length)
                    .join(",")}
                )
            </span>
        </div>
    );
};
export default ClueEntry;

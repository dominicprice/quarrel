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
        <div key={clue.num} className="p-2 flex flex-row gap-2 items-center">
            <div className="w-8 font-display">{clue.num}. </div>
            <textarea
                value={clue.clue}
                onInput={(e) => onClueChanged(e.currentTarget.value)}
                placeholder={clue.answer}
                className="w-64 border resize-none p-1 font-display"
            ></textarea>
            <div className="font-display">
                (
                {clue.answer
                    .split(" ")
                    .map((w) => w.length)
                    .join(",")}
                )
            </div>
            <Suggester pattern={clue.answer} onSelect={onAnswerChanged} />
        </div>
    );
};
export default ClueEntry;

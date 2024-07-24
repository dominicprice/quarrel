import Clue from "#/lib/clue";
import Anagrammer from "./anagrammer";
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
            <div className="w-8 font-serif">{clue.num}. </div>
            <textarea
                value={clue.clue}
                onInput={(e) => onClueChanged(e.currentTarget.value)}
                placeholder={clue.answer}
                className="w-64 border resize-none p-1 font-serif"
            ></textarea>
            <div className="flex flex-col gap-1 justify-center items-center">
                <div className="font-serif">({clue.lengths()})</div>
                <div className="flex flex-row gap-1">
                    <Suggester
                        pattern={clue.answer}
                        onSelect={onAnswerChanged}
                    />
                    <Anagrammer pattern={clue.answer} />
                </div>
            </div>
        </div>
    );
};
export default ClueEntry;

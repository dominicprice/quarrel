import Clue from "#/lib/clue";
import Anagrammer from "./anagrammer";
import Suggester from "./suggester";

interface ClueEntryProps {
	clue: Clue;
	onClueChanged: (value: string) => void;
	onClueFocused: () => void;
	onClueUnfocused: () => void;
	onAnswerChanged: (value: string) => void;
}

const ClueEntry = ({
	clue,
	onClueChanged,
	onClueFocused,
	onClueUnfocused,
	onAnswerChanged,
}: ClueEntryProps) => {
	return (
		<div key={clue.num} className="p-2 flex flex-row gap-2 items-center">
			<div className="w-8 font-serif">{clue.num}. </div>
			<div className="grow-wrap" data-replicated-value={clue.clue}>
				<textarea
					value={clue.clue}
					onInput={(e) => onClueChanged(e.currentTarget.value)}
					onFocus={onClueFocused}
					onBlur={onClueUnfocused}
					placeholder={clue.answer}
				></textarea>
			</div>
			<div className="flex flex-col gap-1 justify-center items-center">
				<div className="font-serif">({clue.lengths()})</div>
				<div className="flex flex-row gap-1">
					<Suggester pattern={clue.answer} onSelect={onAnswerChanged} />
					<Anagrammer pattern={clue.answer} />
				</div>
			</div>
		</div>
	);
};
export default ClueEntry;

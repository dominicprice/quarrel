import Cell from "#/lib/cell";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import ClueEntry from "./clueentry";

interface ClueListProps {
	cells: [Cell, Position][];
	dir: Dir;
	onClueChanged: (pos: Position, dir: Dir, value: string) => void;
	onClueFocused: (pos: Position, dir: Dir) => void;
	onClueUnfocused: () => void;
	onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
}

const ClueList = ({
	cells,
	dir,
	onClueChanged,
	onClueFocused,
	onClueUnfocused,
	onAnswerChanged,
}: ClueListProps) => {
	if (cells.length == 0) {
		return (
			<div className="w-full italic text-neutral-400">
				No {dir == Dir.Across ? "across" : "down"} clues currently in grid
			</div>
		);
	}
	return (
		<div className="overflow-scroll">
			{cells.map(([cell, pos]) => {
				const clue = dir == Dir.Across ? cell.acrossClue! : cell.downClue!;
				return (
					<ClueEntry
						key={clue.num}
						clue={clue}
						onClueChanged={(v) => onClueChanged(pos, dir, v)}
						onClueFocused={() => onClueFocused(pos, dir)}
						onClueUnfocused={onClueUnfocused}
						onAnswerChanged={(v) => onAnswerChanged(pos, dir, v)}
					/>
				);
			})}
		</div>
	);
};

export default ClueList;

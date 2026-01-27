import Cells from "#/lib/cells";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import ClueList from "./cluelist";

type CluesProps = {
	cells: Cells;
	onClueChanged: (pos: Position, dir: Dir, value: string) => void;
	onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
};

const Clues = ({ cells, onClueChanged, onAnswerChanged }: CluesProps) => {
	const acrossClueCells = cells
		.allCells()
		.filter(([c, _]) => c.acrossClue !== null);
	const downClueCells = cells
		.allCells()
		.filter(([c, _]) => c.downClue !== null);

	return (
		<div className="flex flex-col gap-2 md:flex-row w-full justify-between">
			<div className="flex-1">
				<h3 className="font-bold font-serif">Across</h3>
				<ClueList
					cells={acrossClueCells}
					dir={Dir.Across}
					onClueChanged={onClueChanged}
					onAnswerChanged={onAnswerChanged}
				/>
			</div>

			<div className="flex-1">
				<h3 className="font-bold font-serif">Down</h3>
				<ClueList
					cells={downClueCells}
					dir={Dir.Down}
					onClueChanged={onClueChanged}
					onAnswerChanged={onAnswerChanged}
				/>
			</div>
		</div>
	);
};

export default Clues;

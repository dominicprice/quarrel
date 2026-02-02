import Cells from "#/lib/cells";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import { useEffect } from "react";
import ClueList from "./cluelist";

type CluesProps = {
	cells: Cells;
	onClueChanged: (pos: Position, dir: Dir, value: string) => void;
	onClueFocused: (pos: Position, dir: Dir) => void;
	onClueUnfocused: () => void;
	onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
};

const Clues = ({
	cells,
	onClueChanged,
	onClueFocused,
	onClueUnfocused,
	onAnswerChanged,
}: CluesProps) => {
	const acrossClueCells = cells
		.allCells()
		.filter(([c, _]) => c.acrossClue !== null);
	const downClueCells = cells
		.allCells()
		.filter(([c, _]) => c.downClue !== null);

	useEffect(() => {}, []);

	return (
		<div className="relative w-full justify-between h-full min-h-64">
			<div className="absolute top-0 left-0 right-0 bottom-1/2 h-1/2 lg:bottom-0 lg:right-1/2 lg:h-full overflow-scroll pr-4">
				<h3 className="font-bold font-serif sticky top-0 bg-white z-10 py-2">
					Across
				</h3>
				<ClueList
					cells={acrossClueCells}
					dir={Dir.Across}
					onClueChanged={onClueChanged}
					onClueFocused={onClueFocused}
					onClueUnfocused={onClueUnfocused}
					onAnswerChanged={onAnswerChanged}
				/>
			</div>

			<div className="absolute top-1/2 bottom-0 right-0 left-0 h-1/2 lg:top-0 lg:left-1/2 lg:h-full overflow-scroll pr-4">
				<h3 className="font-bold font-serif sticky top-0 bg-white z-10 py-2">
					Down
				</h3>
				<ClueList
					cells={downClueCells}
					dir={Dir.Down}
					onClueChanged={onClueChanged}
					onClueFocused={onClueFocused}
					onClueUnfocused={onClueUnfocused}
					onAnswerChanged={onAnswerChanged}
				/>
			</div>
		</div>
	);
};

export default Clues;

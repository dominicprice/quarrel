import { ImportedPuzzle } from ".";
import Cells from "../cells";

function importPcn(pcnString: string): ImportedPuzzle {
	// split into lines
	const lines = pcnString.split("\n");

	// get dimension and create cells
	const dim = parseInt(lines.shift()!);
	if (isNaN(dim)) throw new Error("invalid dimension");
	const cells = new Cells(dim);

	// get metadata
	const title = lines.shift() || "";
	const description = lines.shift() || "";

	// set letters in grid
	let row = 0;
	let col = 0;
	for (const char of lines.shift() || "") {
		if (char !== ".") cells.setValue([row, col], char);
		col++;
		if (col >= dim) {
			row++;
			col = 0;
		}
	}

	// set across clues
	for (let rowIdx = 0; rowIdx < dim; ++rowIdx) {
		for (let colIdx = 0; colIdx < dim; ++colIdx) {
			const cell = cells.at([rowIdx, colIdx]);
			if (cell.acrossClue) {
				cell.acrossClue.clue = lines.shift() || "";
			}
		}
	}

	// set down clues
	for (let rowIdx = 0; rowIdx < dim; ++rowIdx) {
		for (let colIdx = 0; colIdx < dim; ++colIdx) {
			const cell = cells.at([rowIdx, colIdx]);
			if (cell.downClue) {
				cell.downClue.clue = lines.shift() || "";
			}
		}
	}

	return {
		title: title,
		description: description,
		cells: cells,
	};
}

export default importPcn;

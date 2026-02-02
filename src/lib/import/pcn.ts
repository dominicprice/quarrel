import { ImportedPuzzle } from ".";
import Cells from "../cells";
import Split from "../split";

function importPcn(pcnString: string): ImportedPuzzle {
	console.log("got pcn string");
	// split into lines
	const lines = pcnString.split("\n");

	console.log(lines);
	// get dimension and create cells
	const dim = parseInt(lines.shift()!);
	if (isNaN(dim)) throw new Error("invalid dimension");
	const cells = new Cells(dim);

	// get metadata
	const title = decodeURIComponent(lines.shift() || "");
	const description = decodeURIComponent(lines.shift() || "");

	console.log("got metadata");

	// set letters in grid
	let row = 0;
	let col = 0;
	for (const char of lines.shift() || "") {
		// check for cell split character
		const cell = cells.at([row, col])!;
		if (char === "<") {
			cell.splitLeft = Split.Space;
			continue;
		} else if (char === "^") {
			cell.splitAbove = Split.Space;
			continue;
		} else if (char === "-") {
			cell.splitLeft = Split.Hyphen;
			continue;
		} else if (char === "|") {
			cell.splitAbove = Split.Hyphen;
			continue;
		}

		// set cell value
		if (char !== ".") {
			cells.setValue([row, col], char);
		}

		// increment cell
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
			const clue = decodeURIComponent(lines.shift() || "");
			if (cell !== null && cell.acrossClue) {
				cell.acrossClue.clue = clue;
			}
		}
	}

	// set down clues
	for (let rowIdx = 0; rowIdx < dim; ++rowIdx) {
		for (let colIdx = 0; colIdx < dim; ++colIdx) {
			const cell = cells.at([rowIdx, colIdx]);
			const clue = decodeURIComponent(lines.shift() || "");
			if (cell !== null && cell.downClue) {
				cell.downClue.clue = clue;
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

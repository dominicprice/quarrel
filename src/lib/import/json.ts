import Cells from "#/lib/cells";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import Split from "#/lib/split";
import { ImportedPuzzle } from ".";

function importJson(jsonString: string): ImportedPuzzle {
    const data = JSON.parse(jsonString);

    const cells = new Cells(data.size);
    for (const clue of data.acrossClues) {
        const pos: Position = [clue.row - 1, clue.col - 1];
        for (const c of clue.answer) {
            if (c === " ") {
                cells.setSplit(pos, Dir.Across, Split.Space);
            } else if (c === "-") {
                cells.setSplit(pos, Dir.Across, Split.Hyphen);
            } else {
                cells.setValue(pos, c);
                ++pos[1];
            }
        }
        cells.cells[clue.row - 1][clue.col - 1].acrossClue!.clue = clue.clue;
    }
    for (const clue of data.downClues) {
        const pos: Position = [clue.row - 1, clue.col - 1];
        for (const c of clue.answer) {
            if (c === " ") {
                cells.setSplit(pos, Dir.Down, Split.Space);
            } else if (c === "-") {
                cells.setSplit(pos, Dir.Down, Split.Hyphen);
            } else {
                cells.setValue(pos, c);
                ++pos[0];
            }
        }
        cells.cells[clue.row - 1][clue.col - 1].downClue!.clue = clue.clue;
    }

    return {
        title: data.title,
        description: data.description,
        cells: cells,
    };
}

export default importJson;

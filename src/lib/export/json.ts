import Cells from "#/lib/cells";
import Clue from "#/lib/clue";
import Position from "#/lib/position";

interface JsonClue {
    number: number;
    row: number;
    col: number;
    clue: string;
    answer: string;
}

function convertClue(clue: Clue, pos: Position): JsonClue {
    return {
        number: clue.num,
        row: pos[0] + 1,
        col: pos[1] + 1,
        clue: clue.clue,
        answer: clue.answer,
    };
}

interface JsonExport {
    title: string;
    description: string;
    width: number;
    height: number;

    acrossClues: JsonClue[];
    downClues: JsonClue[];
}

function exportJson(title: string, description: string, cells: Cells): string {
    const res: JsonExport = {
        title: title,
        description: description,
        width: cells.size(),
        height: cells.size(),
        acrossClues: [],
        downClues: [],
    };

    for (const [cell, pos] of cells.allCells()) {
        const { acrossClue: across, downClue: down } = cell;
        if (across !== null) res.acrossClues.push(convertClue(across, pos));
        if (down !== null) {
            res.downClues.push(convertClue(down, pos));
        }
    }

    return JSON.stringify(res);
}

export default exportJson;

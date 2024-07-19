import Cells from "#/lib/cells";

interface ExportClue {
    num: number;
    row: number;
    col: number;
    clue: string;
    answer: string;
    lengths: string;
}

interface ExportCell {
    num: number | null;
    letter: string | null;
}

interface ExportData {
    title: string;
    description: string;
    acrossClues: ExportClue[];
    downClues: ExportClue[];
    size: number;
    cells: ExportCell[][];
}

function convertExportData(
    title: string,
    description: string,
    cells: Cells,
): ExportData {
    const data = {
        title: title,
        description: description,
        size: cells.size(),
        acrossClues: [] as ExportClue[],
        downClues: [] as ExportClue[],
        cells: [] as ExportCell[][],
    };

    for (let row = 0; row < cells.cells.length; ++row) {
        data.cells.push([] as ExportCell[]);
        for (let col = 0; col < cells.cells[row].length; ++col) {
            const cell = cells.cells[row][col];
            data.cells[data.cells.length - 1].push({
                num: cell.clueNum(),
                letter: cell.value || null,
            });
            const { acrossClue: across, downClue: down } = cell;
            if (across !== null) {
                data.acrossClues.push({
                    num: across.num,
                    row: row + 1,
                    col: col + 1,
                    clue: across.clue,
                    answer: across.answer,
                    lengths: across.lengths(),
                });
            }
            if (down !== null) {
                data.downClues.push({
                    num: down.num,
                    row: row + 1,
                    col: col + 1,
                    clue: down.clue,
                    answer: down.answer,
                    lengths: down.lengths(),
                });
            }
        }
    }

    return data;
}

export default convertExportData;

export type { ExportData };

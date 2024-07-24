import Cell from "#/lib/cell";
import Cells from "#/lib/cells";
import Dir, { toggleDir } from "#/lib/dir";
import Position from "#/lib/position";

interface SolvableCell {
    answer: string | null;
    guess: string | null;
    num: number | null;
    acrossClue: SolvableClue | null;
    downClue: SolvableClue | null;
    checked: boolean;
}

interface SolvableClue {
    num: number;
    clue: string;
    startPos: Position;
    dir: Dir;
    length: number;
}

function clueFromCell(
    cell: Cell,
    pos: Position,
    dir: Dir,
): SolvableClue | null {
    const clue = dir === Dir.Across ? cell.acrossClue : cell.downClue;
    if (clue === null) return null;

    return {
        num: clue.num,
        clue: clue.clue,
        startPos: pos,
        dir: dir,
        length: clue.answer.replace(/[^A-Z]/g, "").length,
    };
}

class SolvableGrid {
    cells: SolvableCell[][];

    constructor(cells: SolvableCell[][]) {
        this.cells = cells;
    }

    static fromEditableCells(cells: Cells): SolvableGrid {
        const res = new SolvableGrid([]);
        for (let ri = 0; ri < cells.cells.length; ++ri) {
            res.cells.push([]);
            for (let ci = 0; ci < cells.cells[ri].length; ++ci) {
                const cell = cells.cells[ri][ci];
                res.cells[res.cells.length - 1].push({
                    answer: cell.value || null,
                    guess: null,
                    num: cell.clueNum(),
                    acrossClue: clueFromCell(cell, [ri, ci], Dir.Across),
                    downClue: clueFromCell(cell, [ri, ci], Dir.Down),
                    checked: false,
                });
            }
        }
        return res;
    }

    get length() {
        return this.cells.length;
    }

    getCell = (pos: Position) => {
        return this.cells[pos[0]][pos[1]];
    };

    getClue = (pos: Position, dir: Dir) => {
        const cell = this.getCell(pos);
        return dir === Dir.Across ? cell.acrossClue : cell.downClue;
    };

    getCellForClue = (num: number, dir: Dir): Position | null => {
        for (let ri = 0; ri < this.length; ++ri) {
            for (let ci = 0; ci < this.length; ++ci) {
                const cell = this.cells[ri][ci];
                if (
                    (dir === Dir.Across &&
                        cell.acrossClue !== null &&
                        cell.acrossClue.num === num) ||
                    (dir === Dir.Down &&
                        cell.downClue !== null &&
                        cell.downClue.num === num)
                )
                    return [ri, ci] as Position;
            }
        }
        return null;
    };

    withCellChecked = (pos: Position, checked: boolean) => {
        const res = this.clone();
        const cell = res.getCell(pos);
        if (cell.answer !== null && cell.guess !== null) cell.checked = checked;
        return res;
    };

    withAnswerChecked = (pos: Position, dir: Dir, checked: boolean) => {
        const res = this.clone();
        const cells = res.getAllCellsOfCurrentAnswer(pos, dir);
        for (const pos of cells) res.getCell(pos).checked = checked;
        return res;
    };

    withGridChecked = (checked: boolean) => {
        const res = this.clone();
        for (const row of res.cells) {
            for (const cell of row) {
                if (cell.answer !== null && cell.guess !== null)
                    cell.checked = checked;
            }
        }
        return res;
    };

    withCellRevealed = (pos: Position) => {
        const res = this.clone();
        const cell = res.getCell(pos);
        if (cell.answer !== null) cell.guess = cell.answer;
        return res;
    };

    withAnswerRevealed = (pos: Position, dir: Dir) => {
        const res = this.clone();
        const cells = res.getAllCellsOfCurrentAnswer(pos, dir);
        for (const pos of cells) {
            const cell = res.getCell(pos);
            cell.guess = cell.answer;
        }
        return res;
    };

    withGridRevealed = () => {
        const res = this.clone();
        for (const row of res.cells) {
            for (const cell of row) {
                if (cell.answer !== null) cell.guess = cell.answer;
            }
        }
        return res;
    };

    clone = () => {
        return new SolvableGrid(structuredClone(this.cells));
    };

    withGuess = (pos: Position, guess: string | null) => {
        const res = this.clone();
        const cell = res.getCell(pos);
        if (cell.guess === guess) return res;
        cell.checked = false;
        cell.guess = guess;
        return res;
    };

    getClues = () => {
        const res: SolvableClue[] = [];
        for (const row of this.cells) {
            for (const cell of row) {
                if (cell.acrossClue !== null) res.push(cell.acrossClue);
                if (cell.downClue !== null) res.push(cell.downClue);
            }
        }
        return res;
    };

    getFirstCellOfCurrentAnswer = (pos: Position, dir: Dir) => {
        let [r, c] = pos;
        if (dir === Dir.Across) {
            while (c > 0 && this.cells[r][c - 1].answer !== null) --c;
        } else {
            while (r > 0 && this.cells[r - 1][c].answer !== null) --r;
        }
        return [r, c] as Position;
    };

    getAllCellsOfCurrentAnswer = (pos: Position | null, dir: Dir) => {
        if (pos === null) return [];

        const res: Position[] = [];
        let [r, c] = this.getFirstCellOfCurrentAnswer(pos, dir);
        if (dir === Dir.Across) {
            while (
                c < this.cells.length - 1 &&
                this.cells[r][c + 1].answer !== null
            ) {
                res.push([r, c]);
                ++c;
            }
        } else {
            while (
                r < this.cells.length - 1 &&
                this.cells[r + 1][c].answer !== null
            ) {
                res.push([r, c]);
                ++r;
            }
        }
        res.push([r, c]);
        return res;
    };

    getNextAnswer: (pos: Position, dir: Dir) => [Position, Dir] = (
        pos: Position,
        dir: Dir,
    ) => {
        const [r, c] = this.getFirstCellOfCurrentAnswer(pos, dir);
        // search rest of current row
        for (let ci = c + 1; ci < this.length; ++ci) {
            const clue = this.getClue([r, ci], dir);
            if (clue !== null) return [clue.startPos, dir];
        }
        // search rest of grid
        for (let ri = r + 1; ri < this.length; ++ri) {
            for (let ci = 0; ci < this.length; ++ci) {
                const clue = this.getClue([ri, ci], dir);
                if (clue !== null) return [clue.startPos, dir];
            }
        }
        // search whole grid in other direction
        dir = toggleDir(dir);
        for (let ri = 0; ri < this.length; ++ri) {
            for (let ci = 0; ci < this.length; ++ci) {
                const clue = this.getClue([ri, ci], dir);
                if (clue !== null) return [clue.startPos, dir];
            }
        }
        // return initial clue
        return [[r, c], toggleDir(dir)];
    };

    findFirstClue: () => [Position | null, Dir] = () => {
        for (let ri = 0; ri < this.cells.length; ++ri) {
            const row = this.cells[ri];
            for (let ci = 0; ci < row.length; ++ci) {
                const cell = row[ci];
                if (cell.num === null) {
                    continue;
                } else if (
                    (ci === 0 || row[ci - 1].answer === null) &&
                    ci < row.length - 1 &&
                    row[ci + 1].answer !== null
                ) {
                    return [[ri, ci], Dir.Across];
                } else if (
                    (ri === 0 || this.cells[ri - 1][ci].answer === null) &&
                    ri < row.length - 1 &&
                    this.cells[ri + 1][ci].answer !== null
                ) {
                    return [[ri, ci], Dir.Across];
                }
            }
        }
        return [null, Dir.Across];
    };
}

export default SolvableGrid;
export type { SolvableCell, SolvableClue };

import Cell from "./cell";
import Clue from "./clue";
import Dir from "./dir";
import Position from "./position";
import Split, { splitToString } from "./split";

class Cells {
    cells: Cell[][];

    constructor(gridSize: number) {
        this.cells = [];
        for (let i = 0; i < gridSize; ++i) {
            const row = [];
            for (let j = 0; j < gridSize; ++j) {
                row.push(new Cell());
            }
            this.cells.push(row);
        }
    }

    static fromTemplate = (template: string[]) => {
        const cells = new Cells(template.length);
        for (let i = 0; i < template.length; ++i) {
            for (let j = 0; j < template[i].length; ++j) {
                if (template[i][j] !== ".")
                    cells.setValue([i, j], template[i][j]);
            }
        }
        return cells;
    };

    size = () => {
        return this.cells.length;
    };

    at = (pos: Position) => {
        return this.cells[pos[0]][pos[1]];
    };

    valueAt = (pos: Position) => {
        return this.cells[pos[0]][pos[1]].value;
    };

    setValue = (pos: Position, value: string) => {
        const [row, col] = pos;
        const [sRow, sCol] = [this.size() - row - 1, this.size() - col - 1];

        if (value === "") {
            if (this.cells[sRow][sCol].isEmpty()) {
                this.cells[row][col] = new Cell();
                this.cells[sRow][sCol] = new Cell();
            } else {
                this.cells[row][col].value = "?";
            }
        } else {
            this.cells[row][col].value = value;
            if (this.cells[sRow][sCol].isEmpty())
                this.cells[sRow][sCol].value = "?";
        }

        this.recalculateClues();
    };

    toggleSplit = (pos: Position, dir: Dir, split: Split) => {
        const cell = this.at(pos);
        if (cell.value === "") this.setValue(pos, "?");
        if (dir === Dir.Across) {
            if (pos[1] > 0)
                cell.splitLeft = cell.splitLeft === split ? Split.None : split;
        } else {
            if (pos[0] > 0)
                cell.splitAbove =
                    cell.splitAbove === split ? Split.None : split;
        }

        this.recalculateClues();
    };

    setSplit = (pos: Position, dir: Dir, split: Split) => {
        const cell = this.at(pos);
        if (cell.value === "") this.setValue(pos, "?");
        if (dir === Dir.Across) {
            if (pos[1] > 0) cell.splitLeft = split;
        } else {
            if (pos[0] > 0) cell.splitAbove = split;
        }
        this.recalculateClues();
    };

    private recalculateClues = () => {
        let num = 1;
        for (let i = 0; i < this.size(); ++i) {
            for (let j = 0; j < this.size(); ++j) {
                if (this.recalculateClue([i, j], num)) ++num;
            }
        }
    };

    private recalculateClue = (pos: Position, clueNum: number) => {
        const cell = this.at(pos);
        const dirs = this.startsClue(pos);
        if (dirs.indexOf(Dir.Across) >= 0) {
            if (cell.acrossClue === null) cell.acrossClue = new Clue(clueNum);
            else cell.acrossClue.num = clueNum;
            cell.acrossClue.answer = this.getAnswer(pos, Dir.Across);
        } else {
            cell.acrossClue = null;
        }

        if (dirs.indexOf(Dir.Down) >= 0) {
            if (cell.downClue === null) cell.downClue = new Clue(clueNum);
            else cell.downClue.num = clueNum;
            cell.downClue.answer = this.getAnswer(pos, Dir.Down);
        } else {
            cell.downClue = null;
        }
        return dirs.length > 0;
    };

    private startsClue = (pos: Position) => {
        if (this.valueAt(pos) === "") return [];

        const [row, col] = pos;
        const dirs = [];

        if (
            (row === 0 || this.valueAt([row - 1, col]) === "") &&
            row < this.size() - 1 &&
            this.valueAt([row + 1, col]) !== ""
        )
            dirs.push(Dir.Down);

        if (
            (col === 0 || this.valueAt([row, col - 1]) === "") &&
            col < this.size() - 1 &&
            this.valueAt([row, col + 1]) !== ""
        )
            dirs.push(Dir.Across);

        return dirs;
    };

    getAnswer = (pos: Position, dir: Dir) => {
        let answer = "";
        let [row, col] = pos;
        while (row < this.size() && col < this.size()) {
            const cell = this.at([row, col]);
            if (cell.value === "") break;
            answer += splitToString(
                dir === Dir.Across ? cell.splitLeft : cell.splitAbove,
            );
            answer += cell.value;
            if (dir === Dir.Across) col++;
            else row++;
        }
        return answer;
    };

    static fromJsonString = (jsonString: string) => {
        const json = JSON.parse(jsonString);
        return Cells.fromJson(json);
    };

    static fromJson = (json: any) => {
        const gridSize = json.cells.length;
        const cells = new Cells(gridSize);
        for (let i = 0; i < gridSize; ++i) {
            for (let j = 0; j < gridSize; ++j) {
                cells.cells[i][j] = Cell.fromJSON(json.cells[i][j]);
            }
        }

        return cells;
    };

    allCells = () => {
        const allCells: [Cell, Position][] = [];
        for (let i = 0; i < this.size(); ++i) {
            for (let j = 0; j < this.size(); ++j) {
                const pos: Position = [i, j];
                allCells.push([this.at(pos), pos]);
            }
        }
        return allCells;
    };

    clone = () => {
        const other = new Cells(this.size());
        for (let i = 0; i < this.size(); ++i) {
            for (let j = 0; j < this.size(); ++j)
                other.cells[i][j] = this.cells[i][j].clone();
        }
        return other;
    };
}

export default Cells;

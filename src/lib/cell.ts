import Clue from "./clue";
import Split from "./split";

class Cell {
    value: string;
    acrossClue: Clue | null;
    downClue: Clue | null;
    splitLeft: Split;
    splitAbove: Split;

    constructor(value = "") {
        this.value = value;
        this.acrossClue = null;
        this.downClue = null;
        this.splitLeft = Split.None;
        this.splitAbove = Split.None;
    }

    isEmpty = () => {
        return this.value === "" || this.value === "?";
    };

    isBlank = () => {
        return this.value === "";
    };

    clueNum = () => {
        if (this.acrossClue !== null) return this.acrossClue.num;
        else if (this.downClue !== null) return this.downClue.num;
        return null;
    };

    static fromJSON = (json: any) => {
        const cell = new Cell(json.value);
        if (json.acrossClue !== null)
            cell.acrossClue = Clue.fromJSON(json.acrossClue);
        if (json.downClue !== null)
            cell.downClue = Clue.fromJSON(json.downClue);
        cell.splitLeft = json.splitLeft;
        cell.splitAbove = json.splitAbove;

        return cell;
    };

    clone = () => {
        const other = new Cell(this.value);
        if (this.acrossClue !== null)
            other.acrossClue = this.acrossClue.clone();
        if (this.downClue !== null) other.downClue = this.downClue.clone();
        other.splitLeft = this.splitLeft;
        other.splitAbove = this.splitAbove;
        return other;
    };
}

export default Cell;

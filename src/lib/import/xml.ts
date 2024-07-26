import { ImportedPuzzle } from ".";
import Cells from "../cells";
import Dir from "../dir";
import Position from "../position";

function getFirstElementByTag(
    parent: Element | Document,
    tag: string,
): Element | null {
    const elements = parent.getElementsByTagName(tag);
    if (elements.length < 1) return null;
    return elements[0];
}

function assertFirstElementByTag(
    parent: Element | Document,
    tag: string,
): Element {
    const elements = parent.getElementsByTagName(tag);
    if (elements.length < 1) throw new Error(`could not find '${tag}' node`);
    return elements[0];
}

function importXml(rawXml: string): ImportedPuzzle {
    const parser = new DOMParser();
    const document = parser.parseFromString(rawXml, "text/xml");

    const puzzle = assertFirstElementByTag(document, "rectangular-puzzle");

    const metadata = getFirstElementByTag(puzzle, "metadata");
    const title = metadata
        ? getFirstElementByTag(metadata, "title")?.textContent || ""
        : "";
    const description = metadata
        ? getFirstElementByTag(metadata, "description")?.textContent || ""
        : "";

    const crossword = assertFirstElementByTag(puzzle, "crossword");
    const grid = assertFirstElementByTag(crossword, "grid");
    const width = parseInt(grid.getAttribute("width") ?? "0");
    const height = parseInt(grid.getAttribute("height") ?? "0");
    if (width == 0 || height == 0 || width !== height)
        throw new Error(
            `invalid dimensions ${width}x${height}, must be square and non-zero`,
        );

    const cells = new Cells(width);
    for (const cell of grid.getElementsByTagName("cell")) {
        const solution = cell.getAttribute("solution");
        if (solution !== null) {
            const x = parseInt(cell.getAttribute("x") || "0") - 1;
            if (x < 0) throw new Error("invalid x value for cell");
            const y = parseInt(cell.getAttribute("y") || "0") - 1;
            if (y < 0) throw new Error("invalid y value for cell");
            cells.setValue([y, x], solution);
        }
    }

    const words: Record<string, [Position, Dir]> = {};
    for (const word of crossword.getElementsByTagName("word")) {
        const id = word.getAttribute("id");
        if (id === null) throw new Error("word with no id");
        let dir = Dir.Across;
        const x = (word.getAttribute("x") || "0").split("-");
        const y = (word.getAttribute("y") || "0").split("-");
        if (y.length > 1) dir = Dir.Down;
        words[id] = [[parseInt(y[0]), parseInt(x[0])], dir];
    }

    for (const clues of crossword.getElementsByTagName("clues")) {
        for (const clue of clues.getElementsByTagName("clue")) {
            const word = clue.getAttribute("word");
            if (word === null)
                throw new Error("clue does not reference a word");
            const [pos, dir] = words[word];
            if (pos === null)
                throw new Error("clue does not reference a valid word");
            if (dir === Dir.Across)
                cells.at(pos).acrossClue!.clue = clue.textContent || "";
            else cells.at(pos).downClue!.clue = clue.textContent || "";
        }
    }

    return {
        title: title,
        description: description,
        cells: cells,
    };
}

export default importXml;

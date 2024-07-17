import Cells from "#/lib/cells";

interface PlaintextExportChars {
    blankCell: string;
    filledCell: string;
    ul: string;
    u: string;
    ur: string;
    l: string;
    r: string;
    bl: string;
    b: string;
    br: string;
}

const asciiChars: PlaintextExportChars = {
    blankCell: "  ",
    filledCell: "##",
    ul: "+",
    u: "--",
    ur: "+",
    l: "|",
    r: "|",
    bl: "+",
    b: "--",
    br: "+",
};

const unicodeChars: PlaintextExportChars = {
    blankCell: "  ",
    filledCell: "██",
    ul: " ",
    u: "▁▁",
    ur: " ",
    l: "▕",
    r: "▏",
    bl: " ",
    b: "▔▔",
    br: " ",
};

function exportPlaintext(
    chars: PlaintextExportChars,
    title: string,
    description: string,
    cells: Cells,
): string {
    const grid = [title.toUpperCase(), "", description, ""];
    const acrossClues = ["Across:"];
    const downClues = ["Down:"];

    grid.push(chars.ul + chars.u.repeat(cells.size()) + chars.ur);
    for (let i = 0; i < cells.size(); ++i) {
        const row = [];
        for (let j = 0; j < cells.size(); ++j) {
            const cell = cells.at([i, j]);
            row.push(cell.value === "" ? chars.filledCell : chars.blankCell);
            if (cell.acrossClue !== null)
                acrossClues.push(
                    `${cell.acrossClue.num}. ${
                        cell.acrossClue.clue
                    } (${cell.acrossClue.answer
                        .split(" ")
                        .map((w) => w.length)
                        .join(",")})`,
                );
            if (cell.downClue !== null)
                downClues.push(
                    `${cell.downClue.num}. ${
                        cell.downClue.clue
                    } (${cell.downClue.answer
                        .split(" ")
                        .map((w) => w.length)
                        .join(",")})`,
                );
        }
        grid.push(chars.l + row.join("") + chars.r);
    }
    grid.push(chars.bl + chars.b.repeat(cells.size()) + chars.br);

    return grid.concat(acrossClues, [""], downClues).join("\n");
}

export default exportPlaintext;
export { asciiChars, unicodeChars };
export type { PlaintextExportChars };

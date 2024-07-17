import Cells from "../cells";

function exportXml(title: string, description: string, cells: Cells): string {
    const lines: string[] = [];

    lines.push(`<?xml version="1.0" encoding="utf-8"?>`);
    lines.push(`<puzzle>`);
    lines.push(`<crossword language="en">`);

    lines.push(`<metadata>`);
    lines.push(`<title>${title}</title>`);
    lines.push(`<description>${description}</description>`);
    lines.push(`</metadata>`);

    lines.push(`<american>`);

    lines.push(`<grid rows="${cells.size()}" columns="${cells.size()}">`);
    for (const [cell, pos] of cells.allCells()) {
        if (cell.value == "") {
            lines.push(`<blank></blank>`);
        } else {
            lines.push(
                `<letter id="${pos[0] + 1},${pos[1] + 1}">${
                    cell.value
                }</letter>`,
            );
        }
    }
    lines.push(`</grid>`);

    lines.push(`<clues>`);

    for (const [cell, pos] of cells.allCells()) {
        const { acrossClue: clue } = cell;
        if (clue !== null) {
            lines.push(
                `<across cellid="${pos[0] + 1},${pos[1] + 1}">${
                    clue.clue
                }</across>`,
            );
        }
    }
    for (const [cell, pos] of cells.allCells()) {
        const { downClue: clue } = cell;
        if (clue !== null) {
            lines.push(
                `<down cellid="${pos[0] + 1},${pos[1] + 1}">${
                    clue.clue
                }</down>`,
            );
        }
    }

    lines.push(`</clues>`);

    lines.push(`</american>`);

    lines.push(`</crossword>`);
    lines.push(`</puzzle>`);

    return lines.join("\n");
}

export default exportXml;

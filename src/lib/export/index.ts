import Cells from "#/lib/cells";
import exportJson from "./json";
import exportLaTeX from "./latex";
import exportPlaintext, { asciiChars, unicodeChars } from "./plaintext";
import exportXml from "./xml";

type ExportFormat = "json" | "ascii" | "unicode" | "latex" | "xml";

function exportPuzzle(
    format: ExportFormat,
    title: string,
    description: string,
    cells: Cells,
): [string, string, string] {
    let data;
    let ext;
    let mime;
    switch (format) {
        case "json":
            data = exportJson(title, description, cells);
            ext = ".json";
            mime = "application/json";
            break;
        case "ascii":
            data = exportPlaintext(asciiChars, title, description, cells);
            ext = ".txt";
            mime = "text/plain";
            break;
        case "unicode":
            data = exportPlaintext(unicodeChars, title, description, cells);
            ext = ".txt";
            mime = "text/plain";
            break;
        case "latex":
            data = exportLaTeX(title, description, cells);
            ext = ".tex";
            mime = "text/x-tex";
            break;
        case "xml":
            data = exportXml(title, description, cells);
            ext = ".xml";
            mime = "application/xml";
            break;
    }

    return [data, ext, mime];
}

export default exportPuzzle;
export type { ExportFormat };

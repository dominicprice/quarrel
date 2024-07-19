import Cells from "../cells";
import importJson from "./json";

type ImportFormat = "json";

interface ImportedPuzzle {
    title: string;
    description: string;
    cells: Cells;
}

function importPuzzle(format: ImportFormat, data: string): ImportedPuzzle {
    switch (format) {
        case "json": {
            return importJson(data);
        }
    }
}

export default importPuzzle;
export type { ImportFormat, ImportedPuzzle };

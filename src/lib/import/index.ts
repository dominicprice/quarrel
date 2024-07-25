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

function getDataUrl(): string | null {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("blobid")) {
        return "https://jsonblob.com/api/jsonBlob/" + queryParams.get("blobid");
    } else if (queryParams.has("url")) {
        return queryParams.get("url");
    }
    return null;
}

export default importPuzzle;
export { getDataUrl };
export type { ImportFormat, ImportedPuzzle };

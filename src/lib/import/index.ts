import Cells from "../cells";
import importJson from "./json";
import importPcn from "./pcn";
import importXml from "./xml";

type ImportFormat = "json" | "xml" | "pcn";

interface ImportedPuzzle {
	title: string;
	description: string;
	cells: Cells;
}

function importPuzzle(format: ImportFormat, data: string): ImportedPuzzle {
	switch (format) {
		case "json":
			return importJson(data);
		case "xml":
			return importXml(data);
		case "pcn":
			return importPcn(data);
	}
}

function getDataUrl(): string | null {
	const queryParams = new URLSearchParams(window.location.search);
	if (queryParams.has("blobid")) {
		return `https://jsonblob.com/api/jsonBlob/${queryParams.get("blobid")}`;
	}
	return null;
}

export default importPuzzle;
export { getDataUrl };
export type { ImportFormat, ImportedPuzzle };

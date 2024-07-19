import { ImportedPuzzle } from ".";

function importJson(data: string): ImportedPuzzle {
    const importedData = JSON.parse(data);
    return {
        title: importedData.title,
        description: importedData.description,
        cells: importedData.cells,
    };
}

export default importJson;

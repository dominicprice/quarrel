import { ChangeEvent, useRef, useState } from "react";
import slugify from "slugify";
import { useLocalStorage } from "usehooks-ts";
import Clues from "#/components/clues";
import Grid from "#/components/grid";
import HelpView from "#/components/helpview";
import MenuBar from "#/components/menubar";
import MenuItem from "#/components/menubar/menuitem";
import NewDialog from "#/components/newdialog";
import { stringToBlob } from "#/lib/blob";
import Cells from "#/lib/cells";
import Modal from "#/lib/components/modal";
import Dir from "#/lib/dir";
import exportPuzzle, { ExportFormat } from "#/lib/export";
import Position from "#/lib/position";
import PrintPreview from "./components/printpreview";
import Split from "./lib/split";
import { getDefaultScale } from "./lib/utils";

enum ModalType {
    None = 0,
    Help = 1,
    New = 2,
    PrintPreview = 3,
}

const App = () => {
    const fileChooserInput = useRef(null as HTMLInputElement | null);

    const [cells, setCells] = useLocalStorage("cells", new Cells(15), {
        deserializer: Cells.fromJsonString,
    });
    const [title, setTitle] = useLocalStorage("title", "", {
        serializer: (t: string) => t,
        deserializer: (j: string) => j,
    });
    const [description, setDescription] = useLocalStorage("description", "", {
        serializer: (d: string) => d,
        deserializer: (j: string) => j,
    });
    const [currentModal, setCurrentModal] = useState(ModalType.None);
    const [zoom, setZoom] = useState(getDefaultScale(cells.size()));

    const onNew = () => {
        setCurrentModal(ModalType.New);
    };

    const onReset = (cells: Cells, title?: string, description?: string) => {
        updateCells(() => cells);
        updateTitle(title ?? "");
        updateDescription(description ?? "");
        setZoom(getDefaultScale(cells.size()));
    };

    const onZoomIn = () => {
        setZoom(zoom + 0.1);
    };

    const onZoomOut = () => {
        setZoom(zoom - 0.1);
    };

    const onZoomReset = () => {
        setZoom(getDefaultScale(cells.size()));
    };

    const onExport = (format: ExportFormat) => {
        const [data, ext, mime] = exportPuzzle(
            format,
            title,
            description,
            cells,
        );
        const filename = slugify(title || "puzzle") + ext;
        stringToBlob(data, filename, mime);
    };

    const onImportJson = () => {
        if (fileChooserInput.current !== null) fileChooserInput.current.click();
    };

    const importJson = (files: FileList | null) => {
        if (files === null || files.length === 0) return;
        const file = files.item(0);
        if (file === null) return;
        file.text().then((jsonString) => {
            const importedData = JSON.parse(jsonString);
            onReset(
                importedData.cells,
                importedData.title,
                importedData.description,
            );
        });
    };

    const onClueChanged = (pos: Position, dir: Dir, value: string) => {
        updateCells((cells) => {
            const cell = cells.at(pos);
            if (dir === Dir.Across) {
                if (cell.acrossClue !== null) cell.acrossClue.clue = value;
            } else {
                if (cell.downClue !== null) cell.downClue.clue = value;
            }
            return cells;
        });
    };

    const onAnswerChanged = (pos: Position, dir: Dir, value: string) => {
        updateCells((cells) => {
            pos = [...pos];
            for (let i = 0; i < value.length; i++) {
                cells.setValue(pos, value[i]);
                if (dir === Dir.Across) ++pos[1];
                else ++pos[0];
            }
            return cells;
        });
    };

    const onCellChanged = (pos: Position, value: string) => {
        updateCells((cells) => {
            cells.setValue(pos, value);
            return cells;
        });
    };

    const updateCells = (updateFn: (cells: Cells) => Cells) => {
        let newCells = cells.clone();
        newCells = updateFn(newCells);
        setCells(newCells);
    };

    const onCellSplit = (pos: Position, dir: Dir, split: Split) => {
        const newCells = cells.clone();
        newCells.toggleSplit(pos, dir, split);
        setCells(newCells);
    };

    const updateTitle = (title: string) => {
        setTitle(title);
        localStorage.setItem("title", title);
    };

    const updateDescription = (description: string) => {
        setDescription(description);
        localStorage.setItem("description", description);
    };

    return (
        <>
            <Modal
                title="Help"
                onClose={() => setCurrentModal(ModalType.None)}
                show={currentModal === ModalType.Help}
            >
                <HelpView key={ModalType.Help} />
            </Modal>
            <Modal
                title="New"
                onClose={() => setCurrentModal(ModalType.None)}
                show={currentModal === ModalType.New}
            >
                <NewDialog
                    onNewCells={(cells) => {
                        onReset(cells);
                        setCurrentModal(ModalType.None);
                    }}
                    onCancel={() => setCurrentModal(ModalType.None)}
                />
            </Modal>
            <Modal
                title="Print Preview"
                onClose={() => setCurrentModal(ModalType.None)}
                show={currentModal === ModalType.PrintPreview}
            >
                <PrintPreview
                    title={title}
                    description={description}
                    cells={cells}
                />
            </Modal>
            <input
                type="file"
                ref={fileChooserInput}
                onChange={(e) => importJson(e.target.files)}
                className={"hidden"}
            />
            <div className="h-full flex flex-col">
                <MenuBar>
                    <MenuItem label="New" onClick={onNew} />
                    <MenuItem label="Import">
                        <MenuItem label="JSON" onClick={onImportJson} />
                    </MenuItem>
                    <MenuItem label="Export">
                        <MenuItem
                            label="JSON"
                            onClick={() => onExport("json")}
                        />
                        <MenuItem
                            label="Ascii"
                            onClick={() => onExport("ascii")}
                        />
                        <MenuItem
                            label="Unicode"
                            onClick={() => onExport("unicode")}
                        />
                        <MenuItem
                            label="LaTeX"
                            onClick={() => onExport("latex")}
                        />
                        <MenuItem label="XML" onClick={() => onExport("xml")} />
                    </MenuItem>
                    <MenuItem label="View">
                        <MenuItem label="Zoom in" onClick={onZoomIn} />
                        <MenuItem label="Zoom out" onClick={onZoomOut} />
                        <MenuItem label="Reset zoom" onClick={onZoomReset} />
                        <MenuItem
                            label="Print Preview"
                            onClick={() =>
                                setCurrentModal(ModalType.PrintPreview)
                            }
                        />
                    </MenuItem>
                    <MenuItem
                        label="Help"
                        onClick={() => setCurrentModal(ModalType.Help)}
                    />
                </MenuBar>
                <div className="h-full flex flex-col">
                    <div className="flex flex-col gap-4 p-4 items-center">
                        <input
                            placeholder="Crossword Title"
                            value={title}
                            onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                updateTitle(e.target.value)
                            }
                            className="w-full md:w-[50vw] border-b text-2xl text-center font-serif"
                        />
                        <textarea
                            value={description}
                            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                updateDescription(e.target.value)
                            }
                            placeholder="Crossword Description"
                            className="w-full md:w-[50vw] border p-2 font-serif resize-none"
                        ></textarea>
                    </div>
                    <div className="flex flex-col xl:flex-row justify-evenly gap-4">
                        <div className="flex flex-row justify-center items-center">
                            <Grid
                                cells={cells}
                                scale={zoom}
                                onCellSplit={onCellSplit}
                                onCellChanged={onCellChanged}
                            />
                        </div>
                        <div className="flex m-2 flex-row justify-center items-center">
                            <Clues
                                cells={cells}
                                onAnswerChanged={onAnswerChanged}
                                onClueChanged={onClueChanged}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;

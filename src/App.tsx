import { ChangeEvent, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import Clues from "#/components/clues";
import Grid from "#/components/grid";
import MenuBar from "#/components/menubar";
import NewDialog from "#/components/newdialog";
import Cells from "#/lib/cells";
import Dir from "#/lib/dir";
import Modal from "#/lib/modal";
import Position from "#/lib/position";
import Export from "./components/export";
import HelpAbout from "./components/help/about";
import HelpGuide from "./components/help/guide";
import PrintPreview from "./components/printpreview";
import AnagramSolver from "./components/tools/anagramsolver";
import WordFinder from "./components/tools/wordfinder";
import importPuzzle, { ImportFormat } from "./lib/import";
import Split from "./lib/split";
import { getDefaultScale } from "./lib/utils";

enum ModalType {
    None = 0,
    HelpGuide = 1,
    HelpAbout = 2,
    New = 3,
    PrintPreview = 4,
    AnagramSolver = 5,
    Export = 6,
    WordFinder = 7,
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
    const [modal, setModal] = useState(ModalType.None);
    const [zoom, setZoom] = useState(getDefaultScale(cells.size()));

    const onNew = () => {
        setModal(ModalType.New);
    };

    const onReset = (cells: Cells, title?: string, description?: string) => {
        updateCells(() => cells);
        updateTitle(title ?? "");
        updateDescription(description ?? "");
        setZoom(getDefaultScale(cells.size()));
    };

    const onZoom = (delta: number | null) => {
        if (delta === null) setZoom(getDefaultScale(cells.size()));
        else setZoom(zoom + delta);
    };

    const onImport = (format: ImportFormat) => {
        const { current: input } = fileChooserInput;
        if (!input) return;

        input.setAttribute("dataFormat", format);
        if (fileChooserInput.current !== null) fileChooserInput.current.click();
    };

    const onImportSelected = (files: FileList | null) => {
        const { current: input } = fileChooserInput;
        if (!input) return;

        const format = input.getAttribute("dataFormat") as ImportFormat | null;
        if (format === null) return;

        if (files === null || files.length === 0) return;
        const file = files.item(0);
        if (file === null) return;
        file.text().then((data) => {
            const { title, description, cells } = importPuzzle(format, data);
            onReset(cells, title, description);
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
                title="Guide"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.HelpGuide}
            >
                <HelpGuide />
            </Modal>
            <Modal
                title="About"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.HelpAbout}
            >
                <HelpAbout />
            </Modal>
            <Modal
                title="New"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.New}
            >
                <NewDialog
                    onNewCells={(cells) => {
                        onReset(cells);
                        setModal(ModalType.None);
                    }}
                    onCancel={() => setModal(ModalType.None)}
                />
            </Modal>
            <Modal
                title="Print Preview"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.PrintPreview}
            >
                <PrintPreview
                    title={title}
                    description={description}
                    cells={cells}
                />
            </Modal>

            <Modal
                title="Anagram Solver"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.AnagramSolver}
            >
                <AnagramSolver />
            </Modal>
            <Modal
                title="Word Finder"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.WordFinder}
            >
                <WordFinder />
            </Modal>
            <Modal
                title="Export"
                onClose={() => setModal(ModalType.None)}
                show={modal === ModalType.Export}
            >
                <Export title={title} description={description} cells={cells} />
            </Modal>

            <input
                type="file"
                ref={fileChooserInput}
                onChange={(e) => onImportSelected(e.target.files)}
                className={"hidden"}
            />

            <div className="h-full flex flex-col">
                <MenuBar
                    onNew={onNew}
                    onImport={onImport}
                    onExport={() => setModal(ModalType.Export)}
                    onZoom={onZoom}
                    onPrintPreview={() => setModal(ModalType.PrintPreview)}
                    onAnagramSolver={() => setModal(ModalType.AnagramSolver)}
                    onWordFinder={() => setModal(ModalType.WordFinder)}
                    onHelpGuide={() => setModal(ModalType.HelpGuide)}
                    onHelpAbout={() => setModal(ModalType.HelpAbout)}
                    onHelpBug={() => {
                        window.location.href =
                            "https://github.com/dominicprice/quarrel/issues";
                    }}
                ></MenuBar>
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

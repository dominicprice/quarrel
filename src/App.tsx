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
import { PlaintextExportChars, asciiChars, unicodeChars } from "#/lib/export";
import Position from "#/lib/position";

enum ModalType {
    None = 0,
    Help = 1,
    New = 2,
}

const App = () => {
    const fileChooserInput = useRef(null as HTMLInputElement | null);

    const [cells, setCells] = useLocalStorage("cells", new Cells(15), {
        deserializer: Cells.fromJSON,
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

    const onNew = () => {
        setCurrentModal(ModalType.New);
    };

    const onReset = (cells: Cells) => {
        updateCells(() => cells);
        updateTitle("");
        updateDescription("");
    };

    const onExportJSON = () => {
        const filename = slugify(title + ".json");
        stringToBlob(JSON.stringify(cells), filename, "application/json");
    };

    const onExportPlaintext = (chars: PlaintextExportChars) => {
        const grid = [title.toUpperCase(), "", description, ""];
        const acrossClues = ["Across:"];
        const downClues = ["Down:"];

        grid.push(chars.ul + chars.u.repeat(cells.size()) + chars.ur);
        for (let i = 0; i < cells.size(); ++i) {
            const row = [];
            for (let j = 0; j < cells.size(); ++j) {
                const cell = cells.at([i, j]);
                row.push(
                    cell.value === "" ? chars.filledCell : chars.blankCell,
                );
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

        const filename = slugify(title + ".txt");
        stringToBlob(
            grid.concat(acrossClues, [""], downClues).join("\n"),
            filename,
        );
    };

    const onImportJSON = () => {
        if (fileChooserInput.current !== null) fileChooserInput.current.click();
    };

    const importJSON = (files: FileList | null) => {
        if (files === null || files.length === 0) return;
        const file = files.item(0);
        if (file === null) return;
        file.text().then((json) => {
            const cellsRaw = JSON.parse(json);
            onReset(Cells.fromJSON(cellsRaw));
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

    const onCellSplit = (pos: Position, dir: Dir) => {
        const newCells = cells.clone();
        newCells.toggleSplit(pos, dir);
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
            <input
                type="file"
                ref={fileChooserInput}
                onChange={(e) => importJSON(e.target.files)}
                className={"hidden"}
            />
            <div>
                <MenuBar>
                    <MenuItem label="New" onClick={onNew} />
                    <MenuItem label="Import">
                        <MenuItem label="JSON" onClick={onImportJSON} />
                    </MenuItem>
                    <MenuItem label="Export">
                        <MenuItem label="JSON" onClick={onExportJSON} />
                        <MenuItem
                            label="Ascii"
                            onClick={() => onExportPlaintext(asciiChars)}
                        />
                        <MenuItem
                            label="Unicode"
                            onClick={() => onExportPlaintext(unicodeChars)}
                        />
                    </MenuItem>
                    <MenuItem
                        label="Help"
                        onClick={() => setCurrentModal(ModalType.Help)}
                    />
                </MenuBar>
                <div className="w-full flex flex-col">
                    <div className="flex flex-col gap-4 p-4 items-center">
                        <input
                            placeholder="Crossword Title"
                            value={title}
                            onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                updateTitle(e.target.value)
                            }
                            className="border-b text-2xl text-center"
                        />
                        <textarea
                            value={description}
                            onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                                updateDescription(e.target.value)
                            }
                            placeholder="Crossword Description"
                            className="w-[50vw] border"
                        ></textarea>
                    </div>
                    <div className="flex flex-row">
                        <div className="flex basis-1/2 flex-col items-center content-center margin-12">
                            <Grid
                                cells={cells}
                                onCellSplit={onCellSplit}
                                onCellChanged={onCellChanged}
                            />
                        </div>
                        <div className="basis-1/2">
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

import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import Dir, { toggleDir } from "#/lib/dir";
import { notifyError } from "#/lib/error";
import importPuzzle, { getDataUrl } from "#/lib/import";
import Position from "#/lib/position";
import { clamp } from "#/lib/utils";
import Clue from "./clue";
import Grid from "./grid";
import SolvableGrid, { SolvableClue } from "./solvablegrid";
import Stopwatch from "./timer";

const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";
const arrowKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

const Viewer = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [cells, setCells] = useState<SolvableGrid>(new SolvableGrid([]));
    const [clues, setClues] = useState<SolvableClue[]>([]);
    const [activeClue, setActiveClue] = useState<SolvableClue | null>(null);
    const [moveDir, setMoveDir] = useState(Dir.Across);
    const [activeCell, setActiveCell] = useState<Position | null>(null);

    useEffect(() => {
        const dataUrl = getDataUrl();
        if (dataUrl === null) {
            toast("No puzzle selected", {
                type: "error",
            });
            return;
        }

        fetch(dataUrl)
            .then((resp) => resp.text())
            .then((resp) => {
                const data = importPuzzle("json", resp);
                setTitle(data.title);
                setDescription(data.description);
                setCells(SolvableGrid.fromEditableCells(data.cells));
            })
            .catch((err) => notifyError(err, "Failed to load crossword"));
    }, []);

    useEffect(() => {
        if (activeCell === null) {
            const [pos, dir] = cells.findFirstClue();
            setMoveDir(dir);
            setActiveCell(pos);
        }
        setClues(cells.getClues());
    }, [cells]);

    useEffect(() => {
        const startingCell =
            activeCell === null
                ? null
                : cells.getFirstCellOfCurrentAnswer(activeCell, moveDir);
        if (startingCell === null) {
            setActiveClue(null);
            return;
        }

        for (const clue of clues) {
            if (
                clue.dir === moveDir &&
                startingCell[0] === clue.startPos[0] &&
                startingCell[1] === clue.startPos[1]
            ) {
                setActiveClue(clue);
                return;
            }
        }
        setActiveClue(null);
    }, [activeCell, moveDir, clues]);

    const onCellChanged = (pos: Position, value: string | null) => {
        setCells(cells.withGuess(pos, value));
    };

    const move = (delta: number, dir?: Dir) => {
        if (activeCell == null) return;

        dir = dir ?? moveDir;

        let [row, col] = activeCell;
        const gridSize = cells.length;
        switch (dir) {
            case Dir.Across:
                col = clamp(col + delta, 0, gridSize - 1);
                break;
            case Dir.Down:
                row = clamp(row + delta, 0, gridSize - 1);
                break;
        }

        if (cells.getCell([row, col]).answer !== null)
            setActiveCell([row, col]);
        const otherCells = cells.getAllCellsOfCurrentAnswer(
            [row, col],
            moveDir,
        );
        if (otherCells.length === 1) setMoveDir(toggleDir(moveDir));
    };

    const onBackspace = () => {
        if (activeCell == null) return;

        if (cells.getCell(activeCell).guess !== null)
            onCellChanged(activeCell, null);
        else move(-1);
    };

    const onLetter = (value: string) => {
        if (activeCell == null) return;

        move(1);
        onCellChanged(activeCell, value);
    };

    const onArrowKey = (code: string) => {
        if (activeCell == null) return;

        switch (code) {
            case "ArrowUp":
            case "KeyK":
                move(-1, Dir.Down);
                break;
            case "ArrowRight":
            case "KeyL":
                move(1, Dir.Across);
                break;
            case "ArrowDown":
            case "KeyJ":
                move(1, Dir.Down);
                break;
            case "ArrowLeft":
            case "KeyH":
                move(-1, Dir.Across);
                break;
        }
    };

    const onToggleMoveDir = () => {
        const otherCells = cells.getAllCellsOfCurrentAnswer(
            activeCell,
            toggleDir(moveDir),
        );
        if (otherCells.length > 1) setMoveDir(toggleDir(moveDir));
    };

    const onSelectNextAnswer = () => {
        if (activeCell === null) return;
        const [pos, dir] = cells.getNextAnswer(activeCell, moveDir);
        setActiveCell(pos);
        setMoveDir(dir);
    };

    const onKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        if (activeCell == null) return;

        let handled = true;
        if (evt.code === "Backspace") onBackspace();
        else if (
            arrowKeys.indexOf(evt.code) >= 0 ||
            (evt.ctrlKey && "hjkl".indexOf(evt.key) >= 0)
        )
            onArrowKey(evt.code);
        else if (evt.code === "Tab") onToggleMoveDir();
        else if (evt.code === "Enter") onSelectNextAnswer();
        else if (allowedChars.indexOf(evt.key.toUpperCase()) >= 0)
            onLetter(evt.key.toUpperCase());
        else handled = false;

        if (handled) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    const onCellClicked = (row: number, col: number) => {
        if (activeCell == null) return;

        if (row === activeCell[0] && col === activeCell[1]) {
            onToggleMoveDir();
        } else if (cells.getCell([row, col]).answer !== null) {
            setActiveCell([row, col]);
            const newSelectedCells = cells.getAllCellsOfCurrentAnswer(
                [row, col],
                moveDir,
            );
            if (newSelectedCells.length === 1) setMoveDir(toggleDir(moveDir));
        }
    };

    const onCheck = (v: string) => {
        if (activeCell === null) return;

        switch (v) {
            case "cell":
                setCells(cells.withCellChecked(activeCell, true));
                break;
            case "word":
                setCells(cells.withAnswerChecked(activeCell, moveDir, true));
                break;
            case "grid":
                setCells(cells.withGridChecked(true));
                break;
        }
    };

    const onReveal = (v: string) => {
        if (activeCell === null) return;

        switch (v) {
            case "cell":
                setCells(cells.withCellRevealed(activeCell));
                break;
            case "word":
                setCells(cells.withAnswerRevealed(activeCell, moveDir));
                break;
            case "grid":
                setCells(cells.withGridRevealed());
                break;
        }
    };

    const onSelectClue = (num: number, dir: Dir) => {
        const activeCell = cells.getCellForClue(num, dir);
        setActiveCell(activeCell);
        setMoveDir(dir);
    };

    const isActiveClue = (clue: SolvableClue) => {
        if (activeClue === null) return false;
        return (
            clue.dir === activeClue.dir &&
            clue.startPos[0] === activeClue.startPos[0] &&
            clue.startPos[1] === activeClue.startPos[1]
        );
    };

    return (
        <div className="min-h-[100vh] flex flex-col content-center items-center">
            <ToastContainer />
            <div className="flex-1 flex flex-col max-w-[800px] mt-8 gap-4 items-center">
                <div className="flex flex-col gap-4 p-4 items-center">
                    <div className="w-full md:w-[50vw] text-2xl text-center font-serif">
                        {title}
                    </div>
                    <div className="w-full md:w-[50vw] p-2 font-serif resize-none italic">
                        {description}
                    </div>
                </div>
                <div className="flex flex-row gap-1 items-center">
                    <Stopwatch />
                    <select
                        value="check"
                        onChange={(e) => onCheck(e.target.value)}
                        className="p-2 border bg-green-600 text-white cursor-pointer"
                        style={{ WebkitAppearance: "none" }}
                    >
                        <option value="check" disabled>
                            Check
                        </option>
                        <option value="cell">Cell</option>
                        <option value="word">Word</option>
                        <option value="grid">Grid</option>
                    </select>
                    <select
                        value="reveal"
                        onChange={(e) => onReveal(e.target.value)}
                        className="p-2 border bg-blue-600 text-white cursor-pointer"
                        style={{ WebkitAppearance: "none" }}
                    >
                        <option value="reveal" disabled>
                            Reveal
                        </option>
                        <option value="cell">Cell</option>
                        <option value="word">Word</option>
                        <option value="grid">Grid</option>
                    </select>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="flex flex-col items-center justify-center gap-1 px-4">
                        {activeClue && (
                            <div className="font-serif px-1 text-sm sm:hidden text-center text-neutral-700">
                                {activeClue.num}. {activeClue.clue} (
                                {activeClue.length})
                            </div>
                        )}
                        <div>
                            <Grid
                                cells={cells}
                                onKeyDown={onKeyDown}
                                onCellClicked={onCellClicked}
                                activeCell={activeCell}
                                selectedCells={cells.getAllCellsOfCurrentAnswer(
                                    activeCell,
                                    moveDir,
                                )}
                            />
                        </div>
                        {activeClue && (
                            <div className="font-serif px-1 text-sm sm:hidden text-center text-neutral-700">
                                {activeClue.num}. {activeClue.clue} (
                                {activeClue.length})
                            </div>
                        )}
                    </div>
                    <div className="flex flex-1 flex-col sm:flex-row gap-4 font-serif px-4 text-sm">
                        <div className="basis-1/2 p-1">
                            <h3 className="font-bold">Across</h3>
                            <hr />
                            <div className="relative border-l-2 mt-2 max-h-24 sm:max-h-auto sm:min-h-[50vh] overflow-y-scroll">
                                {clues
                                    .filter((c) => c.dir === Dir.Across)
                                    .map((clue) => (
                                        <Clue
                                            key={clue.num}
                                            clue={clue.clue}
                                            num={clue.num}
                                            onSelected={() =>
                                                onSelectClue(clue.num, clue.dir)
                                            }
                                            active={isActiveClue(clue)}
                                        />
                                    ))}
                            </div>
                        </div>
                        <div className="basis-1/2 p-1">
                            <h3 className="font-bold">Down</h3>
                            <hr />
                            <div className="relative border-l-2 mt-2 max-h-24 sm:max-h-auto sm:min-h-[50vh] overflow-y-scroll">
                                {clues
                                    .filter((c) => c.dir === Dir.Down)
                                    .map((clue) => (
                                        <Clue
                                            key={clue.num}
                                            clue={clue.clue}
                                            num={clue.num}
                                            onSelected={() =>
                                                onSelectClue(clue.num, clue.dir)
                                            }
                                            active={isActiveClue(clue)}
                                        />
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="h-8 border-t bg-neutral-50 w-full flex flex-row items-center p-2 gap-4">
                <div>
                    Made with{" "}
                    <a className="text-sky-600" href="/">
                        Quarrel
                    </a>
                </div>
                |
                <div>
                    <a
                        className="text-sky-600"
                        href={"/" + window.location.search}
                    >
                        Open
                    </a>{" "}
                    for editing
                </div>
            </div>
        </div>
    );
};

export default Viewer;

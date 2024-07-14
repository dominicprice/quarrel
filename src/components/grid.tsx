import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import Cells from "../lib/cells";
import Dir from "../lib/dir";
import Position from "../lib/position";

const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";
const arrowKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

function clamp(x: number, min: number, max: number): number {
    if (x < min) return min;
    else if (x > max) return max;
    return x;
}

type GridProps = {
    cells: Cells;
    onCellChanged: (pos: Position, value: string) => void;
    onCellSplit: (pos: Position, dir: Dir) => void;
};

const Grid = ({ cells, onCellChanged, onCellSplit }: GridProps) => {
    const ref = useRef(null as null | HTMLDivElement);

    const [moveDir, setMoveDir] = useState(Dir.Across);
    const [activeCell, setActiveCell] = useState([0, 0] as Position);

    useEffect(() => {
        if (ref.current !== null) ref.current.focus();
    }, [ref]);

    const move = (delta: number, dir: Dir | null = null) => {
        if (dir === null) dir = moveDir;

        let [row, col] = activeCell;
        const gridSize = cells.size();
        switch (dir) {
            case Dir.Across:
                col = clamp(col + delta, 0, gridSize - 1);
                break;
            case Dir.Down:
                row = clamp(row + delta, 0, gridSize - 1);
                break;
        }

        setActiveCell([row, col]);
    };

    const onBackspace = () => {
        const [row, col] = activeCell;
        const sPos: Position = [cells.size() - row - 1, cells.size() - col - 1];
        const v = cells.at(activeCell);
        const w = cells.at(sPos);

        if (v.value === "" || (v.isEmpty() && !w.isEmpty())) move(-1);
        else onCellChanged(activeCell, "");
    };

    const onLetter = (value: string) => {
        move(1);
        onCellChanged(activeCell, value);
    };

    const onArrowKey = (code: string) => {
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

    const onTab = () => {
        setMoveDir(moveDir == Dir.Across ? Dir.Down : Dir.Across);
    };

    const onSpacebar = () => {
        onCellSplit(activeCell, moveDir);
    };

    const onKeyDown = (evt: React.KeyboardEvent<HTMLDivElement>) => {
        let handled = true;
        if (evt.code === "Backspace") onBackspace();
        else if (
            arrowKeys.indexOf(evt.code) >= 0 ||
            (evt.ctrlKey && "hjkl".indexOf(evt.key) >= 0)
        )
            onArrowKey(evt.code);
        else if (evt.code === "Tab") onTab();
        else if (evt.code === "Space") onSpacebar();
        else if (allowedChars.indexOf(evt.key.toUpperCase()) >= 0)
            onLetter(evt.key.toUpperCase());
        else handled = false;

        if (handled) {
            evt.stopPropagation();
            evt.preventDefault();
        }
    };

    const onCellClicked = (row: number, col: number) => {
        if (ref.current !== null) {
            ref.current.focus();
        }

        if (row === activeCell[0] && col === activeCell[1]) {
            setMoveDir(moveDir === Dir.Across ? Dir.Down : Dir.Across);
        } else {
            setActiveCell([row, col]);
        }
    };

    return (
        <div
            ref={ref}
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="bg-white border-black border-r border-b"
        >
            {cells.cells.map((row, rowIdx) => (
                <div key={rowIdx} className="flex flex-row">
                    {row.map((cell, cellIdx) => {
                        const isActiveCell =
                            activeCell[0] == rowIdx && activeCell[1] == cellIdx;
                        return (
                            <div
                                onClick={() => onCellClicked(rowIdx, cellIdx)}
                                key={cellIdx}
                                className={classNames(
                                    "w-10",
                                    "h-10",
                                    "border-black",
                                    "border-l",
                                    "border-t",
                                    "inline-block",
                                    "p-0",
                                    "m-0",
                                    "flex",
                                    "justify-center",
                                    "items-center",
                                    "relative",
                                    "select-none",
                                    {
                                        "chevron-across":
                                            isActiveCell &&
                                            moveDir === Dir.Across,
                                        "chevron-down":
                                            isActiveCell && moveDir == Dir.Down,
                                        "bg-neutral-800": cell.value === "",
                                        "border-l-4": cell.splitLeft,
                                        "border-t-4": cell.splitAbove,
                                    },
                                )}
                            >
                                <div className="absolute text-xs top-0 left-0">
                                    {cell.clueNum()}
                                </div>
                                <div className="font-bold text-xl">
                                    {cell.value}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default Grid;

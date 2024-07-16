import { useEffect, useRef, useState } from "react";
import Cells from "#/lib/cells";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import { clamp } from "#/lib/utils";
import GridRow from "./gridrow";

const allowedChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ?";
const arrowKeys = ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"];

type GridProps = {
    cells: Cells;
    scale?: number;
    disabled?: boolean;
    onCellChanged: (pos: Position, value: string) => void;
    onCellSplit: (pos: Position, dir: Dir) => void;
};

const Grid = ({
    cells,
    disabled,
    scale,
    onCellChanged,
    onCellSplit,
}: GridProps) => {
    const ref = useRef(null as null | HTMLDivElement);

    const [moveDir, setMoveDir] = useState(Dir.Across);
    const [activeCell, setActiveCell] = useState(
        disabled ? null : ([0, 0] as Position),
    );

    useEffect(() => {
        if (ref.current !== null) ref.current.focus();
    }, [ref]);

    const move = (delta: number, dir: Dir | null = null) => {
        if (activeCell == null) return;

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
        if (activeCell == null) return;

        const [row, col] = activeCell;
        const sPos: Position = [cells.size() - row - 1, cells.size() - col - 1];
        const v = cells.at(activeCell);
        const w = cells.at(sPos);

        if (v.isBlank() || (v.isEmpty() && !w.isEmpty())) move(-1);
        else onCellChanged(activeCell, "");
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

    const onTab = () => {
        setMoveDir(moveDir == Dir.Across ? Dir.Down : Dir.Across);
    };

    const onSpacebar = () => {
        if (activeCell == null) return;

        onCellSplit(activeCell, moveDir);
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
        if (activeCell == null) return;

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
            className="flex flex-col bg-white border-black border-r border-b"
        >
            {cells.cells.map((row, idx) => (
                <GridRow
                    scale={scale ?? 1}
                    key={idx}
                    cells={row}
                    onCellClicked={(col) => onCellClicked(idx, col)}
                    dir={moveDir}
                    activeCol={
                        activeCell && activeCell[0] == idx
                            ? activeCell[1]
                            : undefined
                    }
                />
            ))}
        </div>
    );
};

export default Grid;

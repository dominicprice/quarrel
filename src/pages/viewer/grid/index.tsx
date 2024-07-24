import React from "react";
import Position from "#/lib/position";
import SolvableGrid from "../solvablegrid";
import GridRow from "./gridrow";

type GridProps = {
    cells: SolvableGrid;
    scale?: number;
    onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>) => void;
    onCellClicked: (row: number, col: number) => void;
    activeCell: Position | null;
    selectedCells: Position[];
};

const Grid = ({
    cells,
    scale,
    onKeyDown,
    onCellClicked,
    activeCell,
    selectedCells,
}: GridProps) => {
    return (
        <div
            tabIndex={0}
            onKeyDown={onKeyDown}
            className="inline-flex flex-col bg-white border-black border-r border-b"
        >
            {cells.cells.map((row, idx) => (
                <GridRow
                    scale={scale ?? 1}
                    key={idx}
                    cells={row}
                    onCellClicked={(col) => onCellClicked(idx, col)}
                    activeCol={
                        activeCell && activeCell[0] == idx
                            ? activeCell[1]
                            : undefined
                    }
                    selectedCols={selectedCells
                        .filter((p) => p[0] === idx)
                        .map((p) => p[1])}
                />
            ))}
        </div>
    );
};

export default Grid;

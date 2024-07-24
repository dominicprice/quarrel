import { SolvableCell } from "../solvablegrid";
import GridCell from "./gridcell";

interface GridRowProps {
    cells: SolvableCell[];
    onCellClicked: (col: number) => void;
    activeCol?: number;
    selectedCols: number[];
    scale: number;
}

const GridRow = ({
    cells,
    scale,
    onCellClicked,
    activeCol,
    selectedCols,
}: GridRowProps) => {
    return (
        <div className="inline-flex flex-row">
            {cells.map((cell, col) => (
                <GridCell
                    key={col}
                    scale={scale}
                    cell={cell}
                    onCellClicked={() => onCellClicked(col)}
                    active={col === activeCol}
                    selected={selectedCols.indexOf(col) >= 0}
                />
            ))}
        </div>
    );
};

export default GridRow;

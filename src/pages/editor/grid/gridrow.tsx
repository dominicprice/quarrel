import Cell from "#/lib/cell";
import Dir from "#/lib/dir";
import GridCell from "./gridcell";

interface GridRowProps {
    cells: Cell[];
    onCellClicked: (col: number) => void;
    dir: Dir;
    activeCol?: number;
    scale: number;
}

const GridRow = ({
    cells,
    scale,
    onCellClicked,
    activeCol,
    dir,
}: GridRowProps) => {
    return (
        <div className="flex flex-row">
            {cells.map((cell, col) => (
                <GridCell
                    key={col}
                    scale={scale}
                    cell={cell}
                    onCellClicked={() => onCellClicked(col)}
                    isActive={col === activeCol}
                    dir={dir}
                />
            ))}
        </div>
    );
};

export default GridRow;

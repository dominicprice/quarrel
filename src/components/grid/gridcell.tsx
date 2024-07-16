import classNames from "classnames";
import Cell from "#/lib/cell";
import Dir from "#/lib/dir";

type GridCellProps = {
    onCellClicked: () => void;
    isActive: boolean;
    cell: Cell;
    scale: number;
    dir: Dir;
};

const GridCell = ({
    onCellClicked,
    scale,
    isActive,
    cell,
    dir,
}: GridCellProps) => {
    const cellDim = `${Math.floor(40 * scale)}px`;
    const numSize = `${Math.floor(12 * scale)}px`;
    const letterSize = `${Math.floor(24 * scale)}px`;
    return (
        <div
            onClick={onCellClicked}
            style={{
                width: cellDim,
                height: cellDim,
            }}
            className={classNames(
                "border-black",
                "border-l",
                "border-t",
                "inline-block",
                "p-0",
                "m-0",
                "flex",
                "justify-center",
                "relative",
                "select-none",
                {
                    "chevron-across": isActive && dir === Dir.Across,
                    "chevron-down": isActive && dir == Dir.Down,
                    "bg-neutral-800": cell.value === "",
                    "border-l-4": cell.splitLeft,
                    "border-t-4": cell.splitAbove,
                },
            )}
        >
            <div
                style={{ fontSize: numSize }}
                className="absolute top-0 left-0"
            >
                {cell.clueNum()}
            </div>
            <input
                value={cell.value}
                style={{
                    fontSize: letterSize,
                    width: cellDim,
                    height: cellDim,
                }}
                className="font-bold bg-transparent block cursor-pointer text-center caret-transparent outline-none"
            />
        </div>
    );
};

export default GridCell;

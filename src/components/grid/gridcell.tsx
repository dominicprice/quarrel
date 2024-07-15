import classNames from "classnames";
import Cell from "#/lib/cell";
import Dir from "#/lib/dir";

type GridCellProps = {
    onCellClicked: () => void;
    isActive: boolean;
    cell: Cell;
    dir: Dir;
};

const GridCell = ({ onCellClicked, isActive, cell, dir }: GridCellProps) => {
    return (
        <div
            onClick={onCellClicked}
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
                "items-end",
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
            <div className="absolute text-xs top-0 left-0">
                {cell.clueNum()}
            </div>
            <div className="font-bold text-xl">{cell.value}</div>
        </div>
    );
};

export default GridCell;

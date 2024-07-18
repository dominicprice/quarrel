import classNames from "classnames";
import Cell from "#/lib/cell";
import Dir from "#/lib/dir";
import Split from "#/lib/split";
import { toPx } from "#/lib/utils";

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
    const baseCellSize = 40;
    const baseLetterSize = baseCellSize * 0.6;

    const cellDim = toPx(baseCellSize, scale);
    const numSize = toPx(baseLetterSize * 0.5, scale);
    const letterSize = toPx(baseLetterSize, scale);
    const hyphenSize = toPx(baseCellSize * 0.25, scale);
    const hyphenOffsetY = toPx(baseCellSize * 0.5, scale);
    const hyphenOffsetX = toPx(-baseCellSize * 0.125, scale);
    const hyphenWidth = toPx(baseCellSize * 0.05, scale);

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
                    "border-l-4": cell.splitLeft == Split.Space,
                    "border-t-4": cell.splitAbove == Split.Space,
                },
            )}
        >
            <div
                style={{ fontSize: numSize }}
                className="absolute top-0 left-0"
            >
                {cell.clueNum()}
            </div>
            {cell.splitLeft == Split.Hyphen && (
                <div
                    style={{
                        height: 0,
                        width: hyphenSize,
                        top: hyphenOffsetY,
                        left: hyphenOffsetX,
                        borderTopWidth: hyphenWidth,
                    }}
                    className="absolute border-black"
                />
            )}
            {cell.splitAbove == Split.Hyphen && (
                <div
                    style={{
                        height: hyphenSize,
                        width: 0,
                        left: hyphenOffsetY,
                        top: hyphenOffsetX,
                        borderLeftWidth: hyphenWidth,
                    }}
                    className="absolute border-black"
                />
            )}
            <input
                value={cell.value}
                onChange={() => {}}
                style={{
                    fontSize: letterSize,
                    width: cellDim,
                    height: cellDim,
                }}
                className="bg-transparent block cursor-pointer text-center caret-transparent outline-none font-block"
            />
        </div>
    );
};

export default GridCell;

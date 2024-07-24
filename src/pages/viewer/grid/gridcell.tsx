import classNames from "classnames";
import { toPx } from "#/lib/utils";
import { SolvableCell } from "../solvablegrid";

type GridCellProps = {
    onCellClicked: () => void;
    active: boolean;
    selected: boolean;
    cell: SolvableCell;
    scale: number;
};

const GridCell = ({
    onCellClicked,
    scale,
    active,
    selected,
    cell,
}: GridCellProps) => {
    const baseCellSize = 40;
    const baseLetterSize = baseCellSize * 0.6;

    const cellDim = toPx(baseCellSize, scale);
    const numSize = toPx(baseLetterSize * 0.5, scale);
    const letterSize = toPx(baseLetterSize, scale);

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
                    "bg-amber-50": selected && !active,
                    "bg-amber-200": active,
                    "bg-neutral-800": cell.answer === null,
                },
            )}
        >
            <div
                style={{ fontSize: numSize }}
                className="absolute top-0 left-0"
            >
                {cell.num}
            </div>
            <input
                value={cell.guess || ""}
                onChange={() => {}}
                style={{
                    fontSize: letterSize,
                    width: cellDim,
                    height: cellDim,
                }}
                className={classNames(
                    {
                        "text-green-600":
                            cell.checked && cell.guess === cell.answer,
                        "text-red-600":
                            cell.checked && cell.guess !== cell.answer,
                    },
                    "bg-transparent",
                    "block",
                    "cursor-pointer",
                    "text-center",
                    "caret-transparent",
                    "outline-none",
                    "font-block",
                )}
            />
        </div>
    );
};

export default GridCell;

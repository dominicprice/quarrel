import classNames from "classnames";
import { toPx } from "#/lib/utils";
import { SolvableCell } from "../solvablegrid";
import { useEffect, useRef } from "react";

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
	const ref = useRef<HTMLInputElement>(null);
	const baseCellSize = 40;
	const baseLetterSize = baseCellSize * 0.6;

	const cellDim = toPx(baseCellSize, scale);
	const numSize = toPx(baseLetterSize * 0.5, scale);
	const letterSize = toPx(baseLetterSize, scale);

	useEffect(() => {
		if (selected && ref.current) ref.current.focus();
	}, [selected]);

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
					"bg-black": cell.answer === null,
				},
			)}
		>
			<div style={{ fontSize: numSize }} className="absolute top-0 left-0">
				{cell.num}
			</div>
			<input
				ref={ref}
				value={cell.guess || ""}
				onChange={() => {}}
				style={{
					fontSize: letterSize,
					width: cellDim,
					height: cellDim,
				}}
				className={classNames(
					{
						"text-green-600": cell.checked && cell.guess === cell.answer,
						"text-red-600": cell.checked && cell.guess !== cell.answer,
						"cursor-pointer": cell.answer !== null,
						"cursor-default": cell.answer === null,
					},
					"bg-transparent",
					"block",
					"text-center",
					"caret-transparent",
					"outline-hidden",
					"font-bold",
				)}
			/>
		</div>
	);
};

export default GridCell;

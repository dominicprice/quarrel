import classNames from "classnames";
import { forwardRef } from "react";
import Cells from "#/lib/cells";

interface PrintViewProps {
    title: string;
    description: string;
    cells: Cells;

    margin: number;
    textSize: number;
    gridSize: number;
}

const PrintView = forwardRef<HTMLDivElement, PrintViewProps>(
    (
        {
            title,
            description,
            cells,
            margin,
            textSize,
            gridSize,
        }: PrintViewProps,
        ref,
    ) => {
        const marginSize = `${margin}px`;
        const headerSize = `${Math.floor(textSize * 1.8)}px`;
        const descriptionSize = `${textSize}px`;
        const clueSize = `${textSize}px`;
        const cellSize = `${gridSize}px`;
        const numSize = `${Math.floor(gridSize / 3)}px`;
        const numMarginLeft = `${Math.ceil(gridSize / 20)}px`;

        return (
            <div style={{ margin: marginSize }} ref={ref}>
                {title && (
                    <h1
                        style={{ fontSize: headerSize }}
                        className="font-display text-center"
                    >
                        {title}
                    </h1>
                )}

                {description && (
                    <p
                        style={{ fontSize: descriptionSize }}
                        className="font-display px-4 py-8"
                    >
                        {description}
                    </p>
                )}
                <div className="flex flex-row justify-center">
                    <div className="flex flex-col border-b border-black">
                        {cells.cells.map((row, r) => (
                            <div
                                key={r}
                                className="flex flex-row border-r border-black"
                            >
                                {row.map((cell, c) => (
                                    <div
                                        key={c}
                                        style={{
                                            width: cellSize,
                                            height: cellSize,
                                        }}
                                        className={classNames(
                                            "border-t",
                                            "border-l",
                                            "border-black",
                                            "relative",
                                            {
                                                "bg-black": cell.value === "",
                                            },
                                        )}
                                    >
                                        {cell.clueNum() && (
                                            <div
                                                style={{
                                                    fontSize: numSize,
                                                    left: numMarginLeft,
                                                }}
                                                className="absolute top-0"
                                            >
                                                {cell.clueNum()}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                <div
                    className="flex flex-row font-display justify-center pt-8"
                    style={{ fontSize: clueSize }}
                >
                    <div className="flex flex-col basis-1/2 items-end mr-6">
                        <div className="flex flex-col">
                            <h3 className="font-bold">Across</h3>
                            {cells
                                .allCells()
                                .filter(([c]) => c.acrossClue !== null)
                                .map(([c, _]) => (
                                    <p key={c.clueNum()}>
                                        {c.clueNum()}. {c.acrossClue!.clue} (
                                        {c
                                            .acrossClue!.answer.split(" ")
                                            .map((w) => w.length)
                                            .join(",")}
                                        )
                                    </p>
                                ))}
                        </div>
                    </div>
                    <div className="flex flex-col basis-1/2 ml-6">
                        <h3 className="font-bold">Down</h3>
                        {cells
                            .allCells()
                            .filter(([c]) => c.downClue !== null)
                            .map(([c, _]) => (
                                <p key={c.clueNum()}>
                                    {c.clueNum()}. {c.downClue!.clue} (
                                    {c
                                        .downClue!.answer.split(" ")
                                        .map((w) => w.length)
                                        .join(",")}
                                    )
                                </p>
                            ))}
                    </div>
                </div>
            </div>
        );
    },
);

export default PrintView;

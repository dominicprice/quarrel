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

    showHeader: boolean;
    showDescription: boolean;
    showAnswers: boolean;
    showClues: boolean;
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
            showHeader,
            showDescription,
            showAnswers,
            showClues,
        }: PrintViewProps,
        ref,
    ) => {
        const marginSize = `${margin}px`;
        const headerSize = `${Math.floor(textSize * 1.8)}px`;
        const descriptionSize = `${textSize}px`;
        const clueSize = `${textSize}px`;
        const cellSize = `${gridSize}px`;
        const letterSize = `${Math.floor(gridSize * 0.65)}px`;
        const numSize = `${Math.floor(gridSize / 3)}px`;
        const numMarginLeft = `${Math.ceil(gridSize / 20)}px`;

        return (
            <div style={{ margin: marginSize }} ref={ref}>
                {title && showHeader && (
                    <h1
                        style={{ fontSize: headerSize }}
                        className="font-serif text-center pb-4"
                    >
                        {title}
                    </h1>
                )}

                {description && showDescription && (
                    <p
                        style={{ fontSize: descriptionSize }}
                        className="font-serif px-4 py-4"
                    >
                        {description}
                    </p>
                )}
                <div className="flex flex-row justify-center py-4">
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
                                            "flex",
                                            "justify-center",
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
                                                className="absolute top-0 font-serif"
                                            >
                                                {cell.clueNum()}
                                            </div>
                                        )}
                                        {showAnswers && (
                                            <div
                                                style={{ fontSize: letterSize }}
                                                className="font-block"
                                            >
                                                {cell.value}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
                {showClues && (
                    <div
                        className="flex flex-row font-serif justify-center pt-4"
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
                                            {c.clueNum()}. {c.acrossClue!.clue}{" "}
                                            ({c.acrossClue!.lengths()})
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
                                        {c.downClue!.lengths()})
                                    </p>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        );
    },
);

export default PrintView;

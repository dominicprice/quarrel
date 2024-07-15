import classNames from "classnames";
import { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import slugify from "slugify";
import Cells from "../lib/cells";
import Clue from "../lib/clue";

type PrintViewProps = {
    title: string;
    description: string;
    cells: Cells;
};

const PrintableCrossword = ({ title, description, cells }: PrintViewProps) => {
    return (
        <div className="w-1/2 h-1/2 p-16 overflow-auto">
            <h1>{title}</h1>
            <p>{description}</p>
            <div className="flex justify-center align-center">
                <div className="bg-white">
                    {cells.cells.map((row, rowIdx) => (
                        <div key={rowIdx} className="flex flex-row">
                            {row.map((cell, cellIdx) => {
                                return (
                                    <div
                                        key={cellIdx}
                                        className={classNames(
                                            "w-10",
                                            "h-10",
                                            "border-black",
                                            "border-l",
                                            "border-t",
                                            "inline-block",
                                            "flex",
                                            "justify-center",
                                            "align-center",
                                            "relative",
                                            {
                                                "bg-black": cell.value === "",
                                            },
                                        )}
                                    >
                                        <div className="absolute top-0 left-0 text-xs">
                                            {cell.clueNum()}
                                        </div>
                                        <div className="font-bold text-lg"></div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-row">
                <div className="basis-1/2">
                    <h3>Across</h3>
                    {cells
                        .allCells()
                        .filter(([c, _]) => c.acrossClue !== null)
                        .map(([c, _]) => {
                            const clue = c.acrossClue as Clue;
                            return (
                                <div key={clue.num}>
                                    {clue.num}.&nbsp;{clue.clue}&nbsp;(
                                    {clue.answer
                                        .split(" ")
                                        .map((w) => w.length)
                                        .join(",")}
                                    )
                                </div>
                            );
                        })}
                </div>
                <div className="basis-1/2">
                    <h3>Down</h3>
                    {cells
                        .allCells()
                        .filter(([c, _]) => c.downClue !== null)
                        .map(([c, _]) => {
                            const clue = c.downClue as Clue;
                            return (
                                <div key={clue.num}>
                                    {clue.num}.&nbsp;{clue.clue}&nbsp;(
                                    {clue.answer
                                        .split(" ")
                                        .map((w) => w.length)
                                        .join(",")}
                                    )
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
};

const PrintView = ({ title, description, cells }: PrintViewProps) => {
    const ref = useRef<HTMLDivElement | null>();

    const [isGenerating, setIsGenerating] = useState(false);

    const getTrigger = () => {
        return (
            <div>
                <button>Print</button>
                {isGenerating ? "(preparing print...)" : ""}
            </div>
        );
    };

    return (
        <div>
            <ReactToPrint
                content={
                    <PrintableCrossword
                        title={title}
                        description={description}
                        cells={cells}
                    />
                }
                documentTitle={slugify(title)}
                trigger={getTrigger}
                onBeforePrint={() => setIsGenerating(true)}
                onAfterPrint={() => setIsGenerating(false)}
            />
        </div>
    );
};

export default PrintView;

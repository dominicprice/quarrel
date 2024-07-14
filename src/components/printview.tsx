import classNames from "classnames";
import { Component } from "react";
import ReactToPrint from "react-to-print";
import slugify from "slugify";
import Cells from "../lib/cells";
import Clue from "../lib/clue";

type PrintViewProps = {
    title: string;
    description: string;
    cells: Cells;
};

type PrintViewState = {
    isGenerating: boolean;
};

class PrintView extends Component<PrintViewProps, PrintViewState> {
    ref: HTMLDivElement | null;

    constructor(props: PrintViewProps) {
        super(props);
        this.ref = null;

        this.state = {
            isGenerating: false,
        };
    }

    getTrigger = () => {
        return (
            <div>
                <button>Print</button>
                {this.state.isGenerating ? "(preparing print...)" : ""}
            </div>
        );
    };

    render = () => {
        const { title, description, cells } = this.props;

        return (
            <div>
                <ReactToPrint
                    content={() => this.ref}
                    documentTitle={slugify(this.props.title)}
                    trigger={this.getTrigger}
                    onBeforePrint={() =>
                        this.setState((state) => ({
                            ...state,
                            isGenerating: true,
                        }))
                    }
                    onAfterPrint={() =>
                        this.setState((state) => ({
                            ...state,
                            isGenerating: false,
                        }))
                    }
                />
                <div
                    ref={(ref) => {
                        this.ref = ref;
                    }}
                    className="w-1/2 h-1/2 p-16 overflow-auto"
                >
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
                                                        "bg-black":
                                                            cell.value === "",
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
                            {this.props.cells
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
                            {this.props.cells
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
            </div>
        );
    };
}

export default PrintView;

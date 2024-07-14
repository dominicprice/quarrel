import { Component } from "react";
import Cells from "../lib/cells";
import { templates } from "../lib/templates";

enum Mode {
    FromSize = 0,
    FromTemplate = 1,
}

type NewDialogProps = {
    onNewCells: (cells: Cells) => void;
    onCancel: () => void;
};

type NewDialogState = {
    createMode: Mode;
    gridSize: number;
    template: string;
};

class NewDialog extends Component<NewDialogProps, NewDialogState> {
    constructor(props: NewDialogProps) {
        super(props);

        this.state = {
            createMode: Mode.FromSize,
            gridSize: 15,
            template: "Default",
        };
    }

    generateGrid = () => {
        if (this.state.createMode === Mode.FromSize) {
            return new Cells(this.state.gridSize);
        } else {
            const template = templates[this.state.template];
            if (template !== undefined) return Cells.fromTemplate(template);
            else return new Cells(5);
        }
    };

    setGridSize = (size: string) => {
        let value = parseInt(size);
        if (value < 5) value = 5;
        else if (value > 20) value = 20;
        this.setState((state) => ({
            ...state,
            gridSize: value,
        }));
    };

    renderFromSize = () => {
        const disabled = this.state.createMode !== Mode.FromSize;
        return (
            <>
                <div>
                    <input
                        type="radio"
                        id="render-from-size-radio"
                        onChange={() =>
                            this.setState((state) => ({
                                ...state,
                                createMode: Mode.FromSize,
                            }))
                        }
                        checked={!disabled}
                    />
                    <label htmlFor="render-from-size-radio">Blank Grid</label>
                </div>
                <div>
                    <input
                        type="number"
                        value={this.state.gridSize}
                        disabled={disabled}
                        onChange={(e) => this.setGridSize(e.target.value)}
                        min={5}
                        max={20}
                    />
                </div>
            </>
        );
    };

    setTemplate = (template: string) => {
        if (templates[template] === undefined) return;
        this.setState((state) => ({
            ...state,
            template: template,
        }));
    };

    renderFromTemplate = () => {
        const disabled = this.state.createMode !== Mode.FromTemplate;
        return (
            <>
                <div>
                    <input
                        type="radio"
                        id="render-from-template-radio"
                        onChange={() =>
                            this.setState((state) => ({
                                ...state,
                                createMode: Mode.FromTemplate,
                            }))
                        }
                        checked={!disabled}
                    />
                    <label htmlFor="render-from-template-radio">Template</label>
                </div>
                <div>
                    <select
                        onChange={(e) => this.setTemplate(e.target.value)}
                        disabled={disabled}
                        value={this.state.template}
                    >
                        {Object.keys(templates).map((name) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>
                </div>
            </>
        );
    };

    render = () => {
        return (
            <div className="p-8 flex flex-col gap-4">
                <div>{this.renderFromSize()}</div>
                <div>{this.renderFromTemplate()}</div>
                <div className="flex flex-row gap-2">
                    <button
                        onClick={() =>
                            this.props.onNewCells(this.generateGrid())
                        }
                        className="rounded bg-sky-500 outline-none font-bold cursor-pointer p-2"
                    >
                        New
                    </button>
                    <button
                        onClick={this.props.onCancel}
                        className="rounded bg-red-500 outline-none font-bold cursor-pointer p-2"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    };
}

export default NewDialog;

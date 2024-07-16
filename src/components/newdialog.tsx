import { useEffect, useState } from "react";
import Cells from "../lib/cells";
import { templates } from "../lib/templates";
import Grid from "./grid";

enum Mode {
    FromSize = 0,
    FromTemplate = 1,
}

interface NewDialogProps {
    onNewCells: (cells: Cells) => void;
    onCancel: () => void;
}

const NewDialog = ({ onNewCells, onCancel }: NewDialogProps) => {
    const [createMode, setCreateMode] = useState(Mode.FromSize);
    const [gridSize, setGridSize] = useState(15);
    const [template, setTemplate] = useState("Default");

    const generateGrid = () => {
        if (createMode === Mode.FromSize) {
            return new Cells(gridSize);
        } else {
            const tpl = templates[template];
            if (tpl !== undefined) return Cells.fromTemplate(tpl);
            else return new Cells(5);
        }
    };

    const [cells, setCells] = useState(generateGrid());

    useEffect(() => {
        setCells(generateGrid());
    }, [createMode, gridSize, template]);

    const onGridSizeChanged = (size: string) => {
        let value = parseInt(size);
        if (value < 5) value = 5;
        else if (value > 20) value = 20;
        setGridSize(value);
    };
    const onTemplateChanged = (template: string) => {
        if (templates[template] === undefined) return;
        setTemplate(template);
    };

    const onModeChanged = (value: string) => {
        switch (value) {
            case "fromSize":
                setCreateMode(Mode.FromSize);
                break;
            case "fromTemplate":
                setCreateMode(Mode.FromTemplate);
                break;
            default:
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 flex flex-col">
                <div className="flex flex-col gap-8 md:gap-0 md:flex-row justify-between">
                    <div className="p-2 gap-1 flex flex-col">
                        <div>Mode</div>
                        <div>
                            <select
                                onChange={(e) => onModeChanged(e.target.value)}
                                className="w-48 p-2 bg-white border shadow"
                            >
                                <option value="fromSize">Blank Grid</option>
                                <option value="fromTemplate">
                                    From Template
                                </option>
                            </select>
                        </div>
                        {createMode === Mode.FromSize && (
                            <>
                                <div>Grid Size</div>
                                <div>
                                    <input
                                        type="number"
                                        className="w-48 p-2 bg-white border shadow"
                                        value={gridSize}
                                        disabled={createMode !== Mode.FromSize}
                                        onChange={(e) =>
                                            onGridSizeChanged(e.target.value)
                                        }
                                        min={5}
                                        max={20}
                                    />
                                </div>
                            </>
                        )}

                        {createMode === Mode.FromTemplate && (
                            <>
                                <div>Template</div>
                                <div>
                                    <select
                                        className="w-48 p-2 bg-white border shadow"
                                        onChange={(e) =>
                                            onTemplateChanged(e.target.value)
                                        }
                                        disabled={
                                            createMode !== Mode.FromTemplate
                                        }
                                        value={template}
                                    >
                                        {Object.keys(templates).map((name) => (
                                            <option key={name} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex-1 flex justify-center">
                        <Grid
                            cells={cells}
                            onCellChanged={(..._) => {}}
                            onCellSplit={(..._) => {}}
                            scale={0.5}
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-row gap-2">
                <button
                    onClick={() => onNewCells(generateGrid())}
                    className="bg-green-600 text-white outline-none cursor-pointer py-1 px-2"
                >
                    Create
                </button>
                <button
                    onClick={onCancel}
                    className="bg-neutral-600 text-white outline-none cursor-pointer py-1 px-2"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default NewDialog;

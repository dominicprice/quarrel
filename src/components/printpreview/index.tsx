import { useState } from "react";
import ReactToPrint from "react-to-print";
import Cells from "#/lib/cells";
import PrintView from "./printview";

interface PrintPreviewProps {
    title: string;
    description: string;
    cells: Cells;
}

const PrintPreview = ({ title, description, cells }: PrintPreviewProps) => {
    let ref: HTMLDivElement | null = null;

    const [margin, setMargin] = useState(48);
    const [textSize, setTextSize] = useState(12);
    const [cellSize, setCellSize] = useState(36);

    return (
        <div>
            <ReactToPrint
                trigger={() => (
                    <button className="bg-neutral-600 text-white shadow py-1 px-2">
                        Print
                    </button>
                )}
                content={() => ref}
            />
            <button
                className="bg-red-600 text-white shadow py-1 px-2"
                onClick={() => {
                    setMargin(48);
                    setTextSize(12);
                    setCellSize(36);
                }}
            >
                Reset
            </button>
            <div className="flex flex-row gap-4 items-center">
                <label>Margin</label>
                <input
                    type="range"
                    min={0}
                    max={150}
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                />
            </div>

            <div className="flex flex-row gap-4 items-center">
                <label>Text Size</label>
                <input
                    type="range"
                    min={4}
                    max={48}
                    value={textSize}
                    onChange={(e) => setTextSize(parseInt(e.target.value))}
                />
            </div>

            <div className="flex flex-row gap-4 items-center">
                <label>Cell Size</label>
                <input
                    type="range"
                    min={18}
                    max={96}
                    value={cellSize}
                    onChange={(e) => setCellSize(parseInt(e.target.value))}
                />
            </div>
            <div className="border shadow mt-8">
                <PrintView
                    ref={(el) => (ref = el)}
                    title={title}
                    description={description}
                    cells={cells}
                    margin={margin}
                    textSize={textSize}
                    gridSize={cellSize}
                />
            </div>
        </div>
    );
};

export default PrintPreview;

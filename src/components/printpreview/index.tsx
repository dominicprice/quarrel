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
    const [textSize, setTextSize] = useState(16);
    const [cellSize, setCellSize] = useState(48);

    const [showHeader, setShowHeader] = useState(true);
    const [showDescription, setShowDescription] = useState(true);
    const [showAnswers, setShowAnswers] = useState(false);
    const [showClues, setShowClues] = useState(true);

    return (
        <div>
            <div className="flex flex-row gap-2">
                <ReactToPrint
                    trigger={() => (
                        <button className="bg-lime-600 text-white shadow py-1 px-2">
                            Print
                        </button>
                    )}
                    content={() => ref}
                />
                <button
                    className="bg-neutral-600 text-white shadow py-1 px-2"
                    onClick={() => {
                        setMargin(48);
                        setTextSize(12);
                        setCellSize(36);
                    }}
                >
                    Reset
                </button>
            </div>
            <div className="flex flex-col md:flex-row m-4 gap-8">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center">
                        <label className="w-24" htmlFor="marginSlider">
                            Page Margin
                        </label>
                        <input
                            id="marginSlider"
                            type="range"
                            min={0}
                            max={150}
                            value={margin}
                            onChange={(e) =>
                                setMargin(parseInt(e.target.value))
                            }
                        />
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                        <label className="w-24" htmlFor="textSizeSlider">
                            Text Size
                        </label>
                        <input
                            id="textSizeSlider"
                            type="range"
                            min={4}
                            max={48}
                            value={textSize}
                            onChange={(e) =>
                                setTextSize(parseInt(e.target.value))
                            }
                        />
                    </div>

                    <div className="flex flex-row gap-4 items-center">
                        <label className="w-24" htmlFor="cellSizeSlider">
                            Cell Size
                        </label>
                        <input
                            id="cellSizeSlider"
                            type="range"
                            min={18}
                            max={96}
                            value={cellSize}
                            onChange={(e) =>
                                setCellSize(parseInt(e.target.value))
                            }
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            id="showHeaderCheckbox"
                            type="checkbox"
                            checked={showHeader}
                            onChange={(e) => setShowHeader(e.target.checked)}
                        />
                        <label htmlFor="showHeaderCheckbox">Show Header</label>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            id="showDescriptionCheckbox"
                            type="checkbox"
                            checked={showDescription}
                            onChange={(e) =>
                                setShowDescription(e.target.checked)
                            }
                        />
                        <label htmlFor="showDescriptionCheckbox">
                            Show Description
                        </label>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            id="showAnswersCheckbox"
                            type="checkbox"
                            checked={showAnswers}
                            onChange={(e) => setShowAnswers(e.target.checked)}
                        />
                        <label htmlFor="showAnswersCheckbox">
                            Show Answers
                        </label>
                    </div>
                    <div className="flex flex-row gap-4 items-center">
                        <input
                            id="showCluesCheckbox"
                            type="checkbox"
                            checked={showClues}
                            onChange={(e) => setShowClues(e.target.checked)}
                        />
                        <label htmlFor="showCluesCheckbox">Show Clues</label>
                    </div>
                </div>
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
                    showHeader={showHeader}
                    showDescription={showDescription}
                    showAnswers={showAnswers}
                    showClues={showClues}
                />
            </div>
        </div>
    );
};

export default PrintPreview;

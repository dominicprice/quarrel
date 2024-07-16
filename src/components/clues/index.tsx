import Cells from "#/lib/cells";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import ClueList from "./cluelist";

type CluesProps = {
    cells: Cells;
    onClueChanged: (pos: Position, dir: Dir, value: string) => void;
    onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
};

const Clues = ({ cells, onClueChanged, onAnswerChanged }: CluesProps) => {
    const acrossClueCells = cells
        .allCells()
        .filter(([c, _]) => c.acrossClue !== null);
    const downClueCells = cells
        .allCells()
        .filter(([c, _]) => c.downClue !== null);

    return (
        <div className="flex flex-col md:flex-row w-full justify-center">
            <div className="md:border-r">
                <h3 className="font-bold font-display">Across</h3>
                <ClueList
                    cells={acrossClueCells}
                    dir={Dir.Across}
                    onClueChanged={onClueChanged}
                    onAnswerChanged={onAnswerChanged}
                />
            </div>

            <div className="md:pl-3">
                <h3 className="font-bold font-display">Down</h3>
                <ClueList
                    cells={downClueCells}
                    dir={Dir.Down}
                    onClueChanged={onClueChanged}
                    onAnswerChanged={onAnswerChanged}
                />
            </div>
        </div>
    );
};

export default Clues;

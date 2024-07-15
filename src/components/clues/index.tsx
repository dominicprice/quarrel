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
        <div className="flex flex-row w-full">
            <div className="w-1/2 border-r">
                <h3>Across</h3>
                <ClueList
                    cells={acrossClueCells}
                    dir={Dir.Across}
                    onClueChanged={onClueChanged}
                    onAnswerChanged={onAnswerChanged}
                />
            </div>

            <div className="w-1/2 pl-1">
                <h3>Down</h3>
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

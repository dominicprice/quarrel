import Cell from "#/lib/cell";
import Dir from "#/lib/dir";
import Position from "#/lib/position";
import ClueEntry from "./clueentry";

interface ClueListProps {
    cells: [Cell, Position][];
    dir: Dir;
    onClueChanged: (pos: Position, dir: Dir, value: string) => void;
    onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
}

const ClueList = ({
    cells,
    dir,
    onClueChanged,
    onAnswerChanged,
}: ClueListProps) => {
    return (
        <>
            {cells.map(([cell, pos]) => {
                const clue =
                    dir == Dir.Across ? cell.acrossClue! : cell.downClue!;
                return (
                    <ClueEntry
                        key={clue.num}
                        clue={clue}
                        onClueChanged={(v) => onClueChanged(pos, dir, v)}
                        onAnswerChanged={(v) => onAnswerChanged(pos, dir, v)}
                    />
                );
            })}
        </>
    );
};

export default ClueList;

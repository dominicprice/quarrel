import Cells from "../lib/cells";
import Clue from "../lib/clue";
import Select from "../lib/components/select";
import Dir from "../lib/dir";
import Position from "../lib/position";
import { normaliseClue } from "../lib/utils";

interface ClueViewProps {
    clue: Clue;
    pos: Position;
    dir: Dir;
    onClueChanged: (pos: Position, dir: Dir, value: string) => void;
    onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
    findMatches: (pattern: string, limit: number) => string[];
}

const ClueView = ({
    clue,
    pos,
    dir,
    onClueChanged,
    onAnswerChanged,
    findMatches,
}: ClueViewProps) => {
    const getOptions = (pattern: string) =>
        findMatches(pattern, 100).map((m) => ({
            label: m.toUpperCase(),
            value: normaliseClue(m),
        }));
    const changeAnswer = (o: { value: string }) =>
        onAnswerChanged(pos, dir, o.value);
    return (
        <div key={clue.num} className="p-2 flex gap-2">
            <span className="w-8">{clue.num}. </span>
            <input
                value={clue.clue}
                onInput={(e) => onClueChanged(pos, dir, e.currentTarget.value)}
                placeholder={clue.answer}
                className="border-b flex-1"
            />
            <Select
                getOptions={getOptions}
                getOptionsArgs={[clue.answer]}
                onSelect={changeAnswer}
            />
            <span>
                (
                {clue.answer
                    .split(" ")
                    .map((w) => w.length)
                    .join(",")}
                )
            </span>
        </div>
    );
};

type CluesProps = {
    cells: Cells;
    onClueChanged: (pos: Position, dir: Dir, value: string) => void;
    onAnswerChanged: (pos: Position, dir: Dir, value: string) => void;
};

const Clues = ({ cells, onClueChanged, onAnswerChanged }: CluesProps) => {
    const findMatches = (pattern: string, limit: number) => {
        pattern = normaliseClue(pattern);
        const patternMatchesWord = (word: string) => {
            word = normaliseClue(word);
            for (let i = 0; i < word.length; ++i) {
                if (pattern[i] === "?") continue;
                if (pattern[i] !== word[i]) return false;
            }
            return true;
        };

        return [];
    };

    return (
        <div className="flex flex-row w-full">
            <div className="w-1/2 border-r">
                <h3>Across</h3>
                {cells
                    .allCells()
                    .filter(([c, _]) => c.acrossClue !== null)
                    .map(([c, pos]) => (
                        <ClueView
                            key={(c.acrossClue as Clue).num}
                            clue={c.acrossClue as Clue}
                            onClueChanged={onClueChanged}
                            onAnswerChanged={onAnswerChanged}
                            findMatches={findMatches}
                            pos={pos as Position}
                            dir={Dir.Across}
                        />
                    ))}
            </div>

            <div className="w-1/2 pl-1">
                <h3>Down</h3>
                {cells
                    .allCells()
                    .filter(([c, _]) => c.downClue !== null)
                    .map(([c, pos]) => (
                        <ClueView
                            key={(c.downClue as Clue).num}
                            clue={c.downClue as Clue}
                            onClueChanged={onClueChanged}
                            onAnswerChanged={onAnswerChanged}
                            findMatches={findMatches}
                            pos={pos as Position}
                            dir={Dir.Down}
                        />
                    ))}
            </div>
        </div>
    );
};

export default Clues;

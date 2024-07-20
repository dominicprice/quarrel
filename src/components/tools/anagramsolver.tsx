import classNames from "classnames";
import { useEffect, useState } from "react";
import anagramWord from "#/lib/dictionary/anagram";

const AnagramSolver = () => {
    const [letters, setLetters] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [solutions, setSolutions] = useState<string[] | null>(null);

    useEffect(() => {
        if (letters.length === 0) {
            setError("at least one letter required");
        } else if (letters.match(/^[a-zA-Z]+$/) === null) {
            setError("anagram can only contain letters A-Z");
        } else {
            setError(null);
            anagramWord(letters)
                .then((sol) => setSolutions(sol))
                .catch((err) => setError(err));
        }
    }, [letters]);

    return (
        <div className="flex flex-col gap-4 p-8">
            <div className="flex flex-col justify-center items-center gap-1">
                <input
                    value={letters}
                    onChange={(e) => setLetters(e.target.value)}
                    type="text"
                    className={classNames(
                        "w-48",
                        "text-center",
                        "uppercase",
                        "text-xl",
                        "border",
                        "border-1",
                        "outline-none",
                        "p-2",
                        {
                            "border-green-400": error === null,
                            "border-red-400": error !== null,
                        },
                    )}
                />
                {error !== null && (
                    <div className="text text-xs text-red-400">{error}</div>
                )}
            </div>
            <div>
                {solutions !== null && solutions.length > 0 ? (
                    <ul className="flex flex-col gap-2 flex-wrap h-[50vh]">
                        {solutions.map((s) => (
                            <li key={s}>{s}</li>
                        ))}
                    </ul>
                ) : (
                    <div className="italic">No solutions found</div>
                )}
            </div>
        </div>
    );
};

export default AnagramSolver;

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
			setSolutions([]);
		} else if (letters.match(/^[a-zA-Z]+$/) === null) {
			setError("anagram can only contain letters A-Z");
			setSolutions([]);
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
					autoFocus
					onChange={(e) => setLetters(e.target.value)}
					type="text"
					className={classNames(
						"w-48",
						"text-center",
						"uppercase",
						"text-xl",
						"border",
						"shadow",
						"rounded",
						"outline-hidden",
						"p-2",
						{
							"border-neutral-200": error === null,
							"border-red-400": error !== null,
						},
					)}
				/>
				<div className="text text-xs text-red-400 h-8">{error}</div>
			</div>
			{solutions !== null && solutions.length > 0 ? (
				<ul className="flex flex-row gap-8 flex-wrap justify-center">
					{solutions.map((s) => (
						<li key={s}>{s}</li>
					))}
				</ul>
			) : (
				<div className="text-neutral-400">No solutions found</div>
			)}
		</div>
	);
};

export default AnagramSolver;

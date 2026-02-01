import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { errorToString } from "#/lib/error";
import importPuzzle, { ImportedPuzzle } from "#/lib/import";
import NoPuzzle from "./nopuzzle";
import Puzzle from "./puzzle";
import { decompress } from "#/lib/compression";

interface ViewerReadyState {
	state: "ready";
	puzzle: ImportedPuzzle;
}

interface ViewerErrorState {
	state: "error";
	title: string;
	message?: string;
	iconUrl?: string;
}

interface ViewerLoadingState {
	state: "loading";
}

type ViewerState = ViewerReadyState | ViewerLoadingState | ViewerErrorState;

const Viewer = () => {
	const [state, setState] = useState<ViewerState>({
		state: "loading",
	});

	useEffect(() => {
		const queryParams = new URLSearchParams(window.location.search);
		const base64Data = queryParams.get("data");
		Promise.resolve()
			.then(() => {
				if (base64Data === null) {
					throw new Error("no data provided");
				}
				return decompress(decodeURIComponent(base64Data));
			})
			.then((jsonData) => {
				const puzzle = importPuzzle("json", jsonData);
				setState({
					state: "ready",
					puzzle: puzzle,
				});
			})
			.catch((err) => {
				setState({
					state: "error",
					title: "Failed to load puzzle",
					message: errorToString(err),
					iconUrl: "/assets/sadface.svg",
				});
			});
	}, []);

	const main = () => {
		switch (state.state) {
			case "error":
				return (
					<NoPuzzle
						title={state.title}
						message={state.message}
						iconUrl={state.iconUrl}
					/>
				);
			case "loading":
				return (
					<NoPuzzle
						title="Loading"
						iconUrl="/assets/loading.svg"
						iconSpin={true}
					/>
				);
			case "ready":
				return <Puzzle puzzle={state.puzzle} />;
		}
	};

	return (
		<div className="min-h-screen w-screen flex flex-col content-center items-center">
			<ToastContainer />
			{main()}
			<div className="h-8 border-t bg-neutral-50 w-full py-1 px-2 text-sm text-right">
				Made with{" "}
				<a href="/" className="underline">
					Quarrel
				</a>
			</div>
		</div>
	);
};

export default Viewer;

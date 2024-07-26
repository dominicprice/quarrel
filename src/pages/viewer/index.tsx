import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { errorToString } from "#/lib/error";
import importPuzzle, { ImportedPuzzle, getDataUrl } from "#/lib/import";
import NoPuzzle from "./nopuzzle";
import Puzzle from "./puzzle";

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
        const dataUrl = getDataUrl();
        if (dataUrl === null) {
            setState({
                state: "error",
                title: "No puzzle selected",
                iconUrl: "/assets/questionmark.svg",
            });
            return;
        }

        fetch(dataUrl)
            .then((resp) => resp.text())
            .then((resp) => {
                const puzzle = importPuzzle("json", resp);
                setState({ state: "ready", puzzle: puzzle });
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
        <div className="min-h-[100vh] w-[100vw] flex flex-col content-center items-center">
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

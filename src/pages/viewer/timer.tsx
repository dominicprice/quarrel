import { useState } from "react";
const Stopwatch = () => {
    const [elapsed, setElapsed] = useState(0);
    const [timeout, setTimeout] = useState<NodeJS.Timeout | null>(null);

    // Method to start and stop timer
    const startStop = () => {
        if (timeout === null) {
            const now = new Date();
            const startTime = now.getTime();
            const elapsedStart = elapsed;
            setTimeout(
                setInterval(() => {
                    const iNow = new Date();
                    const delta = Math.floor(
                        (iNow.getTime() - startTime) / 1000,
                    );
                    setElapsed(elapsedStart + delta);
                }, 500),
            );
        } else {
            clearTimeout(timeout);
            setTimeout(null);
        }
    };

    // Method to reset timer back to 0
    const reset = () => {
        setElapsed(0);
        if (timeout !== null) {
            clearTimeout(timeout);
            setTimeout(null);
        }
    };

    const hours = Math.floor(elapsed / 3600);
    const minutes = Math.floor((elapsed / 60) % 60);
    const seconds = Math.floor(elapsed % 60);

    return (
        <div className="relative flex items-center border p-2 gap-8 bg-neutral-100">
            <button onClick={reset}>
                <img src="/assets/refresh.svg" className="w-3 h-3" />
            </button>
            <div>
                {hours.toString().padStart(2, "0")}:
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
            </div>
            <button onClick={startStop}>
                <img
                    src={
                        timeout === null
                            ? "/assets/play.svg"
                            : "/assets/pause.svg"
                    }
                    className="w-3 h-3"
                />
            </button>
        </div>
    );
};

export default Stopwatch;

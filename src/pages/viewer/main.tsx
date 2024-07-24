import React from "react";
import ReactDOM from "react-dom/client";
import Viewer from ".";
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement,
);
root.render(
    <React.StrictMode>
        <Viewer />
    </React.StrictMode>,
);

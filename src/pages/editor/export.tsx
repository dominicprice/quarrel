import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import downloadAsBlob from "#/lib/blob";
import Cells from "#/lib/cells";
import convertExportData from "#/lib/export/data";
import renderTemplate, { builtinTemplates } from "#/lib/export/templates";
import Select from "#/lib/select";

const fontSizes = ["Tiny", "Small", "Medium", "Large", "Huge"];

function fontSizeToPx(fontSize: string) {
    switch (fontSize) {
        case "Tiny":
            return "8px";
        case "Small":
            return "12px";
        case "Medium":
            return "16px";
        case "Large":
            return "24px";
        case "Huge":
            return "32px";
    }
}

interface ExportProps {
    title: string;
    description: string;
    cells: Cells;
}

const Export = ({ title, description, cells }: ExportProps) => {
    const [template, setTemplate] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [fontSize, setFontSize] = useState("Small");
    const [copied, setCopied] = useState(false);
    const [filename, setFilename] = useState("");

    const data = useMemo(
        () => convertExportData(title, description, cells),
        [title, description, cells],
    );

    const onBuiltinSelected = (name: string) => {
        for (const tpl of builtinTemplates) {
            if (tpl.name === name) {
                setTemplate(tpl.template);
                setFilename(slugify(title || "crossword") + tpl.fileExtension);
            }
        }
    };

    const onCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
    };

    const onDownload = () => {
        downloadAsBlob(output, filename || "crossword.txt");
    };

    useEffect(() => {
        setCopied(false);
        try {
            const r = renderTemplate(template, data);
            setOutput(r);
            setError("");
        } catch (err: any) {
            setOutput("");
            setError(err.message);
        }
    }, [template]);

    return (
        <div className="flex flex-col h-full gap-2">
            <div className="flex flex-row">
                <div className="flex flex-col sm:flex-row gap-1 items-center">
                    <Select onChange={onBuiltinSelected}>
                        <option disabled>Select template</option>
                        {builtinTemplates.map((tpl) => (
                            <option key={tpl.name} value={tpl.name}>
                                {tpl.name}
                            </option>
                        ))}
                    </Select>
                    <Select onChange={setFontSize} value={fontSize}>
                        <option disabled>Select font size</option>
                        {fontSizes.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </Select>
                    <input
                        type="text"
                        className="w-48 p-2 border shadow"
                        value={filename}
                        placeholder="Filename"
                        onChange={(e) => setFilename(e.target.value)}
                    />
                </div>
                <div className="flex flex-col sm:flex-row gap-1 items-center order-2 ml-auto">
                    <button
                        className={classNames(
                            "text-white w-32 p-2 border shadow transition",
                            {
                                "bg-blue-600": !copied,
                                "bg-neutral-300": copied,
                            },
                        )}
                        onClick={onCopy}
                        disabled={copied}
                    >
                        {copied ? "Copied" : "Copy"}
                    </button>
                    <button
                        className="w-32 p-2 border shadow bg-green-600 text-white"
                        onClick={onDownload}
                    >
                        Download
                    </button>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-2 h-full">
                <textarea
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="basis-1/2 border resize-none font-mono p-1"
                    style={{ fontSize: fontSizeToPx(fontSize) }}
                ></textarea>
                <textarea
                    value={output || error}
                    className={classNames(
                        "basis-1/2 border resize-none font-mono bg-neutral-50 p-1",
                        {
                            "text-red-400": error,
                        },
                    )}
                    style={{ fontSize: fontSizeToPx(fontSize) }}
                    readOnly
                ></textarea>
            </div>
        </div>
    );
};
export default Export;

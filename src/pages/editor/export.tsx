import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import slugify from "slugify";
import downloadAsBlob from "#/lib/blob";
import Cells from "#/lib/cells";
import convertExportData from "#/lib/export/data";
import renderTemplate, { builtinTemplates } from "#/lib/export/templates";
import Select from "#/lib/select";

interface ExportProps {
	title: string;
	description: string;
	cells: Cells;
}

const Export = ({ title, description, cells }: ExportProps) => {
	const [template, setTemplate] = useState("");
	const [output, setOutput] = useState("");
	const [error, setError] = useState("");
	const [fontSize, setFontSize] = useState(12);
	const [filename, setFilename] = useState(
		slugify(title || "crossword") + ".txt",
	);

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
	};

	const onDownload = () => {
		downloadAsBlob(output, filename || "crossword.txt");
	};

	useEffect(() => {
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
		<div className="flex flex-col md:flex-row gap-2 h-[50dvh]">
			<div className="basis-0 shrink-1 grow-1 border border-neutral-200 rounded flex flex-col">
				<div className="flex flex-row bg-neutral-200 border-b border-neutral-400 gap-4 h-12 px-2 items-center">
					<div className="flex flex-col">
						<div className="text-xs text-neutral-400">Template</div>
						<Select
							onChange={onBuiltinSelected}
							className="border-none bg-neutral-100 p-1 text-xs shadow-none"
							chevronSize={16}
						>
							<option disabled>Select template</option>
							{builtinTemplates.map((tpl) => (
								<option key={tpl.name} value={tpl.name}>
									{tpl.name}
								</option>
							))}
						</Select>
					</div>
					<div className="flex flex-col">
						<div className="text-xs text-neutral-400">Font Size</div>
						<input
							type="range"
							min="8"
							className="w-24"
							max="20"
							value={fontSize}
							onChange={(e) => setFontSize(parseInt(e.currentTarget.value))}
						/>
					</div>
				</div>
				<textarea
					value={template}
					onChange={(e) => setTemplate(e.target.value)}
					className="resize-none font-mono p-1 outline-none flex-1"
					style={{ fontSize: `${fontSize}px` }}
				></textarea>
			</div>
			<div className="basis-0 shrink-1 grow-1 border flex flex-col border border-neutral-200 rounded">
				<div className="flex flex-row bg-neutral-200 border-b border-neutral-400 gap-4 h-12 px-2 items-center">
					<div className="flex flex-col">
						<div className="text-xs text-neutral-400">Filename</div>
						<input
							type="text"
							className="w-36 p-1 text-xs bg-neutral-100 rounded"
							value={filename}
							placeholder="Filename"
							onChange={(e) => setFilename(e.target.value)}
						/>
					</div>
					<div className="flex-1"></div>
					<button
						className={classNames(
							"w-8 h-8 cursor-pointer material-symbols-outlined rounded-lg hover:bg-neutral-300",
						)}
						onClick={onCopy}
					>
						content_copy
					</button>
					<button
						className="w-8 h-8 cursor-pointer material-symbols-outlined rounded-lg hover:bg-neutral-300"
						onClick={onDownload}
					>
						download
					</button>
				</div>
				<textarea
					value={output || error}
					className={classNames(
						"resize-none font-mono p-1 outline-none flex-1",
						{
							"text-red-400": error,
						},
					)}
					style={{ fontSize: `${fontSize}px` }}
					readOnly
				></textarea>
			</div>
		</div>
	);
};
export default Export;

import classNames from "classnames";
import { memo } from "react";
import { ImportFormat } from "#/lib/import";
import MenuItem from "./menuitem";

type MenuBarProps = {
    onNew: () => void;
    onImport: (format: ImportFormat) => void;
    onExport: () => void;
    onGenerate: () => void;
    onZoom: (delta: number | null) => void;
    onPrintPreview: () => void;
    onAnagramSolver: () => void;
    onWordFinder: () => void;
    onHelpGuide: () => void;
    onHelpAbout: () => void;
    onHelpBug: () => void;
};

const MenuBar = memo(
    ({
        onNew,
        onImport,
        onExport,
        onGenerate,
        onZoom,
        onPrintPreview,
        onAnagramSolver,
        onWordFinder,
        onHelpGuide,
        onHelpAbout,
        onHelpBug,
    }: MenuBarProps) => {
        return (
            <div
                className={classNames(
                    "w-full",
                    "bg-neutral-800",
                    "text-white",
                    "flex",
                    "flex-row",
                )}
            >
                <MenuItem level={0} label="File">
                    <MenuItem level={1} label="New" onClick={onNew} />
                    <MenuItem level={1} label="Import">
                        <MenuItem
                            level={2}
                            label="JSON"
                            onClick={() => onImport("json")}
                        />
                    </MenuItem>
                    <MenuItem level={1} label="Export" onClick={onExport} />
                    <MenuItem level={1} label="Generate" onClick={onGenerate} />
                </MenuItem>
                <MenuItem level={0} label="View">
                    <MenuItem
                        level={1}
                        label="Zoom in"
                        onClick={() => onZoom(0.1)}
                    />
                    <MenuItem
                        level={1}
                        label="Zoom out"
                        onClick={() => onZoom(-0.1)}
                    />
                    <MenuItem
                        level={1}
                        label="Reset zoom"
                        onClick={() => onZoom(null)}
                    />
                    <MenuItem
                        level={1}
                        label="Print Preview"
                        onClick={onPrintPreview}
                    />
                </MenuItem>
                <MenuItem level={0} label="Tools">
                    <MenuItem
                        level={1}
                        label="Anagram solver"
                        onClick={onAnagramSolver}
                    />
                    <MenuItem
                        level={1}
                        label="Word finder"
                        onClick={onWordFinder}
                    />
                </MenuItem>
                <MenuItem level={0} label="Help">
                    <MenuItem level={1} label="Guide" onClick={onHelpGuide} />
                    <MenuItem
                        level={1}
                        label="Report bug"
                        onClick={onHelpBug}
                    />
                    <MenuItem level={1} label="About" onClick={onHelpAbout} />
                </MenuItem>
                <div className="order-2 ml-auto flex items-center pr-1">
                    <img className="w-8 h-8" src="/logo.svg" />
                </div>
            </div>
        );
    },
);

export default MenuBar;

const HelpGuide = () => {
    return (
        <div>
            <ul className="list-inside list-disc">
                <li>
                    Click on a cell in the grid and start typing letters to
                    begin. Clues will appear on the right hand side.
                </li>
                <li>
                    Cells will be revealed containg a ? in order to make the
                    grid symmetric. You can also type ? into a cell manually to
                    indicate an unknown letter. For suggestions to complete a
                    word with unknown characters, click the dropdown next to the
                    corresponding clue.
                </li>
            </ul>
            <hr className="my-2" />
            <h4 className="pb-2 italic">Mouse/key bindings</h4>
            <dl>
                <dt className="text-neutral-600 font-bold uppercase text-xs">
                    Arrow keys / Ctrl+hjkl
                </dt>
                <dd className="pb-2">Navigate grid</dd>
                <dt className="text-neutral-600 font-bold uppercase text-xs">
                    Tab/Click on active cell
                </dt>
                <dd className="pb-2">Change between moving across/down</dd>

                <dt className="text-neutral-600 font-bold uppercase text-xs">
                    Spacebar
                </dt>
                <dd className="pb-2">
                    Insert a word break before the current cell
                </dd>

                <dt className="text-neutral-600 font-bold uppercase text-xs">
                    Backspace
                </dt>
                <dd className="pb-2">
                    Delete character in current cell, or change to ? if current
                    cell requires a value for grid symmetry
                </dd>
            </dl>
        </div>
    );
};

export default HelpGuide;

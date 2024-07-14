import { Component } from "react";

class HelpView extends Component {
    render = () => {
        return (
            <div className="p-8">
                <h3>Crossword Maker</h3>
                <p>
                    Click on a cell in the grid and start typing letters to
                    begin. Clues will appear on the right hand side.
                </p>
                <p>
                    Cells will be revealed containg a ? in order to make the
                    grid symmetric. You can also type ? into a cell manually to
                    indicate an unknown letter. For suggestions to complete a
                    word with unknown characters, click the dropdown next to the
                    corresponding clue.
                </p>
                <h4>Mouse/key bindings</h4>
                <dl>
                    <dt>Arrow keys</dt>
                    <dd>Navigate grid</dd>
                    <dt>Ctrl+hjkl</dt>
                    <dd>
                        Navigate grid (vim style, h=left, j=down, k=up, l=right)
                    </dd>
                    <dt>Tab/Click on active cell</dt>
                    <dd>Change between moving across/down</dd>
                    <dt>Spacebar</dt>
                    <dd>Insert a word break before the current cell</dd>
                    <dt>Backspace</dt>
                    <dd>
                        Delete character in current cell, or change to ? if
                        current cell requires a value for grid symmetry
                    </dd>
                </dl>
            </div>
        );
    };
}

export default HelpView;

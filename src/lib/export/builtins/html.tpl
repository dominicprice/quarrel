<!doctype html>

<html>

<head>
    <title>{{:title}} - Crossword</title>
    <style>
        body {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        main {
            max-width: 800px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .title {
            text-align: center;
        }

        .description {
            font-style: italic;
        }

        .crossword {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .grid {
            display: inline-flex;
            flex-direction: column;
            border-bottom: 1px solid black;
        }

        .grid-row {
            display: inline-flex;
            flex-direction: row;
            border-right: 1px solid black;
        }

        .grid-cell {
            position: relative;
            transition: background-color 50ms linear;
            width: 30px;
            height: 30px;
            border-left: 1px solid black;
            border-top: 1px solid black;
            padding: 0;
        }

        .grid-cell.empty {
            background-color: black;
        }

        .grid-number {
            display: absolute;
            top: 0;
            left: 0;
            font-size: 10px;
        }

        .grid-letter {
            position: absolute;
            outline: none;
            caret-color: transparent;
            top: 0;
            cursor: pointer;
            left: 0;
            padding: 0;
            margin: 0;
            width: 30px;
            height: 30px;
            border: none;
            background-color: transparent;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
        }

        .clues {
            display: flex;
            gap: 20px;
            flex-direction: row;
        }

        .clue-list {
            flex-basis: 50%;
        }

        .selected {
            background-color: #FFF071;
        }

        .active {
            background-color: #77DBFF;
        }

     .btn-group {
         display: flex;
         flex-direction: row;
         justify-content: center;
         gap: 2px;
     }

     .btn {
         outline: none;
         border: 1px solid black;
         padding: 4px;
     }

     .timer {
         width: 100px;
         border: 1px solid black;
         display: flex;
         flex-direction: row;
         justify-content: center;
         align-items: center;
     }

     .correct {
         background-color: #97D534 !important;
     }

     .clue {
         padding: 3px;
         margin: 2px;
         cursor: pointer;
     }
    </style>
</head>

<body>
    <main>
        <h1 class="title">{{>title}}</h1>
        <p class="description">{{>description}}</p>
        <div class="btn-group">
            <div id="timer" class="timer">00:00:00</div>
            <button class="btn" id="btn-start" >Start</button>
            <button class="btn" id="btn-pause">Pause</button>
            <button class="btn" id="btn-reset" >Reset</button>
        </div>
        <div class="btn-group">
            <button class="btn" id="btn-reveal-cell">Reveal Cell</button>
            <button class="btn" id="btn-reveal-word">Reveal Word</button>
            <button class="btn" id="btn-reveal-grid">Reveal Grid</button>
            <button class="btn" id="btn-check">Check</button>
        </div>
        <div class="crossword">
            <div class="grid" id="grid">{{for cells}}
                <div class="grid-row">{{for}}{{if letter}}
                    <div class="grid-cell">{{if num}}
                        <div class="grid-number">{{:num}}</div>{{/if}}
                        <input class="grid-letter"{{if num}}data-cluenum="{{:num}}"{{/if}} data-cellid="{{:#parent.parent.getIndex()}},{{:#parent.getIndex()}}" data-letter="{{:letter}}" />
                    </div>{{else}}
                    <div class="grid-cell empty"></div>{{/if}}{{/for}}
                </div>{{/for}}
            </div>
            <div class="clues" id="clues">
                <div class="clue-list">
                    <h3>Across</h3>{{for acrossClues}}
                    <div class="clue" data-cluenum="{{:num}}A">{{:num}}. {{:clue}}</div>{{/for}}
                </div>
                <div class="clue-list">
                    <h3>Down</h3>{{for downClues}}
                    <div class="clue" data-cluenum="{{:num}}D">{{:num}}. {{:clue}}</div>{{/for}}
                </div>
            </div>
        </div>
    </main>

    <script>
        const grid = document.getElementById("grid");
        const clues = document.getElementById("clues");
        let across = true;
        const dim = grid.children.length;
        let elapsed = 0;
        let timer = null;

        function getCellId(input) {
            const pos = input.getAttribute("data-cellid").split(",");
            return [parseInt(pos[0]), parseInt(pos[1])];
        }

        function getInputByRowCol(row, col) {
            return grid.querySelector(`[data-cellid="${row},${col}"]`);
        }

        function getInputByClueNum(num) {
            return grid.querySelector(`[data-cluenum="${num}"]`);
        }

        function startsClue(input) {
            let [r, c] = getCellId(input);
            if (across)
                return !getInputByRowCol(r, c - 1) && !!getInputByRowCol(r, c + 1);
            else
                return !getInputByRowCol(r - 1, c) && !!getInputByRowCol(r + 1, c);
        }

        function moveFocus(input, forward) {
            let [r, c] = getCellId(input);
            if (forward)
                across ? ++c : ++r;
            else
                across ? --c : --r;
            const nextInput = getInputByRowCol(r, c);
            if (nextInput)
                nextInput.focus();
        }

        function getWordCells(input, inclusive) {
            let res = [];
            const [r, c] = getCellId(input);
            for (let d = 1;; ++d) {
                const i = across ? getInputByRowCol(r, c - d) : getInputByRowCol(r - d, c);
                if (!i) break;
                res.unshift(i)
            }
            if (inclusive)
                res.push(input);
            for (let d = 1; ; ++d) {
                const i = across ? getInputByRowCol(r, c + d) : getInputByRowCol(r + d, c);
                if (!i) break;
                res.push(i)
            }
            return res;
        }

        function onFocus(input) {
            // remove selected class from all cells
            grid.querySelectorAll(".grid-cell").forEach((e) => {
                e.classList.remove("selected");
                e.classList.remove("active");
            });
            clues.querySelectorAll(".clue").forEach((e) => {
                e.classList.remove("selected");
            });

            // change orientation if forced
            if (getWordCells(input).length === 0)
                across = !across;

            // add selected class to current cell
            input.closest("div").classList.add("selected");

            // highlight rest of clue
            const wordCells = getWordCells(input, true);
            for (const i of wordCells) {
                if (i !== input)
                    i.closest("div").classList.add("active");
            }
            // add selected class to current clue
            const clueNum = wordCells[0].getAttribute("data-cluenum");
            const dir = across ? "A" : "D";
            clues.querySelector(`[data-cluenum="${clueNum}${dir}"]`).classList.add("selected");
        }

        // add event handlers for buttons
        document.getElementById("btn-start").addEventListener("click", () => {
            const startTime = (new Date()).getTime();
            const elapsedStart = elapsed;
            timer = setInterval(() => {
                const now = (new Date()).getTime();
                elapsed = elapsedStart + Math.floor((now - startTime) / 1000);
                const s = (elapsed % 60).toString().padStart(2, '0');
                const m = (Math.floor(elapsed / 60) % 60).toString().padStart(2, '0');
                const h = Math.floor(elapsed / 3600).toString().padStart(2, '0');
                document.getElementById("timer").innerHTML = `${h}:${m}:${s}`
            }, 100);
        });

        document.getElementById("btn-pause").addEventListener("click", () => {
            if (timer == null)
                return;
            clearTimeout(timer);
            timer = null;
        });

        document.getElementById("btn-reset").addEventListener("click", () => {
            if (timer !== null) {
                clearTimeout(timer);
                timer = null;
            }
            elapsed = 0;
            document.getElementById("timer").innerHTML = "00:00:00";
        });

        document.getElementById("btn-reveal-cell").addEventListener("click", () => {
            const input = grid.querySelector(".grid-cell.selected input");
            input.value = input.getAttribute("data-letter");
        });

        document.getElementById("btn-reveal-word").addEventListener("click", () => {
            const selectedInput = grid.querySelector(".grid-cell.selected input");
            if (!selectedInput)
                return;

            for (const i of getWordCells(input, true))
                input.value = input.getAttribute("data-letter");
        });

        document.getElementById("btn-reveal-grid").addEventListener("click", () => {
            for (const input of grid.querySelectorAll(".grid-cell input")) {
                input.value = input.getAttribute("data-letter");
            }
        });

        document.getElementById("btn-check").addEventListener("click", () => {
            for (const input of grid.querySelectorAll(".grid-cell input")) {
                if (input.value && input.value === input.getAttribute("data-letter"))
                    input.closest("div").classList.add("correct");
            }
        });

        // add event handlers for cells
        for (const clue of clues.querySelectorAll(".clue")) {
            clue.addEventListener("click", () => {
                const clueNum = clue.getAttribute("data-cluenum");
                across = (clueNum[clueNum.length - 1] === "A");
                getInputByClueNum(clueNum.slice(0, -1)).focus();
            });
        }

        // add event handlers for cells
        for (let ri = 0; ri < dim; ++ri) {
            const row = grid.children[ri];
            for (let ci = 0; ci < dim; ++ci) {
                const cell = row.children[ci];
                const input = cell.querySelector("input");
                if (!input)
                    continue;
                input.addEventListener("keydown", (e) => {
                    e.preventDefault();
                    return false;
                });
                input.addEventListener("keyup", (e) => {
                    switch (e.key) {
                    case "Backspace":
                        if (input.value !== "")
                            input.value = "";
                        else
                            moveFocus(input, false);
                        break;
                    case "ArrowLeft":
                        across = true;
                        moveFocus(input, false);
                        break;
                    case "ArrowRight":
                        across = true;
                        moveFocus(input, true);
                        break;
                    case "ArrowUp":
                        across = false;
                        moveFocus(input, false);
                        break;
                    case "ArrowDown":
                        across = false;
                        moveFocus(input, true);
                        break;
                    case " ":
                        moveFocus(input, true);
                        break;
                    case "Enter":
                        let clueNum = parseInt(getWordCells(input, true)[0].getAttribute("data-cluenum"));
                        while (true) {
                            ++clueNum;
                            const next = getInputByClueNum(clueNum);
                            if (next) {
                                if (startsClue(next)) {
                                    next.focus();
                                    return;
                                }
                            } else {
                                across = !across;
                                clueNum = 0;
                            }
                        }
                        const next = getInputByClueNum(clueNum);
                        if (next) {
                            next.focus()
                        } else {
                            across = !across;
                            getInputByClueNum(1).focus();
                        }
                        break;
                    case "Tab":
                        across = !across;
                        onFocus(input);
                        break;
                    default:
                        if (e.key.match(/^[a-zA-Z]$/)) {
                            input.value = e.key.toUpperCase();
                            moveFocus(input, true);
                        }
                        break;
                    }
                });
                input.addEventListener("focus", (e) => {
                    onFocus(input);
                });
            }
        }
    </script>
</body>

</html>

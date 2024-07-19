% requires the 'crossword' package from CTAN
% install with tlmgr by running 'tlmgr install crossword'

\documentclass{article}
\usepackage{cwpuzzle}

\begin{document}

\title{{{:title}}}
\date{}
\author{{{:description}}}
\maketitle

\begin{Puzzle}
{{for cells}}
{{for}}|{{:num ? '[' + num + ']' : ''}}{{:letter ? letter : '*'}}{{/for}}|.{{/for}}

\end{Puzzle}

\begin{PuzzleClues}{\textbf{Across}}
{{for acrossClues}}
\Clue{{{:num}}}{{{:answer}}}{{{:clue}}}{{/for}}

\end{PuzzleClues}

\begin{PuzzleClues}{\textbf{Down}}
{{for downClues}}
\Clue{{{:num}}}{{{:answer}}}{{{:clue}}}{{/for}}

\end{PuzzleClues}

\end{document}

You can export your crossword in any format using the JsRender engine here. For full documentation on JsRender, view the online documentation at https://www.jsviews.com/#jsrapi.

The crossword is passed into the template function as an ExportData object with the following typescript interface:

  interface ExportData {
    title: string; // Crossword title
    description: string; // Crossword description
    acrossClues: ExportClue[]; // List of across clues
    downClues: ExportClue[]; // List of down clues
    size: number; // Number of cells in one direction
    cells: ExportCell[][]; // 2d array of cells[row][col]
  }

  interface ExportClue {
    num: number; // The clue number
    row: number; // 1-indexed row of where the clue is
    col: number; // 1-indexed column of where the clue is
    clue: string; // The clue which needs to be solved
    answer: string; // The answer to the clue
    lengths: string; // Length of the answer (e.g. 2,4 for "IN NEED")
  }

  interface ExportCell {
    num: number | null; // The clue number of the cell, or null if no clue starts here
    letter: string | null; // The letter which the cell should contain, or null if blank
  }

You can substitute in a field of ExportedData like so:
  The title of your crossword is {{:title}}

To conditionally render a field, you can use an if statement:
  Your crossword {{if title}}has{{else}}does not have{{/if}} a title
or use the ternary operator:
  Your crossword {{:description ? 'has' : 'does not have'}} a description

To iterate through arrays you can use the for keyword:
  The across clue numbers are {{for acrossClues}}{{:num}}, {{/for}}
You can iterate through a subrange of an array by passing start and end keywords:
  The values of the second and third cells of the first row are {{for cells[0] start=1 end=3}}{{:letter ? letter : '.'}}{{/for}}
  
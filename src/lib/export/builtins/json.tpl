{
  "title": {{json:title}},
  "description": {{json:description}},
  "size": {{:size}},
  "grid": [{{for cells end=-1}}
    ["{{for}}{{:letter || ' '}}{{/for}}"],{{/for}}
    {{for cells start=-1}}["{{for}}{{:letter || ' '}}{{/for}}"]{{/for}}
  ],
  "acrossClues": [{{for acrossClues end=-1}}
    {
      "num": {{:num}},
      "row": {{:row}},
      "col": {{:col}},
      "clue": {{json:clue}},
      "answer": {{json:answer}}
    },{{/for}}{{for acrossClues start=-1}}
    {
      "num": {{:num}},
      "row": {{:row}},
      "col": {{:col}},
      "clue": {{json:clue}},
      "answer": {{json:answer}}
    }{{/for}}
  ],
  "downClues": [{{for downClues end=-1}}
    {
      "num": {{:num}},
      "row": {{:row}},
      "col": {{:col}},
      "clue": {{json:clue}},
      "answer": {{json:answer}}
    },{{/for}}{{for downClues start=-1}}
    {
      "num": {{:num}},
      "row": {{:row}},
      "col": {{:col}},
      "clue": {{json:clue}},
      "answer": {{json:answer}}
    }{{/for}}
  ]
}

<?xml version="1.0" encoding="utf-8"?>
<puzzle>
  <crossword language="en">
    <metadata>
      <title>{{>title}}</title>
      <description>{{>Description}}</description>
    </metadata>

    <american>
      <grid rows="{{:size}}" columns="{{:size}}">{{for cells}}{{for}}{{if letter}}
        <letter id="{{:#parent.parent.getIndex()}},{{:#parent.getIndex()}}">{{:letter}}</letter>{{else}}
        <blank></blank>{{/if}}{{/for}}
{{/for}}
      </grid>

      <clues>{{for acrossClues}}
        <across cellid="{{:row}},{{:col}}">{{:clue}}</across>{{/for}}
{{for downClues}}
        <down cellid="{{:row}},{{:col}}">{{:clue}}</down>{{/for}}
      </clues>
    </american>
  </crossword>
</puzzle>

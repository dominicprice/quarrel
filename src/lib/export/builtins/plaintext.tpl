{{if title}}{{:title}}

{{/if}}{{if description}}{{:description}}

{{/if}} {{for cells[0]}}{{for}}▁▁{{/for}}{{/for}}{{for cells}}
▕{{for}}{{:letter ? (num ? num : ' ') + '▕' : '██'}}{{/for}}{{/for}} 
 {{for cells[0]}}{{for}}▔▔{{/for}}{{/for}}

Across{{for acrossClues}}
{{:num}}. {{:clue}}{{/for}}

Down{{for downClues}}
{{:num}}. {{:clue}}{{/for}}

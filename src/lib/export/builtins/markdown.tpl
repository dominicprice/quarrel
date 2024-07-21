{{if title}}# {{:title}}
{{/if}}

{{:description}}

{{for cells[0]}}|{{for}}{{:num ? '^'+num+'^' : '&nbsp;'}}&nbsp;{{/for}}{{/for}}
{{for cells[0]}}|{{for}}---{{/for}}{{/for}}
{{for cells start=1}}|{{for}}{{:num ? '^'+num+'^' : '&nbsp;'}}&nbsp;|{{/for}}
{{/for}}

### Across
{{for acrossClues}}{{:num}}. {{:clue}}
{{/for}}
### Down
{{for acrossClues}}{{:num}}. {{:clue}}
{{/for}}
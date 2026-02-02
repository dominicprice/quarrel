{{:size}}
{{url:title}}
{{url:description}}
{{for cells}}{{for}}{{if splitLeft == ' '}}<{{else splitLeft == '-'}}-{{/if}}{{if splitAbove == ' '}}^{{else splitAbove == '-'}}|{{/if}}{{:letter || '.'}}{{/for}}{{/for}}
{{for acrossClues}}{{url:clue}}
{{/for}}{{for downClues}}{{url:clue}}
{{/for}}
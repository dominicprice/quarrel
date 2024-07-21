import jsrender from "jsrender";
import guideTemplate from "./builtins/guide.tpl?raw";
import htmlTemplate from "./builtins/html.tpl?raw";
import jsonTemplate from "./builtins/json.tpl?raw";
import latexTemplate from "./builtins/latex.tpl?raw";
import markdownTemplate from "./builtins/markdown.tpl?raw";
import plaintextTemplate from "./builtins/plaintext.tpl?raw";
import xmlTemplate from "./builtins/xml.tpl?raw";
import { ExportData } from "./data";

const renderer = jsrender();

const builtinTemplates: Record<string, string> = {
    Blank: "",
    JSON: jsonTemplate,
    Guide: guideTemplate,
    LaTeX: latexTemplate,
    XML: xmlTemplate,
    Plaintext: plaintextTemplate,
    MarkDown: markdownTemplate,
    "Standalone HTML": htmlTemplate,
};

function renderTemplate(template: string, data: ExportData): string {
    const tmpl = renderer.templates(template);
    return tmpl.render(data);
}

export default renderTemplate;
export { builtinTemplates };

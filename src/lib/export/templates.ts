import jsrender from "jsrender";
import guideTemplate from "./builtins/guide.tpl?raw";
import jsonTemplate from "./builtins/json.tpl?raw";
import latexTemplate from "./builtins/latex.tpl?raw";
import xmlTemplate from "./builtins/xml.tpl?raw";
import { ExportData } from "./data";

const renderer = jsrender();

const builtinTemplates: Record<string, string> = {
    Blank: "",
    JSON: jsonTemplate,
    Guide: guideTemplate,
    LaTeX: latexTemplate,
    XML: xmlTemplate,
};

function renderTemplate(template: string, data: ExportData): string {
    const tmpl = renderer.templates(template);
    return tmpl.render(data);
}

export default renderTemplate;
export { builtinTemplates };

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

interface Template {
    name: string;
    fileExtension: string;
    template: string;
}

const builtinTemplates: Template[] = [
    {
        name: "Blank",
        fileExtension: ".txt",
        template: "",
    },
    {
        name: "JSON",
        fileExtension: ".json",
        template: jsonTemplate,
    },
    {
        name: "How-to guide",
        fileExtension: ".txt",
        template: guideTemplate,
    },
    {
        name: "LaTeX",
        fileExtension: ".tex",
        template: latexTemplate,
    },
    {
        name: "XML",
        fileExtension: ".xml",
        template: xmlTemplate,
    },
    {
        name: "Plaintext",
        fileExtension: ".txt",
        template: plaintextTemplate,
    },
    {
        name: "Markdown",
        fileExtension: ".md",
        template: markdownTemplate,
    },
    {
        name: "Standalone HTML",
        fileExtension: ".html",
        template: htmlTemplate,
    },
];

function renderTemplate(template: string, data: ExportData): string {
    const tmpl = renderer.templates(template);
    return tmpl.render(data);
}

function templateFromName(name: string): Template | null {
    for (const tmpl of builtinTemplates) {
        if (name === tmpl.name) return tmpl;
    }
    return null;
}

export default renderTemplate;
export { builtinTemplates, templateFromName };

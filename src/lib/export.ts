interface PlaintextExportChars {
    blankCell: string;
    filledCell: string;
    ul: string;
    u: string;
    ur: string;
    l: string;
    r: string;
    bl: string;
    b: string;
    br: string;
}

const asciiChars: PlaintextExportChars = {
    blankCell: "  ",
    filledCell: "##",
    ul: "+",
    u: "--",
    ur: "+",
    l: "|",
    r: "|",
    bl: "+",
    b: "--",
    br: "+",
};

const unicodeChars: PlaintextExportChars = {
    blankCell: "  ",
    filledCell: "██",
    ul: " ",
    u: "▁▁",
    ur: " ",
    l: "▕",
    r: "▏",
    bl: " ",
    b: "▔▔",
    br: " ",
};

export type { PlaintextExportChars };
export { asciiChars, unicodeChars };

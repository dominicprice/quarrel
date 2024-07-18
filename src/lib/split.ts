enum Split {
    None = 0,
    Space = 1,
    Hyphen = 2,
}

function splitToString(split: Split): string {
    switch (split) {
        case Split.None:
            return "";
        case Split.Space:
            return " ";
        case Split.Hyphen:
            return "-";
    }
}

export default Split;

export { splitToString };

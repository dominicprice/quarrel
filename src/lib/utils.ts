function normaliseClue(word: string) {
    return word.replace(/[\ \-\']/g, "").toUpperCase();
}

function intersperse<T, S>(ts: T[], s: S) {
    const res = [];
    let first = true;
    for (const t of ts) {
        if (!first) res.push(s);
        first = false;
        res.push(t);
    }
    return res;
}

export { intersperse, normaliseClue };

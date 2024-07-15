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

function clamp(x: number, min: number, max: number): number {
    if (x < min) return min;
    else if (x > max) return max;
    return x;
}

export { intersperse, normaliseClue, clamp };

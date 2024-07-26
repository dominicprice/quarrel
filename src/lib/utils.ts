function normaliseClue(word: string) {
    return word.replace(/[\ \-\']/g, "").toUpperCase();
}

function clamp(x: number, min: number, max: number): number {
    if (x < min) return min;
    else if (x > max) return max;
    return x;
}

function getDefaultScale(gridSize: number, splitPoint: number): number {
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
    // couldn't work out width, just return 1
    if (vw === 0) return 1;

    // maximum amount of space on the screen we can use
    const maxWidth = (vw < splitPoint ? vw : vw / 2) * 0.9;
    // maximum scale that fits the space
    const maxScale = maxWidth / (40 * gridSize);
    // by default only zoom out
    return Math.min(maxScale, 1);
}

function toPx(px: number, scale?: number): string {
    return Math.ceil(scale ? px * scale : px).toString() + "px";
}
function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
            +c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
        ).toString(16),
    );
}

export { normaliseClue, clamp, getDefaultScale, toPx, uuidv4 };

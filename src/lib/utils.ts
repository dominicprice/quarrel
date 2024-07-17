function normaliseClue(word: string) {
    return word.replace(/[\ \-\']/g, "").toUpperCase();
}

function clamp(x: number, min: number, max: number): number {
    if (x < min) return min;
    else if (x > max) return max;
    return x;
}

function getDefaultScale(gridSize: number): number {
    const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0,
    );
    // couldn't work out width, just return 1
    if (vw === 0) return 1;

    // maximum amount of space on the screen we can use
    const maxWidth = (vw < 1280 ? vw : vw / 2) * 0.9;
    // maximum scale that fits the space
    const maxScale = maxWidth / (40 * gridSize);
    // by default only zoom out
    return Math.min(maxScale, 1);
}

export { normaliseClue, clamp, getDefaultScale };

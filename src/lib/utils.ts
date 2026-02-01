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
	const vh = Math.max(
		document.documentElement.clientHeight || 0,
		window.innerHeight || 0,
	);

	// couldn't work out width or height, just return 1
	if (vw === 0) {
		console.log("failed to calculate width or height");
		return 1;
	}

	console.log("vw=", vw, "vh=", vh);

	const maxWidthProportion = 0.4;
	const maxFillPercentage = 0.9;

	let maxScale;
	if (vw < splitPoint) {
		// flex-col mode
		const maxWidth = vw * maxFillPercentage;
		maxScale = maxWidth / (40 * gridSize);
		console.log("col mode --- maxWidth=", maxWidth, "maxScale=", maxScale);
	} else {
		const maxWidth = vw * maxFillPercentage * maxWidthProportion;
		const maxHeight = vh * maxFillPercentage;
		maxScale = Math.min(
			maxWidth / (40 * gridSize),
			maxHeight / (40 * gridSize),
		);
		console.log(
			"row mode --- maxWidth=",
			maxWidth,
			"maxHeight=",
			maxHeight,
			"maxScale=",
			maxScale,
		);
	}

	// max default zoom is 2
	return Math.min(maxScale, 2);
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

async function compress(s: string): Promise<string> {
	const blob = new Blob([s], { type: "text/plain" });
	const stream = blob.stream();
	const compressor = new CompressionStream("gzip");
	const compressedStream = stream.pipeThrough(compressor);
	const response = new Response(compressedStream);
	const responseBlob = await response.blob();
	const arrayBuffer = await responseBlob.arrayBuffer();
	return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
}

async function decompress(s: string): Promise<string> {
	const byteCharacters = atob(s);
	const byteNumbers = new Array(byteCharacters.length);
	for (let i = 0; i < byteCharacters.length; ++i)
		byteNumbers[i] = byteCharacters.charCodeAt(i);
	const byteArray = new Uint8Array(byteNumbers);
	const blob = new Blob([byteArray]);
	const stream = blob.stream();
	const decompressor = new DecompressionStream("gzip");
	const decompressedStream = stream.pipeThrough(decompressor);
	const response = new Response(decompressedStream);
	return await response.text();
}

export { compress, decompress };

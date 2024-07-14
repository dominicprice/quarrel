function stringToBlob(s: string, filename: string, mime: string = "text/plain") {
    const link = document.createElement("a");
    const file = new Blob([s], { type: mime });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

export { stringToBlob };

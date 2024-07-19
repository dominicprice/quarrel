function stringToBlob(s: string, filename: string, mime = "text/plain") {
    const link = document.createElement("a");
    const file = new Blob([s], { type: mime });
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
}

function downloadAsBlob(data: string, filename: string) {
    const link = document.createElement("a");
    const file = new Blob([data]);
    link.href = URL.createObjectURL(file);
    link.download = filename;
    link.click();
}

export { stringToBlob };

export default downloadAsBlob;

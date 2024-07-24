function getDataUrl(): string | null {
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.has("blobid")) {
        return "https://jsonblob.com/api/jsonBlob/" + queryParams.get("blobid");
    } else if (queryParams.has("url")) {
        return queryParams.get("url");
    }
    return null;
}

export { getDataUrl };

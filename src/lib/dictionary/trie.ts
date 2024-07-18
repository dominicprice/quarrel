type Trie = { [key: string]: Trie };

const remoteTrie: Promise<Trie> = fetch("/dictionary.json.gzip")
    .then((resp) => resp.blob())
    .then((blob) => {
        const ds = new DecompressionStream("gzip");
        const stream = blob.stream().pipeThrough(ds);
        return new Response(stream);
    })
    .then((resp) => resp.json())
    .catch((err) => console.log(err));

export type { Trie };
export default remoteTrie;

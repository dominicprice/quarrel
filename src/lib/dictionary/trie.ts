import { notifyError } from "../error";

type Trie = { [key: string]: Trie };

const remoteTrie: Promise<Trie> = fetch("/assets/dictionary.json.gzip")
    .then((resp) => resp.blob())
    .then((blob) => {
        const ds = new DecompressionStream("gzip");
        const stream = blob.stream().pipeThrough(ds);
        return new Response(stream);
    })
    .then((resp) => resp.json())
    .catch((err) => notifyError(err, "Failed to load dictionary"));

export type { Trie };
export default remoteTrie;

type Trie = { [key: string]: Trie };

let trie: Trie = {};

fetch("/dictionary.json.gzip")
    .then((resp) => resp.blob())
    .then((blob) => {
        const ds = new DecompressionStream("gzip");
        const stream = blob.stream().pipeThrough(ds);
        return new Response(stream);
    })
    .then((resp) => resp.json())
    .then((json) => (trie = json))
    .catch((err) => console.log(err));

function isWord(word: string): boolean {
    const words = word.toUpperCase().split(/\s\-/);
    for (const w of words) {
        if (!isWordInner(w, trie)) return false;
    }
    return true;
}

function isWordInner(word: string, trie: Trie): boolean {
    for (const c of word) {
        trie = trie[c];
        if (trie === undefined) return false;
    }
    return trie[""] !== undefined;
}

function completeWord(word: string, limit: number): string[] {
    return completeWordInner(word.toUpperCase(), trie, limit);
}

function completeWordInner(word: string, trie: Trie, limit: number): string[] {
    if (limit == 0) return [];

    if (word.length === 0) {
        const endOfWord = trie[""] !== undefined;
        return endOfWord ? [""] : [];
    }

    const completions: string[] = [];
    const letter = word[0];
    const rest = word.substring(1);
    if (letter === "?") {
        for (const [subLetter, subTrie] of Object.entries(trie)) {
            const subCompletions = completeWordInner(rest, subTrie, limit);
            for (const completion of subCompletions)
                completions.push(subLetter + completion);
            limit -= subCompletions.length;
            if (limit <= 0) break;
        }
    } else {
        const subTrie = trie[letter];
        if (subTrie !== undefined) {
            const subCompletions = completeWordInner(rest, subTrie, limit);
            for (const completion of subCompletions)
                completions.push(letter + completion);
            limit -= subCompletions.length;
        }
    }
    return completions;
}

export default completeWord;
export { completeWordInner, isWord, isWordInner };

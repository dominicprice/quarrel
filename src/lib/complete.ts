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

function completeWord(word: string): string[] {
    return completeWordInner(word.toUpperCase(), trie);
}

function completeWordInner(word: string, trie: Trie): string[] {
    if (word.length === 0) {
        const endOfWord = trie[""] !== undefined;
        return endOfWord ? [""] : [];
    }

    const completions: string[] = [];
    const letter = word[0];
    const rest = word.substring(1);
    if (letter === "?") {
        for (const [subLetter, subTrie] of Object.entries(trie)) {
            const subCompletions = completeWordInner(rest, subTrie);
            for (const completion of subCompletions)
                completions.push(subLetter + completion);
        }
    } else {
        const subTrie = trie[letter];
        if (subTrie !== undefined) {
            const subCompletions = completeWordInner(rest, subTrie);
            for (const completion of subCompletions)
                completions.push(letter + completion);
        }
    }
    return completions;
}

export default completeWord;
export { completeWordInner };

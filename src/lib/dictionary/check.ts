import remoteTrie, { Trie } from "./trie";

async function checkWord(word: string): Promise<boolean> {
    const trie = await remoteTrie;
    return checkWordInner(word.toUpperCase(), trie);
}

function checkWordInner(word: string, trie: Trie): boolean {
    for (const c of word) {
        trie = trie[c];
        if (trie === undefined) return false;
    }
    return trie[""] !== undefined;
}

export { checkWord, checkWordInner };

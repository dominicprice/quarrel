import remoteTrie, { Trie } from "./trie";

async function checkWord(word: string): Promise<boolean> {
    const trie = await remoteTrie;
    const words = word.toUpperCase().split(/[\s\-]/);
    for (const w of words) {
        if (!checkWordInner(w, trie)) return false;
    }
    return true;
}

function checkWordInner(word: string, trie: Trie): boolean {
    for (const c of word) {
        trie = trie[c];
        if (trie === undefined) return false;
    }
    return trie[""] !== undefined;
}

export { checkWord, checkWordInner };

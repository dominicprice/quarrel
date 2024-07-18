import remoteTrie, { Trie } from "./trie";

async function completeWord(word: string, limit: number): Promise<string[]> {
    const trie = await remoteTrie;
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

export { completeWord, completeWordInner };

import remoteTrie, { Trie } from "./trie";

async function completeWord(
    word: string,
    limit: number,
): Promise<[string[], boolean]> {
    const trie = await remoteTrie;

    // request one more completion that the limit we are given. if we receive that
    // many then there are more possible completions than those we have already
    // generated
    const completions = completeWordInner(word.toUpperCase(), trie, limit + 1);
    const more = completions.length > limit;
    completions.pop();
    return [completions, more];
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

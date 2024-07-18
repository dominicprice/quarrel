import remoteTrie, { Trie } from "./trie";

async function anagramWord(word: string): Promise<string[]> {
    const trie = await remoteTrie;
    const letters = word
        .toUpperCase()
        .split(/[\s\-]/)
        .join("");

    const letterCounts: Record<string, number> = {};
    for (const letter of letters) {
        if (letterCounts[letter] === undefined) letterCounts[letter] = 1;
        else ++letterCounts[letter];
    }
    return anagramWordInner(letterCounts, [], trie, letters.length);
}

function anagramWordInner(
    letterCounts: Record<string, number>,
    path: string[],
    trie: Trie,
    wordLength: number,
): string[] {
    if (trie[""] !== undefined && path.length === wordLength)
        return [path.join("")];

    const words = [];
    for (const [letter, subTrie] of Object.entries(trie)) {
        const count = letterCounts[letter] ?? 0;
        if (count === 0) continue;
        --letterCounts[letter];
        path.push(letter);
        const subWords = anagramWordInner(
            letterCounts,
            path,
            subTrie,
            wordLength,
        );
        for (const word of subWords) words.push(word);
        path.pop();
        letterCounts[letter] = count;
    }
    return words;
}

export default anagramWord;

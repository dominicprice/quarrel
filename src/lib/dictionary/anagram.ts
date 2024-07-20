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
    const res = anagramWordInner(letterCounts, [], trie, letters.length);
    return res;
}

function anagramWordInner(
    letterCounts: Record<string, number>,
    path: string[],
    trie: Trie,
    wordLength: number,
): string[] {
    if (trie[""] !== undefined && path.length === wordLength) {
        return [path.join("")];
    }

    const words = [];
    for (const [letter, subTrie] of Object.entries(trie)) {
        let subWords = [];
        if (letter === "-" || letter === " ") {
            path.push(letter);
            ++wordLength;
            subWords = anagramWordInner(
                letterCounts,
                path,
                subTrie,
                wordLength,
            );
            path.pop();
            --wordLength;
        } else {
            const count = letterCounts[letter] ?? 0;
            if (count === 0) continue;
            --letterCounts[letter];
            path.push(letter);
            subWords = anagramWordInner(
                letterCounts,
                path,
                subTrie,
                wordLength,
            );
            path.pop();
            letterCounts[letter] = count;
        }
        for (const word of subWords) words.push(word);
    }
    return words;
}

export default anagramWord;

import { expect, test } from "vitest";
import { completeWordInner } from "./complete";

test("complete word", () => {
    const trie = {
        C: {
            A: {
                B: { "": {} },
                R: { "": {} },
            },
            O: {
                P: { "": {} },
            },
        },
        D: {
            A: {
                D: { "": {} },
                R: {
                    E: { "": {} },
                },
                Y: { "": {} },
            },
        },
    };

    expect(completeWordInner("?a?", trie)).toEqual([
        "cab",
        "car",
        "dad",
        "day",
    ]);
});

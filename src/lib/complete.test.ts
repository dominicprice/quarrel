import { expect, test } from "vitest";
import { completeWordInner } from "./complete";

test("complete word", () => {
    const trie = {
        c: {
            a: {
                b: { "": {} },
                r: { "": {} },
            },
            o: {
                p: { "": {} },
            },
        },
        d: {
            a: {
                d: { "": {} },
                r: {
                    e: { "": {} },
                },
                y: { "": {} },
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

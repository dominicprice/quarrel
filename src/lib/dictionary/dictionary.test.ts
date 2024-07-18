import { expect, test } from "vitest";
import { checkWordInner } from "./check";
import { completeWordInner } from "./complete";

const testTrie = {
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

test("complete word", () => {
    expect(completeWordInner("?A?", testTrie, 10)).toEqual([
        "CAB",
        "CAR",
        "DAD",
        "DAY",
    ]);
});

test("is word", () => {
    expect(checkWordInner("CAB", testTrie)).toBeTruthy();
    expect(checkWordInner("DARE", testTrie)).toBeTruthy();
    expect(checkWordInner("CA", testTrie)).toBeFalsy();
    expect(checkWordInner("ASDF", testTrie)).toBeFalsy();
});

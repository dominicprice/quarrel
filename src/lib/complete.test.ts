import { expect, test } from "vitest";
import { completeWordInner, isWordInner } from "./complete";

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
    expect(isWordInner("CAB", testTrie)).toBeTruthy();
    expect(isWordInner("DARE", testTrie)).toBeTruthy();
    expect(isWordInner("CA", testTrie)).toBeFalsy();
    expect(isWordInner("ASDF", testTrie)).toBeFalsy();
});

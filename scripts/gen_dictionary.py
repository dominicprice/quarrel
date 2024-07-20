#! /usr/bin/env python3

import argparse
import gzip
import json
import re
from urllib.parse import urlparse
from urllib.request import urlopen


class FileReader:
    def __init__(self, path: str):
        self.path = path

    def __enter__(self):
        if urlparse(self.path).scheme.startswith("http"):
            self.f = urlopen(self.path)
        else:
            self.f = open(self.path, "rb")

        return self

    def __iter__(self):
        for line in self.f:
            yield line.decode().strip().upper()

    def __exit__(self, *_):
        self.f.close()


def add_word(word: str, trie: dict):
    for letter in word:
        if letter not in trie:
            trie[letter] = {}
        trie = trie[letter]
    trie[""] = {}


allowed_chars = re.compile(r"^[a-zA-Z _\-\']+$")


def normalise_word(word: str) -> str | None:
    if word.endswith("(p)"):
        word = word[:-3]
    if not allowed_chars.match(word):
        return None
    return word.replace("_", " ").replace("'", "")


def main(url: str, path: str, indent: int | None):
    trie = {}

    with FileReader(url) as f:
        for word in f:
            if w := normalise_word(word):
                add_word(w, trie)

    with gzip.open(path, "wt") as f:
        json.dump(trie, f, indent=indent)


common_dictionaries = {
    "fsd_en": "https://www.freescrabbledictionary.com/english-word-list/download/english.txt",
    "deostroll": "https://gist.github.com/deostroll/7693b6f3d48b44a89ee5f57bf750bd32/raw/426f564cf73b4c87d2b2c46ccded8a5b98658ce1/dictionary.txt",
}

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate completions dictionary")
    parser.add_argument(
        "--url",
        default="fsd_en",
        help="URL or path of word list (one word per line)",
    )
    parser.add_argument(
        "--indent",
        default=None,
        type=int,
        help="Number of spaces to indent JSON output",
    )
    parser.add_argument(
        "path",
        nargs="?",
        default="public/dictionary.json.gzip",
        help="Output file path",
    )
    args = parser.parse_args()

    if args.url in common_dictionaries:
        args.url = common_dictionaries[args.url]

    main(args.url, args.path, args.indent)

# /usr/bin/env python3
import argparse
import json
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


def main(url: str, path: str, indent: int | None):
    trie = {}

    with FileReader(url) as f:
        for word in f:
            add_word(word, trie)

    with open(path, "w") as f:
        json.dump(trie, f, indent=indent)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate completions dictionary")
    parser.add_argument(
        "--url",
        default="https://github.com/dwyl/english-words/raw/master/words_alpha.txt",
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
        default="public/dictionary.json",
        help="Output file path",
    )
    args = parser.parse_args()

    main(args.url, args.path, args.indent)

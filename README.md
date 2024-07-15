# Quarrel

A web tool for creating crosswords.

I developed this mainly to help with creating cryptic crosswords. The main
features I was looking to implement were:

1. Ensuring that the grid symmetry was maintained
2. A helper to find words matching the checking letters of other clues
3. Ability to export into a variety of formats

I am(/should be) hosting this at
[quarrel.conkers29.co.uk](https://quarrel.conkers29.co.uk) where you play around
with this.

## Developing

Install all the npm dependencies with

```sh
npm install
```

The dev server is run with

```sh
npm run dev
```

## Building

The app is built into a `build` directory with

```sh
npm run build
```

You can then dockerise the app with

```sh
docker build .
```

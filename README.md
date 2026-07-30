# Micro-Motive Games

*Discover the small, specific things that make you come alive.*

Micro-Motive Games is a local-first workspace inspired by Todd Rose and
Ogi Ogas's *[Dark Horse](https://www.toddrose.com/darkhorse)*.

Use it to:

- discover micro-motives through guided, one-question-at-a-time conversations;
- save a motive only when you confirm it with `YES`;
- break broad motives into more specific ones;
- export your collection to Obsidian or another AI system.

The model makes predictions. You decide what is true.

## Run it locally

You need [Node.js 20+](https://nodejs.org/) and a ChatGPT account with access to
Codex.

```bash
git clone https://github.com/siroccomask/micro-motive-games.git
cd micro-motive-games
npm install
npm run codex:login
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

No OpenAI API key is required. The app sends discovery prompts through your
ChatGPT-authenticated Codex session and saves confirmed motives on your
computer in `data/micro-motives.json`.

## Included games

- [`game-of-aliveness`](game-of-aliveness/) starts with something you loved.
- [`game-of-judgment`](game-of-judgment/) starts with a strong reaction to
  someone else.
- [`micro-motive-sim`](micro-motive-sim/) uses confirmed motives to explore
  choices and strategies without prescribing a destination.

You can use these Codex skills directly. **Motive** is the local app included in
this repository for discovering, organizing, refining, and exporting the
results.

## Your data

Raw discovery chats are sent through Codex but are not saved by this app. Only
confirmed micro-motives and their short evidence summaries are written to the
local data file. Use **Export** in the left navigation to download an
Obsidian-ready Markdown note or structured JSON.

This independent project is inspired by *Dark Horse*. It is not affiliated
with or endorsed by the book's authors.

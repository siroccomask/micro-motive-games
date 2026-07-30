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

## Discovery methods

The **Discover** page lets you deliberately begin with:

- [Game of Aliveness](game-of-aliveness/) — follow a real moment you loved
  toward its exact rewarding feature;
- [Game of Judgment](game-of-judgment/) — trace a strong reaction to someone
  through the behavior, feeling, and precise trigger; or
- an adaptive start that chooses between those methods from your first story.

Each method runs as its own typed BAML process through your Codex subscription.
The included [micro-motive simulation](micro-motive-sim/) remains a standalone
Codex skill for exploring possibilities after you have confirmed motives.

Game of Aliveness is this project's name for a positive-memory companion to
the book's advice to examine what you love. Game of Judgment comes directly
from *Dark Horse*.

## Your data

Raw discovery chats are sent through Codex but are not saved by this app. Only
confirmed micro-motives and their short evidence summaries are written to the
local data file. Use **Export** in the left navigation to download an
Obsidian-ready Markdown note or structured JSON.

This independent project is inspired by *Dark Horse*. It is not affiliated
with or endorsed by the book's authors.

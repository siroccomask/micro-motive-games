# Game of Judgment

A standalone Codex skill for uncovering one highly specific micro-motive from a vivid, reflexive judgment of another person.

The skill guides an adaptive interview based on the Game of Judgment from Todd Rose and Ogi Ogas's *Dark Horse*. It follows the user's positive or negative reaction, traces the precise desire or aversion beneath it, confirms the wording, and saves one durable Markdown record.

## What to expect

This is a patient, adaptive interview—not a quiz with a fixed number of steps. The AI asks exactly one question at a time and follows your answers. One play may take **20–50 questions or more**.

Do not stop at a motive that seems merely plausible, close, or mostly right. Keep playing until the candidate feels like a capital **YES**: unmistakably accurate, specific, and complete. Anything less means the game continues.

One play discovers one micro-motive. You can play again later to build a collection.

## Install in Codex

### Copy and paste this command

This installs or updates the skill in your user-scoped Codex skills directory:

```bash
mkdir -p "$HOME/.agents/skills/game-of-judgment/agents" && \
curl -fsSL "https://raw.githubusercontent.com/siroccomask/game-of-judgment/main/game-of-judgment/SKILL.md" \
  -o "$HOME/.agents/skills/game-of-judgment/SKILL.md" && \
curl -fsSL "https://raw.githubusercontent.com/siroccomask/game-of-judgment/main/game-of-judgment/agents/openai.yaml" \
  -o "$HOME/.agents/skills/game-of-judgment/agents/openai.yaml"
```

Codex should detect the skill automatically. If it does not appear, restart Codex. Then start a new task with:

```text
Use $game-of-judgment to help me trace a judgment to one micro-motive. Continue until I call it a capital YES.
```

### Ask Codex to install it

You can also send this prompt to Codex:

```text
Use $skill-installer to install the game-of-judgment skill from https://github.com/siroccomask/game-of-judgment/tree/main/game-of-judgment
```

## Play in another AI chat without installing

1. Open [`game-of-judgment/SKILL.md`](https://github.com/siroccomask/game-of-judgment/blob/main/game-of-judgment/SKILL.md).
2. Copy the entire file and paste it into a new conversation with your AI.
3. Add this prompt after the pasted instructions:

```text
Follow the facilitator instructions above exactly and play one Game of Judgment with me. Ask one question per message and wait for my answer. Continue for as many questions as needed—20 to 50 or more is normal—and do not stop until I say the micro-motive is a capital YES.
```

## Repository contents

- `game-of-judgment/` — the Codex skill folder

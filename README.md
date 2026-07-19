# Micro-Motive Games

*Discover your individuality without being sorted into a type.*

A free collection of Codex skills for uncovering the highly specific things you genuinely love and hate, then using that self-knowledge to create flexible, fulfilling possibilities.

The collection is inspired by Todd Rose and Ogi Ogas's *[Dark Horse](https://www.toddrose.com/darkhorse)*. It does not produce a personality score, assign an archetype, or prescribe one career. Each confirmed micro-motive becomes a portable piece of self-knowledge that can fit many different activities and lives.

## Skills

| Skill | Starts from | Purpose |
| --- | --- | --- |
| [`game-of-judgment`](game-of-judgment/) | A vivid positive or negative judgment of another person | Reverse-engineer the hidden desire or aversion behind the reaction using the Game of Judgment described in *Dark Horse*. |
| [`game-of-aliveness`](game-of-aliveness/) | A real memory or activity you loved | Trace the precise mechanism that made part of the experience feel fulfilling, absorbing, free, delightful, or alive. |
| [`micro-motive-sim`](micro-motive-sim/) | Confirmed motives and lived evidence | Compare or create next opportunities, evaluate tolerable downside, test individuality-fit strategies, and remain adaptive without choosing a permanent destination. |

`Game of Aliveness` is this project's name for a positive-memory companion to the authors' advice to examine what you already love and repeatedly ask why. It is not a term coined by Rose or Ogas.

## Shared contract

- One discovery play may take 20–50 questions or more, asked one at a time.
- The game continues until you call the exact micro-motive a capital `YES`.
- Anything less than `YES` means the investigation continues.
- Real judgments, memories, and activities supply the evidence. Random hypothetical lifestyles do not.
- Strange, selfish, contradictory, trivial, impractical, positive, and negative motives are all valid.
- One play confirms one micro-motive. Repeated plays build a collection.
- You are the referee. The AI may propose wording, but it cannot decide who you are.

## Recommended: create a dedicated Codex project

This keeps all three project-scoped skills beside one durable `Micro-motives/` collection.

### Copy and paste

```bash
PROJECT_DIR="$HOME/Micro-Motive-Games"
RAW_REPO="https://raw.githubusercontent.com/siroccomask/micro-motive-games/refs/heads/main"

mkdir -p "$PROJECT_DIR/Micro-motives"
for SKILL in game-of-judgment game-of-aliveness micro-motive-sim; do
  mkdir -p "$PROJECT_DIR/.agents/skills/$SKILL/agents"
  curl -fsSL "$RAW_REPO/$SKILL/SKILL.md" \
    -o "$PROJECT_DIR/.agents/skills/$SKILL/SKILL.md"
  curl -fsSL "$RAW_REPO/$SKILL/agents/openai.yaml" \
    -o "$PROJECT_DIR/.agents/skills/$SKILL/agents/openai.yaml"
done
```

Open `~/Micro-Motive-Games` as your working folder in Codex. If the skills do not appear immediately, restart Codex. Rerun the command to update them.

## Start playing

Begin with a positive experience:

```text
Use $game-of-aliveness to trace a real experience I loved to one micro-motive. Ask one question at a time and continue until I call the wording a capital YES.
```

Begin with a judgment:

```text
Use $game-of-judgment to trace a vivid judgment to one micro-motive. Ask one question at a time and continue until I call the wording a capital YES.
```

After collecting motives, explore possibilities:

```text
Use $micro-motive-sim to load my confirmed micro-motives and help me create a diverse portfolio of next opportunities. Keep motive fit separate from ability, risk, money, and other constraints.
```

## Alternative: install user-wide

To make every skill available in every Codex project:

```bash
SKILLS_DIR="$HOME/.agents/skills"
RAW_REPO="https://raw.githubusercontent.com/siroccomask/micro-motive-games/refs/heads/main"

for SKILL in game-of-judgment game-of-aliveness micro-motive-sim; do
  mkdir -p "$SKILLS_DIR/$SKILL/agents"
  curl -fsSL "$RAW_REPO/$SKILL/SKILL.md" \
    -o "$SKILLS_DIR/$SKILL/SKILL.md"
  curl -fsSL "$RAW_REPO/$SKILL/agents/openai.yaml" \
    -o "$SKILLS_DIR/$SKILL/agents/openai.yaml"
done
```

Records are saved relative to the current working folder. Reopen the same folder for each play when you want one continuous collection.

## Ask Codex to install a skill

You can also send Codex a prompt such as:

```text
Install the game-of-aliveness skill from https://github.com/siroccomask/micro-motive-games/tree/main/game-of-aliveness and tell me when it is ready to play.
```

## What gets saved

After a capital `YES`, the discovery skills create one Markdown record under `Micro-motives/`. The record preserves:

- the exact confirmed micro-motive;
- the real experience or judgment that revealed it;
- the important feelings and boundary conditions;
- the reasoning that separates the motive from nearby explanations.

The result is a growing, inspectable record of individuality—not a standardized profile generated in one sitting.

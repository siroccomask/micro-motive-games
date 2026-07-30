# Motive agent guide

## Setup

1. Run `npm install`.
2. Run `npm run doctor`.
3. If ChatGPT authentication is missing, run `npm run codex:login` and pause
   while the user completes the browser sign-in.
4. Run `npm run dev`. The app must use `http://127.0.0.1:3000` because BAML’s
   local Codex client targets that origin.

Do not request or add an OpenAI API key. The app intentionally uses the user’s
ChatGPT-authenticated Codex CLI session.

## Product contracts

- The model makes predictions about possible micro-motives; the user remains
  the authority.
- A candidate is not confirmed until the user explicitly says `YES` or clicks
  the equivalent confirmation action.
- Discovery asks one question at a time.
- Challenge vague or standardized motives, but let the user reject any
  interpretation.
- Save the accepted wording exactly. Finalization may structure the title,
  evidence summary, why-it-matters explanation, and boundary conditions, but
  it must not rewrite the statement the user confirmed.
- Raw discovery chat passes through the user's Codex session but is not
  persisted by this app. Persist only confirmed `MicroMotive` records.
- Breaking down a motive must use the typed BAML operation, collect evidence
  for each accepted constituent, and let the user decide whether to keep the
  broader motive or move it to the archive.
- Archive is recoverable. Do not permanently delete a motive from the UI.
- Keep the product focused on discovering, refining, managing, and exporting
  micro-motives.

## Persistence

- `libs/motives/types.ts` defines the canonical record.
- `data/micro-motives.json` is the local `MicroMotive[]` store.
- The data file and `.bak` are personal and gitignored.
- All writes go through `libs/motives/store.ts`; keep its serialized, atomic
  write and backup behavior.
- Do not put LLM-controlled filesystem writes in the persistence path.

## BAML

- Treat `baml_src/` as the source of truth for prompts and output types.
- After changing BAML, run `npm run baml:generate`.
- Keep generated `baml_client/` in sync and committed so a fresh clone runs
  after `npm install`.
- `npm run baml:test` performs live evals through the user’s Codex subscription
  and consumes that account’s Codex allowance.

## Verification

Run:

```bash
npm run typecheck
npm run build
git diff --check
```

Run `npm run baml:test` when prompt behavior or BAML types change.

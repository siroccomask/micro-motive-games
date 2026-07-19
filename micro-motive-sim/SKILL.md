---
name: micro-motive-sim
description: Discover individuality through an evidence-led life simulation based on Todd Rose and Ogi Ogas's Dark Horse method. Use when the user wants to uncover highly specific micro-motives from real judgments, remembered fulfillment, or activities they already love; confirm each motive with a capital YES; compare or create opportunities by motive overlap and tolerable worst case; find individuality-fit strategies; or build a flexible portfolio of fulfilling possibilities without personality types or career prescriptions.
---

# Micro-Motive SIM

Guide the player through the four elements of the Dark Horse mindset in order: know micro-motives, know choices, know strategies, and ignore the destination. Begin with lived evidence. Use simulation only after there is something specific to test or apply.

## Preserve the anti-test contract

- Never assign a personality type, archetype, standardized motive category, tier, universal score, or destiny.
- Never map one motive to one career. Generate possibilities across work, projects, play, relationships, learning, community, place, lifestyle, and service.
- Model opportunities and constraints; do not claim to have completed a model of the person.
- Preserve contradictory motives and context dependence. Do not force the player into a coherent brand.
- Separate desire from ability, money, time, obligations, geography, health, and risk.
- Use the player's language. The AI proposes; only the player confirms.
- Treat identity as an evolving collection of evidence, not a permanent essence.

## Enforce the evidence gate

Never begin discovery with invented opportunity cards or random hypothetical lifestyles. A generic scenario can measure the prompt writer's imagination more than the player's individuality.

Before generating a hypothetical discovery choice, require both:

1. a concrete event from the player's actual life or a real judgment they experienced; and
2. a live micro-motive hypothesis or unresolved distinction derived from that event.

Use this guard:

```text
if (!realEvidence) askForOneConcreteMemoryActivityOrJudgment()
else if (!liveHypothesis) deepenTheRealEvidence()
else generateOneControlledCounterfactual(realEvidence, liveHypothesis)
```

Every hypothetical must have an internal provenance record:

```text
source evidence -> candidate feature -> one variable changed -> predicted distinction
```

Do not show the prediction before the player responds. If the player says the options feel random, treat that as a method failure, not evidence about their motives. Return to real experience.

## Load durable context

At the start of every session:

1. Look in the current workspace for `Micro-motives/`. Create it only when persistent play is authorized and it does not exist.
2. Read existing Markdown records. Extract exact statements under `## Micro-motive`; do not infer motives from filenames.
3. Read the latest in-progress file under `Micro-motives/Explorations/` only when the player asks to resume.
4. Briefly state how many confirmed motives were loaded.
5. Inspect the current conversation for real judgments, beloved activities, and vivid memories the player already supplied. Use this evidence before asking for something new.

Use confirmed motives to widen future possibilities, not to make all new evidence resemble the past.

## Route by Dark Horse element

Infer the active element from the player's request:

- **Know micro-motives:** Default when the player wants self-knowledge, discovery, identity, or to understand what they love and hate.
- **Know choices:** Use when at least one motive is confirmed and the player wants to compare, create, or simulate opportunities.
- **Know strategies:** Use when the player has selected an immediate goal but needs an individuality-fit way to pursue it.
- **Ignore the destination:** Apply throughout. Prefer the next meaningful choice over a fixed career or final life plan.

Do not collapse these elements. Choice simulation cannot replace motive discovery, and ability cannot replace identity.

## Open a discovery arc

Give a compact orientation:

- This is not a personality test; there are no correct or admirable answers.
- One motive may take 20–50 questions or more, one at a time.
- Nothing is confirmed until the player calls the exact wording a capital `YES`.
- Strong attraction, aversion, contradiction, envy, delight, boredom, and `none` are valid evidence.
- Report what is actually felt, not what sounds sensible, impressive, kind, or useful.

Then begin from one real source. Prefer, in order:

1. a vivid judgment or beloved experience already present in the conversation;
2. a recent moment when the player strongly judged, admired, envied, or condemned someone;
3. a concrete activity the player knows they love, followed by repeated `why` questions;
4. a specific memory of feeling unusually fulfilled, absorbed, delighted, free, or alive;
5. a recurring activity the player voluntarily returns to without external pressure.

Ask for one concrete event rather than a list of abstract values. Do not present invented scenarios at this stage.

## Discover one micro-motive from lived evidence

End every turn with exactly one focused question, then wait. Follow the evidence rather than a preset questionnaire.

### Reconstruct the event

Establish what happened, what the player did or witnessed, and the precise instant that carried the strongest emotional charge. If the player begins with a broad activity such as basketball, writing, travel, leadership, or creativity, ask about one actual occasion.

### Identify the live wire

Ask what they felt and which detail produced it. For a judgment, investigate what the player would specifically love or hate if they had the other person's life. For a beloved activity or fulfilling memory, distinguish the activity from the mechanism inside it.

Do not stop at freedom, creativity, impact, people, nature, status, stability, competition, or challenge. Determine what kind, in what moment, under what conditions, and with what rewarding or aversive consequence.

### Ask why and compare

Keep asking why that exact detail mattered. Search the player's real history for another episode with the same suspected feature in a different surface activity. Use their comparison to test portability.

Distinguish neighboring mechanisms such as:

- process versus result;
- private satisfaction versus another person's reaction;
- novelty versus surprise within a stable structure;
- autonomy versus escaping supervision;
- helping versus supplying a missing insight that causes action;
- breaking a rule versus making the rupture shared, harmless, and undeniable.

Do not supply a menu of interpretations before the player has described their reaction.

### Use controlled counterfactuals only when needed

After a real source and hypothesis exist, change one feature of that source while holding the rest stable. Prefer a question first. Use two or three short hypothetical variants only when comparing them would be clearer than prose.

The variants must test a named distinction; they must not be shots in the dark. If none attracts the player, ask what the variants removed or distorted about the real experience.

## Form and confirm one micro-motive

When evidence converges, offer one candidate statement phrased as a highly specific desire, preference, or aversion. Describe the rewarding or aversive mechanism rather than a career, skill, virtue, value category, or identity label.

Include boundary conditions when they distinguish it from a nearby motive. Ask exactly:

> Is this a capital YES—unmistakably accurate, specific, and complete?

If the player hesitates, says close or mostly, changes a word, adds a qualifier, or gives anything other than a clear capital `YES`, continue with one real-example question or controlled counterfactual. Impose no question limit.

## Know choices through motive-grounded simulation

Enter this element only after loading at least one confirmed micro-motive. The purpose is now application and further evidence, not cold-start identity inference.

Generate opportunities whose recurring lived activities can be traced to exact confirmed motives. Include conventional and surprising domains, but never an option without explicit internal provenance. When several motives exist, seek combinations that activate more of the collection so fulfillment is not dependent on one fragile activity.

Run each choice in two passes:

### 1. Fulfillment pass

Describe what the player would repeatedly do and experience. Show which confirmed motives the opportunity may exercise, which it neglects, and where fit remains uncertain. Ask what genuinely attracts or repels the player.

### 2. Worst-case pass

Reveal money, time, energy, obligations, risk, reversibility, learning curve, social cost, and plausible failure. Ask whether the player can live with the worst credible outcome. If not, create the next-most-fulfilling viable choice rather than demanding a reckless leap.

Keep these two decisions separate:

- motive alignment estimates fulfillment potential;
- worst-case tolerance establishes practical viability;
- rejecting the risk does not refute the motive.

Simulate a concrete day, week, success, setback, or changed condition only after the player selects an opportunity. Use the result to refine motive boundaries or create the next real-world experiment.

## Know strategies through fit

After the player chooses an immediate goal, generate multiple ways to pursue it. Treat a strategy as contextual, not universally best. Compare strategies by how they fit the player's motives, patterns of attention, preferred feedback, social configuration, and constraints.

If the player cares about the goal but repeatedly stalls, change the strategy before concluding they lack ability or commitment. Prefer small trials that expose fit quickly.

## Ignore the destination

Do not ask what the player wants to be for the rest of their life. Ask what immediate opportunity best aligns with who they understand themselves to be now and has a survivable downside.

Treat every choice as a source of further self-knowledge. Keep the opportunity horizon open: the same motive mosaic may support many unrelated lives, and the collection may change.

## Maintain evidence without scoring the person

Track hypotheses qualitatively:

```text
exploring -> sharpening -> candidate -> confirmed
```

Maintain concise notes containing:

- the real source event;
- exact attractions and aversions;
- supporting and contradicting real examples;
- controlled counterfactual results;
- boundary conditions and unresolved distinctions;
- pulse, fulfillment, and worst-case choices when simulation begins.

Do not assign numerical confidence or a total fulfillment score. Persist a paraphrased note under `Micro-motives/Explorations/YYYY-MM-DD-<session-slug>.md` after meaningful evidence. Mark it `In progress` until a motive is confirmed or the player pauses.

## Save confirmed individuality

Only after capital-`YES` confirmation:

1. Create one non-overwriting `Micro-motives/YYYY-MM-DD-<short-motive-slug>.md` file.
2. Preserve the exact confirmed statement.
3. Mark the exploration `Confirmed` and link it to the record.
4. Create or update `Micro-motives/INDEX.md` with linked exact statements while preserving user edits.

Use this structure:

```markdown
# <Concise name>

Date: <YYYY-MM-DD>
Status: Confirmed by capital YES

## Micro-motive

<Exact user-confirmed statement.>

## Lived evidence

<The real judgments, beloved activities, or fulfilling memories that revealed it.>

## Boundary conditions

<What must be present, what can vary, and what similar experience does not satisfy it.>

## Opportunity ingredients

<Portable features that can appear in many domains; do not prescribe careers.>
```

After saving, state the updated number of confirmed motives and ask one question: discover another, explore choices, or test a strategy.

## Build an opportunity portfolio

When the player asks for next opportunities, generate a portfolio rather than a recommendation. Prefer at least three confirmed motives when available.

For every opportunity include:

- the recurring lived experience;
- exact confirmed motives it may exercise;
- capabilities and constraints kept separate from motive fit;
- the worst credible outcome and whether it appears survivable;
- features that could make the opportunity hollow;
- one cheap, reversible experiment that produces real evidence.

Optimize for diversity of domain and overlap of motive mechanisms, not prestige, résumé continuity, or a single destination. Let the player choose what to test next.

## Pause cleanly

When the player asks to stop, update the exploration with the next real distinction to investigate. Never convert an unfinished hypothesis into a confirmed identity statement.

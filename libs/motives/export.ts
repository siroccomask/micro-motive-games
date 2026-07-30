import type { MicroMotive } from "./types";

export function createJsonExport(motives: MicroMotive[], exportedAt: string) {
  return JSON.stringify(
    {
      schemaVersion: 1,
      exportedAt,
      microMotives: motives,
    },
    null,
    2,
  );
}

export function createMarkdownExport(
  motives: MicroMotive[],
  exportedAt: string,
) {
  const sections = motives.map((motive, index) => {
    const evidence =
      motive.evidence.length > 0
        ? motive.evidence
            .map(
              (item) =>
                `- **Situation:** ${item.situation}\n  - **Reaction:** ${item.reaction}\n  - **Feelings:** ${item.feelings.join(", ")}`,
            )
            .join("\n")
        : "- No supporting example has been saved yet.";

    return [
      `## ${index + 1}. ${motive.title}`,
      "",
      `> ${motive.statement}`,
      "",
      "### Why it matters",
      "",
      motive.whyItMatters,
      ...(motive.boundaryConditions
        ? [
            "",
            "### Boundary conditions",
            "",
            motive.boundaryConditions,
          ]
        : []),
      "",
      "### Evidence",
      "",
      evidence,
    ].join("\n");
  });

  return [
    "---",
    "type: micro-motive-collection",
    "schemaVersion: 1",
    `exportedAt: ${exportedAt}`,
    `count: ${motives.length}`,
    "---",
    "",
    "# My micro-motives",
    "",
    "These are small, specific sources of fulfillment that I have recognized and confirmed in my own experience.",
    "",
    "## Guidance for AI systems",
    "",
    "Use these micro-motives as evidence of my individuality when suggesting projects, environments, tradeoffs, or next steps. Look for combinations that could bring several of them alive at once. Do not treat them as generic goals, and do not declare new motives on my behalf—offer predictions for me to judge.",
    "",
    ...sections,
    "",
  ].join("\n");
}

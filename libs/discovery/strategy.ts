export type DiscoveryEntry = "ALIVENESS" | "JUDGMENT" | "ADAPTIVE";
export type DiscoveryMethod = "ALIVENESS" | "JUDGMENT";
export type DiscoveryStage =
  | "RECONSTRUCT_MOMENT"
  | "IDENTIFY_LIVE_WIRE"
  | "CAPTURE_JUDGMENT"
  | "SEPARATE_FEELING"
  | "IDENTIFY_TRIGGER"
  | "TEST_BOUNDARY"
  | "FIND_PORTABILITY"
  | "FORM_CANDIDATE";

type DiscoveryEntryOption = {
  entry: DiscoveryEntry;
  method: DiscoveryMethod | null;
  stage: DiscoveryStage | null;
  eyebrow: string;
  title: string;
  description: string;
  opening: string;
};

export const discoveryEntries: readonly DiscoveryEntryOption[] = [
  {
    entry: "ALIVENESS",
    method: "ALIVENESS",
    stage: "RECONSTRUCT_MOMENT",
    eyebrow: "Game of Aliveness",
    title: "Start with a moment that came alive.",
    description:
      "Follow something you loved, found absorbing, or felt deeply satisfied by until its exact reward becomes portable.",
    opening:
      "Think of one specific occasion when you felt unusually alive, absorbed, or satisfied. What was happening, and which moment stands out most clearly?",
  },
  {
    entry: "JUDGMENT",
    method: "JUDGMENT",
    stage: "CAPTURE_JUDGMENT",
    eyebrow: "Game of Judgment",
    title: "Start with a strong reaction to someone.",
    description:
      "Use admiration, irritation, envy, delight, or disgust as evidence about the precise thing that moves you.",
    opening:
      "Think of a specific person who triggered a strong positive or negative reaction in you. What did they do, and what was your immediate unedited judgment?",
  },
  {
    entry: "ADAPTIVE",
    method: null,
    stage: null,
    eyebrow: "Not sure where to begin?",
    title: "Tell me a moment and help me choose.",
    description:
      "Begin with whatever feels vivid. Motive will choose the more useful discovery method from the evidence.",
    opening:
      "Begin with one real moment: when did you feel unusually alive, or notice a strong reaction to someone? What happened?",
  },
] as const;

export type DiscoverySessionStart = {
  entry: DiscoveryEntry;
  method: DiscoveryMethod | null;
  stage: DiscoveryStage | null;
  opening: string;
};

const methodLabels: Record<DiscoveryMethod, string> = {
  ALIVENESS: "Game of Aliveness",
  JUDGMENT: "Game of Judgment",
};

const stageLabels: Record<DiscoveryStage, string> = {
  RECONSTRUCT_MOMENT: "Reconstructing the moment",
  IDENTIFY_LIVE_WIRE: "Finding the live wire",
  CAPTURE_JUDGMENT: "Capturing the judgment",
  SEPARATE_FEELING: "Separating the feeling",
  IDENTIFY_TRIGGER: "Finding the exact trigger",
  TEST_BOUNDARY: "Testing a useful boundary",
  FIND_PORTABILITY: "Looking for portability",
  FORM_CANDIDATE: "Ready for your judgment",
};

export function isDiscoveryEntry(value: unknown): value is DiscoveryEntry {
  return discoveryEntries.some((option) => option.entry === value);
}

export function isDiscoveryMethod(value: unknown): value is DiscoveryMethod {
  return value === "ALIVENESS" || value === "JUDGMENT";
}

export function isDiscoveryStage(value: unknown): value is DiscoveryStage {
  return typeof value === "string" && value in stageLabels;
}

export function startDiscovery(entry: DiscoveryEntry): DiscoverySessionStart {
  const option = discoveryEntries.find((candidate) => candidate.entry === entry);
  if (!option) throw new Error(`Unknown discovery entry "${entry}".`);

  return {
    entry: option.entry,
    method: option.method,
    stage: option.stage,
    opening: option.opening,
  };
}

export function discoveryMethodLabel(method: DiscoveryMethod | null) {
  return method ? methodLabels[method] : "Choosing a discovery method";
}

export function discoveryStageLabel(stage: DiscoveryStage | null) {
  return stage ? stageLabels[stage] : "Listening for the strongest evidence";
}

import {
  b,
  DiscoveryMethod as BamlDiscoveryMethod,
  DiscoveryStage as BamlDiscoveryStage,
} from "@/baml_client/baml_client";
import type {
  DiscoveryMessage,
  DiscoveryTurn,
} from "@/baml_client/baml_client";
import type {
  DiscoveryEntry,
  DiscoveryMethod,
  DiscoveryStage,
} from "./strategy";

type ContinueDiscoveryInput = {
  entry: DiscoveryEntry;
  method: DiscoveryMethod | null;
  stage: DiscoveryStage | null;
  messages: DiscoveryMessage[];
};

const alivenessStages = new Set<DiscoveryStage>([
  "RECONSTRUCT_MOMENT",
  "IDENTIFY_LIVE_WIRE",
  "TEST_BOUNDARY",
  "FIND_PORTABILITY",
  "FORM_CANDIDATE",
]);

const judgmentStages = new Set<DiscoveryStage>([
  "CAPTURE_JUDGMENT",
  "SEPARATE_FEELING",
  "IDENTIFY_TRIGGER",
  "TEST_BOUNDARY",
  "FORM_CANDIDATE",
]);

function resolvedMethod(input: ContinueDiscoveryInput) {
  if (input.entry === "ALIVENESS") return BamlDiscoveryMethod.ALIVENESS;
  if (input.entry === "JUDGMENT") return BamlDiscoveryMethod.JUDGMENT;
  if (input.method === "ALIVENESS") return BamlDiscoveryMethod.ALIVENESS;
  if (input.method === "JUDGMENT") return BamlDiscoveryMethod.JUDGMENT;
  return null;
}

function compatibleStage(
  method: BamlDiscoveryMethod,
  stage: DiscoveryStage | null,
) {
  if (!stage) return null;
  if (
    method === BamlDiscoveryMethod.ALIVENESS &&
    !alivenessStages.has(stage)
  ) {
    return null;
  }
  if (
    method === BamlDiscoveryMethod.JUDGMENT &&
    !judgmentStages.has(stage)
  ) {
    return null;
  }
  return BamlDiscoveryStage[stage];
}

function assertCompatibleTurn(
  turn: DiscoveryTurn,
  expectedMethod?: BamlDiscoveryMethod,
) {
  if (expectedMethod && turn.method !== expectedMethod) {
    throw new Error(
      `Discovery method changed from ${expectedMethod} to ${turn.method}.`,
    );
  }

  const allowedStages =
    turn.method === BamlDiscoveryMethod.ALIVENESS
      ? alivenessStages
      : judgmentStages;
  if (!allowedStages.has(turn.stage)) {
    throw new Error(
      `Discovery stage ${turn.stage} is invalid for ${turn.method}.`,
    );
  }

  return turn;
}

export async function continueDiscovery(input: ContinueDiscoveryInput) {
  const method = resolvedMethod(input);
  if (!method) {
    const routed = await b.RouteDiscovery(input.messages);
    if (routed.kind !== "QUESTION" || routed.candidate) {
      throw new Error("The adaptive router returned a non-routing turn.");
    }
    return assertCompatibleTurn(routed);
  }

  const continuation = {
    current_stage: compatibleStage(method, input.stage),
    messages: input.messages,
  };

  const turn =
    method === BamlDiscoveryMethod.ALIVENESS
      ? await b.ContinueAlivenessDiscovery(continuation)
      : await b.ContinueJudgmentDiscovery(continuation);
  return assertCompatibleTurn(turn, method);
}

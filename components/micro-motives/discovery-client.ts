import type { Evidence, MicroMotive } from "@/libs/motives/types";
import type {
  DiscoveryEntry,
  DiscoveryMethod,
  DiscoveryStage,
} from "@/libs/discovery/strategy";
import type {
  BreakdownCandidate,
  DiscoveryMessage,
  DiscoverySuggestedAction,
  UserFacingError,
} from "./workspace-types";

type FailureBody = {
  error?: string;
  recovery?: string;
};

class DiscoveryClientError extends Error {
  recovery?: string;

  constructor(failure: FailureBody, fallback: string) {
    super(failure.error || fallback);
    this.recovery = failure.recovery;
  }
}

async function responseBody<T>(response: Response, fallback: string): Promise<T> {
  const data = (await response.json()) as T & FailureBody;
  if (!response.ok) throw new DiscoveryClientError(data, fallback);
  return data;
}

export function userFacingError(
  error: unknown,
  fallback: string,
): UserFacingError {
  if (error instanceof DiscoveryClientError) {
    return { message: error.message, recovery: error.recovery };
  }
  return {
    message: error instanceof Error ? error.message : fallback,
  };
}

export const discoveryClient = {
  async continue(input: {
    entry: DiscoveryEntry;
    method: DiscoveryMethod | null;
    stage: DiscoveryStage | null;
    messages: DiscoveryMessage[];
  }) {
    const response = await fetch("/api/discovery/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entry: input.entry,
        method: input.method,
        stage: input.stage,
        messages: input.messages.map(({ role, content }) => ({ role, content })),
      }),
    });
    return responseBody<{
      turn: {
        kind: "QUESTION" | "CANDIDATE";
        method: DiscoveryMethod;
        stage: DiscoveryStage;
        reply: string;
        candidate?: string | null;
        evidence_summary?: string | null;
        suggested_action?: DiscoverySuggestedAction | null;
      };
    }>(response, "The discovery guide did not respond.");
  },

  async finalize(
    acceptedStatement: string,
    messages: DiscoveryMessage[],
    evidenceSummary?: string | null,
  ) {
    const response = await fetch("/api/discovery/finalize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        acceptedStatement,
        messages: messages.map(({ role, content }) => ({ role, content })),
        evidenceSummary: evidenceSummary ?? null,
      }),
    });
    return responseBody<{
      motive: {
        title: string;
        statement: string;
        why_it_matters: string;
        boundary_conditions?: string | null;
        evidence: Evidence[];
      };
    }>(response, "The confirmed motive could not be structured.");
  },

  async breakdown(motive: MicroMotive) {
    const response = await fetch("/api/discovery/breakdown", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ motive }),
    });
    const data = await responseBody<{
      candidates: Array<{
        title: string;
        statement: string;
        why_it_might_fit: string;
        discovery_question: string;
      }>;
    }>(response, "Codex could not break this motive down.");

    return data.candidates.map(
      (candidate, index): BreakdownCandidate => ({
        id: `${motive.id}-candidate-${index + 1}`,
        title: candidate.title,
        statement: candidate.statement,
        whyItMightFit: candidate.why_it_might_fit,
        discoveryQuestion: candidate.discovery_question,
      }),
    );
  },
};

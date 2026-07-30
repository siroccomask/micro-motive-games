import type { FormEvent, RefObject } from "react";
import type {
  DiscoveryEntry,
  DiscoveryMethod,
  DiscoveryStage,
} from "@/libs/discovery/strategy";
import type { MicroMotive } from "@/libs/motives/types";

export type WorkspaceView = "library" | "discover" | "export" | "archive";

export type DiscoverySuggestedAction = {
  kind: "SAVE_CANDIDATE";
  label: string;
};

export type DiscoveryMessage = {
  id: string;
  role: "guide" | "user";
  content: string;
  candidate?: string;
  suggestedAction?: DiscoverySuggestedAction;
};

export type UserFacingError = {
  message: string;
  recovery?: string;
};

export type BreakdownCandidate = {
  id: string;
  title: string;
  statement: string;
  whyItMightFit: string;
  discoveryQuestion: string;
};

export type DiscoveryViewModel = {
  entry: DiscoveryEntry | null;
  method: DiscoveryMethod | null;
  stage: DiscoveryStage | null;
  messages: DiscoveryMessage[];
  reply: string;
  candidate: string | null;
  error: UserFacingError | null;
  isPending: boolean;
  isFinalizing: boolean;
  isStorageReady: boolean;
};

export type DiscoveryViewActions = {
  chooseEntry: (entry: DiscoveryEntry) => void;
  setReply: (reply: string) => void;
  submit: (event: FormEvent) => void;
  startNew: () => void;
  rejectCandidate: () => void;
  confirmCandidate: (statement: string) => void;
};

export type DiscoveryViewProps = {
  model: DiscoveryViewModel;
  actions: DiscoveryViewActions;
  threadRef: RefObject<HTMLDivElement | null>;
};

export type BreakdownViewModel = {
  active: boolean;
  candidates: BreakdownCandidate[];
  error: UserFacingError | null;
  exploringId: string | null;
  reflection: string;
  savedIds: string[];
  isLoading: boolean;
};

export type MotiveLibraryModel = {
  view: "library" | "archive";
  motives: MicroMotive[];
  selected?: MicroMotive;
  query: string;
  latestLabel: string;
  isStorageReady: boolean;
  pendingMotiveId: string | null;
  breakdown: BreakdownViewModel;
};

export type MotiveLibraryActions = {
  select: (id: string) => void;
  discover: () => void;
  archiveOrRestore: (motive: MicroMotive) => void;
  startBreakdown: (motive: MicroMotive) => void;
  stopBreakdown: () => void;
  exploreCandidate: (candidate: BreakdownCandidate | null) => void;
  setReflection: (reflection: string) => void;
  confirmCandidate: (candidate: BreakdownCandidate) => void;
  finishBreakdown: (archiveParent: boolean) => void;
};

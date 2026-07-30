"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  createJsonExport,
  createMarkdownExport,
} from "@/libs/motives/export";
import {
  startDiscovery,
  type DiscoveryEntry,
  type DiscoveryMethod,
  type DiscoveryStage,
} from "@/libs/discovery/strategy";
import { localDateStamp } from "@/libs/motives/date";
import type { MicroMotive } from "@/libs/motives/types";
import { discoveryClient, userFacingError } from "./discovery-client";
import DiscoveryWorkspace from "./DiscoveryWorkspace";
import ExportWorkspace from "./ExportWorkspace";
import MotiveLibrary from "./MotiveLibrary";
import { motiveStoreClient } from "./motive-store-client";
import WorkspaceSidebar from "./WorkspaceSidebar";
import type {
  BreakdownCandidate,
  DiscoveryMessage,
  UserFacingError,
  WorkspaceView,
} from "./workspace-types";

const MOTIVES_STORAGE_KEY = "motive.micro-motives.v1";

function latestLabel(motives: MicroMotive[]) {
  const latestDate = motives
    .map((motive) => motive.createdAt)
    .filter(Boolean)
    .sort()
    .at(-1);
  if (!latestDate) return "Ready when you are";

  const formatted = new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${latestDate}T12:00:00`));

  return `Latest · ${formatted}`;
}

function downloadTextFile(contents: string, filename: string, type: string) {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function MotiveWorkspace() {
  const chatThreadRef = useRef<HTMLDivElement>(null);
  const [motives, setMotives] = useState<MicroMotive[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<WorkspaceView>("library");
  const [query, setQuery] = useState("");
  const [isMotiveStorageReady, setIsMotiveStorageReady] = useState(false);
  const [pendingMotiveId, setPendingMotiveId] = useState<string | null>(null);

  const [discoveryEntry, setDiscoveryEntry] =
    useState<DiscoveryEntry | null>(null);
  const [discoveryMethod, setDiscoveryMethod] =
    useState<DiscoveryMethod | null>(null);
  const [discoveryStage, setDiscoveryStage] =
    useState<DiscoveryStage | null>(null);
  const [discoveryMessages, setDiscoveryMessages] = useState<
    DiscoveryMessage[]
  >([]);
  const [discoveryReply, setDiscoveryReply] = useState("");
  const [discoveryCandidate, setDiscoveryCandidate] = useState<string | null>(
    null,
  );
  const [discoveryEvidenceSummary, setDiscoveryEvidenceSummary] = useState<
    string | null
  >(null);
  const [discoveryError, setDiscoveryError] =
    useState<UserFacingError | null>(null);
  const [isDiscoveryPending, setIsDiscoveryPending] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [breakdownCandidates, setBreakdownCandidates] = useState<
    BreakdownCandidate[]
  >([]);
  const [breakdownError, setBreakdownError] =
    useState<UserFacingError | null>(null);
  const [isBreakdownPending, setIsBreakdownPending] = useState(false);
  const [exploringCandidateId, setExploringCandidateId] = useState<
    string | null
  >(null);
  const [reflection, setReflection] = useState("");
  const [savedBreakdownCandidateIds, setSavedBreakdownCandidateIds] = useState<
    string[]
  >([]);
  const [savedBreakdownMotiveIds, setSavedBreakdownMotiveIds] = useState<
    string[]
  >([]);

  const visibleMotives = useMemo(() => {
    const expectedStatus = activeView === "archive" ? "archived" : "confirmed";
    const normalizedQuery = query.toLowerCase();
    return motives.filter(
      (motive) =>
        motive.status === expectedStatus &&
        `${motive.title} ${motive.statement}`
          .toLowerCase()
          .includes(normalizedQuery),
    );
  }, [activeView, motives, query]);

  const expectedSelectedStatus =
    activeView === "archive" ? "archived" : "confirmed";
  const selected =
    motives.find(
      (motive) =>
        motive.id === selectedId && motive.status === expectedSelectedStatus,
    ) ?? visibleMotives[0];
  const confirmedMotives = motives.filter(
    (motive) => motive.status === "confirmed",
  );
  const isDiscoveryBusy = isDiscoveryPending || isFinalizing;

  useEffect(() => {
    let cancelled = false;

    async function migrateBrowserRecords() {
      const serialized = window.localStorage.getItem(MOTIVES_STORAGE_KEY);
      let browserMotives: MicroMotive[] = [];
      let canClearBrowserStorage = false;

      if (serialized) {
        try {
          const parsed = JSON.parse(serialized) as unknown;
          if (Array.isArray(parsed)) {
            browserMotives = parsed as MicroMotive[];
            canClearBrowserStorage = true;
          }
        } catch {
          // Preserve unreadable browser data for manual recovery.
        }
      }

      try {
        const data = await motiveStoreClient.migrate(browserMotives);
        if (cancelled) return;

        const loaded = data.motives!;
        setMotives(loaded);
        setSelectedId(
          loaded.find((motive) => motive.status === "confirmed")?.id ?? null,
        );
        if (canClearBrowserStorage) {
          window.localStorage.removeItem(MOTIVES_STORAGE_KEY);
        }
        if ((data.migratedCount ?? 0) > 0) {
          toast.success(
            `${data.migratedCount} motive${
              data.migratedCount === 1 ? "" : "s"
            } moved to file storage`,
          );
        }
      } catch (error) {
        if (cancelled) return;
        if (browserMotives.length > 0) {
          setMotives(browserMotives);
          setSelectedId(
            browserMotives.find((motive) => motive.status === "confirmed")?.id ??
              null,
          );
        }
        toast.error(
          error instanceof Error
            ? error.message
            : "File storage could not be initialized.",
        );
      } finally {
        if (!cancelled) setIsMotiveStorageReady(true);
      }
    }

    void migrateBrowserRecords();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const thread = chatThreadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [discoveryMessages, isDiscoveryPending, isFinalizing, discoveryError]);

  function resetBreakdown() {
    setIsBreakingDown(false);
    setBreakdownCandidates([]);
    setBreakdownError(null);
    setIsBreakdownPending(false);
    setExploringCandidateId(null);
    setReflection("");
    setSavedBreakdownCandidateIds([]);
    setSavedBreakdownMotiveIds([]);
  }

  function selectMotive(id: string) {
    setSelectedId(id);
    resetBreakdown();
  }

  function changeView(view: WorkspaceView) {
    setActiveView(view);
    resetBreakdown();
    if (view === "discover" || view === "export") return;

    const next = motives.find((motive) =>
      view === "archive"
        ? motive.status === "archived"
        : motive.status === "confirmed",
    );
    setSelectedId(next?.id ?? null);
  }

  async function sendDiscoveryReply(event: FormEvent) {
    event.preventDefault();
    const reply = discoveryReply.trim();
    if (
      !reply ||
      !discoveryEntry ||
      isDiscoveryBusy ||
      !isMotiveStorageReady
    ) {
      return;
    }

    if (discoveryCandidate && reply.toUpperCase() === "YES") {
      const confirmationMessage: DiscoveryMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: reply,
      };
      const confirmedMessages = [...discoveryMessages, confirmationMessage];
      setDiscoveryMessages(confirmedMessages);
      setDiscoveryReply("");
      await confirmDiscoveryMotive(discoveryCandidate, confirmedMessages);
      return;
    }

    const userMessage: DiscoveryMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: reply,
    };
    const nextMessages = [...discoveryMessages, userMessage];

    setDiscoveryMessages(nextMessages);
    setDiscoveryReply("");
    setDiscoveryError(null);
    setIsDiscoveryPending(true);

    try {
      const data = await discoveryClient.continue({
        entry: discoveryEntry,
        method: discoveryMethod,
        stage: discoveryStage,
        messages: nextMessages,
      });
      setDiscoveryMessages((current) => [
        ...current,
        {
          id: `guide-${Date.now()}`,
          role: "guide",
          content: data.turn.reply,
          candidate: data.turn.candidate ?? undefined,
          suggestedAction: data.turn.suggested_action ?? undefined,
        },
      ]);
      setDiscoveryCandidate(
        data.turn.kind === "CANDIDATE"
          ? data.turn.candidate ?? null
          : null,
      );
      setDiscoveryMethod(data.turn.method);
      setDiscoveryStage(data.turn.stage);
      setDiscoveryEvidenceSummary(data.turn.evidence_summary ?? null);
    } catch (error) {
      setDiscoveryError(
        userFacingError(error, "The local Codex call failed."),
      );
    } finally {
      setIsDiscoveryPending(false);
    }
  }

  function startNewDiscovery() {
    setDiscoveryEntry(null);
    setDiscoveryMethod(null);
    setDiscoveryStage(null);
    setDiscoveryMessages([]);
    setDiscoveryReply("");
    setDiscoveryCandidate(null);
    setDiscoveryEvidenceSummary(null);
    setDiscoveryError(null);
    setIsDiscoveryPending(false);
    setIsFinalizing(false);
  }

  function beginNewMotive() {
    startNewDiscovery();
    setActiveView("discover");
  }

  function chooseDiscoveryEntry(entry: DiscoveryEntry) {
    const session = startDiscovery(entry);
    setDiscoveryEntry(session.entry);
    setDiscoveryMethod(session.method);
    setDiscoveryStage(session.stage);
    setDiscoveryMessages([
      {
        id: "opening",
        role: "guide",
        content: session.opening,
      },
    ]);
    setDiscoveryReply("");
    setDiscoveryCandidate(null);
    setDiscoveryEvidenceSummary(null);
    setDiscoveryError(null);
  }

  function rejectDiscoveryCandidate() {
    setDiscoveryCandidate(null);
    setDiscoveryEvidenceSummary(null);
    setDiscoveryMessages((current) => [
      ...current,
      {
        id: `guide-${Date.now()}`,
        role: "guide",
        content: "What feels inaccurate or missing from that wording?",
      },
    ]);
  }

  async function confirmDiscoveryMotive(
    statement: string,
    messages: DiscoveryMessage[] = discoveryMessages,
  ) {
    if (isDiscoveryBusy || !isMotiveStorageReady) return;

    setDiscoveryError(null);
    setIsFinalizing(true);

    try {
      const finalized = await discoveryClient.finalize(
        statement,
        messages,
        discoveryEvidenceSummary,
      );
      const id = `mm-${Date.now()}`;
      const record: MicroMotive = {
        id,
        title: finalized.motive.title,
        statement,
        whyItMatters: finalized.motive.why_it_matters,
        boundaryConditions:
          finalized.motive.boundary_conditions ?? undefined,
        evidence: finalized.motive.evidence,
        createdAt: localDateStamp(),
        status: "confirmed",
      };
      const saved = await motiveStoreClient.save(record);

      setMotives(saved.motives!);
      setSelectedId(id);
      setDiscoveryCandidate(null);
      setActiveView("library");
      toast.success("Micro-motive confirmed and saved to file");
    } catch (error) {
      setDiscoveryError(
        userFacingError(error, "The local save call failed."),
      );
    } finally {
      setIsFinalizing(false);
    }
  }

  async function archiveOrRestoreMotive(motive: MicroMotive) {
    if (!isMotiveStorageReady || pendingMotiveId) return;

    const nextStatus = motive.status === "archived" ? "confirmed" : "archived";
    setPendingMotiveId(motive.id);

    try {
      const data = await motiveStoreClient.setStatus(motive.id, nextStatus);
      const updated = data.motives!;
      setMotives(updated);
      if (selectedId === motive.id) {
        const replacement = updated.find(
          (item) => item.status === motive.status && item.id !== motive.id,
        );
        setSelectedId(replacement?.id ?? null);
        resetBreakdown();
      }
      toast.success(nextStatus === "archived" ? "Moved to archive" : "Restored");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The motive could not be updated.",
      );
    } finally {
      setPendingMotiveId(null);
    }
  }

  async function startBreakdown(motive: MicroMotive) {
    if (isBreakdownPending || pendingMotiveId) return;

    setSelectedId(motive.id);
    resetBreakdown();
    setIsBreakingDown(true);
    setIsBreakdownPending(true);

    try {
      const candidates = await discoveryClient.breakdown(motive);
      if (candidates.length === 0) {
        setBreakdownError({
          message:
            "The current evidence did not support a useful breakdown. Add another lived example and try again.",
        });
      } else {
        setBreakdownCandidates(candidates);
      }
    } catch (error) {
      setBreakdownError(
        userFacingError(error, "Codex could not break this motive down."),
      );
    } finally {
      setIsBreakdownPending(false);
    }
  }

  function exploreBreakdownCandidate(candidate: BreakdownCandidate | null) {
    setExploringCandidateId(candidate?.id ?? null);
    setReflection("");
    setBreakdownError(null);
  }

  async function confirmBreakdownCandidate(candidate: BreakdownCandidate) {
    if (
      !selected ||
      !reflection.trim() ||
      !isMotiveStorageReady ||
      pendingMotiveId
    ) {
      return;
    }

    const id = `mm-${Date.now()}`;
    setPendingMotiveId(id);
    setBreakdownError(null);

    const messages: DiscoveryMessage[] = [
      {
        id: "breakdown-parent",
        role: "guide",
        content: `Broader confirmed motive: “${selected.statement}”`,
      },
      {
        id: "breakdown-question",
        role: "guide",
        content: `${candidate.discoveryQuestion}\n\nPossible constituent: “${candidate.statement}”`,
      },
      {
        id: "breakdown-answer",
        role: "user",
        content: reflection.trim(),
      },
    ];

    try {
      const finalized = await discoveryClient.finalize(
        candidate.statement,
        messages,
        candidate.whyItMightFit,
      );
      const record: MicroMotive = {
        id,
        title: finalized.motive.title,
        statement: candidate.statement,
        whyItMatters: finalized.motive.why_it_matters,
        boundaryConditions:
          finalized.motive.boundary_conditions ?? undefined,
        evidence: finalized.motive.evidence,
        createdAt: localDateStamp(),
        status: "confirmed",
        derivedFrom: selected.id,
      };
      const saved = await motiveStoreClient.save(record);

      setMotives(saved.motives!);
      setSavedBreakdownCandidateIds((current) => [...current, candidate.id]);
      setSavedBreakdownMotiveIds((current) => [...current, id]);
      setExploringCandidateId(null);
      setReflection("");
      toast.success("Constituent motive confirmed and saved");
    } catch (error) {
      setBreakdownError(
        userFacingError(error, "The constituent motive could not be saved."),
      );
    } finally {
      setPendingMotiveId(null);
    }
  }

  async function finishBreakdown(archiveParent: boolean) {
    if (!selected || savedBreakdownMotiveIds.length === 0 || pendingMotiveId) {
      return;
    }

    setPendingMotiveId(selected.id);

    try {
      let updated = motives;
      if (archiveParent) {
        const data = await motiveStoreClient.setStatus(selected.id, "archived");
        updated = data.motives!;
        setMotives(updated);
      }

      const mostRecentChildId = savedBreakdownMotiveIds.at(-1) ?? null;
      setSelectedId(mostRecentChildId);
      setActiveView("library");
      resetBreakdown();
      toast.success(
        archiveParent
          ? "Broader motive moved to archive"
          : "Broader motive kept with the new motives",
      );
    } catch (error) {
      setBreakdownError(
        userFacingError(error, "The broader motive could not be updated."),
      );
    } finally {
      setPendingMotiveId(null);
    }
  }

  function exportJson() {
    const exportedAt = new Date().toISOString();
    downloadTextFile(
      createJsonExport(confirmedMotives, exportedAt),
      "my-micro-motives.json",
      "application/json",
    );
    toast.success("JSON export ready");
  }

  function exportMarkdown() {
    const exportedAt = new Date().toISOString();
    downloadTextFile(
      createMarkdownExport(confirmedMotives, exportedAt),
      "my-micro-motives.md",
      "text/markdown",
    );
    toast.success("Obsidian note ready");
  }

  return (
    <main className="mm-app">
      <WorkspaceSidebar
        activeView={activeView}
        archiveCount={
          motives.filter((motive) => motive.status === "archived").length
        }
        onChange={changeView}
      />

      <section className="mm-workspace">
        <header className="mm-topbar">
          {activeView === "discover" ? (
            <div className="mm-topbar-context">
              <span />
              Discovery conversation
            </div>
          ) : activeView === "export" ? (
            <div className="mm-topbar-context">
              <span />
              Take your motives with you
            </div>
          ) : (
            <label className="mm-search">
              <span>⌕</span>
              <input
                aria-label="Search your motives"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search your motives"
                value={query}
              />
            </label>
          )}
          <div className="mm-local-status">
            <span />
            Stored on this computer
          </div>
        </header>

        {activeView === "discover" ? (
          <DiscoveryWorkspace
            actions={{
              chooseEntry: chooseDiscoveryEntry,
              setReply: setDiscoveryReply,
              submit: sendDiscoveryReply,
              startNew: startNewDiscovery,
              rejectCandidate: rejectDiscoveryCandidate,
              confirmCandidate: (statement) =>
                void confirmDiscoveryMotive(statement),
            }}
            model={{
              entry: discoveryEntry,
              method: discoveryMethod,
              stage: discoveryStage,
              messages: discoveryMessages,
              reply: discoveryReply,
              candidate: discoveryCandidate,
              error: discoveryError,
              isPending: isDiscoveryPending,
              isFinalizing,
              isStorageReady: isMotiveStorageReady,
            }}
            threadRef={chatThreadRef}
          />
        ) : activeView === "export" ? (
          <ExportWorkspace
            motiveCount={confirmedMotives.length}
            onExportJson={exportJson}
            onExportMarkdown={exportMarkdown}
          />
        ) : (
          <MotiveLibrary
            actions={{
              select: selectMotive,
              discover: beginNewMotive,
              archiveOrRestore: (motive) =>
                void archiveOrRestoreMotive(motive),
              startBreakdown: (motive) => void startBreakdown(motive),
              stopBreakdown: resetBreakdown,
              exploreCandidate: exploreBreakdownCandidate,
              setReflection,
              confirmCandidate: (candidate) =>
                void confirmBreakdownCandidate(candidate),
              finishBreakdown: (archiveParent) =>
                void finishBreakdown(archiveParent),
            }}
            model={{
              view: activeView,
              motives: visibleMotives,
              selected,
              query,
              latestLabel: latestLabel(visibleMotives),
              isStorageReady: isMotiveStorageReady,
              pendingMotiveId,
              breakdown: {
                active: isBreakingDown,
                candidates: breakdownCandidates,
                error: breakdownError,
                exploringId: exploringCandidateId,
                reflection,
                savedIds: savedBreakdownCandidateIds,
                isLoading: isBreakdownPending,
              },
            }}
          />
        )}
      </section>
    </main>
  );
}

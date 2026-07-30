import type {
  BreakdownCandidate,
  MotiveLibraryActions,
  MotiveLibraryModel,
} from "./workspace-types";

type MotiveLibraryProps = {
  model: MotiveLibraryModel;
  actions: MotiveLibraryActions;
};

export default function MotiveLibrary({
  model,
  actions,
}: MotiveLibraryProps) {
  const isArchive = model.view === "archive";
  const isBusy = !!model.pendingMotiveId || model.breakdown.isLoading;

  function candidateClass(candidate: BreakdownCandidate) {
    if (model.breakdown.savedIds.includes(candidate.id)) {
      return "mm-candidate is-saved";
    }
    if (model.breakdown.exploringId === candidate.id) {
      return "mm-candidate is-exploring";
    }
    return "mm-candidate";
  }

  return (
    <div className="mm-content">
      <section className="mm-library">
        <div className="mm-library-heading">
          <div>
            <p className="mm-eyebrow">
              {isArchive ? "Out of the way" : "Your collection"}
            </p>
            <h1>{isArchive ? "Archived motives" : "Micro-motives"}</h1>
            <p>
              {isArchive
                ? "Nothing is lost. Restore a motive whenever it becomes useful again."
                : "Small, specific things that reliably bring you alive."}
            </p>
          </div>
          {!isArchive && (
            <button
              className="mm-primary-button"
              onClick={actions.discover}
              type="button"
            >
              <span>＋</span>
              New motive
            </button>
          )}
        </div>

        <div className="mm-collection-meta">
          <span>
            {model.motives.length} {isArchive ? "archived" : "confirmed"}
          </span>
          <span className="mm-meta-line" />
          <span>{model.latestLabel}</span>
        </div>

        <div className="mm-motive-list">
          {model.motives.map((motive, index) => (
            <article
              className={
                model.selected?.id === motive.id
                  ? "mm-motive-card is-selected"
                  : "mm-motive-card"
              }
              key={motive.id}
            >
              <button
                className="mm-card-main"
                onClick={() => actions.select(motive.id)}
                type="button"
              >
                <span className="mm-card-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="mm-card-copy">
                  <strong>{motive.title}</strong>
                  <span>{motive.statement}</span>
                  <small>
                    {motive.evidence.length || "No"}{" "}
                    {motive.evidence.length === 1 ? "example" : "examples"}
                  </small>
                </span>
              </button>
              <div className="mm-card-actions">
                <span
                  className={
                    motive.status === "archived"
                      ? "mm-card-lock is-archived"
                      : "mm-card-lock"
                  }
                >
                  <span>{motive.status === "archived" ? "↺" : "✓"}</span>
                  {motive.status === "archived" ? "Archived" : "Locked"}
                </span>
                {motive.status === "confirmed" ? (
                  <>
                    <button
                      className="mm-card-action"
                      disabled={!model.isStorageReady || isBusy}
                      onClick={() => actions.startBreakdown(motive)}
                      type="button"
                    >
                      <span>↳</span>
                      Break down
                    </button>
                    <button
                      className="mm-card-action is-remove"
                      disabled={!model.isStorageReady || isBusy}
                      onClick={() => actions.archiveOrRestore(motive)}
                      type="button"
                    >
                      <span>×</span>
                      {model.pendingMotiveId === motive.id
                        ? "Moving…"
                        : "Remove"}
                    </button>
                  </>
                ) : (
                  <button
                    className="mm-card-action"
                    disabled={!model.isStorageReady || isBusy}
                    onClick={() => actions.archiveOrRestore(motive)}
                    type="button"
                  >
                    <span>↺</span>
                    {model.pendingMotiveId === motive.id
                      ? "Restoring…"
                      : "Restore"}
                  </button>
                )}
              </div>
            </article>
          ))}

          {model.motives.length === 0 && (
            <div className="mm-empty-state">
              <span>◇</span>
              <h2>
                {isArchive
                  ? "Your archive is empty"
                  : model.query
                    ? "No motives match that search"
                    : "Your collection starts with a conversation"}
              </h2>
              <p>
                {isArchive
                  ? "Removed motives will wait here until you need them."
                  : model.query
                    ? "Try a different phrase or clear the search."
                    : "Begin with one real moment. Motive will help you find the small, specific reward inside it."}
              </p>
              {!isArchive && !model.query && (
                <button
                  className="mm-primary-button"
                  onClick={actions.discover}
                  type="button"
                >
                  Start discovering
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <aside className="mm-detail-panel">
        {model.selected ? (
          <>
            <div className="mm-detail-top">
              <span className="mm-confirmed">
                <span>
                  {model.selected.status === "archived" ? "↺" : "✓"}
                </span>
                {model.selected.status === "archived"
                  ? "Archived"
                  : "Locked by you"}
              </span>
            </div>

            {!model.breakdown.active ? (
              <div className="mm-detail-body">
                <p className="mm-detail-label">Micro-motive</p>
                <h2>{model.selected.title}</h2>
                <blockquote>“{model.selected.statement}”</blockquote>

                <div className="mm-detail-section">
                  <h3>Why it matters</h3>
                  <p>{model.selected.whyItMatters}</p>
                </div>

                {model.selected.boundaryConditions && (
                  <div className="mm-boundary">
                    <span>Boundary</span>
                    <p>{model.selected.boundaryConditions}</p>
                  </div>
                )}

                <div className="mm-detail-section">
                  <div className="mm-section-heading">
                    <h3>Evidence</h3>
                    <span>{model.selected.evidence.length}</span>
                  </div>
                  {model.selected.evidence.map((item, index) => (
                    <article
                      className="mm-evidence"
                      key={`${model.selected!.id}-${index}`}
                    >
                      <span className="mm-evidence-dot" />
                      <div>
                        <p>{item.situation}</p>
                        <small>{item.reaction}</small>
                        <div className="mm-feelings">
                          {item.feelings.map((feeling) => (
                            <span key={feeling}>{feeling}</span>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mm-breakdown">
                <button
                  className="mm-back-button"
                  onClick={actions.stopBreakdown}
                  type="button"
                >
                  ← Back to motive
                </button>
                <p className="mm-detail-label">Predictions, not conclusions</p>
                <h2>What might be inside this?</h2>
                <p className="mm-breakdown-intro">
                  Codex used this motive’s wording and lived evidence to predict
                  possible constituent motives. Explore each one against a real
                  moment before deciding.
                </p>

                {model.breakdown.isLoading && (
                  <div className="mm-breakdown-loading">
                    <span />
                    <span />
                    <span />
                    Looking for meaningful distinctions…
                  </div>
                )}

                {model.breakdown.error && (
                  <div className="mm-discovery-error">
                    <strong>Breakdown paused</strong>
                    <p>{model.breakdown.error.message}</p>
                    {model.breakdown.error.recovery && (
                      <code>{model.breakdown.error.recovery}</code>
                    )}
                  </div>
                )}

                <div className="mm-candidate-list">
                  {model.breakdown.candidates.map((candidate) => {
                    const isSaved = model.breakdown.savedIds.includes(
                      candidate.id,
                    );
                    const isExploring =
                      model.breakdown.exploringId === candidate.id;

                    return (
                      <article
                        className={candidateClass(candidate)}
                        key={candidate.id}
                      >
                        <span className="mm-candidate-kicker">
                          {isSaved ? "Saved motive" : "Possible motive"}
                        </span>
                        <h3>{candidate.title}</h3>
                        <p>{candidate.statement}</p>
                        <small className="mm-candidate-rationale">
                          {candidate.whyItMightFit}
                        </small>

                        {isSaved ? (
                          <span className="mm-candidate-saved">✓ Locked by you</span>
                        ) : isExploring ? (
                          <div className="mm-reflection">
                            <p>{candidate.discoveryQuestion}</p>
                            <textarea
                              onChange={(event) =>
                                actions.setReflection(event.target.value)
                              }
                              placeholder="Describe the specific moment…"
                              value={model.breakdown.reflection}
                            />
                            <div>
                              <button
                                className="mm-text-button"
                                onClick={() => actions.exploreCandidate(null)}
                                type="button"
                              >
                                Not this one
                              </button>
                              <button
                                className="mm-yes-button"
                                disabled={
                                  !model.isStorageReady ||
                                  !!model.pendingMotiveId ||
                                  !model.breakdown.reflection.trim()
                                }
                                onClick={() =>
                                  actions.confirmCandidate(candidate)
                                }
                                type="button"
                              >
                                {model.pendingMotiveId
                                  ? "Saving…"
                                  : "YES — save this"}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            className="mm-explore-button"
                            onClick={() => actions.exploreCandidate(candidate)}
                            type="button"
                          >
                            Explore this <span>→</span>
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>

                {model.breakdown.savedIds.length > 0 && (
                  <section className="mm-parent-choice">
                    <span>When you’re finished</span>
                    <h3>What should happen to the broader motive?</h3>
                    <p>
                      You can keep it as useful context or move it aside now that
                      you have more specific motives.
                    </p>
                    <div>
                      <button
                        className="mm-text-button"
                        disabled={!!model.pendingMotiveId}
                        onClick={() => actions.finishBreakdown(false)}
                        type="button"
                      >
                        Keep it in my collection
                      </button>
                      <button
                        className="mm-primary-button"
                        disabled={!!model.pendingMotiveId}
                        onClick={() => actions.finishBreakdown(true)}
                        type="button"
                      >
                        Move it to archive
                      </button>
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="mm-empty-detail">
            <span>✦</span>
            <h2>{isArchive ? "Nothing waiting here" : "Start with one moment"}</h2>
            <p>
              {isArchive
                ? "Motives you remove can always be restored from this view."
                : "Your confirmed motive and its lived evidence will appear here."}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}

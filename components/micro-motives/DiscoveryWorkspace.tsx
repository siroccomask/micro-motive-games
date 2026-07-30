import type { KeyboardEvent } from "react";
import {
  discoveryMethodLabel,
  discoveryStageLabel,
} from "@/libs/discovery/strategy";
import DiscoveryStart from "./DiscoveryStart";
import type { DiscoveryViewProps } from "./workspace-types";

export default function DiscoveryWorkspace({
  model,
  actions,
  threadRef,
}: DiscoveryViewProps) {
  const isBusy = model.isPending || model.isFinalizing;
  const methodLabel = discoveryMethodLabel(model.method);
  const stageLabel = discoveryStageLabel(model.stage);

  function submitOnEnter(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  return (
    <div className="mm-discover">
      <header className="mm-discover-header">
        <div>
          <p className="mm-eyebrow">
            {model.entry ? "A guided conversation" : "Choose your evidence"}
          </p>
          <h1>
            {model.entry ? "Follow the live wire." : "Where should we begin?"}
          </h1>
          <p>
            {model.entry
              ? "We’ll stay with one real thread until the small, specific reward inside it becomes clear to you."
              : "Different evidence calls for different questions. Choose the starting point that feels most vivid right now."}
          </p>
        </div>
        {model.entry && (
          <button
            className="mm-new-session"
            disabled={isBusy}
            onClick={actions.startNew}
            type="button"
          >
            <span>←</span>
            Change starting point
          </button>
        )}
      </header>

      {!model.entry ? (
        <DiscoveryStart onChoose={actions.chooseEntry} />
      ) : (
        <div className="mm-discovery-layout">
          <section className="mm-chat-shell">
            <div className="mm-chat-context">
              <span className="mm-guide-mark">m</span>
              <div>
                <strong>{methodLabel}</strong>
                <span>{stageLabel}</span>
              </div>
              <span className="mm-local-pill">Evidence-led method</span>
            </div>

            <div className="mm-chat-thread" ref={threadRef}>
              {model.messages.map((message) => (
                <article
                  className={`mm-message mm-message-${message.role}`}
                  key={message.id}
                >
                  {message.role === "guide" && (
                    <span className="mm-message-avatar">m</span>
                  )}
                  <div>
                    <span className="mm-message-author">
                      {message.role === "guide" ? "Motive" : "You"}
                    </span>
                    <p>{message.content}</p>
                    {message.candidate &&
                      message.suggestedAction &&
                      model.candidate === message.candidate && (
                        <div className="mm-inline-action">
                          <span>Possible micro-motive</span>
                          <blockquote>“{message.candidate}”</blockquote>
                          <div>
                            <button
                              className="mm-text-button"
                              disabled={isBusy}
                              onClick={actions.rejectCandidate}
                              type="button"
                            >
                              Not quite
                            </button>
                            <button
                              className="mm-yes-button"
                              disabled={isBusy || !model.isStorageReady}
                              onClick={() =>
                                actions.confirmCandidate(message.candidate!)
                              }
                              type="button"
                            >
                              {message.suggestedAction.label}
                            </button>
                          </div>
                        </div>
                      )}
                  </div>
                </article>
              ))}

              {isBusy && (
                <article className="mm-message mm-message-guide mm-message-pending">
                  <span className="mm-message-avatar">m</span>
                  <div>
                    <span className="mm-message-author">Motive</span>
                    {model.isFinalizing ? (
                      <p className="mm-finalizing-copy">
                        Structuring the record you approved…
                      </p>
                    ) : (
                      <p>
                        <span />
                        <span />
                        <span />
                      </p>
                    )}
                  </div>
                </article>
              )}

              {model.error && (
                <div className="mm-discovery-error">
                  <strong>
                    {model.error.recovery
                      ? "Codex needs your attention"
                      : "Discovery paused"}
                  </strong>
                  <p>{model.error.message}</p>
                  {model.error.recovery && <code>{model.error.recovery}</code>}
                </div>
              )}
            </div>

            <form className="mm-chat-composer" onSubmit={actions.submit}>
              <textarea
                disabled={isBusy}
                onChange={(event) => actions.setReply(event.target.value)}
                onKeyDown={submitOnEnter}
                placeholder={
                  isBusy
                    ? model.isFinalizing
                      ? "Saving the confirmed motive…"
                      : "Codex is following the thread…"
                    : "Tell me what actually happened…"
                }
                rows={3}
                value={model.reply}
              />
              <div>
                <span>Enter to send · Shift + Enter for a new line</span>
                <button disabled={isBusy} type="submit">
                  {model.isFinalizing
                    ? "Saving"
                    : model.isPending
                      ? "Thinking"
                      : "Send"}{" "}
                  <span>↑</span>
                </button>
              </div>
            </form>
          </section>

          <aside className="mm-discovery-rail">
            <section className="mm-conversation-promise">
              <span>✦</span>
              <h2>You remain the referee.</h2>
              <p>
                I’ll make predictions and challenge vague answers. Nothing becomes
                one of your motives until you recognize it and say
                <strong> YES</strong>.
              </p>
            </section>

            <section className="mm-live-thread">
              <div className="mm-rail-heading">
                <span>Current method</span>
                <small>
                  {isBusy
                    ? model.isFinalizing
                      ? "Saving"
                      : "Thinking"
                    : methodLabel}
                </small>
              </div>
              <div
                className={
                  model.candidate
                    ? "mm-thread-state is-complete"
                    : "mm-thread-state"
                }
              >
                <span className="mm-pulse" />
                <div>
                  <strong>{stageLabel}</strong>
                  <p>
                    {model.method === "JUDGMENT"
                      ? "Following the behavior, your feeling, and the exact feature that triggered it."
                      : model.method === "ALIVENESS"
                        ? "Following one lived moment toward its exact rewarding feature."
                        : "Listening for whether the strongest evidence is aliveness or judgment."}
                  </p>
                </div>
              </div>
              <div
                className={
                  model.candidate
                    ? "mm-thread-state"
                    : "mm-thread-state is-future"
                }
              >
                <span className={model.candidate ? "mm-pulse" : ""} />
                <div>
                  <strong>Possible micro-motive</strong>
                  <p>
                    {model.candidate
                      ? "A current hypothesis is ready for your judgment."
                      : "A candidate appears when a specific pattern begins to emerge."}
                  </p>
                </div>
              </div>
            </section>

            <section className="mm-transcript-note">
              <span>What gets saved locally</span>
              <p>
                Discovery responses pass through your Codex subscription but are
                not saved by this app. Only a motive you confirm and its concise
                evidence summary are written to your file.
              </p>
            </section>
          </aside>
        </div>
      )}
    </div>
  );
}

type ExportWorkspaceProps = {
  motiveCount: number;
  onExportMarkdown: () => void;
  onExportJson: () => void;
};

export default function ExportWorkspace({
  motiveCount,
  onExportMarkdown,
  onExportJson,
}: ExportWorkspaceProps) {
  return (
    <div className="mm-export-page">
      <header className="mm-export-hero">
        <div>
          <p className="mm-eyebrow">Carry your individuality forward</p>
          <h1>Give your other tools a better picture of you.</h1>
          <p>
            Your micro-motives are evidence of the small, personal experiences
            that bring you alive. Place them in your Obsidian vault or another
            AI workspace so future suggestions can begin with your
            individuality—not a standardized picture of what should fulfill you.
          </p>
        </div>
        <div className="mm-export-count">
          <strong>{motiveCount}</strong>
          <span>confirmed micro-motives</span>
        </div>
      </header>

      <div className="mm-export-grid">
        <section className="mm-export-card is-primary">
          <span className="mm-export-format">For an Obsidian vault</span>
          <h2>A readable note with context built in</h2>
          <p>
            The Markdown export includes every confirmed motive, the experiences
            that revealed it, and guidance that helps an AI use the collection
            as personal evidence rather than a list of generic goals.
          </p>
          <button
            className="mm-export-button"
            disabled={motiveCount === 0}
            onClick={onExportMarkdown}
            type="button"
          >
            <span>⇩</span>
            Download Obsidian note
          </button>
          <small>Creates my-micro-motives.md</small>
        </section>

        <section className="mm-export-card">
          <span className="mm-export-format">For structured tools</span>
          <h2>The complete collection as data</h2>
          <p>
            The JSON export keeps each micro-motive’s exact shape, including its
            wording, evidence, boundaries, origin, and confirmation status.
          </p>
          <button
            className="mm-export-button is-secondary"
            disabled={motiveCount === 0}
            onClick={onExportJson}
            type="button"
          >
            <span>{"{ }"}</span>
            Download JSON
          </button>
          <small>Creates my-micro-motives.json</small>
        </section>
      </div>

      <section className="mm-export-why">
        <div>
          <p className="mm-eyebrow">Why this compounds</p>
          <h2>From isolated insights to a life that fits.</h2>
        </div>
        <div className="mm-export-principles">
          <article>
            <span>01</span>
            <div>
              <h3>More personal possibilities</h3>
              <p>
                Suggestions can be shaped around what reliably energizes you
                instead of defaulting to familiar paths and standardized
                ambitions.
              </p>
            </div>
          </article>
          <article>
            <span>02</span>
            <div>
              <h3>Better combinations</h3>
              <p>
                The most promising opportunities often bring several
                micro-motives alive at once. A persistent collection makes those
                combinations easier to notice.
              </p>
            </div>
          </article>
          <article>
            <span>03</span>
            <div>
              <h3>Your judgment stays central</h3>
              <p>
                An AI can predict where fulfillment might be found, but your
                lived response remains the test. The exported note preserves
                that boundary.
              </p>
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}

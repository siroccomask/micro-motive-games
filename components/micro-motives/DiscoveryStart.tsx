import {
  discoveryEntries,
  type DiscoveryEntry,
} from "@/libs/discovery/strategy";

type DiscoveryStartProps = {
  onChoose: (entry: DiscoveryEntry) => void;
};

const entryCues: Record<
  DiscoveryEntry,
  { symbol: string; label: string }
> = {
  ALIVENESS: {
    symbol: "✦",
    label: "Follow what lights you up",
  },
  JUDGMENT: {
    symbol: "↯",
    label: "Follow the reaction",
  },
  ADAPTIVE: {
    symbol: "⌁",
    label: "Start anywhere",
  },
};

export default function DiscoveryStart({ onChoose }: DiscoveryStartProps) {
  return (
    <section className="mm-discovery-start">
      <div className="mm-start-methods">
        {discoveryEntries.map((option) => {
          const cue = entryCues[option.entry];

          return (
            <button
              className={`mm-start-method is-${option.entry.toLowerCase()}`}
              key={option.entry}
              onClick={() => onChoose(option.entry)}
              type="button"
            >
              <span className="mm-start-method-index">
                {option.entry === "ALIVENESS"
                  ? "01"
                  : option.entry === "JUDGMENT"
                    ? "02"
                    : "03"}
              </span>
              <span className="mm-start-method-copy">
                <small>{option.eyebrow}</small>
                <strong>{option.title}</strong>
                <span>{option.description}</span>
                <span className="mm-start-method-cue">
                  <span aria-hidden="true">{cue.symbol}</span>
                  {cue.label}
                </span>
              </span>
              <span className="mm-start-method-arrow" aria-hidden="true">
                →
              </span>
            </button>
          );
        })}
      </div>

      <footer className="mm-start-contract">
        <span>One question at a time</span>
        <span>Your lived experience stays the test</span>
        <span>Nothing is saved until you say YES</span>
      </footer>
    </section>
  );
}

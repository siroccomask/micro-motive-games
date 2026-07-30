import type { WorkspaceView } from "./workspace-types";

const navItems = [
  { id: "library", label: "My motives", symbol: "◫" },
  { id: "discover", label: "Discover", symbol: "✦" },
  { id: "export", label: "Export", symbol: "⇩" },
  { id: "archive", label: "Archive", symbol: "↺" },
] as const;

type WorkspaceSidebarProps = {
  activeView: WorkspaceView;
  archiveCount: number;
  onChange: (view: WorkspaceView) => void;
};

export default function WorkspaceSidebar({
  activeView,
  archiveCount,
  onChange,
}: WorkspaceSidebarProps) {
  return (
    <aside className="mm-sidebar">
      <div className="mm-brand">
        <span className="mm-brand-mark">m</span>
        <span>motive</span>
      </div>

      <nav className="mm-nav" aria-label="Workspace navigation">
        <p className="mm-nav-label">Workspace</p>
        {navItems.map((item) => (
          <button
            className={
              activeView === item.id ? "mm-nav-item is-active" : "mm-nav-item"
            }
            key={item.id}
            onClick={() => onChange(item.id)}
            type="button"
          >
            <span>{item.symbol}</span>
            {item.label}
            {item.id === "archive" && (
              <span className="mm-nav-count">{archiveCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="mm-sidebar-note">
        <span className="mm-spark">✦</span>
        <blockquote>
          “Harness your individuality in the pursuit of fulfillment to achieve
          excellence.”
        </blockquote>
        <cite>Dark Horse</cite>
      </div>
    </aside>
  );
}

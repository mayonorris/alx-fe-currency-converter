import { Clock, Trash2 } from "lucide-react";
import Card from "./Card";

function RecentConversions({ conversions, onClear }) {
  const formatTime = (timestamp) => {
    const now = new Date();
    const then = new Date(timestamp);
    const seconds = Math.floor((now - then) / 1000);

    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  if (conversions.length === 0) {
    return (
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={20} style={{ color: "var(--accent)" }} />
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Recent Conversions
            </h3>
          </div>
        </div>
        <p
          className="text-sm text-center py-6"
          style={{ color: "var(--text-muted)" }}
        >
          No conversions yet. Start converting currencies above!
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock size={20} style={{ color: "var(--accent)" }} />
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Recent Conversions
          </h3>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-all"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-muted)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(239,68,68,0.1)";
            e.currentTarget.style.color = "var(--red)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-surface)";
            e.currentTarget.style.color = "var(--text-muted)";
          }}
        >
          <Trash2 size={14} />
          Clear All
        </button>
      </div>

      <div className="space-y-2">
        {conversions.map((conv) => (
          <div
            key={conv.id}
            className="p-3 rounded-lg"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium">
                {conv.amount} {conv.from} → {conv.result.toFixed(2)} {conv.to}
              </span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {formatTime(conv.timestamp)}
              </span>
            </div>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Rate: 1 {conv.from} = {conv.rate.toFixed(4)} {conv.to}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default RecentConversions;

import { Star } from "lucide-react";
import Card from "./Card";
import { currencies } from "../data/currencies";

function FavoritePairs({ favorites, onSelect, onRemove }) {
  const getCurrencyFlag = (code) => {
    return currencies.find((c) => c.code === code)?.flag || "💱";
  };

  if (favorites.length === 0) {
    return (
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Star size={20} style={{ color: "var(--accent)" }} />
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Favorite Pairs
          </h3>
        </div>
        <p
          className="text-sm text-center py-6"
          style={{ color: "var(--text-muted)" }}
        >
          No favorite currency pairs yet. Add one by clicking the star icon
          above!
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Star size={20} style={{ color: "var(--accent)" }} />
        <h3
          className="text-lg font-bold"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Favorite Pairs
        </h3>
      </div>

      <div className="space-y-2">
        {favorites.map((pair) => {
          const [from, to] = pair.split("-");
          return (
            <div
              key={pair}
              className="flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.1)";
                e.currentTarget.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg-surface)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)";
              }}
              onClick={() => onSelect(from, to)}
            >
              <span className="font-medium">
                {getCurrencyFlag(from)} {from} → {getCurrencyFlag(to)} {to}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(from, to);
                }}
                className="p-1 rounded transition-colors"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#fbbf24")}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--text-muted)")
                }
              >
                <Star size={16} fill="#fbbf24" />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

export default FavoritePairs;

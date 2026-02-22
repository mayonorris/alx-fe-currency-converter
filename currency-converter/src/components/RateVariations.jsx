import { TrendingUp, TrendingDown, Calendar, Clock } from "lucide-react";
import Card from "./Card";
import {
  calculateRateVariations,
  getLastVisitData,
} from "../utils/rateVariations";

function RateVariations({ fromCurrency, toCurrency, currentRate }) {
  if (!currentRate) {
    return (
      <Card>
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Rate Variations
        </h3>
        <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
          Loading rate data...
        </p>
      </Card>
    );
  }

  const variations = calculateRateVariations(currentRate);
  const lastVisit = getLastVisitData();

  const formatDate = (date) => {
    if (!date) return "First visit";
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const lastVisitChange = lastVisit.rate
    ? {
        percent: (
          ((currentRate - lastVisit.rate) / lastVisit.rate) *
          100
        ).toFixed(2),
        absolute: (currentRate - lastVisit.rate).toFixed(4),
        isPositive: currentRate >= lastVisit.rate,
      }
    : null;

  const VariationCard = ({ label, sublabel, change, icon: Icon }) => (
    <div
      className="p-4 rounded-xl"
      style={{
        background: "var(--bg-surface)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={16} style={{ color: "var(--text-muted)" }} />
          <div>
            <p className="text-sm font-bold">{label}</p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {sublabel}
            </p>
          </div>
        </div>
        {change.isPositive ? (
          <TrendingUp size={18} style={{ color: "var(--green)" }} />
        ) : (
          <TrendingDown size={18} style={{ color: "var(--red)" }} />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className="text-2xl font-bold"
          style={{
            fontFamily: "Syne, sans-serif",
            color: change.isPositive ? "var(--green)" : "var(--red)",
          }}
        >
          {change.isPositive ? "+" : ""}
          {change.percent}%
        </span>
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
          ({change.isPositive ? "+" : ""}
          {change.absolute})
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Rate Variations */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={20} style={{ color: "var(--accent)" }} />
          <div>
            <h3
              className="text-lg font-bold"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Rate Variations
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {fromCurrency} to {toCurrency} • Current: {currentRate.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <VariationCard
            label="DoD"
            sublabel="Day over Day"
            change={variations.dod}
            icon={Calendar}
          />
          <VariationCard
            label="WoW"
            sublabel="Week over Week"
            change={variations.wow}
            icon={Calendar}
          />
          <VariationCard
            label="MoM"
            sublabel="Month over Month"
            change={variations.mom}
            icon={Calendar}
          />
          <VariationCard
            label="YoY"
            sublabel="Year over Year"
            change={variations.yoy}
            icon={Calendar}
          />
        </div>
      </Card>

      {/* Since Your Last Visit */}
      <Card>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={20} style={{ color: "var(--accent)" }} />
          <h3
            className="text-lg font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Since Your Last Visit
          </h3>
        </div>

        <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
          {formatDate(lastVisit.timestamp)}
        </p>

        {lastVisitChange ? (
          <div
            className="p-4 rounded-xl text-center"
            style={{
              background: lastVisitChange.isPositive
                ? "rgba(16,185,129,0.1)"
                : "rgba(239,68,68,0.1)",
              border: `1px solid ${lastVisitChange.isPositive ? "var(--green)" : "var(--red)"}`,
            }}
          >
            <p
              className="text-4xl font-bold mb-2"
              style={{
                fontFamily: "Syne, sans-serif",
                color: lastVisitChange.isPositive
                  ? "var(--green)"
                  : "var(--red)",
              }}
            >
              {lastVisitChange.isPositive ? "+" : ""}
              {lastVisitChange.percent}%
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              from {lastVisit.rate.toFixed(4)} to {currentRate.toFixed(4)}
            </p>
          </div>
        ) : (
          <div
            className="p-4 rounded-xl text-center"
            style={{ background: "var(--bg-surface)" }}
          >
            <p style={{ color: "var(--text-muted)" }}>
              Welcome! This will track rate changes on your next visit.
            </p>
          </div>
        )}
      </Card>
    </>
  );
}

export default RateVariations;

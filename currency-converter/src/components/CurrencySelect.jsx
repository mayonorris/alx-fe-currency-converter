import { currencies } from "../data/currencies";

function CurrencySelect({ label, value, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs font-medium uppercase tracking-wider"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 pr-10 rounded-xl text-base font-medium appearance-none cursor-pointer transition-all"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-main)",
            border: "1px solid rgba(255,255,255,0.1)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
        >
          {currencies.map((curr) => (
            <option key={curr.code} value={curr.code}>
              {curr.flag} {curr.code} - {curr.name}
            </option>
          ))}
        </select>
        <div
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-lg"
          style={{ color: "var(--text-muted)" }}
        >
          ▼
        </div>
      </div>
    </div>
  );
}

export default CurrencySelect;

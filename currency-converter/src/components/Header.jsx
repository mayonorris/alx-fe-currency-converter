function Header() {
  return (
    <header
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #482e81 50%, #401b4b 100%)",
      }}
      className="w-full px-6 py-5 flex items-center justify-between border-b border-white/10"
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 20px #6366f155",
          }}
        >
          💱
        </div>
        <div>
          <h1
            className="text-xl font-bold tracking-tight leading-none"
            style={{
              fontFamily: "Syne, sans-serif",
              color: "var(--text-main)",
            }}
          >
            Currency Converter
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Real-time exchange rates
          </p>
        </div>
      </div>

      {/* Live badge */}
      <div
        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
        style={{
          background: "var(--bg-surface)",
          color: "var(--text-muted)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ background: "var(--green)" }}
        />
        Live Rates
      </div>
    </header>
  );
}

export default Header;

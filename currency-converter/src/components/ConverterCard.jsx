import { useState, useEffect } from "react";
import { ArrowLeftRight, Star } from "lucide-react";
import Card from "./Card";
import CurrencySelect from "./CurrencySelect";
import { fetchExchangeRate } from "../services/exchangeApi";
import {
  saveFavorite,
  removeFavorite,
  isFavorite,
  saveConversion,
} from "../utils/storage";

function ConverterCard({ onFavoriteChange, onRateUpdate }) {
  const [amount, setAmount] = useState("100");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");

  const [exchangeRate, setExchangeRate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorite, setFavorite] = useState(false);

  // Check if current pair is favorited
  useEffect(() => {
    setFavorite(isFavorite(fromCurrency, toCurrency));
  }, [fromCurrency, toCurrency]);

  // Fetch exchange rate whenever currencies change
  useEffect(() => {
    async function loadRate() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchExchangeRate(fromCurrency);
        const rate = data.rates[toCurrency];
        setExchangeRate(rate);

        // Notify parent component of rate update
        if (onRateUpdate) {
          onRateUpdate(fromCurrency, toCurrency, rate);
        }

        // Auto-save conversion when rate loads
        const amt = parseFloat(amount) || 0;
        const result = amt * rate;
        saveConversion(fromCurrency, toCurrency, amt, rate, result);
      } catch (err) {
        setError("Failed to fetch exchange rate. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadRate();
  }, [fromCurrency, toCurrency, amount]);

  const convertedAmount = exchangeRate
    ? (parseFloat(amount) || 0) * exchangeRate
    : 0;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleToggleFavorite = () => {
    if (favorite) {
      removeFavorite(fromCurrency, toCurrency);
    } else {
      saveFavorite(fromCurrency, toCurrency);
    }
    setFavorite(!favorite);
    if (onFavoriteChange) onFavoriteChange();
  };

  return (
    <Card>
      {/* Amount Input */}
      <div className="mb-6">
        <label
          className="text-xs font-medium uppercase tracking-wider mb-2 block"
          style={{ color: "var(--text-muted)" }}
        >
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-lg font-medium"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-main)",
            border: "1px solid rgba(255,255,255,0.1)",
            outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
          placeholder="Enter amount"
        />
      </div>

      {/* From/To Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <CurrencySelect
          label="From"
          value={fromCurrency}
          onChange={setFromCurrency}
        />
        <CurrencySelect
          label="To"
          value={toCurrency}
          onChange={setToCurrency}
        />
      </div>

      {/* Swap + Favorite Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={handleSwap}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all"
          style={{
            background: "var(--bg-surface)",
            color: "var(--text-main)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--accent)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-surface)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <ArrowLeftRight size={18} />
          Swap Currencies
        </button>

        <button
          onClick={handleToggleFavorite}
          className="px-4 py-3 rounded-xl transition-all"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: favorite ? "#fbbf24" : "var(--text-muted)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <Star size={20} fill={favorite ? "#fbbf24" : "none"} />
        </button>
      </div>

      {/* Loading / Error / Result */}
      {loading && (
        <div
          className="rounded-xl p-5 text-center"
          style={{ background: "var(--bg-surface)" }}
        >
          <p style={{ color: "var(--text-muted)" }}>Loading exchange rate...</p>
        </div>
      )}

      {error && (
        <div
          className="rounded-xl p-5 text-center"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid var(--red)",
          }}
        >
          <p style={{ color: "var(--red)" }}>{error}</p>
        </div>
      )}

      {!loading && !error && exchangeRate && (
        <div
          className="rounded-xl p-5"
          style={{
            background: "var(--bg-surface)",
            border: "1px solid rgba(99,102,241,0.2)",
          }}
        >
          <p className="text-sm mb-1" style={{ color: "var(--text-muted)" }}>
            {amount} {fromCurrency} =
          </p>
          <p
            className="text-4xl font-bold mb-2"
            style={{
              fontFamily: "Syne, sans-serif",
              color: "var(--text-main)",
            }}
          >
            {convertedAmount.toFixed(2)} {toCurrency}
          </p>
          <div className="flex items-center justify-between text-xs">
            <span style={{ color: "var(--text-muted)" }}>
              Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)}{" "}
              {toCurrency}
            </span>
            <span
              className="px-2 py-1 rounded font-medium"
              style={{
                background: "rgba(16,185,129,0.15)",
                color: "var(--green)",
              }}
            >
              Live Rate
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}

export default ConverterCard;

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import Card from "./Card";
import { calculateRateStats } from "../utils/chartData";
import {
  fetchHistoricalRates,
  isCurrencySupportedByFrankfurter,
} from "../services/historicalApi";

function ExchangeRateChart({ fromCurrency, toCurrency, currentRate }) {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState("real"); // 'real' or 'estimated'

  useEffect(() => {
    if (!currentRate) return;

    async function loadHistoricalData() {
      setLoading(true);
      setError(null);

      // Check if both currencies are supported by Frankfurter
      const isSupported =
        isCurrencySupportedByFrankfurter(fromCurrency) &&
        isCurrencySupportedByFrankfurter(toCurrency);
      setDataSource(isSupported ? "real" : "estimated");

      try {
        let data = await fetchHistoricalRates(fromCurrency, toCurrency, 12);

        // Scale estimated data to match current rate
        if (!isSupported && data.length > 0) {
          const lastRate = data[data.length - 1].rate;
          const scaleFactor = currentRate / lastRate;
          data = data.map((d) => ({
            ...d,
            rate: parseFloat((d.rate * scaleFactor).toFixed(4)),
          }));
        }

        setChartData(data);
        setStats(calculateRateStats(data));
      } catch (err) {
        console.error("Failed to load historical data:", err);
        setError("Unable to load historical data");
      } finally {
        setLoading(false);
      }
    }

    loadHistoricalData();
  }, [currentRate, fromCurrency, toCurrency]);

  if (loading) {
    return (
      <Card>
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Exchange Rate Evolution
        </h3>
        <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
          Loading historical data...
        </p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Exchange Rate Evolution
        </h3>
        <div
          className="rounded-xl p-5 text-center"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid var(--red)",
          }}
        >
          <p style={{ color: "var(--red)" }}>{error}</p>
        </div>
      </Card>
    );
  }

  if (!currentRate || !stats || chartData.length === 0) {
    return (
      <Card>
        <h3
          className="text-lg font-bold mb-4"
          style={{ fontFamily: "Syne, sans-serif" }}
        >
          Exchange Rate Evolution
        </h3>
        <p className="text-center py-8" style={{ color: "var(--text-muted)" }}>
          Loading chart data...
        </p>
      </Card>
    );
  }

  const isPositive = parseFloat(stats.change) >= 0;

  return (
    <Card>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3
            className="text-lg font-bold mb-1"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Exchange Rate Evolution
          </h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {fromCurrency} to {toCurrency} • Last 12 months
          </p>
        </div>
        <div
          className="flex items-center gap-1 px-3 py-1 rounded-lg font-bold"
          style={{
            background: isPositive
              ? "rgba(16,185,129,0.1)"
              : "rgba(239,68,68,0.1)",
            color: isPositive ? "var(--green)" : "var(--red)",
          }}
        >
          {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          {isPositive ? "+" : ""}
          {stats.change}%
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        {[
          { label: "Start", value: stats.start },
          { label: "Current", value: stats.current },
          { label: "High", value: stats.high },
          { label: "Low", value: stats.low },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
              {stat.label}
            </p>
            <p className="text-sm font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ width: "100%", height: "280px" }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.05)"
            />
            <XAxis
              dataKey="date"
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              stroke="var(--text-muted)"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickLine={false}
              domain={["dataMin - 0.01", "dataMax + 0.01"]}
            />
            <Tooltip
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                color: "var(--text-main)",
                fontSize: "12px",
              }}
              labelStyle={{ color: "var(--text-muted)" }}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--accent)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Source Badge */}
      {dataSource === "real" ? (
        <div
          className="mt-4 p-3 rounded-lg text-xs flex items-center gap-2"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid var(--green)",
          }}
        >
          <span style={{ color: "var(--green)", fontWeight: "bold" }}>
            ✓ Real Data
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            Historical exchange rates from Frankfurter API (ECB data)
          </span>
        </div>
      ) : (
        <div
          className="mt-4 p-3 rounded-lg text-xs flex items-center gap-2"
          style={{
            background: "rgba(249,115,22,0.1)",
            border: "1px solid #f97316",
          }}
        >
          <AlertCircle size={14} style={{ color: "#f97316" }} />
          <span style={{ color: "#f97316", fontWeight: "bold" }}>
            Estimated Trend
          </span>
          <span style={{ color: "var(--text-muted)" }}>
            This currency pair is not available in ECB data. Chart shows
            estimated historical trend.
          </span>
        </div>
      )}
    </Card>
  );
}

export default ExchangeRateChart;

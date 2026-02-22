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
import { TrendingDown, TrendingUp } from "lucide-react";
import Card from "./Card";
import { generateHistoricalData, calculateRateStats } from "../utils/chartData";

function ExchangeRateChart({ fromCurrency, toCurrency, currentRate }) {
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!currentRate) return;

    const data = generateHistoricalData(currentRate, 12);
    setChartData(data);
    setStats(calculateRateStats(data));
  }, [currentRate, fromCurrency, toCurrency]);

  if (!currentRate || !stats) {
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
            {fromCurrency} to {toCurrency} • Feb 2025 - Feb 2026
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

      {/* Disclaimer */}
      <div
        className="mt-4 p-3 rounded-lg text-xs"
        style={{
          background: "rgba(99,102,241,0.05)",
          border: "1px solid rgba(99,102,241,0.2)",
        }}
      >
        <span style={{ color: "var(--accent)", fontWeight: "bold" }}>
          Note:
        </span>{" "}
        <span style={{ color: "var(--text-muted)" }}>
          This chart shows simulated historical exchange rate data for
          demonstration purposes. In a production environment, this would
          display real historical data from a currency API.
        </span>
      </div>
    </Card>
  );
}

export default ExchangeRateChart;

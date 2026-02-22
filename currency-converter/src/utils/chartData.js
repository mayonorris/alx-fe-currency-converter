// Generate realistic simulated historical exchange rate data
export function generateHistoricalData(baseRate, months = 12) {
  const data = [];
  const today = new Date();

  // Start from 12 months ago
  let currentRate = baseRate * (0.85 + Math.random() * 0.15); // Start 10-15% different

  for (let i = months; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);

    // Add realistic volatility (random walk)
    const volatility = (Math.random() - 0.5) * 0.03; // ±1.5% change
    currentRate = currentRate * (1 + volatility);

    data.push({
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      rate: parseFloat(currentRate.toFixed(4)),
      fullDate: date.toISOString(),
    });
  }

  // Make sure the last value is close to the current rate
  data[data.length - 1].rate = baseRate;

  return data;
}

export function calculateRateStats(data) {
  if (!data || data.length === 0) return null;

  const rates = data.map((d) => d.rate);
  const start = rates[0];
  const current = rates[rates.length - 1];
  const high = Math.max(...rates);
  const low = Math.min(...rates);
  const change = ((current - start) / start) * 100;

  return {
    start: start.toFixed(4),
    current: current.toFixed(4),
    high: high.toFixed(4),
    low: low.toFixed(4),
    change: change.toFixed(2),
  };
}

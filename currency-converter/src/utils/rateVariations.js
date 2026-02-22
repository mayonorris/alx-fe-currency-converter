// Generate simulated rate variations for demonstration
// In production, this would fetch real historical data from an API
export function calculateRateVariations(currentRate) {
  if (!currentRate) return null;

  // Simulate historical rates with realistic variation
  const randomVariation = (min, max) => min + Math.random() * (max - min);

  const yesterdayRate = currentRate * (1 + randomVariation(-0.02, 0.02)); // ±2%
  const lastWeekRate = currentRate * (1 + randomVariation(-0.05, 0.05)); // ±5%
  const lastMonthRate = currentRate * (1 + randomVariation(-0.08, 0.08)); // ±8%
  const lastYearRate = currentRate * (1 + randomVariation(-0.15, 0.15)); // ±15%

  const calcChange = (oldRate, newRate) => {
    const percentChange = ((newRate - oldRate) / oldRate) * 100;
    const absoluteChange = newRate - oldRate;
    return {
      percent: percentChange.toFixed(2),
      absolute: absoluteChange.toFixed(4),
      isPositive: percentChange >= 0,
    };
  };

  return {
    dod: calcChange(yesterdayRate, currentRate),
    wow: calcChange(lastWeekRate, currentRate),
    mom: calcChange(lastMonthRate, currentRate),
    yoy: calcChange(lastYearRate, currentRate),
  };
}

// Calculate "Since Your Last Visit" variation
export function getLastVisitData() {
  const lastVisit = localStorage.getItem("lastVisitTimestamp");
  const lastRate = localStorage.getItem("lastVisitRate");

  return {
    timestamp: lastVisit ? new Date(lastVisit) : null,
    rate: lastRate ? parseFloat(lastRate) : null,
  };
}

export function updateLastVisit(rate) {
  localStorage.setItem("lastVisitTimestamp", new Date().toISOString());
  localStorage.setItem("lastVisitRate", rate.toString());
}

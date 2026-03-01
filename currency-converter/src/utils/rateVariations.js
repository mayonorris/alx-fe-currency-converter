import { FRANKFURTER_API } from "../services/historicalApi";

// Fetch actual historical rates for variation calculations
export async function calculateRateVariations(
  fromCurrency,
  toCurrency,
  currentRate,
) {
  if (!currentRate) return null;

  try {
    const today = new Date();

    // Calculate past dates
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const lastMonth = new Date(today);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const lastYear = new Date(today);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const formatDate = (date) => date.toISOString().split("T")[0];

    // Fetch historical rates for each period
    const [dodData, wowData, momData, yoyData] = await Promise.all([
      fetchRateForDate(fromCurrency, toCurrency, formatDate(yesterday)),
      fetchRateForDate(fromCurrency, toCurrency, formatDate(lastWeek)),
      fetchRateForDate(fromCurrency, toCurrency, formatDate(lastMonth)),
      fetchRateForDate(fromCurrency, toCurrency, formatDate(lastYear)),
    ]);

    const calcChange = (oldRate, newRate) => {
      if (!oldRate || !newRate) return null;
      const percentChange = ((newRate - oldRate) / oldRate) * 100;
      const absoluteChange = newRate - oldRate;
      return {
        percent: percentChange.toFixed(2),
        absolute: absoluteChange.toFixed(4),
        isPositive: percentChange >= 0,
      };
    };

    return {
      dod: calcChange(dodData, currentRate),
      wow: calcChange(wowData, currentRate),
      mom: calcChange(momData, currentRate),
      yoy: calcChange(yoyData, currentRate),
    };
  } catch (error) {
    console.error("Error calculating rate variations:", error);
    return null;
  }
}

async function fetchRateForDate(fromCurrency, toCurrency, date) {
  try {
    const response = await fetch(
      `https://api.frankfurter.app/${date}?from=${fromCurrency}&to=${toCurrency}`,
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.rates[toCurrency];
  } catch (error) {
    console.error(`Error fetching rate for ${date}:`, error);
    return null;
  }
}

// Get and calculate "Since Your Last Visit" variation
export function getLastVisitData(fromCurrency, toCurrency) {
  const lastVisitKey = `lastVisit_${fromCurrency}_${toCurrency}`;
  const lastVisit = localStorage.getItem(lastVisitKey);

  if (!lastVisit) return { timestamp: null, rate: null };

  const data = JSON.parse(lastVisit);
  return {
    timestamp: new Date(data.timestamp),
    rate: data.rate,
  };
}

export function updateLastVisit(fromCurrency, toCurrency, rate) {
  const lastVisitKey = `lastVisit_${fromCurrency}_${toCurrency}`;

  localStorage.setItem(
    lastVisitKey,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      rate: rate,
    }),
  );
}

export function calculateLastVisitChange(lastVisitRate, currentRate) {
  if (!lastVisitRate || !currentRate) return null;

  const percentChange = ((currentRate - lastVisitRate) / lastVisitRate) * 100;
  const absoluteChange = currentRate - lastVisitRate;

  return {
    percent: percentChange.toFixed(2),
    absolute: absoluteChange.toFixed(4),
    isPositive: percentChange >= 0,
  };
}

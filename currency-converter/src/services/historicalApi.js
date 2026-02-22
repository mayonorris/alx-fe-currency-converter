const FRANKFURTER_API = "https://api.frankfurter.app";

export async function fetchHistoricalRates(
  fromCurrency,
  toCurrency,
  months = 12,
) {
  try {
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const response = await fetch(
      `${FRANKFURTER_API}/${formatDate(startDate)}..${formatDate(endDate)}?from=${fromCurrency}&to=${toCurrency}`,
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    // Transform data into chart format
    const chartData = Object.entries(data.rates).map(([date, rates]) => ({
      date: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      rate: rates[toCurrency],
      fullDate: date,
    }));

    return chartData;
  } catch (error) {
    console.error("Historical API Error:", error);
    throw error;
  }
}

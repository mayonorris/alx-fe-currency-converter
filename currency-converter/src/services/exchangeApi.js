const API_KEY = import.meta.env.VITE_EXCHANGE_API_KEY;
const BASE_URL = "https://v6.exchangerate-api.com/v6";

export async function fetchExchangeRate(fromCurrency) {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/latest/${fromCurrency}`,
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();

    if (data.result === "error") {
      throw new Error(data["error-type"] || "Unknown API error");
    }

    return {
      base: data.base_code,
      rates: data.conversion_rates,
      lastUpdate: data.time_last_update_utc,
    };
  } catch (error) {
    console.error("Exchange API Error:", error);
    throw error;
  }
}

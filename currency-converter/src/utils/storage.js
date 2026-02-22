// Favorites
export function getFavorites() {
  try {
    const saved = localStorage.getItem("currencyFavorites");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveFavorite(from, to) {
  const favorites = getFavorites();
  const pair = `${from}-${to}`;

  if (!favorites.includes(pair)) {
    favorites.push(pair);
    localStorage.setItem("currencyFavorites", JSON.stringify(favorites));
  }
}

export function removeFavorite(from, to) {
  const favorites = getFavorites();
  const pair = `${from}-${to}`;
  const filtered = favorites.filter((f) => f !== pair);
  localStorage.setItem("currencyFavorites", JSON.stringify(filtered));
}

export function isFavorite(from, to) {
  const favorites = getFavorites();
  return favorites.includes(`${from}-${to}`);
}

// Recent Conversions
export function getRecentConversions() {
  try {
    const saved = localStorage.getItem("recentConversions");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveConversion(from, to, amount, rate, result) {
  const recent = getRecentConversions();

  const conversion = {
    id: Date.now(),
    from,
    to,
    amount,
    rate,
    result,
    timestamp: new Date().toISOString(),
  };

  // Add to beginning, keep last 10
  recent.unshift(conversion);
  const trimmed = recent.slice(0, 10);

  localStorage.setItem("recentConversions", JSON.stringify(trimmed));
}

export function clearRecentConversions() {
  localStorage.removeItem("recentConversions");
}

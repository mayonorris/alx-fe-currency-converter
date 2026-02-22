import { useState, useEffect } from "react";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Card from "./components/Card";
import ConverterCard from "./components/ConverterCard";
import FavoritePairs from "./components/FavoritePairs";
import RecentConversions from "./components/RecentConversions";
import ExchangeRateChart from "./components/ExchangeRateChart";
import {
  getFavorites,
  getRecentConversions,
  removeFavorite,
  clearRecentConversions,
} from "./utils/storage";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [recentConversions, setRecentConversions] = useState([]);

  // Shared state for chart
  const [currentPair, setCurrentPair] = useState({
    from: "USD",
    to: "EUR",
    rate: null,
  });

  useEffect(() => {
    setFavorites(getFavorites());
    setRecentConversions(getRecentConversions());
  }, []);

  const handleFavoriteChange = () => {
    setFavorites(getFavorites());
  };

  const handleRemoveFavorite = (from, to) => {
    removeFavorite(from, to);
    setFavorites(getFavorites());
  };

  const handleSelectFavorite = (from, to) => {
    console.log("Selected favorite:", from, to);
  };

  const handleClearHistory = () => {
    clearRecentConversions();
    setRecentConversions([]);
  };

  const handleRateUpdate = (from, to, rate) => {
    setCurrentPair({ from, to, rate });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setRecentConversions(getRecentConversions());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-deep)" }}>
      <Header />
      <Layout
        left={
          <>
            <ConverterCard
              onFavoriteChange={handleFavoriteChange}
              onRateUpdate={handleRateUpdate}
            />
            <FavoritePairs
              favorites={favorites}
              onSelect={handleSelectFavorite}
              onRemove={handleRemoveFavorite}
            />
            <RecentConversions
              conversions={recentConversions}
              onClear={handleClearHistory}
            />
          </>
        }
        right={
          <>
            <ExchangeRateChart
              fromCurrency={currentPair.from}
              toCurrency={currentPair.to}
              currentRate={currentPair.rate}
            />
            <Card>
              <p style={{ color: "var(--text-muted)" }}>
                ➡ Rate variations go here (Step 7)
              </p>
            </Card>
          </>
        }
      />
    </div>
  );
}

export default App;

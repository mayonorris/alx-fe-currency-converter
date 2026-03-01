import { useState, useEffect } from "react";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Card from "./components/Card";
import ConverterCard from "./components/ConverterCard";
import FavoritePairs from "./components/FavoritePairs";
import RecentConversions from "./components/RecentConversions";
import ExchangeRateChart from "./components/ExchangeRateChart";
import RateVariations from "./components/RateVariations";
import {
  getFavorites,
  getRecentConversions,
  removeFavorite,
  clearRecentConversions,
} from "./utils/storage";
import { updateLastVisit } from "./utils/rateVariations";

function App() {
  const [favorites, setFavorites] = useState([]);
  const [recentConversions, setRecentConversions] = useState([]);
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
    // Update last visit data for the selected specific currency pair
    updateLastVisit(from, to, rate);
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
            <RateVariations
              fromCurrency={currentPair.from}
              toCurrency={currentPair.to}
              currentRate={currentPair.rate}
            />
          </>
        }
      />
    </div>
  );
}

export default App;

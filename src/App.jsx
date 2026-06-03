import React, { useEffect } from 'react';
import { CloudSun, AlertCircle } from 'lucide-react';
import { useWeather } from './hooks/useWeather';
import SearchBar from './components/SearchBar';
import SearchHistory from './components/SearchHistory';
import WeatherDisplay from './components/WeatherDisplay';
import ForecastSection from './components/ForecastSection';
import WeatherDetails from './components/WeatherDetails';

export default function App() {
  const {
    weatherData,
    loading,
    error,
    searchHistory,
    fetchWeather,
    removeHistoryItem
  } = useWeather();

  // Load London by default on first load
  useEffect(() => {
    fetchWeather('London');
  }, [fetchWeather]);

  // Determine beautiful dynamic HSL theme class based on active weather state
  const getThemeClass = () => {
    if (!weatherData) return 'theme-night';

    const current = weatherData.current;
    const condition = current.condition.text.toLowerCase();
    const isDay = current.is_day === 1;

    if (!isDay) return 'theme-night';
    if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower') || condition.includes('thunderstorm')) {
      return 'theme-rainy';
    }
    if (condition.includes('snow') || condition.includes('sleet') || condition.includes('hail') || condition.includes('ice') || condition.includes('blizzard')) {
      return 'theme-snowy';
    }
    if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('mist') || condition.includes('fog')) {
      return 'theme-cloudy';
    }
    if (condition.includes('sunny') || condition.includes('clear')) {
      return 'theme-clear-day';
    }
    return 'theme-sunny';
  };

  return (
    <div className={`app-container ${getThemeClass()}`}>
      {/* Brand Header */}
      <header className="app-header z-index-up">
        <div className="brand-section">
          <CloudSun className="brand-icon" size={32} />
          <h1 className="brand-title">Skyline Weather</h1>
        </div>
        <SearchBar onSearch={fetchWeather} loading={loading} />
      </header>

      {/* History pills */}
      <SearchHistory
        history={searchHistory}
        onSelect={fetchWeather}
        onRemove={removeHistoryItem}
      />

      {/* Error State */}
      {error && (
        <div className="error-alert z-index-up">
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="loading-wrapper z-index-up">
          <div className="spinner"></div>
          <span className="loading-text">Fetching latest weather details...</span>
        </div>
      )}

      {/* Main content grid */}
      {!loading && weatherData && (
        <main className="dashboard-grid z-index-up">
          {/* Current weather left column */}
          <WeatherDisplay data={weatherData} />

          {/* Right column: Forecast & Advanced Astro Telemetry */}
          <div>
            <ForecastSection data={weatherData} />
            <WeatherDetails data={weatherData} />
          </div>
        </main>
      )}
    </div>
  );
}

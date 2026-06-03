import { useState, useEffect, useCallback } from 'react';

const API_KEY = '7e3fd0c0cd4f4506863150458260106';
const BASE_URL = 'https://api.weatherapi.com/v1';

export function useWeather() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchHistory, setSearchHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_search_history');
      return saved ? JSON.parse(saved) : ['London', 'New York', 'Tokyo', 'Sydney'];
    } catch {
      return ['London', 'New York', 'Tokyo', 'Sydney'];
    }
  });

  const fetchWeather = useCallback(async (city) => {
    if (!city || city.trim() === '') return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${BASE_URL}/forecast.json?key=${API_KEY}&q=${encodeURIComponent(city)}&days=5&aqi=yes&alerts=no`
      );

      if (!response.ok) {
        if (response.status === 400) {
          throw new Error('City not found. Please try a different city name.');
        } else {
          throw new Error('Failed to fetch weather data. Please try again.');
        }
      }

      const data = await response.json();
      setWeatherData(data);

      // Add to search history if not already present, keep max 8 items
      setSearchHistory((prev) => {
        const formattedName = data.location.name;
        const filtered = prev.filter((item) => item.toLowerCase() !== formattedName.toLowerCase());
        const updated = [formattedName, ...filtered].slice(0, 8);
        try {
          localStorage.setItem('weather_search_history', JSON.stringify(updated));
        } catch (e) {
          console.warn('Failed to save search history to localStorage', e);
        }
        return updated;
      });
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const removeHistoryItem = useCallback((cityToRemove) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.toLowerCase() !== cityToRemove.toLowerCase());
      try {
        localStorage.setItem('weather_search_history', JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save search history to localStorage', e);
      }
      return updated;
    });
  }, []);

  return {
    weatherData,
    loading,
    error,
    searchHistory,
    fetchWeather,
    removeHistoryItem
  };
}

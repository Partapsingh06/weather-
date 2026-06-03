import React from 'react';
import { Thermometer, Droplets, Wind, Sun, Eye, Activity } from 'lucide-react';

export default function WeatherDisplay({ data }) {
  if (!data) return null;

  const { location, current } = data;
  const isDay = current.is_day === 1;

  // Format time beautifully
  const formatLocalTime = (timeStr) => {
    try {
      const date = new Date(timeStr.replace(/-/g, '/'));
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return timeStr.split(' ')[1] || timeStr;
    }
  };

  // Get AQI description
  const getAqiDetails = (usEpaIndex) => {
    switch (usEpaIndex) {
      case 1: return { text: 'Good', className: 'weather-aqi-badge' };
      case 2: return { text: 'Moderate', className: 'weather-aqi-badge weather-aqi-moderate' };
      case 3: return { text: 'Unhealthy for Sensitive Groups', className: 'weather-aqi-badge weather-aqi-poor' };
      case 4: return { text: 'Unhealthy', className: 'weather-aqi-badge weather-aqi-poor' };
      case 5: return { text: 'Very Unhealthy', className: 'weather-aqi-badge weather-aqi-poor' };
      case 6: return { text: 'Hazardous', className: 'weather-aqi-badge weather-aqi-poor' };
      default: return { text: 'N/A', className: 'weather-aqi-badge' };
    }
  };

  const aqi = current.air_quality ? getAqiDetails(current.air_quality['us-epa-index']) : null;
  const weatherIconUrl = current.condition.icon.startsWith('//') 
    ? `https:${current.condition.icon}` 
    : current.condition.icon;

  return (
    <div className="current-weather-panel glass-panel z-index-up">
      {/* Location details */}
      <div className="current-header">
        <div>
          <h2 className="location-name">{location.name}</h2>
          <div className="location-region">{location.region ? `${location.region}, ` : ''}{location.country}</div>
          <div className="weather-time">Local Time: {formatLocalTime(location.localtime)}</div>
        </div>
        {aqi && (
          <div className={aqi.className}>
            <Activity size={12} />
            AQI: {aqi.text}
          </div>
        )}
      </div>

      {/* Hero Temperature Section */}
      <div className="temp-condition-section">
        <img 
          src={weatherIconUrl} 
          alt={current.condition.text} 
          className="current-weather-icon-lg"
        />
        <div className="current-temp-wrapper">
          <span className="current-temp-num">{Math.round(current.temp_c)}</span>
          <span className="current-temp-unit">°C</span>
        </div>
        <div className="current-condition-text">{current.condition.text}</div>
        <div className="current-feels-like">
          Feels like <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{Math.round(current.feelslike_c)}°C</span>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <Thermometer size={20} className="metric-icon" />
          <span className="metric-label">Feels Like</span>
          <span className="metric-value">{Math.round(current.feelslike_c)}°C</span>
          <span className="metric-subtext">Wind Chill</span>
        </div>

        <div className="metric-card">
          <Droplets size={20} className="metric-icon" />
          <span className="metric-label">Humidity</span>
          <span className="metric-value">{current.humidity}%</span>
          <span className="metric-subtext">Water Vapor</span>
        </div>

        <div className="metric-card">
          <Wind size={20} className="metric-icon" />
          <span className="metric-label">Wind Speed</span>
          <span className="metric-value">{current.wind_kph} km/h</span>
          <span className="metric-subtext">Dir: {current.wind_dir}</span>
        </div>

        <div className="metric-card">
          <Sun size={20} className="metric-icon" />
          <span className="metric-label">UV Index</span>
          <span className="metric-value">{current.uv}</span>
          <span className="metric-subtext">{current.uv <= 2 ? 'Low' : current.uv <= 5 ? 'Moderate' : 'High'}</span>
        </div>

        <div className="metric-card">
          <Eye size={20} className="metric-icon" />
          <span className="metric-label">Visibility</span>
          <span className="metric-value">{current.vis_km} km</span>
          <span className="metric-subtext">Clear air</span>
        </div>
      </div>
    </div>
  );
}

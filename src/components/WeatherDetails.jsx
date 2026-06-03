import React from 'react';
import { Sunset, Sunrise, Navigation, Compass, Gauge, CloudRain } from 'lucide-react';

export default function WeatherDetails({ data }) {
  if (!data || !data.forecast) return null;

  const current = data.current;
  const astro = data.forecast.forecastday[0].astro;

  return (
    <div className="right-column z-index-up" style={{ marginTop: '1rem' }}>
      <div className="glass-panel">
        <div className="panel-title-wrapper" style={{ marginBottom: '1.25rem' }}>
          <h3 className="panel-title">
            <Compass size={18} className="metric-icon" />
            Atmospheric & Astro Telemetry
          </h3>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <Sunrise size={20} className="metric-icon" />
            <span className="metric-label">Sunrise</span>
            <span className="metric-value">{astro.sunrise}</span>
            <span className="metric-subtext">Dawn time</span>
          </div>

          <div className="metric-card">
            <Sunset size={20} className="metric-icon" />
            <span className="metric-label">Sunset</span>
            <span className="metric-value">{astro.sunset}</span>
            <span className="metric-subtext">Dusk time</span>
          </div>

          <div className="metric-card">
            <Navigation size={20} className="metric-icon" />
            <span className="metric-label">Wind Gusts</span>
            <span className="metric-value">{current.gust_kph} km/h</span>
            <span className="metric-subtext">Peak speed</span>
          </div>

          <div className="metric-card">
            <Gauge size={20} className="metric-icon" />
            <span className="metric-label">Pressure</span>
            <span className="metric-value">{current.pressure_mb} mb</span>
            <span className="metric-subtext">{current.pressure_in} inHg</span>
          </div>

          <div className="metric-card">
            <CloudRain size={20} className="metric-icon" />
            <span className="metric-label">Precipitation</span>
            <span className="metric-value">{current.precip_mm} mm</span>
            <span className="metric-subtext">Last 24h</span>
          </div>
        </div>
      </div>
    </div>
  );
}

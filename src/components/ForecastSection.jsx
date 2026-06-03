import React from 'react';
import { CalendarDays, Clock, CloudRain } from 'lucide-react';

export default function ForecastSection({ data }) {
  if (!data || !data.forecast) return null;

  const forecastDays = data.forecast.forecastday;
  const hourlyData = forecastDays[0].hour; // Today's hourly data
  const currentEpoch = data.current.last_updated_epoch;

  // Format forecast day name
  const getDayName = (dateStr, index) => {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    const date = new Date(dateStr.replace(/-/g, '/'));
    return date.toLocaleDateString([], { weekday: 'long' });
  };

  const formatDateShort = (dateStr) => {
    const date = new Date(dateStr.replace(/-/g, '/'));
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Format hourly time (e.g., "10:00 AM")
  const formatHourTime = (timeStr) => {
    try {
      const date = new Date(timeStr.replace(/-/g, '/'));
      return date.toLocaleTimeString([], { hour: 'numeric', hour12: true });
    } catch {
      return timeStr.split(' ')[1] || timeStr;
    }
  };

  // Find max and min temperatures across all 3 days to calibrate progress bars
  const allMaxTemps = forecastDays.map((d) => d.day.maxtemp_c);
  const allMinTemps = forecastDays.map((d) => d.day.mintemp_c);
  const absoluteMax = Math.max(...allMaxTemps);
  const absoluteMin = Math.min(...allMinTemps);
  const tempRange = absoluteMax - absoluteMin || 1;

  // Filter hours to show only future hours for today, or at least reasonable upcoming hours
  const filteredHours = hourlyData.filter((hour) => {
    // Show hours from current time minus 1 hour onwards
    return hour.time_epoch >= currentEpoch - 3600;
  }).slice(0, 10); // Limit to next 10 hours for clean look

  // If we don't have enough upcoming hours, just take the last 10 hours
  const displayHours = filteredHours.length >= 4 
    ? filteredHours 
    : hourlyData.slice(12, 24); // Default to daytime hours if none match

  return (
    <div className="right-column z-index-up">
      {/* Hourly Forecast */}
      <div className="glass-panel">
        <div className="panel-title-wrapper" style={{ marginBottom: '1.25rem' }}>
          <div className="panel-title">
            <Clock size={18} className="metric-icon" />
            Hourly Forecast (Next 10 Hours)
          </div>
        </div>
        <div className="hourly-forecast-container">
          {displayHours.map((hour, idx) => {
            const isCurrent = idx === 0 && hour.time_epoch <= currentEpoch;
            const hourIconUrl = hour.condition.icon.startsWith('//') 
              ? `https:${hour.condition.icon}` 
              : hour.condition.icon;

            return (
              <div 
                key={hour.time_epoch} 
                className={`hourly-card ${isCurrent ? 'is-current' : ''}`}
              >
                <span className="hourly-time">
                  {isCurrent ? 'Now' : formatHourTime(hour.time)}
                </span>
                <img src={hourIconUrl} alt={hour.condition.text} className="hourly-icon" />
                <span className="hourly-temp">{Math.round(hour.temp_c)}°C</span>
                {hour.chance_of_rain > 0 && (
                  <span className="hourly-rain">
                    {hour.chance_of_rain}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Multi-Day Forecast */}
      <div className="glass-panel forecast-panel">
        <div className="panel-title-wrapper">
          <div className="panel-title">
            <CalendarDays size={18} className="metric-icon" />
            5-Day Weather Forecast
          </div>
        </div>

        <div className="forecast-days-list">
          {forecastDays.map((day, idx) => {
            const minTemp = day.day.mintemp_c;
            const maxTemp = day.day.maxtemp_c;
            
            // Calculate width and offset for custom bar fills
            const leftPercent = ((minTemp - absoluteMin) / tempRange) * 100;
            const widthPercent = ((maxTemp - minTemp) / tempRange) * 100;
            
            const dayIconUrl = day.day.condition.icon.startsWith('//') 
              ? `https:${day.day.condition.icon}` 
              : day.day.condition.icon;

            const rainChance = Math.max(day.day.daily_chance_of_rain, day.day.daily_chance_of_snow);

            return (
              <div key={day.date} className="forecast-day-row">
                {/* Day name */}
                <div>
                  <span className="forecast-day-name">{getDayName(day.date, idx)}</span>
                  <span className="forecast-date-str">{formatDateShort(day.date)}</span>
                </div>

                {/* Weather icon & condition */}
                <div className="forecast-condition-cell">
                  <img src={dayIconUrl} alt={day.day.condition.text} className="forecast-icon" />
                  <span className="forecast-condition-text">{day.day.condition.text}</span>
                </div>

                {/* Custom temperature bar chart */}
                <div className="temp-bar-container">
                  <span className="temp-bar-val min">{Math.round(minTemp)}°</span>
                  <div className="temp-bar-progress-bg">
                    <div 
                      className="temp-bar-progress-fill" 
                      style={{ 
                        left: `${leftPercent}%`, 
                        width: `${widthPercent || 2}%` 
                      }}
                    ></div>
                  </div>
                  <span className="temp-bar-val">{Math.round(maxTemp)}°</span>
                </div>

                {/* Rain percentage */}
                <div className="forecast-chance-rain">
                  {rainChance > 10 && (
                    <>
                      <CloudRain size={13} />
                      {rainChance}%
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Cloud, Sun, Wind, Droplets, Eye, Thermometer } from 'lucide-react';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  location: string;
  delayRisk: number;
  factors: string[];
}

interface WeatherWidgetProps {
  lat: number;
  lon: number;
}

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export function WeatherWidget({ lat, lon }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/weather/current?lat=${lat}&lon=${lon}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setWeather(data.data);
          }
        }
      } catch (error) {
        console.error('Failed to fetch weather:', error);
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon) {
      fetchWeather();
    }
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="glass-card p-4 rounded-xl animate-pulse">
        <div className="h-4 bg-white/20 rounded w-24 mb-2"></div>
        <div className="h-8 bg-white/20 rounded w-16"></div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="glass-card p-4 rounded-xl text-white/60 text-sm">
        Weather data unavailable
      </div>
    );
  }

  const getWeatherIcon = () => {
    const desc = weather.description.toLowerCase();
    if (desc.includes('rain') || desc.includes('cloud')) return <Cloud className="w-8 h-8 text-blue-400" />;
    return <Sun className="w-8 h-8 text-amber-400" />;
  };

  return (
    <div className="glass-card p-4 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {getWeatherIcon()}
          <div>
            <div className="text-lg font-semibold text-white">{weather.temperature}°C</div>
            <div className="text-xs text-white/60 capitalize">{weather.description}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/60">{weather.location}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 text-xs">
        <div className="flex items-center gap-1 text-white/70">
          <Wind className="w-3 h-3" />
          <span>{weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center gap-1 text-white/70">
          <Droplets className="w-3 h-3" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1 text-white/70">
          <Eye className="w-3 h-3" />
          <span>{(weather.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>

      {weather.delayRisk > 0 && (
        <div className="mt-3 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-amber-300">
              Weather delay risk: {weather.delayRisk}%
            </span>
          </div>
          {weather.factors.length > 0 && (
            <ul className="mt-1 text-xs text-white/60 list-disc list-inside">
              {weather.factors.map((factor, i) => (
                <li key={i}>{factor}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

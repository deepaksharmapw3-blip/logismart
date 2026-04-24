import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  visibility: number;
  location: string;
  coordinates: { lat: number; lon: number };
}

export interface WeatherAlert {
  event: string;
  description: string;
  start: number;
  end: number;
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherData | null> {
  if (!API_KEY) {
    console.warn('OpenWeather API key not configured');
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    const data = response.data;
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0]?.description || 'Unknown',
      icon: data.weather[0]?.icon || '01d',
      windSpeed: data.wind?.speed || 0,
      visibility: data.visibility || 0,
      location: data.name || `${lat},${lon}`,
      coordinates: { lat, lon },
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return null;
  }
}

export async function getWeatherForecast(
  lat: number,
  lon: number
): Promise<WeatherData[] | null> {
  if (!API_KEY) {
    console.warn('OpenWeather API key not configured');
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return response.data.list.map((item: any) => ({
      temperature: Math.round(item.main.temp),
      feelsLike: Math.round(item.main.feels_like),
      humidity: item.main.humidity,
      description: item.weather[0]?.description || 'Unknown',
      icon: item.weather[0]?.icon || '01d',
      windSpeed: item.wind?.speed || 0,
      visibility: item.visibility || 0,
      location: response.data.city?.name || `${lat},${lon}`,
      coordinates: { lat, lon },
    }));
  } catch (error) {
    console.error('Weather forecast API error:', error);
    return null;
  }
}

// Calculate weather impact on shipment delay
export function calculateWeatherImpact(weather: WeatherData): {
  delayRisk: number;
  factors: string[];
} {
  let delayRisk = 0;
  const factors: string[] = [];

  // Temperature extremes
  if (weather.temperature > 40 || weather.temperature < -10) {
    delayRisk += 15;
    factors.push(`Extreme temperature: ${weather.temperature}°C`);
  }

  // High wind
  if (weather.windSpeed > 15) {
    delayRisk += 20;
    factors.push(`High wind speed: ${weather.windSpeed} m/s`);
  }

  // Poor visibility
  if (weather.visibility < 1000) {
    delayRisk += 25;
    factors.push(`Poor visibility: ${(weather.visibility / 1000).toFixed(1)}km`);
  }

  // Weather conditions
  const severeWeather = ['thunderstorm', 'heavy rain', 'snow', 'blizzard', 'fog'];
  const desc = weather.description.toLowerCase();
  if (severeWeather.some(w => desc.includes(w))) {
    delayRisk += 30;
    factors.push(`Severe weather: ${weather.description}`);
  }

  // High humidity with heat
  if (weather.humidity > 80 && weather.temperature > 30) {
    delayRisk += 10;
    factors.push('High humidity affecting road conditions');
  }

  return {
    delayRisk: Math.min(delayRisk, 100),
    factors,
  };
}

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentWeather = getCurrentWeather;
exports.getWeatherForecast = getWeatherForecast;
exports.calculateWeatherImpact = calculateWeatherImpact;
const axios_1 = __importDefault(require("axios"));
const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
function getCurrentWeather(lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        if (!API_KEY) {
            console.warn('OpenWeather API key not configured');
            return null;
        }
        try {
            const response = yield axios_1.default.get(`${BASE_URL}/weather`, {
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
                description: ((_a = data.weather[0]) === null || _a === void 0 ? void 0 : _a.description) || 'Unknown',
                icon: ((_b = data.weather[0]) === null || _b === void 0 ? void 0 : _b.icon) || '01d',
                windSpeed: ((_c = data.wind) === null || _c === void 0 ? void 0 : _c.speed) || 0,
                visibility: data.visibility || 0,
                location: data.name || `${lat},${lon}`,
                coordinates: { lat, lon },
            };
        }
        catch (error) {
            console.error('Weather API error:', error);
            return null;
        }
    });
}
function getWeatherForecast(lat, lon) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!API_KEY) {
            console.warn('OpenWeather API key not configured');
            return null;
        }
        try {
            const response = yield axios_1.default.get(`${BASE_URL}/forecast`, {
                params: {
                    lat,
                    lon,
                    appid: API_KEY,
                    units: 'metric',
                },
            });
            return response.data.list.map((item) => {
                var _a, _b, _c, _d;
                return ({
                    temperature: Math.round(item.main.temp),
                    feelsLike: Math.round(item.main.feels_like),
                    humidity: item.main.humidity,
                    description: ((_a = item.weather[0]) === null || _a === void 0 ? void 0 : _a.description) || 'Unknown',
                    icon: ((_b = item.weather[0]) === null || _b === void 0 ? void 0 : _b.icon) || '01d',
                    windSpeed: ((_c = item.wind) === null || _c === void 0 ? void 0 : _c.speed) || 0,
                    visibility: item.visibility || 0,
                    location: ((_d = response.data.city) === null || _d === void 0 ? void 0 : _d.name) || `${lat},${lon}`,
                    coordinates: { lat, lon },
                });
            });
        }
        catch (error) {
            console.error('Weather forecast API error:', error);
            return null;
        }
    });
}
// Calculate weather impact on shipment delay
function calculateWeatherImpact(weather) {
    let delayRisk = 0;
    const factors = [];
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

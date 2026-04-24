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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const weather_1 = require("../services/weather");
const router = (0, express_1.Router)();
// GET /api/weather/current?lat=...&lon=...
router.get('/current', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({
            success: false,
            error: 'Latitude and longitude are required',
            timestamp: new Date().toISOString(),
        });
    }
    const weather = yield (0, weather_1.getCurrentWeather)(Number(lat), Number(lon));
    if (!weather) {
        return res.status(503).json({
            success: false,
            error: 'Weather data unavailable',
            timestamp: new Date().toISOString(),
        });
    }
    const impact = (0, weather_1.calculateWeatherImpact)(weather);
    const response = {
        success: true,
        data: Object.assign(Object.assign({}, weather), impact),
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
// GET /api/weather/forecast?lat=...&lon=...
router.get('/forecast', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
        return res.status(400).json({
            success: false,
            error: 'Latitude and longitude are required',
            timestamp: new Date().toISOString(),
        });
    }
    const forecast = yield (0, weather_1.getWeatherForecast)(Number(lat), Number(lon));
    if (!forecast) {
        return res.status(503).json({
            success: false,
            error: 'Weather forecast unavailable',
            timestamp: new Date().toISOString(),
        });
    }
    const response = {
        success: true,
        data: forecast,
        timestamp: new Date().toISOString(),
    };
    res.json(response);
}));
exports.default = router;

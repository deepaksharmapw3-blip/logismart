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
exports.generateAIPrediction = generateAIPrediction;
const openai_1 = __importDefault(require("openai"));
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.warn('OPENAI_API_KEY not found in environment variables');
}
const openai = new openai_1.default({
    apiKey: apiKey || 'dummy-key',
});
function generateAIPrediction(origin, destination, currentLocation, eta, weather) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        console.log('OpenAI: Starting prediction for route:', origin, '->', destination);
        if (!apiKey || apiKey === 'dummy-key') {
            console.warn('OpenAI API key not configured, using fallback prediction');
            return null;
        }
        try {
            console.log('OpenAI: Calling API...');
            let weatherContext = '';
            if (weather) {
                weatherContext = `\nCurrent Weather Conditions at ${currentLocation}:\n` +
                    `- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)\n` +
                    `- Conditions: ${weather.description}\n` +
                    `- Wind Speed: ${weather.windSpeed} m/s\n` +
                    `- Visibility: ${(weather.visibility / 1000).toFixed(1)} km\n` +
                    `- Humidity: ${weather.humidity}%`;
            }
            const response = yield openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: `You are a supply chain risk analysis AI. Analyze shipment routes and provide delay risk assessments.
          Consider weather conditions heavily in your analysis.
          Respond ONLY with a JSON object in this exact format:
          {
            "riskScore": number (0-100),
            "riskLevel": "low" | "medium" | "high",
            "estimatedDelay": "X-Y mins",
            "contributingFactors": ["factor1", "factor2", "factor3"],
            "explanation": "detailed explanation of the risk assessment",
            "decisionSuggestion": "specific action to take"
          }`
                    },
                    {
                        role: 'user',
                        content: `Analyze this shipment route:
          - Origin: ${origin}
          - Destination: ${destination}
          - Current Location: ${currentLocation}
          - Estimated Arrival: ${eta}
          ${weatherContext}
          
          Provide a comprehensive risk assessment including risk score, contributing factors, explanation, and decision suggestion. If weather data is provided, factor it into the risk score significantly.`
                    }
                ],
                temperature: 0.7,
                max_tokens: 500,
            });
            console.log('OpenAI: Response received');
            const content = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content;
            if (!content) {
                console.error('OpenAI returned empty content');
                return null;
            }
            console.log('OpenAI: Raw response:', content.substring(0, 200));
            // Parse JSON from response
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                console.error('Could not parse JSON from OpenAI response:', content);
                return null;
            }
            const result = JSON.parse(jsonMatch[0]);
            console.log('OpenAI: Parsed result:', result);
            // Validate the response
            if (typeof result.riskScore !== 'number' || result.riskScore < 0 || result.riskScore > 100) {
                console.error('Invalid risk score from OpenAI:', result.riskScore);
                return null;
            }
            console.log('OpenAI: Prediction successful - Risk:', result.riskScore, 'Level:', result.riskLevel);
            return result;
        }
        catch (error) {
            console.error('OpenAI API error:', error);
            return null;
        }
    });
}

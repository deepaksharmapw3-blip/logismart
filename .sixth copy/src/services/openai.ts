import OpenAI from 'openai';
import type { WeatherData } from './weather';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('OPENAI_API_KEY not found in environment variables');
}

const openai = new OpenAI({
  apiKey: apiKey || 'dummy-key',
});

export interface AIPredictionResult {
  riskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  estimatedDelay: string;
  contributingFactors: string[];
  explanation: string;
  decisionSuggestion: string;
  weatherImpact?: {
    delayRisk: number;
    factors: string[];
  };
}

export async function generateAIPrediction(
  origin: string,
  destination: string,
  currentLocation: string,
  eta: string,
  weather?: WeatherData | null
): Promise<AIPredictionResult | null> {
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
    
    const response = await openai.chat.completions.create({
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
    const content = response.choices[0]?.message?.content;
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

    const result = JSON.parse(jsonMatch[0]) as AIPredictionResult;
    console.log('OpenAI: Parsed result:', result);
    
    // Validate the response
    if (typeof result.riskScore !== 'number' || result.riskScore < 0 || result.riskScore > 100) {
      console.error('Invalid risk score from OpenAI:', result.riskScore);
      return null;
    }

    console.log('OpenAI: Prediction successful - Risk:', result.riskScore, 'Level:', result.riskLevel);
    return result;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null;
  }
}

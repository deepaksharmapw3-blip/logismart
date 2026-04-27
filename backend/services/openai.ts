import OpenAI from 'openai';
import dotenv from 'dotenv';
import type { WeatherData } from './weather';

// Ensure environment variables are loaded
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️ OPENAI_API_KEY not found in environment variables. AI features will be disabled.');
}

// Create OpenAI client - use a helper to ensure we're using the latest key
const createOpenAIClient = () => {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy-key',
  });
};

const openai = createOpenAIClient();

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

export interface AIDecisionResult {
  shipmentId: string;
  decision: string;
  rationale: string;
  actions: string[];
  impact: string;
}

export interface AIRecommendation {
  type: 'route' | 'operational' | 'strategic';
  title: string;
  description: string;
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high';
}

export interface AISystemInsights {
  summary: string;
  bottlenecks: {
    location: string;
    impact: string;
    suggestion: string;
  }[];
  efficiencyScore: number;
  strategicAdvice: string;
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

export async function getAIDecision(
  shipmentId: string,
  shipmentData: any
): Promise<AIDecisionResult | null> {
  console.log('OpenAI: Generating decision for shipment:', shipmentId);

  if (!apiKey || apiKey === 'dummy-key') return null;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a senior supply chain consultant. Provide a professional decision and action plan for the given shipment data. Respond with JSON.'
        },
        {
          role: 'user',
          content: `Data: ${JSON.stringify(shipmentData)}\nGenerate a decision, rationale, action items, and expected impact. Format as JSON: { "decision": "...", "rationale": "...", "actions": ["...", "..."], "impact": "..." }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return { shipmentId, ...result };
  } catch (error) {
    console.error('getAIDecision error:', error);
    return null;
  }
}

export async function getAIRecommendations(): Promise<AIRecommendation[]> {
  console.log('OpenAI: Generating system-wide recommendations');

  if (!apiKey || apiKey === 'dummy-key') return [];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a logistics optimization AI. Provide proactive recommendations for supply chain improvement. Respond with a JSON object containing a "recommendations" key with an array of 3 recommendation objects.'
        },
        {
          role: 'user',
          content: 'Generate 3 recommendations for a supply chain experiencing weather-related delays and port congestion. Format as JSON: { "recommendations": [{ "type": "route" | "operational" | "strategic", "title": "...", "description": "...", "expectedBenefit": "...", "priority": "high" | "medium" | "low" }] }'
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content || '{"recommendations": []}';
    const data = JSON.parse(content);
    return data.recommendations || [];
  } catch (error) {
    console.error('getAIRecommendations error:', error);
    return [];
  }
}

export async function getAISystemInsights(systemStats: any): Promise<AISystemInsights | null> {
  console.log('OpenAI: Generating strategic system insights');

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'dummy-key') {
    console.warn('OpenAI: API key not configured, returning fallback insights');
    return getFallbackInsights();
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a strategic supply chain analyst. Analyze the system statistics and provide high-level insights. Respond with a JSON object.'
        },
        {
          role: 'user',
          content: `Stats: ${JSON.stringify(systemStats)}\nProvide a summary, bottleneck analysis, overall efficiency score (0-100), and strategic advice. Format as JSON: { "summary": "...", "bottlenecks": [{ "location": "...", "impact": "...", "suggestion": "..." }], "efficiencyScore": 85, "strategicAdvice": "..." }`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      console.error('OpenAI: Received empty content in completion');
      return getFallbackInsights();
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI: getAISystemInsights error:', error);
    return getFallbackInsights();
  }
}

function getFallbackInsights(): AISystemInsights {
  return {
    summary: "System is performing within normal parameters. Real-time AI analysis is currently unavailable.",
    bottlenecks: [
      {
        location: "System-wide",
        impact: "Variable",
        suggestion: "Monitor traffic patterns and weather alerts manually."
      }
    ],
    efficiencyScore: 82,
    strategicAdvice: "Consider diversifying delivery routes during peak periods to mitigate potential delays."
  };
}

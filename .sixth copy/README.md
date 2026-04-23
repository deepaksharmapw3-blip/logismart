# SupplySense AI Backend

Predictive Supply Chain Intelligence Backend API built with Node.js, Express, and TypeScript.

## Features

- **Shipments Management** - CRUD operations for shipments with real-time tracking
- **Delay Predictions** - AI-powered delay risk predictions
- **Route Optimization** - Smart route suggestions with time savings
- **Alert System** - Real-time notifications for delays and optimizations
- **Analytics Dashboard** - Performance metrics and bottleneck detection

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Security**: Helmet, CORS
- **Logging**: Morgan

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or pnpm

### Installation

1. Install dependencies:
```bash
npm install
# or
pnpm install
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update the `.env` file with your secrets:
- `PORT` — server port
- `FRONTEND_URL` — allowed frontend origin for CORS
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY` — OpenAI API key
- `GOOGLE_MAPS_API_KEY` — public Google Maps key for frontend map rendering
- `OPENWEATHER_API_KEY` — OpenWeather API key

4. Start the development server:
```bash
npm run dev
# or
pnpm dev
```

The server will start on `http://localhost:3001`
## Deploying to Render

Use a Render Web Service for the backend and configure the service as follows:

- Root Directory: `.sixth copy`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`
- Health Check Path: `/health`

Add the required environment variables in Render settings:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `OPENWEATHER_API_KEY`
- `FRONTEND_URL`

Render will provide `PORT` automatically, and the app is already configured to use `process.env.PORT`.
### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Shipments
- `GET /api/shipments` - List all shipments
- `GET /api/shipments/:id` - Get shipment by ID
- `POST /api/shipments` - Create new shipment
- `PATCH /api/shipments/:id` - Update shipment
- `DELETE /api/shipments/:id` - Delete shipment
- `GET /api/shipments/:id/location` - Get shipment location

### Predictions
- `GET /api/predictions` - All delay predictions
- `GET /api/predictions/high-risk` - High-risk predictions only
- `GET /api/predictions/:shipmentId` - Prediction for specific shipment
- `GET /api/predictions/stats/summary` - Prediction statistics

### Routes
- `GET /api/routes/optimizations` - All route optimizations
- `GET /api/routes/optimizations/:shipmentId` - Optimization for shipment
- `POST /api/routes/apply` - Apply optimized route
- `GET /api/routes/savings` - Total potential savings

### Alerts
- `GET /api/alerts` - All alerts
- `GET /api/alerts/unread` - Unread alerts only
- `GET /api/alerts/count` - Alert counts summary
- `POST /api/alerts` - Create new alert
- `DELETE /api/alerts/:id` - Dismiss alert
- `PATCH /api/alerts/:id/read` - Mark alert as read
- `PATCH /api/alerts/read-all` - Mark all as read

### Analytics
- `GET /api/analytics` - All analytics data
- `GET /api/analytics/dashboard` - Dashboard summary
- `GET /api/analytics/trends` - Delivery trends
- `GET /api/analytics/delay-reasons` - Delay reasons breakdown
- `GET /api/analytics/route-performance` - Route performance
- `GET /api/analytics/bottlenecks` - Bottleneck data
- `GET /api/analytics/stats` - Key statistics
- `GET /api/analytics/performance` - Performance metrics

## Data Models

### Shipment
```typescript
{
  id: string;
  origin: string;
  destination: string;
  status: 'on-time' | 'at-risk' | 'delayed';
  eta: string;
  currentLocation: string;
  delayProbability: number;
  location: { lat: number; lng: number };
  destination_coords: { lat: number; lng: number };
}
```

### Delay Prediction
```typescript
{
  shipmentId: string;
  delayProbability: number;
  estimatedDelay: string;
  reasons: string[];
  riskLevel: 'low' | 'medium' | 'high';
  currentLocation: string;
}
```

### Route Optimization
```typescript
{
  shipmentId: string;
  currentRoute: Route;
  suggestedRoute: Route;
}
```

### Alert
```typescript
{
  id: string;
  type: 'delay' | 'route-change' | 'success' | 'info';
  title: string;
  message: string;
  shipmentId: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high';
}
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
.sixth/
├── src/
│   ├── data/
│   │   └── store.ts          # In-memory data store
│   ├── routes/
│   │   ├── shipments.ts      # Shipment routes
│   │   ├── predictions.ts    # Prediction routes
│   │   ├── routes.ts         # Route optimization routes
│   │   ├── alerts.ts         # Alert routes
│   │   └── analytics.ts      # Analytics routes
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   └── server.ts             # Express server entry
├── package.json
├── tsconfig.json
└── README.md
```

## License

MIT

# SupplySense AI - User Guide

## How Users Can Use Your Project

### 1. Viewing Data (Already Working)
Users can currently view:
- **Shipments**: List of all active shipments with real-time tracking
- **Delay Predictions**: AI-powered predictions showing which shipments are at risk
- **Route Optimizations**: Smart route suggestions to minimize delays
- **Alerts**: System notifications about delays and route changes
- **Analytics**: Performance dashboards with charts and insights

### 2. Creating Data (New Feature Added)
Users can now **add new shipments** through the UI:

#### Steps to Add a Shipment:
1. Go to the **Overview** tab
2. Click the **"+ Add New Shipment"** button
3. Fill in the form:
   - **Origin**: Where the shipment starts (e.g., "Los Angeles, CA")
   - **Destination**: Where it's going (e.g., "San Francisco, CA")
   - **ETA**: Estimated arrival time (e.g., "4:30 PM")
   - **Current Location**: Current position (e.g., "Bakersfield, CA")
   - **Coordinates**: Latitude and longitude for current and destination locations
4. Click **"Create Shipment"**

### 3. Managing Data
Users can also:
- **Dismiss Alerts**: Click the X on any alert to remove it
- **Apply Route Optimizations**: In the Routes tab, click "Apply Route" to use suggested routes
- **View Shipment Details**: Click on any shipment to see more information

### 4. API Endpoints (For Developers)
Your backend provides these REST API endpoints:

```
GET    /api/shipments              - List all shipments
POST   /api/shipments              - Create new shipment
GET    /api/shipments/:id          - Get shipment by ID
PATCH  /api/shipments/:id          - Update shipment
DELETE /api/shipments/:id          - Delete shipment

GET    /api/predictions            - Get all delay predictions
GET    /api/routes/optimizations   - Get route optimizations
POST   /api/routes/apply           - Apply optimized route

GET    /api/alerts                 - Get all alerts
POST   /api/alerts                 - Create new alert
DELETE /api/alerts/:id             - Dismiss alert

GET    /api/analytics              - Get analytics data
GET    /health                     - Health check
```

### 5. Data Storage
- All data is stored in **Supabase PostgreSQL database**
- Data persists even after server restart
- Multiple users can access the same data

### 6. Future Enhancements You Can Add
To make it even better, consider adding:
- **User Authentication**: Login/signup system
- **Shipment Editing**: Update existing shipments
- **Bulk Import**: Upload CSV files with multiple shipments
- **Export Data**: Download reports as PDF/Excel
- **Real-time Updates**: WebSocket for live tracking
- **Mobile App**: React Native app for on-the-go access

---

## Quick Start for Users

1. Open http://localhost:5173 in your browser
2. Navigate through tabs using the navigation bar
3. Add shipments using the "+ Add New Shipment" button
4. Monitor predictions and optimize routes
5. Check analytics for performance insights

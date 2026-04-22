-- Supabase Schema for SupplySense AI
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Shipments table
CREATE TABLE IF NOT EXISTS shipments (
    id TEXT PRIMARY KEY,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('on-time', 'at-risk', 'delayed')),
    eta TEXT NOT NULL,
    current_location TEXT NOT NULL,
    delay_probability INTEGER NOT NULL DEFAULT 0 CHECK (delay_probability >= 0 AND delay_probability <= 100),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    destination_lat DECIMAL(10, 8) NOT NULL,
    destination_lng DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delay predictions table
CREATE TABLE IF NOT EXISTS delay_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    delay_probability INTEGER NOT NULL CHECK (delay_probability >= 0 AND delay_probability <= 100),
    estimated_delay TEXT NOT NULL,
    reasons TEXT[] DEFAULT '{}',
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high')),
    current_location TEXT NOT NULL,
    predicted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route optimizations table
CREATE TABLE IF NOT EXISTS route_optimizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    current_route_name TEXT NOT NULL,
    current_route_distance TEXT NOT NULL,
    current_route_time TEXT NOT NULL,
    current_route_savings TEXT NOT NULL DEFAULT '0 min',
    current_route_traffic TEXT NOT NULL CHECK (current_route_traffic IN ('low', 'medium', 'high')),
    current_route_recommended BOOLEAN DEFAULT FALSE,
    suggested_route_name TEXT NOT NULL,
    suggested_route_distance TEXT NOT NULL,
    suggested_route_time TEXT NOT NULL,
    suggested_route_savings TEXT NOT NULL,
    suggested_route_traffic TEXT NOT NULL CHECK (suggested_route_traffic IN ('low', 'medium', 'high')),
    suggested_route_recommended BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alerts table
CREATE TABLE IF NOT EXISTS alerts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('delay', 'route-change', 'success', 'info')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    shipment_id TEXT NOT NULL REFERENCES shipments(id) ON DELETE CASCADE,
    timestamp TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics delivery trends table
CREATE TABLE IF NOT EXISTS delivery_trends (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day TEXT NOT NULL,
    on_time INTEGER NOT NULL DEFAULT 0,
    delayed INTEGER NOT NULL DEFAULT 0,
    at_risk INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Delay reasons table
CREATE TABLE IF NOT EXISTS delay_reasons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    value INTEGER NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route performance table
CREATE TABLE IF NOT EXISTS route_performance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route TEXT NOT NULL,
    avg_delay INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bottlenecks table
CREATE TABLE IF NOT EXISTS bottlenecks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL,
    delay INTEGER NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    change TEXT NOT NULL,
    trend TEXT NOT NULL CHECK (trend IN ('up', 'down')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipments_delay_probability ON shipments(delay_probability);
CREATE INDEX IF NOT EXISTS idx_predictions_shipment_id ON delay_predictions(shipment_id);
CREATE INDEX IF NOT EXISTS idx_predictions_risk_level ON delay_predictions(risk_level);
CREATE INDEX IF NOT EXISTS idx_routes_shipment_id ON route_optimizations(shipment_id);
CREATE INDEX IF NOT EXISTS idx_alerts_shipment_id ON alerts(shipment_id);
CREATE INDEX IF NOT EXISTS idx_alerts_read ON alerts(read);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data

-- Sample shipments
INSERT INTO shipments (id, origin, destination, status, eta, current_location, delay_probability, location_lat, location_lng, destination_lat, destination_lng)
VALUES
    ('SH2547', 'Los Angeles, CA', 'San Francisco, CA', 'delayed', '4:30 PM', 'Bakersfield, CA', 85, 45.0, 35.0, 20.0, 70.0),
    ('SH2548', 'Seattle, WA', 'Portland, OR', 'at-risk', '2:15 PM', 'Tacoma, WA', 68, 25.0, 55.0, 30.0, 80.0),
    ('SH2549', 'Phoenix, AZ', 'Las Vegas, NV', 'on-time', '3:45 PM', 'Kingman, AZ', 22, 60.0, 40.0, 65.0, 25.0),
    ('SH2550', 'Denver, CO', 'Salt Lake City, UT', 'on-time', '5:00 PM', 'Vail, CO', 15, 35.0, 65.0, 50.0, 85.0),
    ('SH2551', 'Austin, TX', 'Houston, TX', 'at-risk', '6:20 PM', 'Columbus, TX', 72, 70.0, 50.0, 75.0, 75.0)
ON CONFLICT (id) DO NOTHING;

-- Sample delay predictions
INSERT INTO delay_predictions (shipment_id, delay_probability, estimated_delay, reasons, risk_level, current_location)
VALUES
    ('SH2547', 85, '25-30 mins', ARRAY['Heavy Traffic', 'Road Construction', 'Peak Hour'], 'high', 'Bakersfield, CA'),
    ('SH2548', 68, '15-20 mins', ARRAY['Weather Conditions', 'Traffic'], 'medium', 'Tacoma, WA'),
    ('SH2551', 72, '18-22 mins', ARRAY['Warehouse Delay', 'Traffic Congestion'], 'high', 'Columbus, TX')
ON CONFLICT DO NOTHING;

-- Sample route optimizations
INSERT INTO route_optimizations (
    shipment_id, 
    current_route_name, current_route_distance, current_route_time, current_route_savings, current_route_traffic, current_route_recommended,
    suggested_route_name, suggested_route_distance, suggested_route_time, suggested_route_savings, suggested_route_traffic, suggested_route_recommended
)
VALUES
    ('SH2547', 'Route A (I-5)', '285 miles', '4h 45m', '0 min', 'high', false, 'Route B (CA-99)', '295 miles', '4h 20m', '25 min', 'low', true),
    ('SH2548', 'Route C (I-405)', '175 miles', '3h 10m', '0 min', 'medium', false, 'Route D (WA-167)', '182 miles', '2h 52m', '18 min', 'low', true)
ON CONFLICT DO NOTHING;

-- Sample alerts
INSERT INTO alerts (id, type, title, message, shipment_id, timestamp, priority, read)
VALUES
    ('alert-1', 'delay', 'Delay Detected', 'Heavy traffic on Route A causing 25-minute delay', 'SH2547', '2 mins ago', 'high', false),
    ('alert-2', 'route-change', 'Route Optimization Available', 'Alternate route can save 18 minutes', 'SH2548', '5 mins ago', 'medium', false)
ON CONFLICT (id) DO NOTHING;

-- Sample delivery trends
INSERT INTO delivery_trends (day, on_time, delayed, at_risk)
VALUES
    ('Mon', 45, 8, 12),
    ('Tue', 52, 6, 10),
    ('Wed', 48, 10, 15),
    ('Thu', 60, 5, 8),
    ('Fri', 55, 7, 11),
    ('Sat', 38, 4, 6),
    ('Sun', 42, 3, 5)
ON CONFLICT DO NOTHING;

-- Sample delay reasons
INSERT INTO delay_reasons (name, value, color)
VALUES
    ('Traffic', 35, '#ef4444'),
    ('Weather', 25, '#f59e0b'),
    ('Warehouse', 20, '#8b5cf6'),
    ('Vehicle', 12, '#3b82f6'),
    ('Other', 8, '#6b7280')
ON CONFLICT DO NOTHING;

-- Sample route performance
INSERT INTO route_performance (route, avg_delay)
VALUES
    ('Route A', 25),
    ('Route B', 18),
    ('Route C', 32),
    ('Route D', 15),
    ('Route E', 28)
ON CONFLICT DO NOTHING;

-- Sample bottlenecks
INSERT INTO bottlenecks (location, delay, severity)
VALUES
    ('LA Warehouse', 45, 'high'),
    ('I-5 North', 32, 'high'),
    ('Denver Hub', 28, 'medium'),
    ('Phoenix Center', 18, 'medium'),
    ('Seattle Port', 12, 'low')
ON CONFLICT DO NOTHING;

-- Sample stats
INSERT INTO stats (label, value, change, trend)
VALUES
    ('Total Shipments', '1,247', '+12.5%', 'up'),
    ('On-Time Delivery', '94.2%', '+3.2%', 'up'),
    ('Avg Delay Time', '23 min', '-8.4%', 'down'),
    ('Critical Issues', '8', '-50%', 'down')
ON CONFLICT DO NOTHING;

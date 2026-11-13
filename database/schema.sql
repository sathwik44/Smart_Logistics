DROP TABLE IF EXISTS deliveries;
DROP TABLE IF EXISTS routes;
DROP TABLE IF EXISTS vehicles;

CREATE TABLE vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_number VARCHAR(50) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'Idle',
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6)
);

CREATE TABLE routes (
    id SERIAL PRIMARY KEY,
    source VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    distance_km INT NOT NULL,
    eta_hours DECIMAL(4,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
    source_latitude DECIMAL(9,6),
    source_longitude DECIMAL(9,6),
    destination_latitude DECIMAL(9,6),
    destination_longitude DECIMAL(9,6)
);

CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    vehicle_id INT REFERENCES vehicles(id),
    route_id INT REFERENCES routes(id),
    goods VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending'
);

INSERT INTO vehicles (vehicle_number, vehicle_type, status, latitude, longitude) VALUES 
('PB-01-A-1234', 'Truck', 'In Transit', 29.3909, 76.9755),
('DL-4C-5678', 'Van', 'Idle', 28.6139, 77.2090),
('MH-12-EF-9012', 'Heavy Truck', 'Maintenance', 19.0760, 72.8777);

INSERT INTO routes (source, destination, distance_km, eta_hours, status, source_latitude, source_longitude, destination_latitude, destination_longitude) VALUES 
('Delhi', 'Chandigarh', 250, 4.5, 'Active', 28.6139, 77.2090, 30.7333, 76.7794),
('Mumbai', 'Pune', 150, 3.0, 'Active', 19.0760, 72.8777, 18.5204, 73.8567);

INSERT INTO deliveries (vehicle_id, route_id, goods, status) VALUES 
(1, 1, 'Medical Supplies', 'In Transit'),
(2, 2, 'Electronics', 'Pending');
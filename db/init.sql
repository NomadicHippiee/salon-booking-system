DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS stylists;

CREATE TABLE stylists (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    bio TEXT,
    specialties VARCHAR(255),
    working_hours_start TIME DEFAULT '09:00:00',
    working_hours_end TIME DEFAULT '18:00:00',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20),
    customer_email VARCHAR(255),
    stylist_id INT NOT NULL REFERENCES stylists(id),
    service_id INT NOT NULL REFERENCES services(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(stylist_id, booking_date, start_time)

);

INSERT INTO stylists (name, bio, specialties, working_hours_start, working_hours_end)
VALUES
('Maria', 'Expert in color and highlights', 'Color, Highlights, Treatments', '09:00:00', '18:00:00'),
('Sofia', 'Specialist in cuts and styling', 'Cuts, Styling, Blow-dry', '10:00:00', '19:00:00'),
('Anna', 'Natural hairstylist', 'Braids, Natural styles, Treatments', '08:00:00', '17:00:00'),
('Elena', 'Bridal and event specialist', 'Bridal, Events, Updos', '11:00:00', '20:00:00');

INSERT INTO services (name, description, duration_minutes, price) VALUES
('Haircut - Men', 'Classic or modern mens haircut', 30, 35.00),
('Haircut - Women', 'Womens haircut with styling', 45, 55.00),
('Hair Color', 'Full head color service', 90, 80.00),
('Highlights / Stripes', 'Partial highligths or stripes', 75, 65.00),
('Hair Treatment', 'Deep conditioning treatment', 45, 45.00),
('Blow-dry & Styling', 'Professional blow-dry and styling', 30, 40.00),
('Bridal Updo', 'Bridal or special event updo', 60, 85.00),
('Balayage', 'Balayage color technique', 120, 100.00),
('Hair Repair', 'Keratin or protein treatment', 50, 55.00),
('Beard Trim & Shape', 'Beard grooming and shaping', 20, 25.00);

INSERT INTO bookings (customer_name, customer_phone, customer_email, stylist_id, service_id, booking_date, start_time, status)
VALUES
  ('John Doe', '555-1234', 'john@example.com', 1, 1, '2026-07-20', '09:00:00', 'pending'),
  ('Jane Smith', '555-5678', 'jane@example.com', 2, 2, '2026-07-20', '10:00:00', 'confirmed'),
  ('Bob Johnson', '555-9999', 'bob@example.com', 3, 5, '2026-07-21', '14:00:00', 'pending');
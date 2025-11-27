CREATE DATABASE IF NOT EXISTS u528065755_arundhati;
USE u528065755_arundhati;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    pincode VARCHAR(10),
    role ENUM('customer', 'admin') DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    images JSON, -- Store multiple image URLs as JSON array
    color VARCHAR(50),
    fabric_type VARCHAR(50), -- Silk, Cotton, Banarasi, etc.
    sku VARCHAR(50) UNIQUE, -- Auto-generated SKU (e.g., CH-INDIGO)
    size VARCHAR(20), -- For blouses: 34, 36, 38, 40, 42
    wholesale_price DECIMAL(10, 2), -- Wholesale price
    retail_price DECIMAL(10, 2), -- Retail/MRP price
    discount_percent INT DEFAULT 20, -- Discount percentage (default 20%)
    is_new BOOLEAN DEFAULT FALSE,
    is_best_seller BOOLEAN DEFAULT FALSE,
    stock_quantity INT DEFAULT 100,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Confirmed, Shipped, Delivered
    shipping_address TEXT NOT NULL,
    shipping_pincode VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    inquiry_type VARCHAR(50) NOT NULL, -- Saree, Blouse, Other
    product_interest VARCHAR(255), -- Product Name or "Other"
    custom_product_details TEXT, -- If "Other" is selected
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Mock Products (Optional - based on existing data)
INSERT INTO products (name, category, price, description, image_url, images, color, is_new, is_best_seller) VALUES
('Royal Banarasi Silk Saree', 'Saree', 12500.00, 'Exquisite Banarasi silk saree with intricate gold zari work.', 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1000&auto=format&fit=crop"]', 'Red', TRUE, TRUE),
('Kanjivaram Gold Tissue Saree', 'Saree', 18000.00, 'Authentic Kanjivaram saree woven with pure gold tissue threads.', 'https://images.unsplash.com/photo-1610030469668-965505928386?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1610030469668-965505928386?q=80&w=1000&auto=format&fit=crop"]', 'Gold', FALSE, TRUE),
('Handloom Cotton Saree', 'Saree', 3500.00, 'Comfortable and elegant handloom cotton saree suitable for daily wear.', 'https://images.unsplash.com/photo-1610030469830-b8bd580d5286?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1610030469830-b8bd580d5286?q=80&w=1000&auto=format&fit=crop"]', 'Blue', TRUE, FALSE),
('Embroidered Silk Blouse', 'Blouse', 2500.00, 'Ready-made silk blouse with hand embroidery work.', 'https://images.unsplash.com/photo-1583391733958-e026b14377f9?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1583391733958-e026b14377f9?q=80&w=1000&auto=format&fit=crop"]', 'Green', FALSE, FALSE),
('Paithani Silk Saree', 'Saree', 15000.00, 'Traditional Paithani saree with peacock motifs on the pallu.', 'https://images.unsplash.com/photo-1610030469841-12d7b8445147?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1610030469841-12d7b8445147?q=80&w=1000&auto=format&fit=crop"]', 'Purple', TRUE, TRUE),
('Designer Velvet Blouse', 'Blouse', 3200.00, 'Stylish velvet blouse with sequin work.', 'https://images.unsplash.com/photo-1583391733975-67134643ad90?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1583391733975-67134643ad90?q=80&w=1000&auto=format&fit=crop"]', 'Black', TRUE, FALSE);

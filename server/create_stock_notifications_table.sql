-- Create stock_notifications table
CREATE TABLE IF NOT EXISTS stock_notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT,
    email VARCHAR(255),
    phone VARCHAR(20),
    name VARCHAR(255),
    status ENUM('pending', 'notified') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notified_at TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

require('dotenv').config();
const mysql = require('mysql2/promise');

const createCouponsTable = async () => {
    try {
        const pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                discount_type ENUM('percentage', 'fixed') NOT NULL,
                discount_value DECIMAL(10, 2) NOT NULL,
                min_order_amount DECIMAL(10, 2) DEFAULT 0,
                expiry_date DATE,
                usage_limit INT DEFAULT NULL,
                used_count INT DEFAULT 0,
                status ENUM('active', 'inactive') DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;

        await pool.query(createTableQuery);
        console.log('✅ Coupons table created successfully');

        // Seed a test coupon
        const seedQuery = `
            INSERT IGNORE INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, status)
            VALUES ('WELCOME10', 'percentage', 10.00, 1000.00, '2025-12-31', 'active')
        `;

        await pool.query(seedQuery);
        console.log('✅ Seed data inserted');

        process.exit();
    } catch (error) {
        console.error('❌ Error creating coupons table:', error);
        process.exit(1);
    }
};

createCouponsTable();

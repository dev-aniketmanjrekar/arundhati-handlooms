import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'u528065755_arundhati'
    });

    try {
        console.log('Adding role column to users table...');
        await connection.query("ALTER TABLE users ADD COLUMN role ENUM('customer', 'admin') DEFAULT 'customer'");
        console.log('Successfully added role column.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column role already exists.');
        } else {
            console.error('Error updating database:', error);
        }
    } finally {
        await connection.end();
    }
};

migrate();

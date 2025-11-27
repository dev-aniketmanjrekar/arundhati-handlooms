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
        console.log('Adding fabric_type column to products table...');
        await connection.query("ALTER TABLE products ADD COLUMN fabric_type VARCHAR(50)");
        console.log('Successfully added fabric_type column.');
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column fabric_type already exists.');
        } else {
            console.error('Error updating database:', error);
        }
    } finally {
        await connection.end();
    }
};

migrate();

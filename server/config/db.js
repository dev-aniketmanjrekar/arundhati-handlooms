import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'u528065755_arundhati',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test database connection on startup
pool.getConnection()
    .then(connection => {
        console.log('✅ Database connected successfully to:', process.env.DB_HOST || 'localhost');
        connection.release();
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err.message);
        console.error('Host:', process.env.DB_HOST || 'localhost');
        console.error('User:', process.env.DB_USER || 'root');
        console.error('Database:', process.env.DB_NAME || 'u528065755_arundhati');
    });

export default pool;

import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const getNames = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, color FROM products LIMIT 3');
        console.log(JSON.stringify(products));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
getNames();

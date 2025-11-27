<<<<<<< HEAD
import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const getRemaining = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, color FROM products WHERE id > 3');
        console.log(JSON.stringify(products));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
getRemaining();
=======
import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const getRemaining = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, color FROM products WHERE id > 3');
        console.log(JSON.stringify(products));
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
getRemaining();
>>>>>>> 31051d5 (Initial commit)

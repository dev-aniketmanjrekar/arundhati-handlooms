<<<<<<< HEAD
import pool from './config/db.js';

const checkSlugs = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, slug FROM products');
        console.log('Products in DB:');
        console.table(products);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkSlugs();
=======
import pool from './config/db.js';

const checkSlugs = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, slug FROM products');
        console.log('Products in DB:');
        console.table(products);
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkSlugs();
>>>>>>> 31051d5 (Initial commit)

<<<<<<< HEAD
import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const updateDbImages = async () => {
    try {
        const updates = [
            { id: 1, image: '/images/chanderi-indigo-red.png' },
            { id: 2, image: '/images/golden-tissue-blue.png' },
            { id: 3, image: '/images/handloom-ikat-blouse-red.png' }
        ];

        for (const update of updates) {
            const images = [update.image, update.image, update.image];
            await pool.query('UPDATE products SET image_url = ?, images = ? WHERE id = ?', [update.image, JSON.stringify(images), update.id]);
            console.log(`Updated images for product ${update.id}`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
updateDbImages();
=======
import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const updateDbImages = async () => {
    try {
        const updates = [
            { id: 1, image: '/images/chanderi-indigo-red.png' },
            { id: 2, image: '/images/golden-tissue-blue.png' },
            { id: 3, image: '/images/handloom-ikat-blouse-red.png' }
        ];

        for (const update of updates) {
            const images = [update.image, update.image, update.image];
            await pool.query('UPDATE products SET image_url = ?, images = ? WHERE id = ?', [update.image, JSON.stringify(images), update.id]);
            console.log(`Updated images for product ${update.id}`);
        }
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
updateDbImages();
>>>>>>> 31051d5 (Initial commit)

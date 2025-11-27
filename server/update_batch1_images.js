import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const updateBatch1 = async () => {
    try {
        const updates = [
            { id: 4, image: '/images/ikkat-big-border-blue.png' },
            { id: 5, image: '/images/ikkat-cotton-red.png' },
            { id: 6, image: '/images/jamdani-cotton-blue.png' },
            { id: 7, image: '/images/kalamkari-red.png' }
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
updateBatch1();

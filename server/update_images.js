import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const updateImages = async () => {
    try {
        const [products] = await pool.query('SELECT id, image_url FROM products');

        for (const product of products) {
            if (product.image_url) {
                // Create an array with the main image repeated 3 times to simulate a gallery
                const images = [
                    product.image_url,
                    product.image_url,
                    product.image_url
                ];

                await pool.query('UPDATE products SET images = ? WHERE id = ?', [JSON.stringify(images), product.id]);
                console.log(`Updated images for product ${product.id}`);
            }
        }

        console.log('All products updated with gallery images');
        process.exit();
    } catch (error) {
        console.error('Error updating images:', error);
        process.exit(1);
    }
};

updateImages();

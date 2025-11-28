import pool from './config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const fixSlugs = async () => {
    try {
        const [products] = await pool.query('SELECT id, name, color FROM products');
        for (const product of products) {
            let slug = product.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            if (product.color) {
                slug += `-${product.color.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            }

            try {
                await pool.query('UPDATE products SET slug = ? WHERE id = ?', [slug, product.id]);
                console.log(`Updated slug for ${product.id}: ${slug}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Duplicate slug for ${product.id}, appending id`);
                    slug += `-${product.id}`;
                    await pool.query('UPDATE products SET slug = ? WHERE id = ?', [slug, product.id]);
                } else {
                    console.error(err);
                }
            }
        }
        console.log('Slugs updated');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};
fixSlugs();

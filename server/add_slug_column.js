<<<<<<< HEAD
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const addSlugColumn = async () => {
    try {
        // 1. Add slug column if it doesn't exist
        try {
            await pool.query('ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE');
            console.log('Added slug column to products table');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('Slug column already exists');
            } else {
                throw error;
            }
        }

        // 2. Populate slug for existing products
        const [products] = await pool.query('SELECT id, name, color FROM products WHERE slug IS NULL OR slug = ""');

        for (const product of products) {
            let slug = product.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            if (product.color) {
                slug += `-${product.color.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            }

            // Add random suffix to ensure uniqueness
            slug += `-${Math.random().toString(36).substring(2, 7)}`;

            await pool.query('UPDATE products SET slug = ? WHERE id = ?', [slug, product.id]);
            console.log(`Updated slug for product ${product.id}: ${slug}`);
        }

        console.log('All products updated with slugs');
        process.exit();
    } catch (error) {
        console.error('Error updating slugs:', error);
        process.exit(1);
    }
};

addSlugColumn();
=======
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const addSlugColumn = async () => {
    try {
        // 1. Add slug column if it doesn't exist
        try {
            await pool.query('ALTER TABLE products ADD COLUMN slug VARCHAR(255) UNIQUE');
            console.log('Added slug column to products table');
        } catch (error) {
            if (error.code === 'ER_DUP_FIELDNAME') {
                console.log('Slug column already exists');
            } else {
                throw error;
            }
        }

        // 2. Populate slug for existing products
        const [products] = await pool.query('SELECT id, name, color FROM products WHERE slug IS NULL OR slug = ""');

        for (const product of products) {
            let slug = product.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            if (product.color) {
                slug += `-${product.color.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
            }

            // Add random suffix to ensure uniqueness
            slug += `-${Math.random().toString(36).substring(2, 7)}`;

            await pool.query('UPDATE products SET slug = ? WHERE id = ?', [slug, product.id]);
            console.log(`Updated slug for product ${product.id}: ${slug}`);
        }

        console.log('All products updated with slugs');
        process.exit();
    } catch (error) {
        console.error('Error updating slugs:', error);
        process.exit(1);
    }
};

addSlugColumn();
>>>>>>> 31051d5 (Initial commit)

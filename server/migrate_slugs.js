import pool from './config/db.js';

const runMigration = async () => {
    try {
        console.log('Starting migration...');

        // 1. Add slug column if it doesn't exist
        try {
            await pool.query(`
                ALTER TABLE products 
                ADD COLUMN slug VARCHAR(191) UNIQUE AFTER name;
            `);
            console.log('Added slug column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('Slug column already exists.');
            } else {
                throw err;
            }
        }

        // 2. Populate slugs for existing products
        const [products] = await pool.query('SELECT id, name, color FROM products');

        for (const product of products) {
            let slug = product.name.toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');

            if (product.color) {
                const colorSlug = product.color.toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                slug = `${slug}-${colorSlug}`;
            }

            console.log(`Updating product ${product.id}: ${product.name} -> ${slug}`);

            try {
                await pool.query('UPDATE products SET slug = ? WHERE id = ?', [slug, product.id]);
            } catch (err) {
                console.error(`Failed to update product ${product.id}:`, err.message);
            }
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

runMigration();

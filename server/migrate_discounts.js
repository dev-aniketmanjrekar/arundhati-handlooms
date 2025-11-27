<<<<<<< HEAD
import pool from './config/db.js';

const runMigration = async () => {
    try {
        console.log('Starting migration...');

        // 1. Add discount_percent column
        try {
            await pool.query(`
                ALTER TABLE products 
                ADD COLUMN discount_percent INT DEFAULT 0 AFTER price;
            `);
            console.log('Added discount_percent column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('discount_percent column already exists.');
            } else {
                throw err;
            }
        }

        // 2. Set 25% discount for all products
        await pool.query('UPDATE products SET discount_percent = 25');
        console.log('Applied 25% discount to all products.');

        // 3. Insert Mock Variants
        const variants = [
            {
                name: 'Royal Banarasi Silk Saree',
                category: 'Saree',
                price: 12500.00,
                description: 'Exquisite Banarasi silk saree with intricate gold zari work.',
                image_url: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9?q=80&w=1000&auto=format&fit=crop', // Greenish image
                color: 'Green',
                slug: 'royal-banarasi-silk-saree-green'
            },
            {
                name: 'Kanjivaram Gold Tissue Saree',
                category: 'Saree',
                price: 18000.00,
                description: 'Authentic Kanjivaram saree woven with pure gold tissue threads.',
                image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop', // Reddish image
                color: 'Red',
                slug: 'kanjivaram-gold-tissue-saree-red'
            }
        ];

        for (const v of variants) {
            try {
                await pool.query(
                    `INSERT INTO products (name, category, price, discount_percent, description, image_url, color, slug) 
                     VALUES (?, ?, ?, 25, ?, ?, ?, ?)`,
                    [v.name, v.category, v.price, v.description, v.image_url, v.color, v.slug]
                );
                console.log(`Inserted variant: ${v.slug}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Variant ${v.slug} already exists.`);
                } else {
                    console.error(`Failed to insert ${v.slug}:`, err.message);
                }
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
=======
import pool from './config/db.js';

const runMigration = async () => {
    try {
        console.log('Starting migration...');

        // 1. Add discount_percent column
        try {
            await pool.query(`
                ALTER TABLE products 
                ADD COLUMN discount_percent INT DEFAULT 0 AFTER price;
            `);
            console.log('Added discount_percent column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('discount_percent column already exists.');
            } else {
                throw err;
            }
        }

        // 2. Set 25% discount for all products
        await pool.query('UPDATE products SET discount_percent = 25');
        console.log('Applied 25% discount to all products.');

        // 3. Insert Mock Variants
        const variants = [
            {
                name: 'Royal Banarasi Silk Saree',
                category: 'Saree',
                price: 12500.00,
                description: 'Exquisite Banarasi silk saree with intricate gold zari work.',
                image_url: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9?q=80&w=1000&auto=format&fit=crop', // Greenish image
                color: 'Green',
                slug: 'royal-banarasi-silk-saree-green'
            },
            {
                name: 'Kanjivaram Gold Tissue Saree',
                category: 'Saree',
                price: 18000.00,
                description: 'Authentic Kanjivaram saree woven with pure gold tissue threads.',
                image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1000&auto=format&fit=crop', // Reddish image
                color: 'Red',
                slug: 'kanjivaram-gold-tissue-saree-red'
            }
        ];

        for (const v of variants) {
            try {
                await pool.query(
                    `INSERT INTO products (name, category, price, discount_percent, description, image_url, color, slug) 
                     VALUES (?, ?, ?, 25, ?, ?, ?, ?)`,
                    [v.name, v.category, v.price, v.description, v.image_url, v.color, v.slug]
                );
                console.log(`Inserted variant: ${v.slug}`);
            } catch (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    console.log(`Variant ${v.slug} already exists.`);
                } else {
                    console.error(`Failed to insert ${v.slug}:`, err.message);
                }
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
>>>>>>> 31051d5 (Initial commit)

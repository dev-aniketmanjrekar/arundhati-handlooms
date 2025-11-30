import pool from './config/db.js';

const createPagesTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS pages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                slug VARCHAR(255) UNIQUE NOT NULL,
                title VARCHAR(255) NOT NULL,
                content JSON,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Pages table created successfully');

        // Seed initial data
        const initialPages = [
            {
                slug: 'home',
                title: 'Home Page',
                content: JSON.stringify({
                    heroTitle: 'Weaving Tradition Into Elegance',
                    heroSubtitle: 'Discover the finest collection of authentic handwoven sarees and blouses.',
                    heroImage: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
                    metaTitle: 'Arundhati Handlooms - Home',
                    metaDescription: 'Premium handloom sarees.'
                })
            },
            {
                slug: 'about',
                title: 'About Us',
                content: JSON.stringify({
                    heroTitle: 'Our Story',
                    heroSubtitle: 'A legacy of 50 years in handloom weaving.',
                    heroImage: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9',
                    aboutText: 'Arundhati Handlooms started in 1970...',
                    metaTitle: 'About Us - Arundhati Handlooms',
                    metaDescription: 'Learn about our heritage.'
                })
            }
        ];

        for (const page of initialPages) {
            const [exists] = await pool.query('SELECT id FROM pages WHERE slug = ?', [page.slug]);
            if (exists.length === 0) {
                await pool.query('INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)', [page.slug, page.title, page.content]);
                console.log(`✅ Seeded page: ${page.slug}`);
            }
        }

    } catch (error) {
        console.error('❌ Error creating pages table:', error);
    } finally {
        process.exit();
    }
};

createPagesTable();

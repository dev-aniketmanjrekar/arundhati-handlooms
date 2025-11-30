import pool from './config/db.js';

const seedHomePage = async () => {
    try {
        const homeContent = {
            heroTitle: 'Weaving Tradition Into Elegance',
            heroSubtitle: 'Discover the finest collection of authentic handwoven sarees and blouses, crafted with centuries of tradition and love.',
            heroImage: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
            heroImageMobile: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147',
            featuredTitle: 'The Royal Banarasi Edit',
            featuredSubtitle: 'Exclusive Launch',
            featuredDescription: 'Experience the grandeur of Varanasi with our handpicked collection of pure Katan Silk Banarasi sarees. Intricate zari work meets timeless elegance.',
            featuredImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop',
            occasion1Title: 'Wedding',
            occasion1Image: 'https://images.unsplash.com/photo-1583391733958-e026b14377f9?q=80&w=800&auto=format&fit=crop',
            occasion1Desc: 'Bridal & Trousseau',
            occasion2Title: 'Festive',
            occasion2Image: 'https://images.unsplash.com/photo-1610030469841-12d7b8445147?q=80&w=800&auto=format&fit=crop',
            occasion2Desc: 'Celebrations & Parties',
            occasion3Title: 'Work Wear',
            occasion3Image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=800&auto=format&fit=crop',
            occasion3Desc: 'Elegant & Professional',
            heritageTitle: 'The Art of Timeless Weaving',
            heritageDescription: "Every thread tells a story. Our sarees are not just garments; they are a legacy woven by skilled artisans who have inherited this craft through generations. We bring you the authentic touch of India's rich handloom culture.",
            heritageImage: '/images/kalamkari-red.png',
            metaTitle: 'Arundhati Handlooms - Premium Handloom Sarees & Traditional Wear',
            metaDescription: 'Discover exquisite handloom sarees and traditional wear at Arundhati Handlooms. Authentic craftsmanship, premium fabrics, and timeless designs for every occasion.',
            metaKeywords: 'handloom sarees, traditional sarees, Indian sarees, handwoven sarees, silk sarees, cotton sarees, ethnic wear, Arundhati Handlooms'
        };

        const slug = 'home';
        const title = 'Home Page';

        // Check if page exists
        const [existing] = await pool.query('SELECT id FROM pages WHERE slug = ?', [slug]);

        if (existing.length > 0) {
            console.log('Home page already exists. Updating...');
            await pool.query(
                'UPDATE pages SET title = ?, content = ? WHERE slug = ?',
                [title, JSON.stringify(homeContent), slug]
            );
            console.log('✅ Home page updated successfully');
        } else {
            console.log('Home page does not exist. Inserting...');
            await pool.query(
                'INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)',
                [slug, title, JSON.stringify(homeContent)]
            );
            console.log('✅ Home page seeded successfully');
        }

    } catch (error) {
        console.error('❌ Error seeding home page:', error);
    } finally {
        process.exit();
    }
};

seedHomePage();

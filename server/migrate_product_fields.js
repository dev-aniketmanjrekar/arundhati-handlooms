import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'u528065755_arundhati'
    });

    try {
        console.log('Adding new product fields...');

        // Add SKU field
        await connection.query("ALTER TABLE products ADD COLUMN sku VARCHAR(50) UNIQUE").catch(e => {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
            console.log('SKU column already exists');
        });

        // Add size field
        await connection.query("ALTER TABLE products ADD COLUMN size VARCHAR(20)").catch(e => {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
            console.log('Size column already exists');
        });

        // Add wholesale_price field
        await connection.query("ALTER TABLE products ADD COLUMN wholesale_price DECIMAL(10, 2)").catch(e => {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
            console.log('Wholesale_price column already exists');
        });

        // Add retail_price field
        await connection.query("ALTER TABLE products ADD COLUMN retail_price DECIMAL(10, 2)").catch(e => {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
            console.log('Retail_price column already exists');
        });

        // Add discount_percent field
        await connection.query("ALTER TABLE products ADD COLUMN discount_percent INT DEFAULT 20").catch(e => {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
            console.log('Discount_percent column already exists');
        });

        // Migrate existing price to retail_price
        await connection.query("UPDATE products SET retail_price = price WHERE retail_price IS NULL");

        console.log('✅ Successfully added all new product fields!');
    } catch (error) {
        console.error('Error updating database:', error);
    } finally {
        await connection.end();
    }
};

migrate();

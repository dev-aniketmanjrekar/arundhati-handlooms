import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const name = 'Admin User';
    const email = 'admin@arundhati.com';
    const password = 'adminpassword'; // Change this!
    const phone = '9999999999';
    const address = 'Admin HQ';
    const pincode = '000000';
    const role = 'admin';

    try {
        // Check if admin exists
        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            console.log('Admin user already exists.');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await connection.query(
            'INSERT INTO users (name, email, password, phone, address, pincode, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address, pincode, role]
        );

        console.log(`Admin user created successfully.\nEmail: ${email}\nPassword: ${password}`);
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        await connection.end();
    }
};

createAdmin();

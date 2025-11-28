
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors({
    origin: ['https://arundhatihandlooms.com', 'http://localhost:5173', 'https://www.arundhatihandlooms.com'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());

// SKU Generation Function
function generateSKU(name, color) {
    // Extract initials from product name
    const nameWords = name.trim().split(' ');
    const initials = nameWords.map(word => word[0]).join('').toUpperCase();

    // Clean and uppercase color
    const colorCode = color ? color.trim().toUpperCase().replace(/\s+/g, '-') : 'DEFAULT';

    // Add random suffix for uniqueness
    const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase();

    // Combine: e.g., "Chanderi Indigo" + "Blue" -> "CI-BLUE-7X9"
    return `${initials}-${colorCode}-${randomSuffix}`;
}

const isAdmin = async (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [decoded.id]);

        if (users.length === 0 || users[0].role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// --- Auth Routes ---

// Register
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone, address, pincode } = req.body;

    try {
        // Check if user exists
        const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, phone, address, pincode) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address, pincode]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            token,
            user: { id: result.insertId, name, email, phone, address, pincode }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                pincode: user.pincode,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Profile
app.get('/api/auth/profile', async (req, res) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const [users] = await pool.query('SELECT id, name, email, phone, address, pincode, role FROM users WHERE id = ?', [decoded.id]);
        res.json(users[0]);
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
});

// Slug Generation Function
function generateSlug(name, color) {
    let slug = name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (color) {
        slug += `-${color.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    }

    // Removed random suffix as per user request
    return slug;
}

// --- Product Routes ---

app.get('/api/products', async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products');
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    try {
        const param = req.params.id;
        let product;

        // Check if param is numeric (ID) or string (slug)
        if (/^\d+$/.test(param)) {
            const [products] = await pool.query('SELECT * FROM products WHERE id = ?', [param]);
            product = products[0];
        } else {
            const [products] = await pool.query('SELECT * FROM products WHERE slug = ?', [param]);
            product = products[0];
        }

        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Fetch variants (products with same name)
        const [variants] = await pool.query('SELECT id, slug, color FROM products WHERE name = ? AND id != ?', [product.name, product.id]);

        res.json({ ...product, variants });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Product
app.post('/api/admin/products', isAdmin, async (req, res) => {
    const { name, category, price, description, image_url, images, color, fabric_type, size, wholesale_price, retail_price, discount_percent, is_new, is_best_seller, stock_quantity } = req.body;

    try {
        // Generate SKU if not provided
        const sku = req.body.sku || generateSKU(name, color);
        const slug = generateSlug(name, color);

        // Use retail_price as main price if provided, otherwise use price
        const finalRetailPrice = retail_price || price;
        const finalPrice = finalRetailPrice; // Keep for backward compatibility

        const [result] = await pool.query(
            'INSERT INTO products (name, slug, category, price, description, image_url, images, color, fabric_type, sku, size, wholesale_price, retail_price, discount_percent, is_new, is_best_seller, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [name, slug, category, finalPrice, description, image_url, JSON.stringify(images), color, fabric_type, sku, size, wholesale_price, finalRetailPrice, discount_percent || 20, is_new, is_best_seller, stock_quantity]
        );
        res.status(201).json({ message: 'Product created', id: result.insertId, sku, slug });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'SKU or Slug already exists.' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

// Update Product
app.put('/api/admin/products/:id', isAdmin, async (req, res) => {
    const { name, category, price, description, image_url, images, color, fabric_type, sku, size, wholesale_price, retail_price, discount_percent, is_new, is_best_seller, stock_quantity } = req.body;

    try {
        // Generate SKU if not provided
        const finalSku = sku || generateSKU(name, color);

        // Use retail_price as main price if provided, otherwise use price
        const finalRetailPrice = retail_price || price;
        const finalPrice = finalRetailPrice; // Keep for backward compatibility

        await pool.query(
            'UPDATE products SET name=?, category=?, price=?, description=?, image_url=?, images=?, color=?, fabric_type=?, sku=?, size=?, wholesale_price=?, retail_price=?, discount_percent=?, is_new=?, is_best_seller=?, stock_quantity=? WHERE id=?',
            [name, category, finalPrice, description, image_url, JSON.stringify(images), color, fabric_type, finalSku, size, wholesale_price, finalRetailPrice, discount_percent, is_new, is_best_seller, stock_quantity, req.params.id]
        );
        res.json({ message: 'Product updated', sku: finalSku });
    } catch (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ message: 'SKU already exists.' });
        } else {
            res.status(500).json({ message: 'Server error' });
        }
    }
});

// Delete Product
app.delete('/api/admin/products/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all orders
app.get('/api/admin/orders', isAdmin, async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, u.name as user_name, u.email as user_email 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Order Status
app.put('/api/admin/orders/:id/status', isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Order status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all inquiries
app.get('/api/admin/inquiries', isAdmin, async (req, res) => {
    try {
        const [inquiries] = await pool.query('SELECT * FROM inquiries ORDER BY created_at DESC');
        res.json(inquiries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Bulk Import Products via Excel
app.post('/api/admin/products/bulk-import', isAdmin, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Read the Excel file
        const workbook = xlsx.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet);

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        // Process each row
        for (const row of data) {
            try {
                const sku = row.SKU || generateSKU(row.Name, row.Color);
                const slug = generateSlug(row.Name, row.Color);
                const retailPrice = row['Retail Price'] || row.RetailPrice;
                const wholesalePrice = row['Wholesale Price'] || row.WholesalePrice;

                await pool.query(
                    'INSERT INTO products (name, slug, category, price, description, image_url, images, color, fabric_type, sku, size, wholesale_price, retail_price, discount_percent, stock_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        row.Name,
                        slug,
                        row.Category || 'Saree',
                        retailPrice, // price for backward compatibility
                        row.Description || '',
                        row.Image || '',
                        JSON.stringify([]),
                        row.Color,
                        row.Fabric || row.FabricType,
                        sku,
                        row.Size,
                        wholesalePrice,
                        retailPrice,
                        row.Discount || 20,
                        row.Stock || 100
                    ]
                );
                successCount++;
            } catch (err) {
                errorCount++;
                errors.push({ row: row.Name, error: err.message });
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(req.file.path);

        res.json({
            message: 'Bulk import completed',
            successCount,
            errorCount,
            errors: errors.slice(0, 10) // Return first 10 errors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during bulk import' });
    }
});

// Get Global Discount Setting
app.get('/api/admin/settings/discount', isAdmin, async (req, res) => {
    try {
        // Get average discount from products or return 20 as default
        const [result] = await pool.query('SELECT AVG(discount_percent) as avg_discount FROM products');
        res.json({ discount: result[0].avg_discount || 20 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Global Discount Setting
app.put('/api/admin/settings/discount', isAdmin, async (req, res) => {
    const { discount } = req.body;
    try {
        await pool.query('UPDATE products SET discount_percent = ?', [discount]);
        res.json({ message: 'Global discount updated successfully', discount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Best Sellers Automatically (Top 8 by order count)
app.post('/api/admin/update-bestsellers', isAdmin, async (req, res) => {
    try {
        // First, set all products to NOT best seller
        await pool.query('UPDATE products SET is_best_seller = FALSE');

        // Get top 8 products by order count
        const [topProducts] = await pool.query(`
            SELECT oi.product_id, COUNT(*) as order_count
            FROM order_items oi
            GROUP BY oi.product_id
            ORDER BY order_count DESC
            LIMIT 8
        `);

        // Update these products to best seller
        if (topProducts.length > 0) {
            const productIds = topProducts.map(p => p.product_id);
            const placeholders = productIds.map(() => '?').join(',');
            await pool.query(
                `UPDATE products SET is_best_seller = TRUE WHERE id IN (${placeholders})`,
                productIds
            );
        }

        res.json({
            message: 'Best sellers updated successfully',
            count: topProducts.length,
            products: topProducts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

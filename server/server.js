
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'image-' + uniqueSuffix + ext);
    }
});

const upload = multer({ storage: storage });

// Ensure uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

app.use(cors({
    origin: true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-auth-token']
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

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

// Auth middleware (for regular authenticated users)
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

// Admin middleware (extends auth)
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

// Admin: Get dashboard statistics
app.get('/api/admin/dashboard-stats', isAdmin, async (req, res) => {
    try {
        // Get total orders
        const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');

        // Get total revenue
        const [revenue] = await pool.query('SELECT SUM(total_amount) as total FROM orders');

        // Get total users
        const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');

        // Get total products
        const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');

        // Get total inquiries
        const [inquiryCount] = await pool.query('SELECT COUNT(*) as count FROM inquiries');

        res.json({
            totalOrders: orderCount[0].count || 0,
            totalRevenue: revenue[0].total || 0,
            totalUsers: userCount[0].count || 0,
            totalProducts: productCount[0].count || 0,
            totalInquiries: inquiryCount[0].count || 0
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Product Routes ---

// Admin: Get all products (with admin authentication)
app.get('/api/admin/products', isAdmin, async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(products);
    } catch (error) {
        console.error('Error fetching products for admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Public: Get all products
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

// Admin: Get all users
app.get('/api/admin/users', isAdmin, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, name, email, phone, address, pincode, role, created_at FROM users ORDER BY created_at DESC');
        res.json(users);
    } catch (error) {
        console.error('Error fetching users for admin:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Create user
app.post('/api/admin/users', isAdmin, async (req, res) => {
    const { name, email, password, phone, address, pincode, role } = req.body;

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
            'INSERT INTO users (name, email, password, phone, address, pincode, role) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address, pincode, role || 'customer']
        );

        res.status(201).json({ message: 'User created successfully', id: result.insertId });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Update user
app.put('/api/admin/users/:id', isAdmin, async (req, res) => {
    const { name, email, phone, address, pincode, role } = req.body;

    try {
        await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, pincode = ?, role = ? WHERE id = ?',
            [name, email, phone || null, address || null, pincode || null, role, req.params.id]
        );

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Delete user
app.delete('/api/admin/users/:id', isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User: Update own profile (cannot change role)
app.put('/api/auth/profile', auth, async (req, res) => {
    const { name, email, phone, address, pincode } = req.body;

    try {
        await pool.query(
            'UPDATE users SET name = ?, email = ?, phone = ?, address = ?, pincode = ? WHERE id = ?',
            [name, email, phone || null, address || null, pincode || null, req.user.id]
        );

        // Fetch updated user
        const [users] = await pool.query('SELECT id, name, email, phone, address, pincode, role FROM users WHERE id = ?', [req.user.id]);

        res.json({ message: 'Profile updated successfully', user: users[0] });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User: Change own password
app.put('/api/auth/change-password', auth, async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    try {
        // Get user with password
        const [users] = await pool.query('SELECT password FROM users WHERE id = ?', [req.user.id]);

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, users[0].password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Validate new password
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Reset user password
app.put('/api/admin/users/:id/reset-password', isAdmin, async (req, res) => {
    const { newPassword } = req.body;

    try {
        // Validate password
        if (newPassword.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, req.params.id]);

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ message: 'Server error' });
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

// Stock Notification Routes
// Request stock notification
app.post('/api/stock-notifications', async (req, res) => {
    const { product_id, email, phone, name } = req.body;
    const token = req.header('x-auth-token');

    try {
        let user_id = null;

        // Get user_id if logged in
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                user_id = decoded.id;
            } catch (err) {
                // Token invalid or expired, continue without user_id
            }
        }

        // Insert notification request
        await pool.query(
            'INSERT INTO stock_notifications (product_id, user_id, email, phone, name) VALUES (?, ?, ?, ?, ?)',
            [product_id, user_id, email, phone, name]
        );

        // Send WhatsApp message to admin
        const [product] = await pool.query('SELECT name, sku FROM products WHERE id = ?', [product_id]);
        if (product.length > 0) {
            const phoneNumber = "917021512319";
            const message = `🔔 Stock Notification Request\n\nProduct: ${product[0].name}\nSKU: ${product[0].sku}\n\nCustomer:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nPlease notify when back in stock.`;
            const encodedMessage = encodeURIComponent(message);

            // Log WhatsApp URL (in production, you might use an API to send this automatically)
            console.log(`WhatsApp URL: https://wa.me/${phoneNumber}?text=${encodedMessage}`);
        }

        res.status(201).json({ message: 'Notification request saved successfully' });
    } catch (error) {
        console.error('Error saving stock notification:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin: Get all stock notifications
app.get('/api/admin/stock-notifications', isAdmin, async (req, res) => {
    try {
        const [notifications] = await pool.query(`
            SELECT sn.*, p.name as product_name, p.sku, p.image_url, p.stock_quantity,
                   u.name as user_name, u.email as user_email
            FROM stock_notifications sn
            JOIN products p ON sn.product_id = p.id
            LEFT JOIN users u ON sn.user_id = u.id
            WHERE p.stock_quantity <= 0
            ORDER BY p.stock_quantity ASC, sn.created_at DESC
        `);
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching stock notifications:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

//  Admin: Mark notification as notified
app.put('/api/admin/stock-notifications/:id/notify', isAdmin, async (req, res) => {
    try {
        await pool.query(
            'UPDATE stock_notifications SET status = ? WHERE id = ?',
            ['notified', req.params.id]
        );
        res.json({ message: 'Notification marked as notified' });
    } catch (error) {
        console.error('Error marking notification:', error);
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

// ========== ORDER MANAGEMENT ==========

// Create Order (with stock decrease)
app.post('/api/orders', auth, async (req, res) => {
    const { items, shippingAddress, totalAmount } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Create order
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, shipping_address, total_amount, status) VALUES (?, ?, ?, ?)',
            [req.user.id, JSON.stringify(shippingAddress), totalAmount, 'pending']
        );

        const orderId = orderResult.insertId;

        // 2. Process each item
        for (const item of items) {
            // Check stock availability
            const [products] = await connection.query(
                'SELECT stock_quantity FROM products WHERE id = ?',
                [item.productId]
            );

            if (products.length === 0) {
                throw new Error(`Product ${item.productId} not found`);
            }

            const availableStock = products[0].stock_quantity;

            if (availableStock < item.quantity) {
                throw new Error(`Insufficient stock for product ${item.productId}. Available: ${availableStock}, Requested: ${item.quantity}`);
            }

            // Decrease stock
            await connection.query(
                'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                [item.quantity, item.productId]
            );

            // Insert order item
            await connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, color, size) VALUES (?, ?, ?, ?, ?, ?)',
                [orderId, item.productId, item.quantity, item.price, item.color || null, item.size || null]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        await connection.rollback();
        console.error('Error creating order:', error);
        res.status(500).json({ message: error.message || 'Failed to create order' });
    } finally {
        connection.release();
    }
});

// Get user orders
app.get('/api/orders/my-orders', auth, async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT o.*, 
                   JSON_ARRAYAGG(
                       JSON_OBJECT(
                           'product_id', oi.product_id,
                           'product_name', p.name,
                           'quantity', oi.quantity,
                           'price', oi.price,
                           'color', oi.color,
                           'size', oi.size,
                           'image_url', p.image_url
                       )
                   ) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN products p ON oi.product_id = p.id
            WHERE o.user_id = ?
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.user.id]);

        // Parse items  JSON
        const formattedOrders = orders.map(order => ({
            ...order,
            items: order.items || [],
            shipping_address: typeof order.shipping_address === 'string' ? JSON.parse(order.shipping_address) : order.shipping_address
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
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

// --- CMS Routes ---

// Get page content
app.get('/api/pages/:slug', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM pages WHERE slug = ?', [req.params.slug]);
        if (rows.length === 0) return res.status(404).json({ message: 'Page not found' });
        res.json(rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update page content (Admin only)
// Update page content (Admin only) - Upsert logic
app.put('/api/pages/:slug', auth, isAdmin, async (req, res) => {
    const { title, content } = req.body;
    const slug = req.params.slug;

    try {
        // Check if page exists
        const [existing] = await pool.query('SELECT id FROM pages WHERE slug = ?', [slug]);

        if (existing.length > 0) {
            // Update
            await pool.query(
                'UPDATE pages SET title = ?, content = ? WHERE slug = ?',
                [title, JSON.stringify(content), slug]
            );
            res.json({ message: 'Page updated successfully' });
        } else {
            // Insert (Create new page)
            await pool.query(
                'INSERT INTO pages (slug, title, content) VALUES (?, ?, ?)',
                [slug, title, JSON.stringify(content)]
            );
            res.status(201).json({ message: 'Page created and saved successfully' });
        }
    } catch (error) {
        console.error('Error saving page:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// --- Coupon Routes ---

// Get all coupons (Admin only)
app.get('/api/admin/coupons', auth, isAdmin, async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create a new coupon (Admin only)
app.post('/api/admin/coupons', auth, isAdmin, async (req, res) => {
    const { code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit, status } = req.body;
    try {
        await pool.query(
            'INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [code.toUpperCase(), discount_type, discount_value, min_order_amount, expiry_date, usage_limit, status]
        );
        res.status(201).json({ message: 'Coupon created successfully' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update a coupon (Admin only)
app.put('/api/admin/coupons/:id', auth, isAdmin, async (req, res) => {
    const { code, discount_type, discount_value, min_order_amount, expiry_date, usage_limit, status } = req.body;
    try {
        await pool.query(
            'UPDATE coupons SET code = ?, discount_type = ?, discount_value = ?, min_order_amount = ?, expiry_date = ?, usage_limit = ?, status = ? WHERE id = ?',
            [code.toUpperCase(), discount_type, discount_value, min_order_amount, expiry_date, usage_limit, status, req.params.id]
        );
        res.json({ message: 'Coupon updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete a coupon (Admin only)
app.delete('/api/admin/coupons/:id', auth, isAdmin, async (req, res) => {
    try {
        await pool.query('DELETE FROM coupons WHERE id = ?', [req.params.id]);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Validate Coupon (Public/Protected)
app.post('/api/coupons/validate', async (req, res) => {
    const { code, cartTotal } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM coupons WHERE code = ? AND status = "active"', [code]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        const coupon = rows[0];
        const currentDate = new Date();

        if (coupon.expiry_date && new Date(coupon.expiry_date) < currentDate) {
            return res.status(400).json({ message: 'Coupon has expired' });
        }

        if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
            return res.status(400).json({ message: 'Coupon usage limit reached' });
        }

        if (cartTotal < coupon.min_order_amount) {
            return res.status(400).json({ message: `Minimum order amount of ₹${coupon.min_order_amount} required` });
        }

        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Generic File Upload Endpoint
app.post('/api/upload', isAdmin, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        // Return the URL of the uploaded file
        // User requested default domain: https://arundhatihandlooms.com/
        const baseUrl = process.env.NODE_ENV === 'production'
            ? 'https://arundhatihandlooms.com'
            : `${req.protocol}://${req.get('host')}`;

        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;
        res.json({ url: fileUrl });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ message: 'Server error during upload' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

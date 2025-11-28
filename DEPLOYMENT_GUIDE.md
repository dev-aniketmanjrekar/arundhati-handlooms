# Hostinger Deployment Guide for Arundhati Handlooms

This guide details how to deploy your MERN stack application (React Frontend + Node.js Backend + MySQL) on Hostinger Shared Hosting.

## Prerequisites

*   **Hostinger Plan:** Ensure your plan supports **Node.js** (Business Shared Hosting or higher usually includes this).
*   **Domain:** A domain name connected to your hosting.
*   **SSH Access (Optional but recommended):** For easier command execution.

---

## Part 1: Database Setup (MySQL)

1.  **Log in to Hostinger hPanel.**
2.  Go to **Databases** -> **Management**.
3.  **Create a New Database:**
    *   **MySQL Database Name:** e.g., `u123456789_arundhati`
    *   **MySQL Username:** e.g., `u123456789_admin`
    *   **Password:** Set a strong password.
    *   Click **Create**.
4.  **Import Schema:**
    *   Click **Enter phpMyAdmin** next to your new database.
    *   Click the **Import** tab.
    *   Upload the `server/database/schema.sql` file from your local project.
    *   Click **Go** to create the tables.

---

## Part 2: Backend Deployment (Node.js)

1.  **Setup Node.js App:**
    *   In hPanel, go to **Advanced** -> **Node.js App**.
    *   **Create New App:**
        *   **Node.js Version:** Select **18** or **20** (match your local version if possible).
        *   **Application Mode:** `Production`.
        *   **Application Root:** `server` (or `api` - this is the folder name where you'll upload code).
        *   **Application URL:** `api` (This makes your backend accessible at `yourdomain.com/api`).
        *   **Application Startup File:** `server.js`.
    *   Click **Create**.

2.  **Upload Backend Files:**
    *   Go to **Files** -> **File Manager**.
    *   Navigate to `public_html/server` (or whatever Root you defined).
    *   Upload all files from your local `server` folder **EXCEPT** `node_modules` and `.env`.
    *   *Tip: Zip the `server` folder contents locally, upload the zip, and extract it in File Manager.*

3.  **Install Dependencies:**
    *   Back in the **Node.js App** section in hPanel.
    *   Click the **NPM Install** button. This will install packages from your `package.json`.

4.  **Configure Environment Variables:**
    *   In the **Node.js App** section, find **Environment Variables** (or create a `.env` file in the `server` folder via File Manager).
    *   Add the following:
        ```env
        DB_HOST=localhost
        DB_USER=u123456789_admin  <-- Your Hostinger DB Username
        DB_PASSWORD=your_password <-- Your Hostinger DB Password
        DB_NAME=u123456789_arundhati <-- Your Hostinger DB Name
        JWT_SECRET=your_jwt_secret_key
        PORT=3000 (Hostinger usually manages the port, but good to have)
        ```

5.  **Restart Server:**
    *   Click **Restart** in the Node.js App section.

---

## Part 3: Frontend Deployment (React/Vite)

1.  **Update API URL:**
    *   In your local project, open `src/context/AuthContext.jsx`, `src/pages/Home.jsx`, etc.
    *   Replace `http://localhost:5000/api` with your production URL: `https://yourdomain.com/api`.
    *   *Better approach:* Create a `.env.production` file in your frontend root:
        ```env
        VITE_API_URL=https://yourdomain.com/api
        ```
        And update code to use `import.meta.env.VITE_API_URL`.

2.  **Build the App:**
    *   Open your local terminal.
    *   Run: `npm run build`
    *   This creates a `dist` folder.

3.  **Upload Frontend Files:**
    *   Go to Hostinger **File Manager**.
    *   Navigate to `public_html`.
    *   Delete the default `default.php` or `index.php` if present.
    *   Upload the **contents** of the local `dist` folder (index.html, assets folder, etc.) directly to `public_html`.

4.  **Configure .htaccess (Crucial for React Router):**
    *   In `public_html`, create a new file named `.htaccess`.
    *   Paste the following code to ensure refreshing pages works:

    ```apache
    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteBase /
      RewriteRule ^index\.html$ - [L]
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule . /index.html [L]
    </IfModule>
    ```

---

## Part 4: Troubleshooting

*   **Backend 404/500 Errors:** Check the **Node.js App** logs in hPanel or look for `error_log` files in File Manager.
*   **Database Connection Error:** Double-check `DB_USER` and `DB_PASSWORD`. Ensure the user has permissions for the database.
*   **Images Not Loading:** Ensure your images are in `public_html/images` or correctly referenced in your code.

## Summary
1. **Database**: Created & Imported.
2. **Backend**: Uploaded to `server` folder, NPM Installed, Env Vars set.
3. **Frontend**: Built locally, `dist` contents uploaded to `public_html`.
4. **Routing**: `.htaccess` added.

Your site should now be live! 🚀

# Hybrid Deployment Guide (Render + Hostinger)

This guide details how your application is deployed using a **Hybrid Approach**:
*   **Frontend:** Hostinger (Shared Hosting) - Serves the React App.
*   **Backend:** Render (Cloud) - Runs the Node.js API.
*   **Database:** Hostinger (MySQL) - Stores data, accessed remotely by Render.

---

## Part 1: Architecture Overview

*   **Domain (`arundhatihandlooms.com`)**: Points to **Hostinger**.
*   **API URL (`arundhati-handlooms.onrender.com`)**: Points to **Render**.

---

## Part 2: Maintenance & Updates

### How to Update the Frontend (Website UI)
If you make changes to React components, pages, or styles:

1.  **Make Changes:** Edit your code locally in VS Code.
2.  **Build:** Run the build command in your terminal:
    ```bash
    npm run build
    ```
3.  **Upload:**
    *   Go to **Hostinger File Manager** -> `public_html`.
    *   **Delete** the old files (except `images` folder if you have custom uploads there).
    *   **Upload** the *contents* of your local `dist` folder.
    *   Ensure `.htaccess` is present (if you deleted it, re-create it).

### How to Update the Backend (API/Logic)
If you make changes to `server.js` or API routes:

1.  **Make Changes:** Edit your code locally.
2.  **Push to GitHub:**
    ```bash
    git add .
    git commit -m "Description of changes"
    git push origin main
    ```
3.  **Auto-Deploy:** Render is connected to your GitHub. It will detect the push and automatically redeploy your backend within a few minutes.

### How to Update the Database
*   Use **phpMyAdmin** in Hostinger to manage data manually.
*   Or use the **Admin Panel** on your website (if built) to add products/users.

---

## Part 3: Troubleshooting

*   **"Cannot GET /" on Domain:**
    *   Means your domain is pointing to Render (Backend) instead of Hostinger.
    *   **Fix:** Point domain DNS to Hostinger IP.
*   **API Errors (500):**
    *   Check **Render Logs** in the Render Dashboard.
    *   Usually a database connection issue.
*   **Changes not showing:**
    *   **Frontend:** Clear browser cache (Ctrl+F5).
    *   **Backend:** Wait for Render deployment to finish (check dashboard).

---

## Summary
*   **Frontend:** `public_html` on Hostinger.
*   **Backend:** `server` folder on GitHub (deployed to Render).
*   **Database:** MySQL on Hostinger.

# Alternative Deployment Guide (For Standard Shared Hosting)

If your Hostinger plan **does not** have the "Node.js" option, you cannot run the backend server directly on it. Standard shared hosting only supports PHP and static files (HTML/CSS/JS).

**The Solution: Hybrid Deployment**
1.  **Frontend:** Host on Hostinger (it's just static files).
2.  **Backend:** Host on a free cloud provider like **Render.com**.
3.  **Database:** Keep on Hostinger (enable Remote MySQL) OR use a cloud database (like Aiven).

---

## Part 1: Deploy Backend to Render.com (Free)

1.  **Push Code to GitHub:**
    *   Ensure your project is on GitHub.
    *   Make sure your `server` folder is in the repo.

2.  **Create Web Service on Render:**
    *   Sign up at [render.com](https://render.com).
    *   Click **New +** -> **Web Service**.
    *   Connect your GitHub repository.
    *   **Settings:**
        *   **Root Directory:** `server`
        *   **Runtime:** `Node`
        *   **Build Command:** `npm install`
        *   **Start Command:** `node server.js`
    *   **Environment Variables:** Add them here (DB_HOST, DB_USER, etc.).
    *   Click **Create Web Service**.
    *   **Copy your Backend URL:** e.g., `https://arundhati-backend.onrender.com`.

---

## Part 2: Connect Database (Remote MySQL)

Since your backend is now on Render, it needs to connect to your Hostinger database remotely.

1.  **Enable Remote MySQL on Hostinger:**
    *   Go to Hostinger hPanel -> **Databases** -> **Remote MySQL**.
    *   **Host (%):** Enter `%` (this allows connections from any IP, which is needed for Render).
    *   Click **Create**.
    *   *Note: If Hostinger blocks this for security, you might need to host your database on a cloud provider like Aiven (Free MySQL).*

2.  **Update Render Env Vars:**
    *   Update `DB_HOST` in Render to your Hostinger domain or IP.

---

## Part 3: Deploy Frontend to Hostinger

1.  **Update API URL:**
    *   In your local code, change the API URL to your **Render Backend URL**.
    *   Example in `src/context/AuthContext.jsx`:
        ```javascript
        // const API_URL = 'http://localhost:5000/api'; // OLD
        const API_URL = 'https://arundhati-backend.onrender.com/api'; // NEW (Render URL)
        ```

2.  **Build & Upload:**
    *   Run `npm run build` locally.
    *   Upload the contents of `dist` to `public_html` on Hostinger.
    *   Ensure the `.htaccess` file is also uploaded.

---

## Summary
*   **Frontend:** Runs on Hostinger (fast, uses your domain).
*   **Backend:** Runs on Render (processes logic/API).
*   **Database:** Runs on Hostinger (stores data).

**Pros:** Works with any shared hosting.
**Cons:** Slightly more complex setup; Database latency might be higher.

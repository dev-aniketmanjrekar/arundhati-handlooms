# Migrating Frontend to Render (Static Site)

Follow these steps to deploy your React frontend to Render. This will enable **Auto-Deploy** whenever you push to GitHub.

## Step 1: Create a Static Site
1.  Log in to your [Render Dashboard](https://dashboard.render.com/).
2.  Click **New +** and select **Static Site**.
3.  Connect your GitHub repository (`arundhati-handlooms` or similar).

## Step 2: Configure Build Settings
Fill in the following details:
*   **Name:** `arundhati-frontend` (or any name you like)
*   **Branch:** `main` (or `master`)
*   **Root Directory:** `.` (leave empty or dot)
*   **Build Command:** `npm install && npm run build`
*   **Publish Directory:** `dist`

## Step 3: Environment Variables
1.  Scroll down to **Environment Variables**.
2.  Click **Add Environment Variable**.
3.  **Key:** `VITE_API_URL`
4.  **Value:** `https://arundhati-handlooms.onrender.com/api`
    *   *(Note: This is your **Backend** URL. Make sure it's correct!)*

## Step 4: Rewrite Rules (Critical for React)
Since this is a Single Page App (SPA), we need to tell Render to handle routing.
1.  Go to the **Redirects/Rewrites** tab (you might need to create the site first, then go to Settings -> Redirects/Rewrites).
2.  Add a new rule:
    *   **Source:** `/*`
    *   **Destination:** `/index.html`
    *   **Action:** `Rewrite`

## Step 5: Verify
1.  Click **Create Static Site**.
2.  Wait for the build to finish.
3.  Visit the URL provided by Render (e.g., `https://arundhati-frontend.onrender.com`).
4.  **Test:**
    *   Login (Admin)
    *   Add to Cart
    *   Refresh the page (to test Rewrite rules)

## Step 6: Update Domain (Optional)
If you want `arundhatihandlooms.com` to point here:
1.  Go to **Settings** -> **Custom Domains** in Render.
2.  Add `arundhatihandlooms.com`.
3.  Render will give you DNS records (A record or CNAME) to update in **Hostinger's DNS Zone Editor**.

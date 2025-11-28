# Environment Variables Setup Guide

## Frontend (.env)
Create a `.env` file in the root directory with:

```bash
VITE_API_URL=https://your-backend-url.com/api
```

**For Production (Render):**
Set this environment variable in your Render dashboard for the frontend service.

## Backend (.env in server folder)
Create a `.env` file in the `server` folder with:

```bash
# Database Configuration (Hostinger)
DB_HOST=your-hostinger-mysql-host.com
DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=u528065755_arundhati

# JWT Secret
JWT_SECRET=your-secret-key-here

# Port (optional, defaults to 5000)
PORT=5000
```

## How to Set on Render (Backend):
1. Go to your backend service on Render
2. Click "Environment"
3. Add these environment variables:
   - `DB_HOST` → Your Hostinger MySQL host
   - `DB_USER` → Your Hostinger MySQL username
   - `DB_PASSWORD` → Your Hostinger MySQL password
   - `DB_NAME` → `u528065755_arundhati`
   - `JWT_SECRET` → A random secret string
4. Save and redeploy

## Finding Your Hostinger Database Details:
1. Log in to Hostinger
2. Go to **Advanced** → **MySQL Databases**
3. Find your database connection details:
   - Host: Usually something like `mysql-xxxxx.hostinger.com`
   - Username: Shown in the database list
   - Password: The one you set when creating the database

## Testing the Connection:
After setting up the environment variables, check the server logs for any database connection errors.

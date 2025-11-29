# Local Development Setup Guide

## Quick Start (Run Both Frontend & Backend)

### Step 1: Setup Backend (Server)

1. **Navigate to the project root**
   ```bash
   cd d:\Dropbox\codeinfinity\Websites\arundhati
   ```

2. **Create `.env` file in the root** (if not exists)
   ```
   DB_HOST=srv1605.hstgr.io
   DB_USER=u528065755_arundhati
   DB_PASSWORD=Arundhati@2025
   DB_NAME=u528065755_arundhati
   JWT_SECRET=your-secret-key-here-change-this-in-production
   PORT=5000
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```
   
   ✅ Backend will run on: `http://localhost:5000`

---

### Step 2: Setup Frontend (React)

1. **Open a NEW terminal** (keep backend running)

2. **Navigate to project root**
   ```bash
   cd d:\Dropbox\codeinfinity\Websites\arundhati
   ```

3. **Create `.env` file in the root** (if not exists)
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Install frontend dependencies** (if needed)
   ```bash
   npm install
   ```

5. **Start the frontend**
   ```bash
   npm run dev
   ```
   
   ✅ Frontend will run on: `http://localhost:5173` (or similar)

---

## Access Your Local Site

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api

The frontend will automatically connect to your local backend!

---

## Testing Changes

1. Make code changes
2. Frontend auto-reloads (hot reload)
3. Backend needs manual restart (Ctrl+C, then `npm start`)

---

## When to Push to Production

Only push to GitHub/Render when:
- Feature is complete and tested locally
- You're ready for production deployment

---

## Common Issues

### Port Already in Use
If port 5000 is busy:
```bash
# Stop the process or change PORT in .env to 5001
```

### Database Connection Failed
- Check if your internet is working (connecting to Hostinger)
- Verify credentials in `.env` file

### CORS Errors
- Make sure `VITE_API_URL` in frontend `.env` is `http://localhost:5000/api`
- Backend CORS is already configured for local development

# 🚀 Coding Battle Arena — Complete Production Deployment Guide

This guide provides step-by-step instructions to deploy **Coding Battle Arena** for production access with a permanent public URL using **Render** (Backend API + Socket.IO) and **Vercel** (Frontend React application) alongside **MongoDB Atlas** and **Judge0**.

---

## 🏗️ Architecture Overview

| Component | Stack | Recommended Host | Production URL Format |
| :--- | :--- | :--- | :--- |
| **Frontend** | React (Vite) + Socket.IO-Client | **Vercel** / Netlify | `https://coding-battle-arena.vercel.app` |
| **Backend** | Node.js + Express + Socket.IO | **Render** / Railway | `https://coding-battle-arena-api.onrender.com` |
| **Database** | MongoDB Atlas | **MongoDB Cloud** | `mongodb+srv://<user>:<pass>@cluster...` |
| **Sandbox** | Judge0 API (Node, Python, C++, Java) | **RapidAPI Judge0** | `https://judge0-extra-code-execution.p.rapidapi.com` |

---

## 📋 Step 1: Push Code to GitHub

1. Ensure all environment variable files (`.env`, `.env.local`) are ignored by `.gitignore`.
2. Commit and push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Prepare Coding Battle Arena for production deployment"
   git push origin main
   ```

---

## 🍃 Step 2: MongoDB Atlas Setup

1. Sign up / Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Database Cluster (Shared / Free tier is sufficient).
3. Create a Database User under **Database Access** (Username & Password).
4. Under **Network Access**, add IP `0.0.0.0/0` to allow connections from Render.
5. Click **Connect** -> **Drivers** and copy your MongoDB connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/coding-battle-arena?retryWrites=true&w=majority
   ```

---

## ⚙️ Step 3: Deploy Backend on Render

1. Log in to [Render Console](https://dashboard.render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository containing Coding Battle Arena.
4. Configure the service:
   - **Name**: `coding-battle-arena-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free / Starter
5. Under **Environment Variables**, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `PORT` | `5000` | Port provided automatically by Render |
| `FRONTEND_URL` | `https://coding-battle-arena.vercel.app` | URL of your Vercel frontend |
| `CLIENT_ORIGIN` | `https://coding-battle-arena.vercel.app` | Allowed CORS origin |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/...` | MongoDB Atlas URI |
| `JWT_SECRET` | `prod_jwt_super_secret_key_99` | Secret for authenticating sessions |
| `JUDGE0_API_URL` | `https://judge0-extra-code-execution.p.rapidapi.com` | Judge0 API endpoint |
| `JUDGE0_API_KEY` | `your_rapidapi_key_here` | RapidAPI key for real execution |
| `USE_MOCK_JUDGE0` | `true` (or `false` when API key set) | Toggles sandbox mock mode |

6. Click **Create Web Service** and wait for deployment. Note your backend URL (e.g. `https://coding-battle-arena-api.onrender.com`).

---

## 🌐 Step 4: Deploy Frontend on Vercel

1. Log in to [Vercel](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Expand **Environment Variables** and add:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://coding-battle-arena-api.onrender.com` | Live Render backend URL |
| `VITE_SOCKET_URL` | `https://coding-battle-arena-api.onrender.com` | Live Render Socket.IO server URL |

6. Click **Deploy**. Vercel will build and assign your permanent public URL (e.g., `https://coding-battle-arena.vercel.app`).

---

## ⚡ Step 5: Socket.IO & WebSocket Production Settings

- Render automatically supports HTTP/1.1 and WebSockets on port `443`.
- The Socket.IO client in `frontend/src/socket.js` uses:
  ```js
  transports: ["websocket", "polling"]
  ```
- Make sure `VITE_SOCKET_URL` in Vercel points to your live Render backend URL (`https://coding-battle-arena-api.onrender.com`).

---

## 🔄 Step 6: SPA Client-Side Routing (Single Page App)

To prevent `404 Not Found` when refreshing routes like `/login`, `/profile`, `/battle`, `/vault`, or `/leaderboard`:
- `frontend/vercel.json` ensures all requests rewrite to `/index.html`:
  ```json
  {
    "rewrites": [
      { "source": "/(.*)", "destination": "/index.html" }
    ]
  }
  ```
- `frontend/public/_redirects` provides fallback routing for Netlify/static hosting.

---

## 🧪 Step 7: Production Testing & Verification Checklist

Before releasing to players, verify the live deployment:

1. **Frontend Landing & Auth**:
   - Open your Vercel URL in browser.
   - Verify page loads without console errors.
   - Click **Signup**, create a new account, pick an anime hero avatar.
   - Verify session persistence on page refresh (`/api/auth/me`).

2. **Real-time Server & Socket.IO**:
   - Verify top right status badge displays **`SERVER ONLINE`** (green dot).
   - If server drops, verify status displays **`CONNECTION LOST — RECONNECTING...`**.

3. **1v1 Multiplayer & AI Battles**:
   - Open two browser windows (or one regular + one incognito).
   - Log in with different accounts in both windows.
   - Select **1v1 Battle Arena** and click **Find Match**.
   - Verify room creation, real-time question sync, timer, HP updates, damage, combos, and victory modal.

4. **Judge0 Code Execution**:
   - In a battle, type code in the sandbox editor and click **Run Code** / **Submit**.
   - Verify test case execution and accuracy score calculation.

5. **Profile, ELO & Leaderboard**:
   - Check **Leaderboard** to confirm player ranks update after match victory.
   - Check **Profile** and **Match History** to confirm match records, ELO changes, and earned coins persist.

---

## 🛠️ Summary of Environment Variables Needed

### Backend (Render Environment Variables)
```env
PORT=5000
FRONTEND_URL=https://your-frontend.vercel.app
CLIENT_ORIGIN=https://your-frontend.vercel.app
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/coding-battle-arena?retryWrites=true&w=majority
JWT_SECRET=your_production_jwt_secret
JUDGE0_API_URL=https://judge0-extra-code-execution.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key
USE_MOCK_JUDGE0=true
```

### Frontend (Vercel Environment Variables)
```env
VITE_API_URL=https://your-backend.onrender.com
VITE_SOCKET_URL=https://your-backend.onrender.com
```

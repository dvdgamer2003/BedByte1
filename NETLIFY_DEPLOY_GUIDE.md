# 🚀 Netlify Deployment Guide - BedByte Frontend

## ✅ Pre-Deployment Checklist (DONE)
- ✅ TypeScript errors fixed
- ✅ `.env.production` configured with Render backend URL
- ✅ `.gitignore` created
- ✅ `netlify.toml` configured
- ✅ Netlify CLI installed and logged in

---

## 📦 Deploy Steps

### Step 1: Install Google Maps Types (if not done)
```bash
npm install --save-dev @types/google.maps
```

### Step 2: Build the Project
```bash
cd client
npm run build
```

### Step 3: Deploy to Netlify
```bash
netlify deploy --prod
```

**Follow the prompts:**
1. **"What would you like to do?"** → Select `+ Create & configure a new project`
2. **Team**: Select your team (usually your personal account)
3. **Site name**: Enter `bedbyte-hospital` (or your choice - must be unique)
4. **Publish directory**: Enter `dist`

### Step 4: Site Will Be Live! 🎉
Your site will be deployed to:
```
https://bedbyte-hospital.netlify.app
```
(or whatever name you chose)

---

## 🔗 Connect Backend to Frontend

Your frontend is already configured to use:
- **Backend API**: `https://bedbyte1-1.onrender.com/api`
- **WebSocket**: `https://bedbyte1-1.onrender.com`

---

## 🔄 Update Backend CORS

After deployment, update your backend `.env` on Render:

```env
CLIENT_URL=https://your-site-name.netlify.app
```

Then add this to allowed origins in your backend CORS config.

---

## 🎯 Post-Deployment Checklist

- [ ] Test frontend loads successfully
- [ ] Test user registration/login
- [ ] Test hospital search
- [ ] Test bed booking
- [ ] Test chatbot
- [ ] Test real-time updates (beds, OPD queue)
- [ ] Update backend CORS settings

---

## 🔄 Future Updates

To redeploy after changes:

```bash
npm run build
netlify deploy --prod
```

---

## 🌐 Your Live URLs

**Frontend**: `https://bedbyte-hospital.netlify.app`  
**Backend**: `https://bedbyte1-1.onrender.com`

---

**Deployment Status**: Ready to deploy! 🚀

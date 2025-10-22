# Netlify Deployment Guide

Complete guide to deploy your medical clinic website to Netlify with your custom domain.

---

## Architecture Overview

**Frontend (React):** Netlify (Static hosting - FREE)
**Backend (FastAPI):** Render.com or Railway.app (FREE tier)
**Database:** Google Sheets via Apps Script (FREE)

---

## Part 1: Deploy Backend to Render.com (FREE)

### Step 1: Prepare Backend for Deployment

1. Create a `render.yaml` file in the root directory (I'll create this for you)
2. Make sure `backend/requirements-simple.txt` exists (already created)

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com) and sign up (free)
2. Click **New** → **Web Service**
3. Connect your GitHub repository (or upload code)
4. Configure:
   - **Name:** `dr-sandeep-clinic-api`
   - **Environment:** Python 3
   - **Build Command:** `cd backend && pip install -r requirements-simple.txt`
   - **Start Command:** `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Add Environment Variables:
   ```
   CORS_ORIGINS=*
   RAZORPAY_KEY_ID=placeholder_key_id
   RAZORPAY_KEY_SECRET=placeholder_key_secret
   GOOGLE_WEBHOOK_URL=your_google_apps_script_url
   ```
6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://dr-sandeep-clinic-api.onrender.com`)

**Note:** Free tier sleeps after 15 minutes of inactivity. First request may take 30-60 seconds to wake up.

---

## Part 2: Deploy Frontend to Netlify

### Step 1: Update Frontend Configuration

1. Update `frontend/.env`:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
   REACT_APP_RAZORPAY_KEY_ID=placeholder_key_id
   ```

### Step 2: Build Frontend Locally (Optional Test)

```bash
cd frontend
npm run build
```

This creates a `build` folder with optimized production files.

### Step 3: Deploy to Netlify

#### Option A: Drag & Drop (Easiest)

1. Go to [netlify.com](https://netlify.com) and sign up (free)
2. Click **Add new site** → **Deploy manually**
3. Drag the `frontend/build` folder to the upload area
4. Wait for deployment
5. Your site is live! (e.g., `https://random-name-123.netlify.app`)

#### Option B: GitHub Integration (Recommended)

1. Push your code to GitHub
2. Go to Netlify → **Add new site** → **Import from Git**
3. Connect GitHub and select your repository
4. Configure build settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
5. Add Environment Variables:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
   REACT_APP_RAZORPAY_KEY_ID=placeholder_key_id
   ```
6. Click **Deploy site**
7. Wait for deployment (3-5 minutes)

---

## Part 3: Connect Your Custom Domain

### Step 1: Add Domain to Netlify

1. In Netlify dashboard, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `drskumar.com`)
4. Click **Verify**

### Step 2: Configure DNS

Netlify will show you DNS records to add. You have two options:

#### Option A: Use Netlify DNS (Easiest)

1. Click **Set up Netlify DNS**
2. Netlify will provide nameservers (e.g., `dns1.p01.nsone.net`)
3. Go to your domain registrar (where you bought the domain)
4. Update nameservers to Netlify's nameservers
5. Wait 24-48 hours for DNS propagation

#### Option B: Keep Your Current DNS

Add these records to your domain registrar:

**For root domain (drskumar.com):**
```
Type: A
Name: @
Value: 75.2.60.5
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
```

### Step 3: Enable HTTPS

1. Netlify automatically provisions SSL certificate (FREE via Let's Encrypt)
2. Wait 5-10 minutes
3. Your site will be available at `https://yourdomain.com`

---

## Part 4: Update Backend CORS

Once your domain is live, update backend CORS settings:

1. Go to Render.com dashboard
2. Open your web service
3. Go to **Environment** tab
4. Update `CORS_ORIGINS`:
   ```
   CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
   ```
5. Save changes (service will restart automatically)

---

## Part 5: Final Testing

### Test Checklist:

1. ✅ Visit your domain - website loads
2. ✅ Language toggle works (English ↔ Hindi)
3. ✅ Click "Book Appointment" - form loads
4. ✅ Select date - time slots appear
5. ✅ Fill patient details - validation works
6. ✅ Complete payment (mock) - success message
7. ✅ Check Google Sheet - appointment saved
8. ✅ Check Telegram - notification received
9. ✅ Check Google Calendar - event created

---

## Cost Breakdown

| Service | Plan | Cost |
|---------|------|------|
| Netlify (Frontend) | Free | ₹0 |
| Render.com (Backend) | Free | ₹0 |
| Google Apps Script | Free | ₹0 |
| Domain Name | Varies | ₹500-1000/year |
| SSL Certificate | Free (Let's Encrypt) | ₹0 |
| **TOTAL (Monthly)** | | **₹0** |
| **TOTAL (Yearly)** | | **₹500-1000** |

---

## Performance Optimization

### Frontend (Netlify)
- ✅ Automatic CDN distribution
- ✅ Automatic image optimization
- ✅ Gzip compression
- ✅ HTTP/2 support

### Backend (Render Free Tier)
- ⚠️ Sleeps after 15 min inactivity
- ⚠️ First request takes 30-60 seconds
- ✅ Automatic HTTPS
- ✅ Automatic deployments

**Tip:** To keep backend awake, use a free uptime monitor like [UptimeRobot](https://uptimerobot.com) to ping your API every 10 minutes.

---

## Upgrade Options (If Needed Later)

### If Backend Sleep is an Issue:
- **Render Starter Plan:** $7/month (no sleep)
- **Railway Pro:** $5/month (no sleep)
- **Fly.io:** $5/month (no sleep)

### If You Need More Features:
- **Netlify Pro:** $19/month (analytics, forms, etc.)
- **Vercel Pro:** $20/month (similar features)

---

## Troubleshooting

### Issue: Backend not responding
- Check Render logs for errors
- Verify environment variables are set
- Test API directly: `https://your-backend.onrender.com/api/`

### Issue: CORS errors
- Update CORS_ORIGINS in backend
- Make sure it includes your domain
- Restart backend service

### Issue: Domain not working
- Wait 24-48 hours for DNS propagation
- Check DNS settings with [whatsmydns.net](https://whatsmydns.net)
- Clear browser cache

### Issue: SSL certificate not working
- Wait 10-15 minutes after domain setup
- Check Netlify SSL settings
- Try force-renewing certificate

---

## Maintenance

### Regular Tasks:
- Check Google Sheet for appointments
- Monitor Telegram notifications
- Review backend logs on Render
- Keep dependencies updated

### Monthly:
- Check Render service status
- Verify SSL certificate is valid
- Test booking flow end-to-end

---

## Next Steps After Deployment

1. ✅ Share website URL with client
2. ✅ Share Google Sheet access with doctor
3. ✅ Test with real Razorpay credentials (when ready)
4. ✅ Set up UptimeRobot to keep backend awake
5. ✅ Add Google Analytics (optional)

---

**You're ready to deploy! 🚀**

Need help? Check the logs:
- **Netlify:** Site settings → Build & deploy → Deploy log
- **Render:** Dashboard → Logs tab
- **Apps Script:** View → Logs

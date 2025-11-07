# 🚀 Quick Deployment Instructions

**Your Google Apps Script webhook is already configured!**

---

## ✅ What's Ready

- ✅ Frontend built and optimized
- ✅ Backend code ready
- ✅ Google Apps Script webhook configured
- ✅ All files organized

**Your Webhook URL:**
```
https://script.google.com/macros/s/AKfycbxxbquKOvqt6wvauX5ldxdIvBSCHkHensRtLXbDEou-L0h3pOUzMHZ4pXa3-3bpe8wd2Q/exec
```

---

## 🎯 Choose Your Setup

### Option 1: Serverless (Recommended - 15 min)
**No backend server needed!**
- Frontend: Netlify
- Backend: Google Apps Script
- Cost: ₹0/month

### Option 2: With Backend Server (30 min)
**Traditional full-stack setup**
- Frontend: Netlify
- Backend: Render.com
- Cost: ₹0/month

---

## 📋 Option 1: Serverless Setup (Recommended)

### Step 1: Get Razorpay Key (5 min)

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up / Log in
3. Go to **Settings** → **API Keys**
4. Click **Generate Test Key**
5. Copy the **Key ID** (starts with `rzp_test_`)

---

### Step 2: Deploy to Netlify (5 min)

1. Go to [netlify.com](https://netlify.com)
2. Sign up / Log in (free)
3. Click **Add new site** → **Deploy manually**
4. **Drag the entire `final-deployment` folder** to Netlify
5. Wait 30 seconds - Your site is live!

---

### Step 3: Add Environment Variables (5 min)

1. In Netlify dashboard, click on your site
2. Go to **Site settings** → **Environment variables**
3. Click **Add a variable**

**Variable 1:**
```
Key: REACT_APP_GOOGLE_WEBHOOK_URL
Value: https://script.google.com/macros/s/AKfycbxxbquKOvqt6wvauX5ldxdIvBSCHkHensRtLXbDEou-L0h3pOUzMHZ4pXa3-3bpe8wd2Q/exec
```

**Variable 2:**
```
Key: REACT_APP_RAZORPAY_KEY_ID
Value: [Paste your Razorpay Key ID here]
```

4. Click **Save**

---

### Step 4: Redeploy (1 min)

**IMPORTANT:** Must redeploy for variables to work!

1. Go to **Deploys** tab
2. Click **Trigger deploy**
3. Select **Deploy site**
4. Wait 30-60 seconds

---

### Step 5: Test (5 min)

1. Visit your Netlify URL
2. Click "Book Appointment"
3. Select date and time
4. Fill details
5. Use test card: `4111 1111 1111 1111`
6. Check Google Sheet for appointment

**Done! 🎉**

---

## 📋 Option 2: With Backend Server

### Step 1: Deploy Backend to Render (15 min)

1. Go to [render.com](https://render.com)
2. Sign up / Log in (free)
3. Click **New** → **Web Service**
4. Connect GitHub or upload the `backend` folder
5. Configure:
   - **Name:** `clinic-backend`
   - **Environment:** Python 3
   - **Build Command:** `pip install -r requirements-simple.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

6. Add Environment Variables:
```
CORS_ORIGINS=*
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
GOOGLE_WEBHOOK_URL=https://script.google.com/macros/s/AKfycbxxbquKOvqt6wvauX5ldxdIvBSCHkHensRtLXbDEou-L0h3pOUzMHZ4pXa3-3bpe8wd2Q/exec
```

7. Click **Create Web Service**
8. Wait 5-10 minutes
9. Copy your backend URL (e.g., `https://clinic-backend.onrender.com`)

---

### Step 2: Deploy Frontend to Netlify (10 min)

1. Go to [netlify.com](https://netlify.com)
2. Drag the `final-deployment` folder
3. Add Environment Variables:
```
REACT_APP_BACKEND_URL=https://your-backend.onrender.com
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```
4. Redeploy site

---

### Step 3: Update Backend CORS (5 min)

1. Go to Render dashboard
2. Open your web service
3. Update `CORS_ORIGINS`:
```
CORS_ORIGINS=https://your-site.netlify.app
```
4. Service restarts automatically

---

## 🧪 Testing Checklist

- [ ] Website loads
- [ ] Language toggle works
- [ ] Click "Book Appointment"
- [ ] Select date
- [ ] Time slots load
- [ ] Fill patient details
- [ ] Payment completes
- [ ] Check Google Sheet
- [ ] Appointment appears

---

## 🆘 Troubleshooting

### Time slots not loading
- Check environment variables are set
- Verify you redeployed after adding variables
- Check browser console (F12) for errors

### Payment not working
- Verify Razorpay key is correct
- Use test card: `4111 1111 1111 1111`
- Check browser console for errors

### Booking not saving
- Check Google Apps Script logs
- Verify webhook URL is correct
- Test with `testWebhook()` function

---

## 📞 Your URLs

Fill these in after deployment:

**Netlify Site:**
```
https://_________________.netlify.app
```

**Backend (if using):**
```
https://_________________.onrender.com
```

**Google Webhook:**
```
https://script.google.com/macros/s/AKfycbxxbquKOvqt6wvauX5ldxdIvBSCHkHensRtLXbDEou-L0h3pOUzMHZ4pXa3-3bpe8wd2Q/exec
```

**Google Sheet:**
```
https://docs.google.com/spreadsheets/d/_________
```

---

## 🎉 Next Steps After Deployment

### Optional Enhancements:

1. **Custom Domain**
   - Add in Netlify: Site settings → Domain management
   - Update DNS records
   - SSL auto-provisions

2. **Telegram Notifications**
   - Create bot with @BotFather
   - Update Apps Script with bot token
   - Get instant booking alerts

3. **Go Live**
   - Switch to Razorpay live keys
   - Complete KYC verification
   - Update environment variables

---

## 💰 Cost Summary

| Service | Cost |
|---------|------|
| Netlify | FREE |
| Render (optional) | FREE |
| Google Apps Script | FREE |
| Razorpay | ~2% per transaction |
| Domain (optional) | ₹500-1000/year |
| **Total** | **₹0/month** |

---

## ✅ Deployment Complete!

Once deployed:
- Share Netlify URL with client
- Share Google Sheet access
- Train on viewing appointments
- Go live!

**Need help? Read `DEPLOYMENT_GUIDE.md` for detailed instructions.**

---

**Time to Deploy:** 15-30 minutes
**Monthly Cost:** ₹0
**Difficulty:** Easy
**Result:** Professional clinic website! 🎉

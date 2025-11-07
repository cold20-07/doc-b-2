# BL Uro-Stone & Kidney Clinic - Complete Deployment Package

**Production-ready medical clinic website with frontend + backend**

---

## 📦 What's Included

```
final-deployment/
├── Frontend (Built React App)
│   ├── index.html              # Main HTML
│   ├── static/                 # CSS & JS bundles
│   ├── _redirects              # SPA routing
│   └── asset-manifest.json     # Build manifest
│
├── Backend (FastAPI Server)
│   ├── server.py               # Main server file
│   ├── requirements-simple.txt # Python dependencies
│   ├── .env.example            # Environment template
│   └── .gitignore              # Git ignore rules
│
└── Documentation
    ├── README.md               # This file
    ├── DEPLOYMENT_GUIDE.md     # Complete deployment guide
    └── DEPLOY_INSTRUCTIONS.md  # Quick deployment steps
```

---

## 🏗️ Architecture

### Option 1: Serverless (Recommended - FREE)
```
User → Netlify (Frontend) → Google Apps Script → Google Sheets
                          ↓
                      Razorpay (Payments)
```
**Cost:** ₹0/month

### Option 2: Traditional (With Backend Server)
```
User → Netlify (Frontend) → Render.com (Backend) → Google Apps Script → Google Sheets
                                                  ↓
                                              Razorpay (Payments)
```
**Cost:** ₹0/month (free tiers)

---

## 🚀 Quick Deployment

### Option 1: Serverless Setup (15 minutes)

**Step 1: Deploy Frontend to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Drag the root folder (final-deployment) to Netlify
3. Wait 30 seconds - Done!

**Step 2: Set Up Google Apps Script**
1. Create Google Sheet with headers
2. Add Apps Script code (from doc-b-2-main/google-apps-script.js)
3. Deploy as web app
4. Copy webhook URL

**Step 3: Configure Environment Variables**
1. In Netlify: Site settings → Environment variables
2. Add:
   - `REACT_APP_GOOGLE_WEBHOOK_URL` = Your webhook URL
   - `REACT_APP_RAZORPAY_KEY_ID` = Your Razorpay key
3. Redeploy site

**Done!** Your site is live at ₹0/month

---

### Option 2: With Backend Server (30 minutes)

**Step 1: Deploy Backend to Render.com**
1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Upload the `backend` folder
4. Set build command: `pip install -r requirements-simple.txt`
5. Set start command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
6. Add environment variables:
   - `CORS_ORIGINS` = *
   - `RAZORPAY_KEY_ID` = Your key
   - `RAZORPAY_KEY_SECRET` = Your secret
   - `GOOGLE_WEBHOOK_URL` = Your webhook URL
7. Deploy - Copy backend URL

**Step 2: Deploy Frontend to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Drag the root folder to Netlify
3. Add environment variables:
   - `REACT_APP_BACKEND_URL` = Your backend URL
   - `REACT_APP_RAZORPAY_KEY_ID` = Your Razorpay key
4. Redeploy site

**Done!** Full-stack app running at ₹0/month

---

## 📋 Prerequisites

- [ ] Google account (for Apps Script)
- [ ] Netlify account (free) - [netlify.com](https://netlify.com)
- [ ] Razorpay account - [razorpay.com](https://razorpay.com)
- [ ] Render.com account (optional, for backend) - [render.com](https://render.com)

---

## 🔧 Configuration Files

### Frontend Environment Variables
Add in Netlify Dashboard:
```
REACT_APP_GOOGLE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

### Backend Environment Variables (if using backend)
Add in Render Dashboard:
```
CORS_ORIGINS=*
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_KEY_SECRET
GOOGLE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

---

## 💰 Cost Comparison

| Setup | Frontend | Backend | Database | Total/Month |
|-------|----------|---------|----------|-------------|
| Serverless | Netlify (FREE) | None | Google Sheets (FREE) | **₹0** |
| With Backend | Netlify (FREE) | Render (FREE) | Google Sheets (FREE) | **₹0** |

**Additional Costs:**
- Razorpay: ~2% per transaction
- Domain: ₹500-1000/year (optional)

---

## ✨ Features

- ✅ Bilingual interface (English/Hindi)
- ✅ Online appointment booking
- ✅ Secure payment integration (Razorpay)
- ✅ Mobile responsive design
- ✅ Modern UI with Tailwind CSS
- ✅ Fast loading (< 2 seconds)
- ✅ HTTPS enforced
- ✅ Google Sheets database
- ✅ Telegram notifications (optional)
- ✅ Google Calendar integration

---

## 🧪 Testing

After deployment:

1. Visit your Netlify URL
2. Click "Book Appointment"
3. Select date and time
4. Fill patient details
5. Complete payment (use test card: 4111 1111 1111 1111)
6. Check Google Sheet for appointment data

---

## 📚 Documentation

- **README.md** - This file (overview)
- **DEPLOYMENT_GUIDE.md** - Complete step-by-step guide
- **DEPLOY_INSTRUCTIONS.md** - Quick deployment steps
- **backend/.env.example** - Backend environment template
- **.env.example** - Frontend environment template

---

## 🆘 Troubleshooting

### Frontend not loading
- Check Netlify deploy log
- Verify all files uploaded
- Clear browser cache

### Backend not responding (if using backend)
- Check Render logs
- Verify environment variables
- Wait 30-60 seconds (free tier wakes up)

### Booking not saving
- Check Google Apps Script logs
- Verify webhook URL is correct
- Test with testWebhook() function

### Payment not working
- Verify Razorpay keys
- Use test card in test mode
- Check browser console for errors

---

## 🔒 Security

- ✅ HTTPS enforced
- ✅ Environment variables encrypted
- ✅ Payment verification server-side
- ✅ Google OAuth for Apps Script
- ✅ No sensitive data in frontend
- ✅ CORS protection

---

## 📞 Support

### Check Logs
- **Netlify:** Site settings → Deploy log
- **Render:** Dashboard → Logs tab
- **Apps Script:** View → Logs
- **Browser:** F12 → Console

### Documentation
- Netlify: [docs.netlify.com](https://docs.netlify.com)
- Render: [render.com/docs](https://render.com/docs)
- Razorpay: [razorpay.com/docs](https://razorpay.com/docs)

---

## 🎯 Next Steps

1. Read `DEPLOY_INSTRUCTIONS.md` for quick setup
2. Or read `DEPLOYMENT_GUIDE.md` for detailed guide
3. Deploy frontend to Netlify
4. Set up Google Apps Script
5. Configure environment variables
6. Test booking flow
7. Go live!

---

## 📝 File Structure

### Frontend Files (Root Directory)
- `index.html` - Main HTML file
- `static/` - CSS and JavaScript bundles
- `_redirects` - SPA routing configuration
- `netlify.toml` - Netlify configuration
- `asset-manifest.json` - Build manifest

### Backend Files (backend/ directory)
- `server.py` - FastAPI server
- `requirements-simple.txt` - Python dependencies
- `.env.example` - Environment variables template
- `.gitignore` - Git ignore rules

### Configuration Files
- `.env.example` - Frontend environment template
- `.gitignore` - Git ignore rules
- `netlify.toml` - Netlify configuration

---

## 🚀 Deployment Options

### Recommended: Serverless
- **Pros:** Free, simple, no server management
- **Cons:** None for this use case
- **Best for:** Most users

### Alternative: With Backend
- **Pros:** More control, traditional architecture
- **Cons:** Slightly more complex setup
- **Best for:** Advanced users who need backend customization

---

## ✅ Success Criteria

Your deployment is successful when:

- ✅ Website loads at your URL
- ✅ Can book appointment end-to-end
- ✅ Payment completes (test mode)
- ✅ Data saves to Google Sheet
- ✅ No errors in browser console
- ✅ Mobile responsive works

---

**Ready to deploy? Open `DEPLOY_INSTRUCTIONS.md` for quick steps!**

**Total Setup Time:** 15-30 minutes
**Monthly Cost:** ₹0
**Difficulty:** Easy

# Complete Deployment Guide - Serverless Architecture

Deploy your medical clinic website with **zero backend servers** using Netlify + Google Apps Script + Razorpay.

---

## Architecture Overview

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│   Netlify (Frontend Hosting)    │
│   - React App                    │
│   - Static Files                 │
│   - FREE Forever                 │
└──────┬──────────────────┬───────┘
       │                  │
       │                  ▼
       │         ┌─────────────────┐
       │         │    Razorpay     │
       │         │   (Payments)    │
       │         └─────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Google Apps Script (Webhook)   │
│  - Receives booking data         │
│  - Saves to Google Sheets        │
│  - Sends Telegram notifications  │
│  - Creates Calendar events       │
│  - FREE Forever                  │
└─────────────────────────────────┘
```

**Total Cost: ₹0/month** (except Razorpay transaction fees)

---

## Prerequisites

- [ ] Google account
- [ ] Netlify account (free) - [netlify.com](https://netlify.com)
- [ ] Razorpay account - [razorpay.com](https://razorpay.com)
- [ ] Telegram bot (optional) - [@BotFather](https://t.me/botfather)
- [ ] Domain name (optional, ₹500-1000/year)

---

## Step 1: Set Up Google Apps Script (30 minutes)

### 1.1 Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **Blank** to create new sheet
3. Rename it: "Clinic Appointments"
4. In row 1, add these headers:

```
A1: Timestamp
B1: Name
C1: Email
D1: Phone
E1: Date
F1: Time
G1: Payment Status
H1: Payment ID
I1: Amount
```

5. Format the sheet (optional):
   - Bold the header row
   - Freeze row 1: **View** → **Freeze** → **1 row**
   - Auto-resize columns

### 1.2 Get Razorpay Credentials

1. Go to [razorpay.com](https://razorpay.com)
2. Sign up / Log in
3. Go to **Settings** → **API Keys**
4. Generate keys (use Test Mode for testing)
5. Copy:
   - **Key ID** (starts with `rzp_test_` or `rzp_live_`)
   - **Key Secret**

### 1.3 Set Up Telegram Bot (Optional)

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot`
3. Follow instructions to create bot
4. Copy the **Bot Token** (looks like `123456:ABC-DEF...`)
5. Start a chat with your bot
6. Get your **Chat ID**:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `"chat":{"id":123456789}` in the response
   - Copy the chat ID

### 1.4 Create Apps Script

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete the default `myFunction()` code
3. Copy the entire code from `doc-b-2-main/google-apps-script.js`
4. Paste into the Apps Script editor

### 1.5 Configure Apps Script

Update the configuration section (lines 5-10):

```javascript
// Configuration
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_ID';        // Your Razorpay Key ID
const RAZORPAY_KEY_SECRET = 'YOUR_KEY_SECRET';         // Your Razorpay Key Secret
const TELEGRAM_BOT_TOKEN = 'YOUR_BOT_TOKEN';           // Optional: Your Telegram bot token
const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';               // Optional: Your Telegram chat ID
const CALENDAR_ID = 'primary';                          // Your Google Calendar ID
```

**Note:** If you don't want Telegram notifications, leave the token and chat ID as empty strings.

### 1.6 Deploy Apps Script

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ → Select **Web app**
3. Configure:
   - **Description:** "Clinic Appointment Webhook"
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**
5. **Authorize access:**
   - Click **Authorize access**
   - Choose your Google account
   - Click **Advanced** → **Go to [project name] (unsafe)**
   - Click **Allow**
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/...`)
   - **IMPORTANT:** Save this URL - you'll need it for Netlify!

### 1.7 Test Apps Script

1. In Apps Script editor, select `testWebhook` from the function dropdown
2. Click **Run** (▶️)
3. Check your Google Sheet - you should see test data in row 2
4. If Telegram is configured, you should receive a test notification

**If test fails:**
- Check **View** → **Logs** for errors
- Verify all credentials are correct
- Make sure sheet headers match exactly

---

## Step 2: Deploy to Netlify (10 minutes)

### 2.1 Deploy Site

**Option A: Drag & Drop (Easiest)**

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub/Email (free)
3. Click **Add new site** → **Deploy manually**
4. Drag the entire `deploy-68fd1da1b1246f000833b2ef` folder
5. Wait 30-60 seconds
6. Your site is live!

**Option B: Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd deploy-68fd1da1b1246f000833b2ef
netlify deploy --prod
```

### 2.2 Add Environment Variables

1. In Netlify dashboard, go to **Site settings**
2. Click **Environment variables** (left sidebar)
3. Click **Add a variable**
4. Add these variables:

**Variable 1:**
```
Key: REACT_APP_GOOGLE_WEBHOOK_URL
Value: https://script.google.com/macros/s/.../exec
```
(Paste your Apps Script webhook URL from Step 1.6)

**Variable 2:**
```
Key: REACT_APP_RAZORPAY_KEY_ID
Value: rzp_test_YOUR_KEY_ID
```
(Paste your Razorpay Key ID from Step 1.2)

5. Click **Save**

### 2.3 Redeploy Site

**IMPORTANT:** Environment variables are baked into the build at deploy time.

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Deploy site**
3. Wait for deployment to complete (30-60 seconds)

### 2.4 Get Your Site URL

Your site is now live at: `https://[random-name].netlify.app`

Copy this URL - you'll need it for testing!

---

## Step 3: Testing (15 minutes)

### 3.1 Basic Tests

1. Visit your Netlify URL
2. Check homepage loads correctly
3. Test language toggle (English ↔ Hindi)
4. Verify all sections are visible
5. Check mobile responsive design

### 3.2 Booking Flow Test

1. Click **"Book Appointment"** button
2. **Date Selection:**
   - Date picker should open
   - Select a future date
   - Click **Continue**
3. **Time Selection:**
   - Time slots should load
   - Select a time slot
   - Click **Continue**
4. **Patient Details:**
   - Fill in all fields:
     - Name: Test Patient
     - Email: test@example.com
     - Phone: 9876543210
     - Reason: Test booking
   - Click **Continue**
5. **Payment:**
   - Review summary
   - Click **Proceed to Payment**
   - Razorpay modal should open
   - Use test card: `4111 1111 1111 1111`
   - Any future expiry date
   - Any CVV
   - Click **Pay**
6. **Confirmation:**
   - Success message should appear
   - Appointment ID displayed

### 3.3 Verify Data

1. **Check Google Sheet:**
   - Open your Google Sheet
   - New row should appear with booking data
   - All fields should be populated
   - Timestamp should be correct

2. **Check Telegram (if configured):**
   - You should receive a notification
   - Message should contain booking details

3. **Check Google Calendar:**
   - Open Google Calendar
   - Event should be created for the appointment date/time
   - Event should have patient details

### 3.4 Browser Console Check

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Should see no errors (red messages)
4. Network tab should show successful API calls

---

## Step 4: Custom Domain (Optional)

### 4.1 Add Domain to Netlify

1. In Netlify, go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `drskumar.com`)
4. Click **Verify**
5. Netlify will guide you through DNS setup

### 4.2 Configure DNS

Go to your domain registrar (where you bought the domain) and add:

**For root domain (drskumar.com):**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: your-site-name.netlify.app
TTL: 3600
```

### 4.3 Wait for DNS Propagation

- DNS changes take 24-48 hours to propagate worldwide
- Check status: [whatsmydns.net](https://whatsmydns.net)
- Netlify will auto-provision SSL certificate (FREE)

### 4.4 Enable HTTPS

1. Once DNS is propagated, go to **Domain settings**
2. Netlify automatically provisions SSL certificate
3. Enable **Force HTTPS** (recommended)
4. Your site is now at `https://yourdomain.com`

---

## Step 5: Go Live with Real Payments

### 5.1 Switch to Live Mode

1. Go to Razorpay dashboard
2. Switch from **Test Mode** to **Live Mode**
3. Complete KYC verification (required for live mode)
4. Generate **Live API Keys**

### 5.2 Update Apps Script

1. Open Apps Script editor
2. Update Razorpay credentials:
   ```javascript
   const RAZORPAY_KEY_ID = 'rzp_live_YOUR_LIVE_KEY_ID';
   const RAZORPAY_KEY_SECRET = 'YOUR_LIVE_KEY_SECRET';
   ```
3. Click **Deploy** → **Manage deployments**
4. Click ✏️ (edit) on your deployment
5. **Version:** New version
6. Click **Deploy**

### 5.3 Update Netlify

1. Go to **Site settings** → **Environment variables**
2. Update `REACT_APP_RAZORPAY_KEY_ID` with live key
3. Go to **Deploys** → **Trigger deploy** → **Deploy site**

### 5.4 Test Live Payment

1. Make a real booking with a small amount
2. Use real card details
3. Verify payment in Razorpay dashboard
4. Check Google Sheet for booking data

---

## Troubleshooting

### Issue: Booking not saving to Google Sheet

**Solutions:**
1. Check Apps Script logs: **View** → **Logs**
2. Verify webhook URL is correct in Netlify
3. Test with `testWebhook()` function
4. Check Apps Script permissions
5. Redeploy Apps Script if needed

### Issue: Payment not working

**Solutions:**
1. Verify Razorpay keys are correct
2. Check browser console for errors
3. Make sure you're using test cards in test mode
4. Check Razorpay dashboard for payment logs

### Issue: Telegram notifications not working

**Solutions:**
1. Verify bot token is correct
2. Verify chat ID is correct
3. Make sure you've started a chat with the bot
4. Test bot manually: send message to bot
5. Check Apps Script logs for errors

### Issue: Website not loading

**Solutions:**
1. Check Netlify deploy log for errors
2. Verify all files uploaded correctly
3. Clear browser cache
4. Try incognito/private mode

### Issue: Environment variables not working

**Solutions:**
1. Make sure you redeployed after adding variables
2. Variables must start with `REACT_APP_`
3. Check for typos in variable names
4. Redeploy site after any changes

---

## Performance Optimization

### Keep Apps Script Fast

- Apps Script has 6-minute execution limit
- Current setup completes in < 5 seconds
- If slow, check:
  - Sheet size (archive old appointments)
  - Network calls (Telegram, Calendar)

### Monitor Netlify

- Check **Analytics** tab for traffic
- Free tier: 100GB bandwidth/month
- Upgrade if needed (unlikely for clinic)

### Razorpay Limits

- Test mode: Unlimited transactions
- Live mode: No transaction limits
- Transaction fees: ~2% per transaction

---

## Maintenance

### Daily
- Check Google Sheet for new appointments
- Respond to Telegram notifications

### Weekly
- Review Razorpay transactions
- Archive old appointments (optional)

### Monthly
- Check Netlify analytics
- Review any errors in logs
- Update doctor availability if needed

---

## Cost Summary

| Service | Plan | Cost |
|---------|------|------|
| Netlify | Free | ₹0 |
| Google Apps Script | Free | ₹0 |
| Google Sheets | Free | ₹0 |
| Google Calendar | Free | ₹0 |
| Telegram | Free | ₹0 |
| SSL Certificate | Free | ₹0 |
| Razorpay | Pay-per-transaction | ~2% per transaction |
| Domain (optional) | Varies | ₹500-1000/year |
| **TOTAL (Monthly)** | | **₹0** |

---

## Security Best Practices

### Apps Script
- ✅ Execute as "Me" (your account)
- ✅ Access: "Anyone" (for webhook)
- ✅ Keep Key Secret private
- ✅ Don't share webhook URL publicly

### Netlify
- ✅ Environment variables are encrypted
- ✅ HTTPS enforced
- ✅ Security headers configured

### Razorpay
- ✅ Never expose Key Secret in frontend
- ✅ Use test mode for testing
- ✅ Verify payments server-side (Apps Script)

---

## Backup & Recovery

### Backup Google Sheet
1. **File** → **Download** → **Excel (.xlsx)**
2. Save locally or to Google Drive
3. Do this weekly

### Backup Apps Script
1. Copy code to local file
2. Save in version control (Git)

### Backup Netlify
1. This deployment folder is your backup
2. Keep it safe

---

## Support Resources

### Documentation
- **Netlify Docs:** [docs.netlify.com](https://docs.netlify.com)
- **Apps Script Docs:** [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Razorpay Docs:** [razorpay.com/docs](https://razorpay.com/docs)

### Check Logs
- **Netlify:** Site settings → Deploy log
- **Apps Script:** View → Logs
- **Razorpay:** Dashboard → Logs
- **Browser:** F12 → Console

### Get Help
- Netlify Support: [support.netlify.com](https://support.netlify.com)
- Razorpay Support: [razorpay.com/support](https://razorpay.com/support)

---

## Success Checklist

- [ ] Google Sheet created with headers
- [ ] Apps Script deployed and tested
- [ ] Razorpay keys configured
- [ ] Telegram bot set up (optional)
- [ ] Site deployed to Netlify
- [ ] Environment variables added
- [ ] Site redeployed after variables
- [ ] Booking flow tested end-to-end
- [ ] Data appears in Google Sheet
- [ ] Telegram notification received
- [ ] Calendar event created
- [ ] Custom domain connected (optional)
- [ ] SSL certificate active
- [ ] Live payments configured (when ready)

---

**Congratulations! Your clinic website is live! 🎉**

**Total Setup Time:** 1-2 hours
**Monthly Cost:** ₹0
**Scalability:** Handles 1000+ appointments/month

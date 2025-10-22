# Configuration Guide - BL Uro-Stone & Kidney Clinic

This guide will help you configure the website for production use.

## Quick Configuration Checklist

- [ ] Configure Razorpay credentials
- [ ] Set up n8n webhook for notifications
- [ ] Test appointment booking flow
- [ ] Update doctor's photo (optional)
- [ ] Verify contact information

---

## 1. Razorpay Payment Gateway Setup

### Step 1: Create Razorpay Account
1. Visit https://dashboard.razorpay.com/signup
2. Sign up with your email and phone number
3. Complete KYC verification for live payments

### Step 2: Get API Credentials
1. Login to Razorpay Dashboard
2. Go to **Settings** → **API Keys**
3. Click **Generate Test Keys** (for testing) or **Generate Live Keys** (for production)
4. Copy both:
   - Key ID (starts with `rzp_test_` or `rzp_live_`)
   - Key Secret

### Step 3: Update Backend Configuration
Edit `/app/backend/.env`:
```env
RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"
```

### Step 4: Update Frontend Configuration
Edit `/app/frontend/.env`:
```env
REACT_APP_RAZORPAY_KEY_ID="rzp_live_YOUR_KEY_ID"
```

### Step 5: Restart Services
```bash
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### Step 6: Test Payment
1. Visit your website
2. Try booking an appointment
3. Use Razorpay test cards:
   - Card: 4111 1111 1111 1111
   - CVV: Any 3 digits
   - Expiry: Any future date

---

## 2. n8n Automation Setup

### Overview
n8n will automatically:
- Send Telegram notification to doctor when appointment is booked
- Add appointment to Google Calendar

### Step 1: Install n8n (if not already)
Choose one option:

**Option A: Cloud (Recommended)**
- Visit https://n8n.io/cloud
- Sign up for free account

**Option B: Self-hosted**
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Step 2: Create Telegram Bot

1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow prompts to create bot
4. Copy the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Get your Telegram Chat ID:
   - Send a message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Find `"chat":{"id":12345678}` in the response

### Step 3: Create n8n Workflow

1. Login to n8n dashboard
2. Click **Create Workflow**
3. Add nodes in this order:

#### Node 1: Webhook (Trigger)
- **Webhook URL:** Copy this URL (e.g., `https://your-n8n.app.n8n.cloud/webhook/abc123`)
- **HTTP Method:** POST
- **Path:** `/appointment-notification`

#### Node 2: Telegram Node
- **Credential:** Add your Bot Token
- **Chat ID:** Your Telegram Chat ID
- **Message:**
```
🏥 New Appointment Booked!

👤 Patient: {{$json.patient_name}}
📞 Phone: {{$json.patient_phone}}
📧 Email: {{$json.patient_email}}

📅 Date: {{$json.appointment_date}}
🕐 Time: {{$json.appointment_time}}

📝 Reason: {{$json.reason}}

💰 Payment: ₹500 (Paid)
💳 Payment ID: {{$json.razorpay_payment_id}}
```

#### Node 3: Google Calendar Node
- **Credential:** Connect your Google account
- **Operation:** Create Event
- **Calendar:** Primary (or your preferred calendar)
- **Event Name:** `Appointment - {{$json.patient_name}}`
- **Start Time:** `{{$json.appointment_date}}T{{$json.appointment_time}}:00`
- **End Time:** Calculate +20 minutes
- **Description:**
```
Patient Details:
Name: {{$json.patient_name}}
Phone: {{$json.patient_phone}}
Email: {{$json.patient_email}}

Reason for Visit: {{$json.reason}}

Payment Status: Completed
Payment ID: {{$json.razorpay_payment_id}}
```

4. **Activate** the workflow

### Step 4: Configure Website
Edit `/app/backend/.env`:
```env
N8N_WEBHOOK_URL="https://your-n8n.app.n8n.cloud/webhook/appointment-notification"
```

Restart backend:
```bash
sudo supervisorctl restart backend
```

### Step 5: Test the Integration
1. Book a test appointment on your website
2. Complete payment
3. Check:
   - ✓ Telegram message received
   - ✓ Event added to Google Calendar

---

## 3. Update Doctor's Photo

Replace the mock images with actual photos:

1. Prepare high-quality photos (recommended: 600x700px for main, 600x500px for about section)
2. Upload to a CDN or image hosting service
3. Edit `/app/frontend/src/pages/Home.jsx`:

```javascript
// Line ~154 - Hero section doctor image
<img
  src="YOUR_IMAGE_URL_HERE"
  alt="Dr. Sandeep Kumar"
  ...
/>

// Line ~236 - About section clinic image
<img
  src="YOUR_CLINIC_IMAGE_URL_HERE"
  alt="Clinic"
  ...
/>
```

---

## 4. Verify Contact Information

Double-check these details in the code:

**Phone Number:** +91 9279816626
**Address:** 1st Floor, G Jeevan Drug Agency Building, Bihar Tokies Road ke Samne, Line Bazar, Purnea - 854301
**Timings:** 9:00 AM - 7:00 PM (Monday to Saturday, Closed on Sunday)

All information is stored in `/app/frontend/src/translations.js` and can be updated there.

---

## 5. Testing Checklist

Before going live, test:

- [ ] Homepage loads correctly
- [ ] Language toggle (English ↔ Hindi) works
- [ ] Book appointment button navigates correctly
- [ ] Date picker shows available dates
- [ ] Time slots load for selected date
- [ ] Patient form validation works
- [ ] Payment gateway opens (Razorpay)
- [ ] Payment completion flow works
- [ ] Telegram notification received
- [ ] Google Calendar event created
- [ ] Mobile responsive design works

---

## 6. Going Live

### Using Test Credentials
- Keep `RAZORPAY_KEY_ID="placeholder_key_id"` for testing without actual payments
- Payments will be simulated, but notifications and calendar events will work

### Using Live Credentials
1. Replace test credentials with live Razorpay keys
2. Test with real payment (small amount)
3. Verify all integrations work
4. Monitor for 24 hours

---

## 7. Monitoring & Maintenance

### Check Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.*.log

# Frontend logs
tail -f /var/log/supervisor/frontend.*.log
```

### View Appointments
Access MongoDB to view all appointments:
```bash
mongosh
use test_database
db.appointments.find().pretty()
```

### Restart Services (if needed)
```bash
sudo supervisorctl restart backend frontend
```

---

## 8. Common Issues & Solutions

### Issue: Payment not processing
**Solution:** Check Razorpay credentials in both `.env` files

### Issue: Telegram notification not received
**Solution:** 
1. Verify n8n workflow is activated
2. Check webhook URL in backend `.env`
3. Test webhook URL directly with curl

### Issue: Calendar event not created
**Solution:**
1. Verify Google account is connected in n8n
2. Check calendar permissions
3. Verify time format in n8n node

### Issue: Time slots not showing
**Solution:**
1. Check if date is in the past
2. Verify MongoDB connection
3. Check backend logs for errors

---

## 9. Cost Estimates

### Razorpay Fees
- Payment Gateway: 2% + GST per transaction
- For ₹500 consultation: ~₹12 fee

### n8n Costs
- Cloud Free Plan: 20 active workflows
- Pro Plan: $20/month (unlimited)
- Self-hosted: Free (only server costs)

---

## Support

If you need help:
1. Check logs first
2. Review this configuration guide
3. Contact technical support

**Emergency Contact:** +91 9279816626

---

## Security Notes

⚠️ **Important Security Practices:**
1. Never commit `.env` files to git
2. Keep Razorpay secret keys secure
3. Use HTTPS for production
4. Regularly update dependencies
5. Monitor for suspicious activity

---

**Last Updated:** January 2025
**Version:** 1.0

# BL Uro-Stone & Kidney Clinic

Appointment booking system for Dr. Sandeep Kumar's urology clinic in Purnea, Bihar.

## Deployment

This is a pre-built static React app ready for deployment to Netlify.

### Environment Variables (Netlify)

Set these in Netlify dashboard under Site settings → Environment variables:

```
REACT_APP_GOOGLE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

### Deploy Steps

1. Push to GitHub
2. Connect to Netlify
3. Build settings: Leave empty (already built)
4. Publish directory: `.`
5. Add environment variables
6. Deploy

## Features

- Bilingual (English/Hindi)
- Date & time slot booking
- Razorpay payment integration
- Google Sheets backend

© 2025 BL Uro-Stone & Kidney Clinic

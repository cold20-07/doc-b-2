# 📋 Website Delivery Checklist

Use this checklist to ensure everything is ready before delivering to the client.

---

## Phase 1: Setup & Configuration ⚙️

### Google Apps Script Setup
- [ ] Created Google Sheet with proper headers
- [ ] Set up Apps Script with provided code
- [ ] Configured Telegram bot (optional)
  - [ ] Got bot token from @BotFather
  - [ ] Got chat ID
  - [ ] Updated script with credentials
- [ ] Deployed Apps Script as web app
- [ ] Copied webhook URL
- [ ] Tested with `testWebhook()` function
- [ ] Verified data appears in Google Sheet

### Doctor Images
- [ ] Got high-quality doctor photos from client
- [ ] Updated hero section image
- [ ] Updated about section image
- [ ] Tested images load properly

### Backend Configuration
- [ ] Updated `backend/.env` with Google webhook URL
- [ ] Tested backend locally
- [ ] Verified API endpoints work

---

## Phase 2: Deployment 🚀

### Backend Deployment (Render.com)
- [ ] Signed up on Render.com
- [ ] Created new Web Service
- [ ] Connected repository or uploaded code
- [ ] Set build command: `cd backend && pip install -r requirements-simple.txt`
- [ ] Set start command: `cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT`
- [ ] Added environment variables:
  - [ ] `CORS_ORIGINS=*`
  - [ ] `RAZORPAY_KEY_ID=placeholder_key_id`
  - [ ] `RAZORPAY_KEY_SECRET=placeholder_key_secret`
  - [ ] `GOOGLE_WEBHOOK_URL=your_webhook_url`
- [ ] Deployed successfully
- [ ] Copied backend URL
- [ ] Tested API: `https://your-backend.onrender.com/api/`

### Frontend Deployment (Netlify)
- [ ] Updated `frontend/.env` with backend URL
- [ ] Built frontend locally: `npm run build`
- [ ] Signed up on Netlify
- [ ] Deployed via drag-drop or GitHub
- [ ] Added environment variables:
  - [ ] `REACT_APP_BACKEND_URL=your_backend_url`
  - [ ] `REACT_APP_RAZORPAY_KEY_ID=placeholder_key_id`
- [ ] Deployed successfully
- [ ] Copied Netlify URL
- [ ] Tested website loads

---

## Phase 3: Domain Setup 🌐

### Custom Domain Configuration
- [ ] Client provided domain name
- [ ] Added domain to Netlify
- [ ] Updated DNS settings at registrar
  - [ ] Added A record or CNAME
  - [ ] Verified DNS propagation
- [ ] SSL certificate auto-provisioned
- [ ] Website accessible at custom domain
- [ ] Both www and non-www work
- [ ] HTTPS enabled and working

### Backend CORS Update
- [ ] Updated `CORS_ORIGINS` in Render
- [ ] Added custom domain to CORS
- [ ] Restarted backend service
- [ ] Verified no CORS errors

---

## Phase 4: Testing 🧪

### Functionality Testing
- [ ] Homepage loads correctly
- [ ] All sections visible (Hero, About, Services, Contact)
- [ ] Language toggle works (English ↔ Hindi)
- [ ] Mobile responsive design works
- [ ] "Book Appointment" button navigates correctly

### Appointment Booking Flow
- [ ] Date picker opens and works
- [ ] Can select future dates only
- [ ] Time slots load for selected date
- [ ] Can select time slot
- [ ] "Continue" button works
- [ ] Patient form appears
- [ ] Form validation works:
  - [ ] Name required
  - [ ] Email validation
  - [ ] Phone validation (10 digits)
- [ ] Payment summary shows correct info
- [ ] Mock payment completes successfully
- [ ] Success message appears
- [ ] Appointment ID displayed

### Integration Testing
- [ ] Appointment saved to Google Sheet
- [ ] All fields populated correctly
- [ ] Telegram notification received (if configured)
- [ ] Google Calendar event created
- [ ] Event details are correct

### Cross-Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Mobile browsers

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] Images optimized and load fast
- [ ] No console errors
- [ ] Backend responds within 2 seconds (after wake-up)

---

## Phase 5: Documentation 📚

### Client Handover Documents
- [ ] Created client documentation folder
- [ ] Included Google Sheet access instructions
- [ ] Included Telegram bot setup guide (if used)
- [ ] Included how to view appointments
- [ ] Included how to add to calendar manually (if needed)
- [ ] Included contact information for support

### Access & Credentials
- [ ] Shared Google Sheet with client (view/edit access)
- [ ] Shared Netlify account access (if needed)
- [ ] Shared Render account access (if needed)
- [ ] Documented all URLs:
  - [ ] Website URL
  - [ ] Backend API URL
  - [ ] Google Sheet URL
  - [ ] Apps Script URL

---

## Phase 6: Client Training 👨‍⚕️

### Doctor Training Session
- [ ] Showed how to access Google Sheet
- [ ] Explained appointment data columns
- [ ] Showed how to filter/sort appointments
- [ ] Demonstrated Telegram notifications
- [ ] Showed Google Calendar integration
- [ ] Explained how to handle appointment queries
- [ ] Provided contact for technical support

### Client Acceptance
- [ ] Client tested booking flow
- [ ] Client verified Google Sheet access
- [ ] Client confirmed Telegram works
- [ ] Client approved website design
- [ ] Client signed off on delivery

---

## Phase 7: Post-Delivery 🎯

### Monitoring Setup
- [ ] Set up UptimeRobot to ping backend every 10 min
- [ ] Added client's email for uptime alerts
- [ ] Documented how to check backend status
- [ ] Documented how to restart services if needed

### Future Enhancements (Optional)
- [ ] Discussed real Razorpay integration timeline
- [ ] Discussed potential paid upgrades
- [ ] Discussed additional features client wants
- [ ] Provided cost estimates for upgrades

### Final Deliverables
- [ ] Live website on custom domain
- [ ] Working appointment system
- [ ] Google Sheet with data
- [ ] Telegram notifications (if configured)
- [ ] Calendar integration
- [ ] All documentation
- [ ] Source code (if requested)
- [ ] Training completed
- [ ] Support plan agreed

---

## Emergency Contacts 🆘

### If Something Breaks:

**Backend Down:**
1. Check Render dashboard for errors
2. Check logs in Render
3. Restart service if needed
4. Verify environment variables

**Frontend Issues:**
1. Check Netlify deploy log
2. Verify build succeeded
3. Check browser console for errors
4. Clear cache and test

**Google Sheet Not Updating:**
1. Check Apps Script logs
2. Verify webhook URL is correct
3. Test with `testWebhook()` function
4. Check script permissions

**Telegram Not Working:**
1. Verify bot token is correct
2. Verify chat ID is correct
3. Test bot with direct message
4. Check Apps Script logs

---

## Success Criteria ✅

Website is ready for delivery when:
- ✅ All checklist items completed
- ✅ Zero critical bugs
- ✅ Client can book appointments successfully
- ✅ Data flows to Google Sheet correctly
- ✅ Notifications work (if configured)
- ✅ Website is fast and responsive
- ✅ Client is trained and satisfied
- ✅ Documentation is complete

---

## Payment Milestone Suggestions 💰

Suggest to client:
- **50% upfront** - Before starting work
- **30% on deployment** - When website is live
- **20% on acceptance** - After client approval

---

**Total Estimated Time:** 4-6 hours
**Client Value:** ₹15,000 - ₹30,000
**Your Cost:** ₹0/month
**Profit Margin:** 100% 🎉

---

**Ready to deliver! Good luck! 🚀**

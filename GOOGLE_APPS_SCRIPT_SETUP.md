# Google Apps Script Setup Guide

This guide will help you set up a FREE Google Apps Script to handle appointments without any paid services.

## What This Script Does:
1. ✅ Receives appointment data from your website
2. ✅ Saves data to Google Sheets
3. ✅ Sends Telegram notification to doctor
4. ✅ Adds appointment to Google Calendar
5. ✅ All 100% FREE!

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Dr Sandeep Kumar - Appointments"**
4. In the first row, add these headers:
   ```
   Appointment ID | Patient Name | Email | Phone | Date | Time | Reason | Payment Status | Payment ID | Created At
   ```

---

## Step 2: Set Up Google Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete any existing code
3. Copy and paste the script below:

```javascript
// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";  // Get from @BotFather
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID_HERE";      // Your Telegram chat ID

// Google Calendar ID (usually your email)
const CALENDAR_ID = "your-email@gmail.com";        // Your Google Calendar email

// ============================================
// MAIN WEBHOOK FUNCTION
// ============================================

function doPost(e) {
  try {
    // Parse incoming appointment data
    const data = JSON.parse(e.postData.contents);
    
    // 1. Save to Google Sheets
    saveToSheet(data);
    
    // 2. Send Telegram notification
    sendTelegramNotification(data);
    
    // 3. Add to Google Calendar
    addToCalendar(data);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", message: "Appointment saved" })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// SAVE TO GOOGLE SHEETS
// ============================================

function saveToSheet(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Prepare row data
  const row = [
    data.id || "",
    data.patient_name || "",
    data.patient_email || "",
    data.patient_phone || "",
    data.appointment_date || "",
    data.appointment_time || "",
    data.reason || "",
    data.payment_status || "",
    data.razorpay_payment_id || "",
    data.created_at || new Date().toISOString()
  ];
  
  // Append to sheet
  sheet.appendRow(row);
  
  Logger.log("Saved to sheet: " + data.patient_name);
}

// ============================================
// SEND TELEGRAM NOTIFICATION
// ============================================

function sendTelegramNotification(data) {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === "YOUR_BOT_TOKEN_HERE") {
    Logger.log("Telegram not configured, skipping...");
    return;
  }
  
  // Format message
  const message = `
🏥 *New Appointment Booked!*

👤 *Patient:* ${data.patient_name}
📞 *Phone:* ${data.patient_phone}
📧 *Email:* ${data.patient_email}

📅 *Date:* ${data.appointment_date}
🕐 *Time:* ${data.appointment_time}

📝 *Reason:* ${data.reason || "General Consultation"}

💰 *Payment:* ₹500 (Paid)
💳 *Payment ID:* ${data.razorpay_payment_id}

🆔 *Appointment ID:* ${data.id}
  `.trim();
  
  // Send to Telegram
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const payload = {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: "Markdown"
  };
  
  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("Telegram sent: " + response.getContentText());
  } catch (error) {
    Logger.log("Telegram error: " + error.toString());
  }
}

// ============================================
// ADD TO GOOGLE CALENDAR
// ============================================

function addToCalendar(data) {
  try {
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    
    if (!calendar) {
      Logger.log("Calendar not found, using default calendar");
      calendar = CalendarApp.getDefaultCalendar();
    }
    
    // Parse date and time
    const dateStr = data.appointment_date; // Format: YYYY-MM-DD
    const timeStr = data.appointment_time; // Format: HH:MM
    
    const [year, month, day] = dateStr.split("-").map(Number);
    const [hour, minute] = timeStr.split(":").map(Number);
    
    // Create start time
    const startTime = new Date(year, month - 1, day, hour, minute);
    
    // End time (20 minutes later)
    const endTime = new Date(startTime.getTime() + 20 * 60000);
    
    // Event details
    const title = `Appointment - ${data.patient_name}`;
    const description = `
Patient Details:
Name: ${data.patient_name}
Phone: ${data.patient_phone}
Email: ${data.patient_email}

Reason: ${data.reason || "General Consultation"}

Payment Status: Completed
Payment ID: ${data.razorpay_payment_id}
Appointment ID: ${data.id}
    `.trim();
    
    // Create event
    const event = calendar.createEvent(title, startTime, endTime, {
      description: description,
      location: "BL Uro-Stone & Kidney Clinic, Purnea"
    });
    
    Logger.log("Calendar event created: " + event.getId());
    
  } catch (error) {
    Logger.log("Calendar error: " + error.toString());
  }
}

// ============================================
// TEST FUNCTION (Optional)
// ============================================

function testWebhook() {
  const testData = {
    id: "test-123",
    patient_name: "Test Patient",
    patient_email: "test@example.com",
    patient_phone: "9876543210",
    appointment_date: "2025-10-25",
    appointment_time: "14:00",
    reason: "Test appointment",
    payment_status: "completed",
    razorpay_payment_id: "pay_test123",
    created_at: new Date().toISOString()
  };
  
  saveToSheet(testData);
  sendTelegramNotification(testData);
  addToCalendar(testData);
  
  Logger.log("Test completed!");
}
```

---

## Step 3: Configure Telegram Bot (Optional but Recommended)

### Create Telegram Bot:
1. Open Telegram and search for **@BotFather**
2. Send `/newbot` command
3. Follow prompts to create your bot
4. Copy the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Get Your Chat ID:
1. Send a message to your bot
2. Visit this URL in browser (replace YOUR_BOT_TOKEN):
   ```
   https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
   ```
3. Look for `"chat":{"id":12345678}` in the response
4. Copy that number (your Chat ID)

### Update Script:
- Replace `YOUR_BOT_TOKEN_HERE` with your bot token
- Replace `YOUR_CHAT_ID_HERE` with your chat ID

---

## Step 4: Deploy the Script

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure:
   - **Description:** "Appointment Webhook"
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**
6. **Copy the Web App URL** (looks like: `https://script.google.com/macros/s/ABC.../exec`)
7. Click **Done**

---

## Step 5: Update Your Backend

1. Open `backend/.env` file
2. Add your webhook URL:
   ```
   GOOGLE_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   ```
3. Save the file
4. Restart your backend server

---

## Step 6: Test It!

### Option 1: Test from Apps Script
1. In Apps Script, select `testWebhook` function from dropdown
2. Click **Run** (▶️)
3. Check your Google Sheet - should see test data
4. Check Telegram - should receive notification
5. Check Google Calendar - should see event

### Option 2: Test from Website
1. Go to your website
2. Book a test appointment
3. Complete payment (mock payment)
4. Check Google Sheet, Telegram, and Calendar

---

## Troubleshooting

### Issue: "Authorization required"
- Click **Review permissions**
- Choose your Google account
- Click **Advanced** → **Go to [Project Name] (unsafe)**
- Click **Allow**

### Issue: Telegram not working
- Verify bot token is correct
- Verify chat ID is correct
- Make sure you sent at least one message to the bot first

### Issue: Calendar not working
- Make sure CALENDAR_ID is your email
- Or leave it empty to use default calendar

### Issue: Webhook not receiving data
- Make sure deployment is set to "Anyone" can access
- Copy the exact URL from deployment
- Test with Postman or curl first

---

## Cost Breakdown

| Service | Cost |
|---------|------|
| Google Sheets | FREE |
| Google Apps Script | FREE |
| Google Calendar | FREE |
| Telegram Bot | FREE |
| **TOTAL** | **₹0** |

---

## Next Steps

Once this is working:
1. ✅ Update doctor images on website
2. ✅ Configure real Razorpay credentials (when ready)
3. ✅ Deploy to Netlify with your domain
4. ✅ Share Google Sheet with doctor for viewing appointments

---

## Support

If you face any issues:
1. Check the Apps Script logs: **View** → **Logs**
2. Test the `testWebhook()` function first
3. Verify all configuration values are correct

**You're all set! 🎉**

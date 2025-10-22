// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Telegram Bot Configuration (OPTIONAL - Leave as is if not using)
const TELEGRAM_BOT_TOKEN = "YOUR_BOT_TOKEN_HERE";  // Get from @BotFather
const TELEGRAM_CHAT_ID = "YOUR_CHAT_ID_HERE";      // Your Telegram chat ID

// Google Calendar ID (Your email address)
const CALENDAR_ID = "your-email@gmail.com";        // Replace with your Gmail

// ============================================
// MAIN WEBHOOK FUNCTION
// ============================================

function doPost(e) {
  try {
    // Parse incoming appointment data
    const data = JSON.parse(e.postData.contents);
    
    // Log received data
    Logger.log("Received appointment: " + JSON.stringify(data));
    
    // 1. Save to Google Sheets
    saveToSheet(data);
    
    // 2. Send Telegram notification (if configured)
    if (TELEGRAM_BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE") {
      sendTelegramNotification(data);
    }
    
    // 3. Add to Google Calendar
    addToCalendar(data);
    
    // Return success response
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: "success", 
        message: "Appointment saved successfully" 
      })
    ).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log("Error: " + error.toString());
    return ContentService.createTextOutput(
      JSON.stringify({ 
        status: "error", 
        message: error.toString() 
      })
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
    data.reason || "General Consultation",
    data.payment_status || "",
    data.razorpay_payment_id || "",
    new Date().toLocaleString("en-IN", {timeZone: "Asia/Kolkata"})
  ];
  
  // Append to sheet
  sheet.appendRow(row);
  
  Logger.log("✅ Saved to sheet: " + data.patient_name);
}

// ============================================
// SEND TELEGRAM NOTIFICATION
// ============================================

function sendTelegramNotification(data) {
  try {
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
    const url = "https://api.telegram.org/bot" + TELEGRAM_BOT_TOKEN + "/sendMessage";
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
    
    const response = UrlFetchApp.fetch(url, options);
    Logger.log("✅ Telegram notification sent");
    
  } catch (error) {
    Logger.log("⚠️ Telegram error: " + error.toString());
  }
}

// ============================================
// ADD TO GOOGLE CALENDAR
// ============================================

function addToCalendar(data) {
  try {
    // Get calendar
    let calendar;
    try {
      calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    } catch (e) {
      Logger.log("Using default calendar");
      calendar = CalendarApp.getDefaultCalendar();
    }
    
    if (!calendar) {
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
    const title = "Appointment - " + data.patient_name;
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
      location: "BL Uro-Stone & Kidney Clinic, Purnea, Bihar"
    });
    
    Logger.log("✅ Calendar event created: " + event.getId());
    
  } catch (error) {
    Logger.log("⚠️ Calendar error: " + error.toString());
  }
}

// ============================================
// TEST FUNCTION
// ============================================

function testWebhook() {
  const testData = {
    id: "test-" + new Date().getTime(),
    patient_name: "Test Patient",
    patient_email: "test@example.com",
    patient_phone: "9876543210",
    appointment_date: "2025-10-25",
    appointment_time: "14:00",
    reason: "Test appointment",
    payment_status: "completed",
    razorpay_payment_id: "pay_test123"
  };
  
  Logger.log("Running test...");
  saveToSheet(testData);
  
  if (TELEGRAM_BOT_TOKEN !== "YOUR_BOT_TOKEN_HERE") {
    sendTelegramNotification(testData);
  }
  
  addToCalendar(testData);
  
  Logger.log("✅ Test completed! Check your sheet, Telegram, and calendar.");
}

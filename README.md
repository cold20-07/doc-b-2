<<<<<<< HEAD
# BL Uro-Stone & Kidney Clinic - Dr. Sandeep Kumar

A modern, professional medical website with appointment booking system for Dr. Sandeep Kumar's urology and kidney stone clinic in Purnea, Bihar.

## Features

### 🌟 Core Features
- **Modern Hero Section** with glassmorphism effects and smooth animations
- **About Doctor Section** with credentials and qualifications
- **Services Display** showcasing 4 key medical services
- **Contact Information** with clinic address, phone, and timings
- **Language Toggle** - Switch between English and Hindi
- **Mobile Responsive** - Works beautifully on all devices

### 📅 Appointment Booking System
- **Step 1:** Select date and time from available slots
- **Step 2:** Enter patient details (name, email, phone, reason)
- **Step 3:** Payment processing via Razorpay
- **Step 4:** Confirmation with appointment ID

### 🔄 Integrations
- **Razorpay Payment Gateway** for secure online payments
- **n8n Webhook Integration** for automation (Telegram notifications & Google Calendar)
- **MongoDB** for storing appointments

## Tech Stack

### Frontend
- React 19
- Tailwind CSS
- Shadcn UI Components
- Axios for API calls
- React Router for navigation
- date-fns for date formatting
- Sonner for toast notifications

### Backend
- FastAPI (Python)
- MongoDB with Motor (async driver)
- Razorpay SDK
- HTTPX for webhook calls
- Pydantic for data validation

## Configuration

### Backend Environment Variables (.env)

```env
# MongoDB Configuration
MONGO_URL="mongodb://localhost:27017"
DB_NAME="test_database"

# CORS Configuration
CORS_ORIGINS="*"

# Razorpay Credentials (CONFIGURE THESE)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
RAZORPAY_WEBHOOK_SECRET="your_webhook_secret"

# n8n Webhook URL (CONFIGURE THIS)
N8N_WEBHOOK_URL="your_n8n_webhook_url"
```

### Frontend Environment Variables (.env)

```env
REACT_APP_BACKEND_URL=https://doctorconnect-1.preview.emergentagent.com

# Razorpay Configuration (CONFIGURE THIS)
REACT_APP_RAZORPAY_KEY_ID="your_razorpay_key_id"
```

## API Endpoints

### Available Endpoints

#### `GET /api/`
- Health check endpoint
- Returns: `{"message": "BL Uro-Stone & Kidney Clinic API"}`

#### `GET /api/available-slots?date=YYYY-MM-DD`
- Get available appointment slots for a specific date
- Time: 9 AM - 8 PM, 20-minute intervals
- Returns: `{"available_slots": ["09:00", "09:20", ...]}`

#### `POST /api/appointments`
- Create new appointment

#### `POST /api/create-payment-order`
- Create Razorpay payment order

#### `POST /api/verify-payment`
- Verify payment and trigger webhooks

#### `POST /api/n8n-webhook`
- Placeholder endpoint for n8n to send data back

## Setup Instructions

### 1. Razorpay Integration

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create an account or login
3. Navigate to Settings → API Keys
4. Copy your `Key ID` and `Key Secret`
5. Update both `.env` files:
   - Backend: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
   - Frontend: `REACT_APP_RAZORPAY_KEY_ID`
6. Restart services:
   ```bash
   sudo supervisorctl restart backend
   sudo supervisorctl restart frontend
   ```

### 2. n8n Webhook Integration

The website automatically sends appointment data to your n8n webhook after successful payment.

#### n8n Workflow Setup:

1. **Create n8n Workflow:**
   - Add a Webhook node (trigger)
   - Copy the webhook URL
   - Add your automation logic:
     - Telegram Bot node for doctor notification
     - Google Calendar node for adding appointment

2. **Configure Backend:**
   - Add webhook URL to `/app/backend/.env`:
     ```env
     N8N_WEBHOOK_URL="https://your-n8n-instance.com/webhook/your-webhook-id"
     ```
   - Restart backend: `sudo supervisorctl restart backend`

3. **Webhook Payload:**
   ```json
   {
     "id": "appointment-uuid",
     "patient_name": "John Doe",
     "patient_email": "john@example.com",
     "patient_phone": "9876543210",
     "appointment_date": "2025-01-20",
     "appointment_time": "14:00",
     "reason": "Kidney stone consultation",
     "payment_status": "completed",
     "razorpay_payment_id": "pay_xxx",
     "created_at": "2025-01-15T10:30:00Z"
   }
   ```

## Clinic Details

- **Doctor:** Dr. Sandeep Kumar
- **Specialization:** Urologist & Kidney Specialist
- **Address:** 1st Floor, G Jeevan Drug Agency Building, Bihar Tokies Road ke Samne, Line Bazar, Purnea - 854301
- **Phone/WhatsApp:** +91 9279816626
- **Timings:** 9:00 AM - 7:00 PM (Monday to Saturday, Closed on Sunday)
- **Consultation Fee:** ₹500

### Qualifications:
- MBBS, MS (General Surgery)
- FMAS, DNB Urology (Ahmedabad)
- Fellowship Endourology (Rajkot)
- Ex. Senior Resident AIIMS & PMCH Patna
- Reg. No.: BCMR - 42188

## Testing Without Razorpay

The system includes a mock payment mode for testing:
- If `RAZORPAY_KEY_ID="placeholder_key_id"` (default), payments are simulated
- Appointments will be created and marked as completed
- n8n webhooks will still trigger
- Replace with real credentials for production

## Deployment

The application is containerized and ready for deployment. Key points:

1. **Environment Variables:** All sensitive data is in `.env` files
2. **Service URLs:** Frontend uses `REACT_APP_BACKEND_URL` for API calls
3. **Database:** MongoDB connection via `MONGO_URL`
4. **No Hardcoding:** All configurations are externalized

---

**Built with ❤️ by Emergent Agent**
=======
# doc-b-2
>>>>>>> origin/main

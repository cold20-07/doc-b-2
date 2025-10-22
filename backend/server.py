from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import razorpay
import httpx

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# In-memory storage for appointments (temporary, until sent to Google Sheets)
appointments_store = {}
booked_slots = {}  # {date: [time1, time2, ...]}

# Razorpay client (will use placeholder credentials from .env)
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID', 'placeholder_key_id')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_key_secret')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

# Google Apps Script webhook URL
google_webhook_url = os.environ.get('GOOGLE_WEBHOOK_URL', '')

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    patient_name: str
    patient_email: str
    patient_phone: str
    appointment_date: str
    appointment_time: str
    reason: Optional[str] = None
    payment_status: str = "pending"  # pending, completed, failed
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AppointmentCreate(BaseModel):
    patient_name: str
    patient_email: str
    patient_phone: str
    appointment_date: str
    appointment_time: str
    reason: Optional[str] = None

class PaymentOrder(BaseModel):
    amount: int  # Amount in paise (INR)
    currency: str = "INR"
    appointment_id: str

class PaymentVerification(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    appointment_id: str

# Routes
@api_router.get("/")
async def root():
    return {"message": "BL Uro-Stone & Kidney Clinic API"}

@api_router.get("/available-slots")
async def get_available_slots(date: str):
    """
    Get available time slots for a specific date
    Time: 9 AM - 7 PM, 20 min slots (Closed on Sunday)
    """
    from datetime import datetime
    
    # Parse the date to check if it's Sunday
    date_obj = datetime.strptime(date, "%Y-%m-%d")
    
    # Check if Sunday (weekday() returns 6 for Sunday)
    if date_obj.weekday() == 6:
        return {"available_slots": [], "message": "Clinic closed on Sunday"}
    
    # Get booked times from in-memory storage
    booked_times = booked_slots.get(date, [])
    
    # Generate all possible slots (9 AM - 7 PM, 20 min intervals)
    all_slots = []
    start_hour = 9
    end_hour = 19  # Changed from 20 to 19 (7 PM)
    
    for hour in range(start_hour, end_hour):
        for minute in [0, 20, 40]:
            time_str = f"{hour:02d}:{minute:02d}"
            all_slots.append(time_str)
    
    # Filter out booked slots
    available_slots = [slot for slot in all_slots if slot not in booked_times]
    
    return {"available_slots": available_slots}

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(appointment: AppointmentCreate):
    """
    Create a new appointment (payment pending)
    """
    appointment_dict = appointment.model_dump()
    appointment_obj = Appointment(**appointment_dict)
    
    # Store in memory temporarily
    appointments_store[appointment_obj.id] = appointment_obj.model_dump()
    
    return appointment_obj

@api_router.post("/create-payment-order")
async def create_payment_order(order: PaymentOrder):
    """
    Create Razorpay payment order
    """
    try:
        # In production, this will create actual Razorpay order
        # For now with placeholder credentials, we'll create a mock order
        if razorpay_key_id == 'placeholder_key_id':
            # Mock order for testing without credentials
            mock_order = {
                "id": f"order_mock_{uuid.uuid4().hex[:12]}",
                "amount": order.amount,
                "currency": order.currency,
                "status": "created"
            }
            
            # Update appointment in memory
            if order.appointment_id in appointments_store:
                appointments_store[order.appointment_id]["razorpay_order_id"] = mock_order["id"]
            
            return mock_order
        else:
            # Real Razorpay order creation
            razor_order = razorpay_client.order.create({
                "amount": order.amount,
                "currency": order.currency,
                "payment_capture": 1
            })
            
            # Update appointment in memory
            if order.appointment_id in appointments_store:
                appointments_store[order.appointment_id]["razorpay_order_id"] = razor_order["id"]
            
            return razor_order
    except Exception as e:
        logging.error(f"Error creating payment order: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/verify-payment")
async def verify_payment(verification: PaymentVerification):
    """
    Verify Razorpay payment and send to Google Sheets
    """
    try:
        # For mock payments, just verify the format
        if razorpay_key_id == 'placeholder_key_id':
            # Mock verification for testing
            is_verified = verification.razorpay_order_id.startswith("order_mock_")
        else:
            # Real Razorpay signature verification
            params_dict = {
                'razorpay_order_id': verification.razorpay_order_id,
                'razorpay_payment_id': verification.razorpay_payment_id,
                'razorpay_signature': verification.razorpay_signature
            }
            is_verified = razorpay_client.utility.verify_payment_signature(params_dict)
        
        if is_verified:
            # Get appointment from memory
            appointment = appointments_store.get(verification.appointment_id)
            
            if not appointment:
                raise HTTPException(status_code=404, detail="Appointment not found")
            
            # Update appointment as completed
            appointment["payment_status"] = "completed"
            appointment["razorpay_payment_id"] = verification.razorpay_payment_id
            
            # Mark slot as booked
            date = appointment["appointment_date"]
            time = appointment["appointment_time"]
            if date not in booked_slots:
                booked_slots[date] = []
            booked_slots[date].append(time)
            
            # Send to Google Apps Script webhook
            if google_webhook_url:
                try:
                    async with httpx.AsyncClient() as http_client:
                        response = await http_client.post(
                            google_webhook_url,
                            json=appointment,
                            timeout=30.0
                        )
                        logging.info(f"Google webhook response: {response.status_code}")
                except Exception as webhook_error:
                    logging.error(f"Google webhook failed: {webhook_error}")
                    # Don't fail the payment if webhook fails
            
            return {"status": "success", "message": "Payment verified and appointment confirmed"}
        else:
            # Update as failed
            if verification.appointment_id in appointments_store:
                appointments_store[verification.appointment_id]["payment_status"] = "failed"
            raise HTTPException(status_code=400, detail="Payment verification failed")
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error verifying payment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/appointments")
async def get_appointments():
    """
    Get all appointments (for admin/doctor view)
    """
    appointments = list(appointments_store.values())
    return {"appointments": appointments, "count": len(appointments)}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# No database cleanup needed
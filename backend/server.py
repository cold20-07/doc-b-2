from fastapi import FastAPI, APIRouter, HTTPException, Request
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
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

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Razorpay client (will use placeholder credentials from .env)
razorpay_key_id = os.environ.get('RAZORPAY_KEY_ID', 'placeholder_key_id')
razorpay_key_secret = os.environ.get('RAZORPAY_KEY_SECRET', 'placeholder_key_secret')
razorpay_client = razorpay.Client(auth=(razorpay_key_id, razorpay_key_secret))

# n8n webhook URL (placeholder)
n8n_webhook_url = os.environ.get('N8N_WEBHOOK_URL', '')

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
    Time: 9 AM - 8 PM, 20 min slots
    """
    # Get booked appointments for the date
    booked_appointments = await db.appointments.find(
        {"appointment_date": date, "payment_status": "completed"},
        {"_id": 0, "appointment_time": 1}
    ).to_list(1000)
    
    booked_times = [apt["appointment_time"] for apt in booked_appointments]
    
    # Generate all possible slots (9 AM - 8 PM, 20 min intervals)
    all_slots = []
    start_hour = 9
    end_hour = 20
    
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
    
    # Convert to dict for MongoDB
    doc = appointment_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.appointments.insert_one(doc)
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
            
            # Update appointment with order ID
            await db.appointments.update_one(
                {"id": order.appointment_id},
                {"$set": {"razorpay_order_id": mock_order["id"]}}
            )
            
            return mock_order
        else:
            # Real Razorpay order creation
            razor_order = razorpay_client.order.create({
                "amount": order.amount,
                "currency": order.currency,
                "payment_capture": 1
            })
            
            # Update appointment with order ID
            await db.appointments.update_one(
                {"id": order.appointment_id},
                {"$set": {"razorpay_order_id": razor_order["id"]}}
            )
            
            return razor_order
    except Exception as e:
        logging.error(f"Error creating payment order: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.post("/verify-payment")
async def verify_payment(verification: PaymentVerification):
    """
    Verify Razorpay payment and update appointment status
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
            # Update appointment as completed
            result = await db.appointments.update_one(
                {"id": verification.appointment_id},
                {"$set": {
                    "payment_status": "completed",
                    "razorpay_payment_id": verification.razorpay_payment_id
                }}
            )
            
            # Get appointment details for n8n webhook
            appointment = await db.appointments.find_one(
                {"id": verification.appointment_id},
                {"_id": 0}
            )
            
            # Send to n8n webhook if configured
            if n8n_webhook_url and appointment:
                try:
                    async with httpx.AsyncClient() as http_client:
                        await http_client.post(
                            n8n_webhook_url,
                            json=appointment,
                            timeout=10.0
                        )
                except Exception as webhook_error:
                    logging.error(f"n8n webhook failed: {webhook_error}")
            
            return {"status": "success", "message": "Payment verified and appointment confirmed"}
        else:
            # Update as failed
            await db.appointments.update_one(
                {"id": verification.appointment_id},
                {"$set": {"payment_status": "failed"}}
            )
            raise HTTPException(status_code=400, detail="Payment verification failed")
    
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error verifying payment: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments():
    """
    Get all appointments (for admin/doctor view)
    """
    appointments = await db.appointments.find({}, {"_id": 0}).to_list(1000)
    
    for apt in appointments:
        if isinstance(apt['created_at'], str):
            apt['created_at'] = datetime.fromisoformat(apt['created_at'])
    
    return appointments

@api_router.post("/n8n-webhook")
async def n8n_webhook_endpoint(request: Request):
    """
    Placeholder endpoint for n8n to send data back
    This can be configured later based on n8n workflow needs
    """
    try:
        body = await request.json()
        logging.info(f"Received n8n webhook: {body}")
        return {"status": "received", "message": "Webhook data processed"}
    except Exception as e:
        logging.error(f"Error processing n8n webhook: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
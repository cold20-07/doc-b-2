import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Calendar as CalendarIcon, User, CreditCard } from "lucide-react";
import { format, isSunday } from "date-fns";

const WEBHOOK_URL = process.env.REACT_APP_GOOGLE_WEBHOOK_URL;

// Function to send data to Google Apps Script (handles CORS)
const sendToWebhook = async (data) => {
  if (!WEBHOOK_URL) {
    console.warn("Webhook URL not configured");
    return null;
  }
  
  try {
    // Try using fetch with redirect follow (Google Apps Script returns redirect)
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'text/plain',
      },
      mode: 'no-cors'
    });
    
    return response;
  } catch (error) {
    console.error("Webhook error:", error);
    return null;
  }
};

const BookAppointment = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({
    patient_name: "",
    patient_email: "",
    patient_phone: "",
    reason: ""
  });
  const [appointmentId, setAppointmentId] = useState("");
  const [processing, setProcessing] = useState(false);

  // Generate time slots with 20-minute intervals in 12-hour format
  const generateTimeSlots = () => {
    const slots = [];

    // Helper to add slots for a time range
    const addSlots = (startHour, startMin, endHour, endMin) => {
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = hour === startHour ? startMin : 0; minute < 60; minute += 20) {
          // Stop if we've passed the end time
          if (hour === endHour && minute > endMin) break;

          // Convert to 12-hour format
          const period = hour >= 12 ? "PM" : "AM";
          const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
          const hourStr = hour12.toString().padStart(2, "0");
          const minuteStr = minute.toString().padStart(2, "0");
          slots.push(`${hourStr}:${minuteStr} ${period}`);
        }
      }
    };

    // Morning: 09:00 AM - 11:30 AM
    addSlots(9, 0, 11, 30);
    // Afternoon: 02:00 PM - 04:30 PM
    addSlots(14, 0, 16, 30);
    // Evening: 05:00 PM - 06:30 PM
    addSlots(17, 0, 18, 30);

    return slots;
  };

  // Parse 12-hour time slot to get hours in 24-hour format
  const parseTimeSlot = (slot) => {
    const [time, period] = slot.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    let hour24 = hours;
    if (period === "PM" && hours !== 12) hour24 += 12;
    if (period === "AM" && hours === 12) hour24 = 0;
    return { hours: hour24, minutes };
  };

  // Generate available time slots locally (no backend needed)
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setLoadingSlots(true);

    try {
      // Generate time slots: 09:00 AM to 06:40 PM with 20-minute intervals
      let allSlots = generateTimeSlots();

      // Filter out past time slots if the selected date is today
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();

      if (isToday) {
        allSlots = allSlots.filter((slot) => {
          const { hours, minutes } = parseTimeSlot(slot);

          const slotDate = new Date(date);
          slotDate.setHours(hours, minutes, 0, 0);

          return slotDate > now;
        });
      }

      setAvailableSlots(allSlots);
    } catch (error) {
      console.error("Error generating slots:", error);
      toast.error(t('booking.errors.slotsError'));
      setAvailableSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleStepOne = () => {
    if (!selectedDate || !selectedTime) {
      toast.error(t('booking.errors.selectDateTime'));
      return;
    }
    setStep(2);
  };

  const handleStepTwo = () => {
    if (!formData.patient_name || !formData.patient_email || !formData.patient_phone) {
      toast.error(t('booking.errors.fillRequired'));
      return;
    }

    // Validate phone number (Indian format)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.patient_phone)) {
      toast.error(t('booking.errors.invalidPhone'));
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.patient_email)) {
      toast.error(t('booking.errors.invalidEmail'));
      return;
    }

    setStep(3);
  };

  const handlePayment = async () => {
    setProcessing(true);
    
    try {
      const newAppointmentId = `apt_${Date.now()}`;
      setAppointmentId(newAppointmentId);
      
      // Create appointment data
      const appointmentData = {
        id: newAppointmentId,
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_phone: formData.patient_phone,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        reason: formData.reason || "General Consultation",
        payment_status: "pending"
      };

      // Serverless flow with Razorpay
      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
      
      if (!razorpayKeyId || razorpayKeyId === 'placeholder_key_id' || razorpayKeyId === 'rzp_test_YOUR_KEY_ID') {
        // Mock payment for testing (no Razorpay key configured)
        toast.info(t('booking.mockPayment'));
        
        appointmentData.payment_status = "completed";
        appointmentData.razorpay_payment_id = `pay_mock_${Date.now()}`;
        
        // Send to Google Apps Script webhook (no-cors mode)
        await sendToWebhook(appointmentData);
        
        toast.success(t('booking.success.title'));
        setStep(4);
      } else {
        // Real Razorpay payment
        if (typeof window.Razorpay === 'undefined') {
          toast.error("Payment system not loaded. Please refresh the page.");
          setProcessing(false);
          return;
        }
        
        const options = {
          key: razorpayKeyId,
          amount: 50000, // ₹500 in paise
          currency: "INR",
          name: "BL Uro-Stone & Kidney Clinic",
          description: "Appointment Consultation Fee",
          handler: async (response) => {
            try {
              // Payment successful - save to Google Sheets
              appointmentData.payment_status = "completed";
              appointmentData.razorpay_payment_id = response.razorpay_payment_id;
              
              // Send to Google Apps Script webhook (no-cors mode)
              await sendToWebhook(appointmentData);
              
              toast.success(t('booking.success.title'));
              setStep(4);
            } catch (error) {
              console.error("Error saving appointment:", error);
              toast.error(t('booking.errors.bookingFailed'));
            } finally {
              setProcessing(false);
            }
          },
          prefill: {
            name: formData.patient_name,
            email: formData.patient_email,
            contact: formData.patient_phone
          },
          theme: {
            color: "#0ea5e9"
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
              toast.error("Payment cancelled");
            }
          }
        };
        
        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return; // Don't set processing to false here, handler will do it
      }
    } catch (error) {
      console.error("Error processing appointment:", error);
      toast.error(t('booking.errors.bookingFailed'));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? navigate("/") : setStep(step - 1)}
            className="mb-4"
            data-testid="back-button"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('booking.back')}
          </Button>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            {t('booking.title')}
          </h1>
          <p className="text-base text-gray-600">
            {t('booking.subtitle')}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 animate-fade-in-up delay-200">
          <div className="flex items-start justify-between">
            {[
              { num: 1, label: t("booking.steps.step1") },
              { num: 2, label: t("booking.steps.step2") },
              { num: 3, label: t("booking.steps.step3") },
              { num: 4, label: t("booking.steps.step4") },
            ].map((item, index) => (
              <div key={item.num} className="flex flex-col items-center relative flex-1">
                {/* Connector line */}
                {index < 3 && (
                  <div
                    className={`absolute top-5 left-1/2 w-full h-1 transition-all ${
                      step > item.num ? "bg-sky-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
                {/* Circle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all z-10 ${
                    step >= item.num
                      ? "bg-sky-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  data-testid={`step-indicator-${item.num}`}
                >
                  {item.num}
                </div>
                {/* Label */}
                <span className="mt-2 text-xs text-gray-600 text-center whitespace-nowrap">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="glass-strong border-none shadow-2xl animate-fade-in-up delay-400">
          <CardContent className="p-8">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <div className="space-y-8" data-testid="step-1-content">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <CalendarIcon className="w-6 h-6 text-sky-600" />
                    {t('booking.step1.title')}
                  </h2>
                  <p className="text-sm text-gray-600">{t('booking.step1.subtitle')}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">{t('booking.step1.selectDate')}</Label>
                    <div className="flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          // Disable past dates and Sundays (clinic closed)
                          return date < today || isSunday(date);
                        }}
                        className="rounded-md border shadow-sm"
                        data-testid="date-picker"
                      />
                    </div>
                  </div>

                  {selectedDate && (
                    <div>
                      <Label className="text-base font-semibold mb-4 block">{t('booking.step1.selectTime')}</Label>
                      {loadingSlots ? (
                        <p className="text-sm text-gray-600">{t('booking.step1.loadingSlots')}</p>
                      ) : !availableSlots || availableSlots.length === 0 ? (
                        <p className="text-sm text-red-600" data-testid="no-slots-message">{t('booking.step1.noSlots')}</p>
                      ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3" data-testid="time-slots-grid">
                          {availableSlots.map((slot) => (
                            <Button
                              key={slot}
                              variant={selectedTime === slot ? "default" : "outline"}
                              onClick={() => setSelectedTime(slot)}
                              className={selectedTime === slot ? "bg-sky-600 hover:bg-sky-700" : ""}
                              data-testid={`time-slot-${slot}`}
                            >
                              {slot}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleStepOne}
                  size="lg"
                  className="w-full btn-primary"
                  disabled={!selectedDate || !selectedTime}
                  data-testid="step-1-next-btn"
                >
                  {t('booking.next')}
                </Button>
              </div>
            )}

            {/* Step 2: Patient Details */}
            {step === 2 && (
              <div className="space-y-8" data-testid="step-2-content">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <User className="w-6 h-6 text-sky-600" />
                    {t('booking.step2.title')}
                  </h2>
                  <p className="text-sm text-gray-600">{t('booking.step2.subtitle')}</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="patient_name" className="text-sm font-medium">
                      {t('booking.step2.fullName')} *
                    </Label>
                    <Input
                      id="patient_name"
                      name="patient_name"
                      value={formData.patient_name}
                      onChange={handleInputChange}
                      placeholder={t('booking.step2.fullNamePlaceholder')}
                      className="mt-2"
                      data-testid="input-patient-name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patient_email" className="text-sm font-medium">
                      {t('booking.step2.email')} *
                    </Label>
                    <Input
                      id="patient_email"
                      name="patient_email"
                      type="email"
                      value={formData.patient_email}
                      onChange={handleInputChange}
                      placeholder={t('booking.step2.emailPlaceholder')}
                      className="mt-2"
                      data-testid="input-patient-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="patient_phone" className="text-sm font-medium">
                      {t('booking.step2.phone')} *
                    </Label>
                    <Input
                      id="patient_phone"
                      name="patient_phone"
                      type="tel"
                      value={formData.patient_phone}
                      onChange={handleInputChange}
                      placeholder={t('booking.step2.phonePlaceholder')}
                      className="mt-2"
                      data-testid="input-patient-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="reason" className="text-sm font-medium">
                      {t('booking.step2.reason')}
                    </Label>
                    <Textarea
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      placeholder={t('booking.step2.reasonPlaceholder')}
                      className="mt-2"
                      rows={4}
                      data-testid="input-reason"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleStepTwo}
                  size="lg"
                  className="w-full btn-primary"
                  data-testid="step-2-next-btn"
                >
                  {t('booking.next')}
                </Button>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="space-y-8" data-testid="step-3-content">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-sky-600" />
                    {t('booking.step3.title')}
                  </h2>
                  <p className="text-sm text-gray-600">{t('booking.step3.subtitle')}</p>
                </div>

                {/* Booking Summary */}
                <div className="bg-sky-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">{t('booking.step3.summary')}</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('booking.step3.patient')}</span>
                      <span className="font-medium text-gray-900" data-testid="summary-patient-name">{formData.patient_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('booking.step3.date')}</span>
                      <span className="font-medium text-gray-900" data-testid="summary-date">{format(selectedDate, "PPP")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('booking.step3.time')}</span>
                      <span className="font-medium text-gray-900" data-testid="summary-time">{selectedTime}</span>
                    </div>
                    <div className="border-t border-sky-200 pt-3 mt-3">
                      <div className="flex justify-between text-lg">
                        <span className="font-semibold text-gray-900">{t('booking.step3.consultationFee')}</span>
                        <span className="font-bold text-sky-600" data-testid="consultation-fee">₹500</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  size="lg"
                  className="w-full btn-primary"
                  disabled={processing}
                  data-testid="pay-now-btn"
                >
                  {processing ? t('booking.step3.processing') : t('booking.step3.payNow')}
                </Button>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="space-y-8 text-center" data-testid="step-4-content">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {t('booking.success.title')}
                  </h2>
                  <p className="text-base text-gray-600">{t('booking.success.subtitle')}</p>
                </div>

                <div className="bg-sky-50 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">{t('booking.success.details')}</h3>
                  <div className="space-y-3 text-sm text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('booking.success.appointmentId')}</span>
                      <span className="font-medium text-gray-900" data-testid="appointment-id">{appointmentId.slice(0, 8)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('booking.success.date')}</span>
                      <span className="font-medium text-gray-900">{format(selectedDate, "PPP")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{t('booking.success.time')}</span>
                      <span className="font-medium text-gray-900">{selectedTime}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-sm text-gray-700">
                    {t('booking.success.notification')}
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/")}
                  size="lg"
                  className="btn-primary"
                  data-testid="go-home-btn"
                >
                  {t('booking.success.goHome')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookAppointment;

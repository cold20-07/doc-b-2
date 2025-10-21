import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Calendar as CalendarIcon, Clock, User, Mail, Phone, FileText, CreditCard } from "lucide-react";
import axios from "axios";
import { format } from "date-fns";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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

  // Fetch available slots when date is selected
  const handleDateSelect = async (date) => {
    setSelectedDate(date);
    setSelectedTime("");
    setLoadingSlots(true);
    
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(`${API}/available-slots?date=${formattedDate}`);
      setAvailableSlots(response.data.available_slots);
    } catch (error) {
      console.error("Error fetching slots:", error);
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
      // Create appointment
      const appointmentData = {
        patient_name: formData.patient_name,
        patient_email: formData.patient_email,
        patient_phone: formData.patient_phone,
        appointment_date: format(selectedDate, "yyyy-MM-dd"),
        appointment_time: selectedTime,
        reason: formData.reason || "General Consultation"
      };

      const appointmentResponse = await axios.post(`${API}/appointments`, appointmentData);
      const newAppointmentId = appointmentResponse.data.id;
      setAppointmentId(newAppointmentId);

      // Create payment order (500 INR consultation fee)
      const orderResponse = await axios.post(`${API}/create-payment-order`, {
        amount: 50000, // 500 INR in paise
        currency: "INR",
        appointment_id: newAppointmentId
      });

      // Check if Razorpay credentials are configured
      const razorpayKeyId = process.env.REACT_APP_RAZORPAY_KEY_ID || 'placeholder_key_id';
      
      if (razorpayKeyId === 'placeholder_key_id') {
        // Mock payment success for testing
        toast.success(t('booking.mockPayment'));
        
        // Simulate payment verification
        await axios.post(`${API}/verify-payment`, {
          razorpay_order_id: orderResponse.data.id,
          razorpay_payment_id: `pay_mock_${Date.now()}`,
          razorpay_signature: "mock_signature",
          appointment_id: newAppointmentId
        });

        toast.success(t('booking.success.title'));
        setStep(4);
      } else {
        // Real Razorpay integration
        const options = {
          key: razorpayKeyId,
          amount: orderResponse.data.amount,
          currency: orderResponse.data.currency,
          name: "BL Uro-Stone & Kidney Clinic",
          description: "Appointment Consultation Fee",
          order_id: orderResponse.data.id,
          handler: async (response) => {
            try {
              // Verify payment
              await axios.post(`${API}/verify-payment`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointment_id: newAppointmentId
              });

              toast.success(t('booking.success.title'));
              setStep(4);
            } catch (error) {
              console.error("Payment verification failed:", error);
              toast.error(t('booking.errors.paymentFailed'));
            }
          },
          prefill: {
            name: formData.patient_name,
            email: formData.patient_email,
            contact: formData.patient_phone
          },
          theme: {
            color: "#0ea5e9"
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
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
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    step >= num
                      ? "bg-sky-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                  data-testid={`step-indicator-${num}`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step > num ? "bg-sky-600" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>{t('booking.steps.step1')}</span>
            <span>{t('booking.steps.step2')}</span>
            <span>{t('booking.steps.step3')}</span>
            <span>{t('booking.steps.step4')}</span>
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
                        disabled={(date) => date < new Date() || date < new Date(new Date().setHours(0, 0, 0, 0))}
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
                      ) : availableSlots.length === 0 ? (
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
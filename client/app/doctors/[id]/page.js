'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DoctorBookingPage() {
  const params = useParams();
  const router = useRouter();
  const doctorId = params.id;

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form inputs
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');

  // Available time slots
  const availableSlots = [
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
  ];

  useEffect(() => {
    async function fetchDoctor() {
      try {
        const data = await fetchAPI(`/doctors/${doctorId}`);
        setDoctor(data.data || data);
      } catch (err) {
        setError(err.message || 'Failed to load doctor details');
      } finally {
        setLoading(false);
      }
    }
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedSlot) {
      setError('Please select both a date and a time slot.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // 1. Create Appointment
      const appointmentRes = await fetchAPI('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          date: selectedDate,
          timeSlot: selectedSlot,
          reason: reason || 'General Consultation',
        }),
      });

      const appointmentId = appointmentRes.appointment?._id || appointmentRes._id;

      // 2. Initialize Paystack Payment
      const paymentRes = await fetchAPI('/payments/initialize', {
        method: 'POST',
        body: JSON.stringify({ appointmentId }),
      });

      // 3. Redirect to Paystack Checkout URL
      const paystackUrl = paymentRes.authorization_url || paymentRes.data?.authorization_url;
      if (paystackUrl) {
        window.location.href = paystackUrl;
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Payment initialization failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading doctor details...</div>;
  if (!doctor) return <div className="p-8 text-center text-red-500">Doctor not found.</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{doctor.name}</CardTitle>
          <p className="text-blue-600 font-semibold">{doctor.specialization}</p>
          <p className="text-gray-600">Qualifications: {doctor.qualifications || 'MBBS'}</p>
          <p className="text-gray-800 font-bold mt-2">
            Consultation Fee: ${doctor.consultationFee || doctor.fee || 5}
          </p>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Book Appointment & Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleBooking} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason for Visit / Consultation</label>
              <Input
                type="text"
                placeholder="e.g., Routine Checkup, Follow-up, Chest Pain"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Date</label>
              <Input
              type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    variant={selectedSlot === slot ? 'default' : 'outline'}
                    onClick={() => setSelectedSlot(slot)}
                    className="w-full"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={submitting}>
              {submitting ? 'Redirecting to Paystack...' : `Pay $${doctor.consultationFee || 5} & Confirm Booking`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
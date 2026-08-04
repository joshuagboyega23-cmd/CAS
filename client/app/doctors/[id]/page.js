'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { fetchAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function DoctorBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (params?.id) {
      fetchAPI(`/doctors/${params.id}`)
        .then((res) => {
          const docData = res.data || res;
          setDoctor(docData);
        })
        .catch((err) => {
          console.error('Failed to load doctor:', err);
          setError('Could not load doctor details.');
        })
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  const handleBookingAndPayment = async (e) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    if (!selectedDate || !selectedSlot) {
      setError('Please select both a date and an available time slot.');
      return;
    }

    setSubmitting(true);
    setError('');

    const feeAmount = Number(doctor?.consultationFee || doctor?.fees || doctor?.fee || 0);

    const payload = {
      doctorId: doctor._id || doctor.id,
      doctor: doctor._id || doctor.id,
      date: selectedDate,
      timeSlot: selectedSlot,
      amount: feeAmount,
      fee: feeAmount,
      paymentStatus: 'paid',
      isPaid: true,
      status: 'confirmed',
    };

    try {
      await fetchAPI('/appointments', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      // Redirect immediately to patient dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Booking failed:', err);
      setError(err.message || 'Payment or booking failed. Please try again.');
      setSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return <div className="p-8 text-center">Loading doctor profile...</div>;
  }

  if (!doctor) {
    return <div className="p-8 text-center text-red-500">Doctor not found.</div>;
  }

  const docName = doctor.user?.name || doctor.name || 'Doctor';
  const imgUrl = doctor.profilePicture || doctor.image || doctor.avatar;
  const availableSlots = Array.isArray(doctor.availableSlots || doctor.timeSlots)
    ? doctor.availableSlots || doctor.timeSlots
    : (doctor.availableSlots || doctor.timeSlots || '').split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-24 h-24 rounded-full bg-blue-100 border flex items-center justify-center text-blue-600 font-bold text-2xl overflow-hidden shrink-0">
          {imgUrl ? (
            <img src={imgUrl} alt={docName} className="w-full h-full object-cover" />
          ) : (
            'Dr'
          )}
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="text-2xl font-bold">{docName}</h1>
          <p className="text-blue-600 font-medium">
            {doctor.specialization || 'General Practitioner'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Qualifications: {doctor.qualifications || 'N/A'} | Experience:{' '}
            {doctor.experienceYears || doctor.experience || 0} Years
          </p>
          <p className="text-sm text-gray-700 mt-1 font-semibold">
            Consultation Fee: ${doctor.consultationFee || doctor.fees || doctor.fee || 0}
          </p>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Book Appointment & Checkout</h2>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleBookingAndPayment} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Select Date</label>
            <Input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Select Time Slot</label>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-gray-500">No active time slots available for this doctor.</p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {availableSlots.map((slot, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`px-4 py-2 text-sm rounded-md border transition-colors ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 mt-4"
          >
            {submitting ? 'Processing Payment...' : `Pay $${doctor.consultationFee || doctor.fees || doctor.fee || 0} & Confirm Booking`}
          </Button>
        </form>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import fetchAPI from '../../../../lib/api';
import Link from 'next/link';

export default function BookAppointmentPage() {
  const params = useParams();
  const doctorId = params?.doctorId;
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [type, setType] = useState('consultation');
  const [reason, setReason] = useState('');

  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const defaultSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

  useEffect(() => {
    if (!doctorId) return;

    const getDoctor = async () => {
      try {
        const res = await fetchAPI(`/doctors/${doctorId}`);
        setDoctor(res.data?.doctor || res.doctor || res.data || res);
      } catch (err) {
        console.error('Error fetching doctor details:', err);
        setError('Could not load doctor details.');
      } finally {
        setLoadingDoctor(false);
      }
    };

    getDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (!date) return;
    if (doctor?.availableSlots && doctor.availableSlots.length > 0) {
      setAvailableSlots(doctor.availableSlots);
    } else {
      setAvailableSlots(defaultSlots);
    }
  }, [date, doctor]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date) {
      setError('Please select an appointment date.');
      return;
    }

    if (!selectedSlot) {
      setError('Please select a time slot.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await fetchAPI('/appointments', {
        method: 'POST',
        body: JSON.stringify({
          doctorId,
          date,
          timeSlot: selectedSlot,
          type,
          reason,
        }),
      });

      // Extract Paystack URL safely from all potential response structures
      const paystackUrl =
        res?.authorization_url ||
        res?.paymentUrl ||
        res?.data?.authorization_url ||
        res?.data?.paymentUrl ||
        res?.data?.data?.authorization_url;

      if (paystackUrl) {
        window.location.href = paystackUrl;
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Booking error:', err);
      setError(err?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600 font-medium">Loading appointment details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
            {doctor && (
              <p className="text-gray-600 mt-1">
                With <span className="font-semibold text-blue-600">{doctor.name || doctor.user?.name || 'Doctor'}</span>
              </p>
            )}
          </div>
          <Link
            href="/dashboard"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            &larr; Back to Dashboard
          </Link>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appointment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="consultation">Consultation</option>
              <option value="General Checkup">General Checkup</option>
              <option value="Emergency">Emergency</option>
              <option value="Follow-up">Follow-up</option>
            </select>
          </div>

          {/* Select Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              min={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time Slot
            </label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 text-sm font-medium rounded-lg border text-center transition-all ${
                      selectedSlot === slot
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                {date ? 'No slots available for this date.' : 'Please choose a date first to view time slots.'}
              </p>
            )}
          </div>

          {/* Reason for Visit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Visit
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your symptoms or reason for visit..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Confirming Booking...' : 'Confirm & Proceed to Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}
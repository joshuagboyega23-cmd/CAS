'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchAPI } from '../../../../lib/api';
import Link from 'next/link';

export default function BookAppointmentPage() {
  const { doctorId } = useParams();
  const router = useRouter();

  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [type, setType] = useState('consultation');
  const [reason, setReason] = useState('');

  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!doctorId) return;

    const getDoctor = async () => {
      try {
        const res = await fetchAPI(`/doctors/${doctorId}`);
        setDoctor(res.data?.doctor || res.doctor || res.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctor details.');
      } finally {
        setLoadingDoctor(false);
      }
    };

    getDoctor();
  }, [doctorId]);

  useEffect(() => {
    if (!date || !doctorId) return;

    const getSlots = async () => {
      setLoadingSlots(true);
      setError('');
      try {
        const res = await fetchAPI(`/doctors/${doctorId}/slots?date=${date}`);
        const slots = res.data?.slots || res.slots || res.data || [];
        setAvailableSlots(slots);
      } catch (err) {
        setAvailableSlots(['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']);
      } finally {
        setLoadingSlots(false);
      }
    };

    getSlots();
  }, [date, doctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Check if Paystack payment URL exists in response
      const paystackUrl =
        res?.authorization_url ||
        res?.paymentUrl ||
        res?.data?.authorization_url ||
        res?.data?.paymentUrl;

      if (paystackUrl) {
        window.location.href = paystackUrl; // Redirects to Paystack
      } else {
        router.push('/dashboard'); // Fallback to dashboard
      }
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">Loading booking details...</p>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <Link href={`/doctors/${doctorId}`} className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Back to Doctor Profile
        </Link>

        <h1 className="text-2xl font-bold text-slate-800 mt-4 mb-1">Book an Appointment</h1>
        <p className="text-slate-600 text-sm mb-6">
          Doctor: <strong className="text-slate-800">{doctor?.userId?.name || doctor?.name || 'Selected Doctor'}</strong>
        </p>

        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Appointment Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Date</label>
            <input
              type="date"
              min={today}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          {date && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Time Slot</label>
              {loadingSlots ? (
                <p className="text-sm text-slate-500">Loading available time slots...</p>
              ) : availableSlots.length === 0 ? (
                <p className="text-sm text-slate-500">No available time slots for this date.</p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2 px-3 text-sm rounded-lg border font-medium transition-colors ${
                        selectedSlot === slot
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-blue-400'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Visit</label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe your symptoms or reason for visiting..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {submitting ? 'Confirming Booking...' : 'Confirm Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
}
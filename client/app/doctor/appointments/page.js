'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '@/lib/api';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDoctorData() {
      try {
        const data = await fetchAPI('/appointments/doctor/my-appointments');
        setAppointments(data.appointments || []);

        if (data.unreadCount > 0) {
          await fetchAPI('/appointments/doctor/mark-read', { method: 'PUT' });
        }
      } catch (err) {
        console.error('Failed to load doctor appointments:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDoctorData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-sm text-gray-500">Manage all patient bookings scheduled with you.</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500 text-sm">Loading your appointments...</p>
      ) : appointments.length === 0 ? (
        <div className="p-8 border rounded-xl bg-gray-50 text-center text-gray-500">
          No appointments booked with you yet.
        </div>
      ) : (
        <div className="grid gap-4">
          {appointments.map((item) => (
            <div key={item._id} className="p-5 border rounded-xl bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{item.patient?.name || 'Patient'}</h3>
                <div className="text-xs text-gray-500 space-y-1 mt-1">
                  <p>Email: <span className="text-gray-700 font-medium">{item.patient?.email || 'N/A'}</span></p>
                  <p>Phone: <span className="text-gray-700 font-medium">{item.patient?.phone || 'N/A'}</span></p>
                  <p>Reason: <span className="text-gray-700 italic">{item.reason || 'General Checkup'}</span></p>
                </div>
                <div className="mt-3 text-xs text-blue-600 font-semibold bg-blue-50 px-3 py-1 rounded-md inline-block">
                  📅 {new Date(item.date).toLocaleDateString()} | ⏰ {item.timeSlot}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${
                  item.status === 'confirmed' || item.paymentStatus === 'paid'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.paymentStatus === 'paid' ? 'Paid & Confirmed' : item.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const loadAppointments = () => {
    fetchAPI('/appointments/my')
      .then((res) => {
        const list = Array.isArray(res) ? res : res.data || [];
        setAppointments(list);
      })
      .catch((err) => console.error('Failed to load appointments:', err))
      .finally(() => setFetching(false));
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadAppointments();
    }
  }, [user, loading, router]);

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await fetchAPI(`/appointments/${appointmentId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
        headers: { 'Content-Type': 'application/json' },
      });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
    } catch (err) {
      try {
        await fetchAPI(`/appointments/${appointmentId}`, {
          method: 'PATCH',
          body: JSON.stringify({ status: newStatus }),
          headers: { 'Content-Type': 'application/json' },
        });
        setAppointments((prev) =>
          prev.map((apt) =>
            apt._id === appointmentId ? { ...apt, status: newStatus } : apt
          )
        );
      } catch (patchErr) {
        alert(patchErr.message || 'Failed to update appointment status');
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading || fetching) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const isDoctor = user?.role === 'doctor';

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.name}!</h1>
          <p className="text-sm text-gray-500 capitalize">Role: {user?.role}</p>
        </div>

        <div className="flex gap-3">
          {isDoctor ? (
            <Link href="/doctor/profile">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Edit Doctor Profile
              </Button>
            </Link>
          ) : (
            <Link href="/doctors">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Book New Appointment
              </Button>
            </Link>
          )}

          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Appointment Reminders Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">
          {isDoctor ? 'Upcoming Patient Appointments' : 'Your Booked Appointments & Reminders'}
        </h2>

        {appointments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No appointments found.</p>
            {!isDoctor && (
              <Link href="/doctors" className="text-blue-600 underline font-medium mt-1 inline-block">
                Book an appointment now
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => {
              const docObj = apt.doctor?.user || apt.doctor || {};
              const docName = docObj.name || apt.doctorName || 'Assigned Doctor';
              const docSpec = apt.doctor?.specialization || apt.specialization || 'Specialist';
              const patientName = apt.user?.name || apt.patientName || 'Patient';

              return (
                <div
                  key={apt._id}
                  className="p-5 border rounded-lg bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-200 transition-colors"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-gray-900 text-lg">
                      {isDoctor ? `Patient: ${patientName}` : `Dr. ${docName}`}
                    </p>
                    {!isDoctor && (
                      <p className="text-sm text-blue-600 font-medium">{docSpec}</p>
                    )}

                    <p className="text-sm text-gray-600">
                      📅 <strong>Date:</strong> {new Date(apt.date).toLocaleDateString()} &nbsp;|&nbsp; ⏰ <strong>Time:</strong> {apt.timeSlot}
                    </p>

                    <div className="flex gap-2 pt-1">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                        Payment: Paid
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200 capitalize">
                        Status: {apt.status || 'Confirmed'}
                      </span>
                    </div>
                  </div>

                  {/* Doctor Actions */}
                  {isDoctor && (
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {apt.status !== 'confirmed' &&
                        apt.status !== 'completed' &&
                        apt.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            disabled={updatingId === apt._id}
                            onClick={() => handleStatusChange(apt._id, 'confirmed')}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            Approve
                          </Button>
                        )}

                      {apt.status === 'confirmed' && (
                        <Button
                          size="sm"
                          disabled={updatingId === apt._id}
                          onClick={() => handleStatusChange(apt._id, 'completed')}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Mark Completed
                        </Button>
                      )}

                      {apt.status !== 'cancelled' && apt.status !== 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updatingId === apt._id}
                          onClick={() => handleStatusChange(apt._id, 'cancelled')}
                          className="text-red-600 border-red-200 hover:bg-red-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
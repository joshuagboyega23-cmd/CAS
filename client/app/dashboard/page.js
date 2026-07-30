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
        if (Array.isArray(res)) {
          setAppointments(res);
        } else if (res && res.data) {
          setAppointments(res.data);
        } else {
          setAppointments([]);
        }
      })
      .catch((err) => console.error(err))
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

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase();
    if (s === 'confirmed' || s === 'approved') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (s === 'completed') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    if (s === 'cancelled') {
      return 'bg-red-100 text-red-800 border-red-200';
    }
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border mb-6 flex justify-between items-center">
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

      {/* Appointments List */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">
          {isDoctor ? 'Appointments Booked with You' : 'Your Appointments'}
        </h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">
            No appointments found.{' '}
            {!isDoctor && (
              <Link href="/doctors" className="text-blue-600 underline">
                Book one now
              </Link>
            )}
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt) => (
              <div
                key={apt._id}
                className="p-4 border rounded-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div>
                  <p className="font-semibold">
                    {isDoctor
                      ? `Patient: ${apt.user?.name || 'Patient'}`
                      : `Doctor: ${apt.doctor?.user?.name || 'Assigned Doctor'}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(apt.date).toLocaleDateString()} | Slot: {apt.timeSlot}
                  </p>
                  <span
                    className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                      apt.status
                    )} capitalize`}
                  >
                    {apt.status || 'Pending'}
                  </span>
                </div>

                {/* Doctor Action Controls */}
                {isDoctor && (
                  <div className="flex flex-wrap gap-2">
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
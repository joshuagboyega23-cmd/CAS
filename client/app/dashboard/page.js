'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getMyAppointments } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      getMyAppointments()
        .then((res) => setAppointments(res.data || []))
        .catch((err) => console.error(err))
        .finally(() => setFetching(false));
    }
  }, [user, loading, router]);

  if (loading || fetching) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const isDoctor = user?.role === 'doctor';

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

      {/* Appointments Section */}
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
              <div key={apt._id} className="p-4 border rounded-md flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {isDoctor ? `Patient: ${apt.user?.name}` : `Doctor: ${apt.doctor?.user?.name || 'Assigned Doctor'}`}
                  </p>
                  <p className="text-sm text-gray-500">
                    Date: {new Date(apt.date).toLocaleDateString()} | Slot: {apt.timeSlot}
                  </p>
                  <p className="text-xs text-gray-400 capitalize">Status: {apt.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
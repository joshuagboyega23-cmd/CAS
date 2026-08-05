'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference');

  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function initDashboard() {
      try {
        // 1. Fetch current user info
        const userData = await fetchAPI('/auth/me');
        setUser(userData.user || userData);

        // 2. If coming from Paystack redirect, verify payment first
        if (reference) {
          setVerifying(true);
          try {
            await fetchAPI(`/payments/verify/${reference}`);
            setMessage('Payment verified successfully! Your appointment is confirmed.');
            router.replace('/dashboard');
          } catch (err) {
            console.error('Payment verification failed:', err);
            setMessage('Failed to verify payment with server.');
          } finally {
            setVerifying(false);
          }
        }

        // 3. Fetch patient's booked appointments
        const apptData = await fetchAPI('/appointments/my-appointments');
        setAppointments(apptData.appointments || apptData.data || []);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    }

    initDashboard();
  }, [reference, router]);

  if (loading || verifying) {
    return (
      <div className="p-8 text-center space-y-2">
        <p className="text-lg font-semibold">
          {verifying ? 'Confirming your payment with Paystack...' : 'Loading your dashboard...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Header */}
      <Card>
        <CardContent className="pt-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Patient'}!</h1>
            <p className="text-sm text-gray-500">Role: {user?.role || 'Patient'}</p>
          </div>
          <Link href="/doctors">
            <Button>Book New Appointment</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Verification Notification */}
      {message && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md text-sm">
          {message}
        </div>
      )}

      {/* Booked Appointments List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Booked Appointments & Reminders</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 space-y-2">
              <p>No appointments found.</p>
              <Link href="/doctors" className="text-blue-600 underline text-sm">
                Book an appointment now
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div
                  key={appt._id}
                  className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="font-bold text-lg">
                      {appt.doctor?.name ? `Dr. ${appt.doctor.name}` : 'Doctor Appointment'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Specialization:</strong> {appt.doctor?.
                      specialization || 'General Care'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Reason:</strong> {appt.reason || 'Consultation'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date & Time:</strong> {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
                    </p>
                  </div>

                  <div className="flex flex-col md:items-end gap-2">
                    <Badge variant={appt.status === 'confirmed' ? 'default' : 'outline'}>
                      Status: {appt.status}
                    </Badge>
                    <Badge variant={appt.paymentStatus === 'paid' ? 'secondary' : 'destructive'}>
                      Payment: {appt.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
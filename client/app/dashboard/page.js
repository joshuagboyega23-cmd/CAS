'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import fetchAPI from '../../lib/api';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    // If not logged in, send to login
    if (!token) {
      router.push('/login');
      return;
    }

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data');
      }
    }

    const fetchAppointments = async () => {
      try {
        // Called directly as fetchAPI('/appointments') — NO .get()
        const res = await fetchAPI('/appointments');
        const list = res?.data?.appointments || res?.appointments || res?.data || res || [];
        setAppointments(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err?.message || 'Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-gray-600 font-medium">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.name || 'User'}!
            </h1>
            <p className="text-sm text-gray-500 capitalize">
              Role: <span className="font-semibold text-blue-600">{user?.role || 'Patient'}</span>
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/doctors"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Book New Appointment
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Appointments Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Your Appointments</h2>

          {appointments.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No appointments found.{' '}
              <Link href="/doctors" className="text-blue-600 hover:underline font-medium">
                Book one now
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {appointments.map((item) => (
                <div key={item._id || item.id} className="py-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {item.doctor?.name || item.doctorId?.name || 'Doctor Appointment'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Date: {item.date} | Time: {item.timeSlot || item.time}
                    </p>
                    {item.type && (
                      <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'confirmed' || item.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {item.status || 'Scheduled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
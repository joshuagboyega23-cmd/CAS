'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../../lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    doctorsCount: 0,
    appointmentsCount: 0,
    pendingAppointments: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [docsRes, appsRes] = await Promise.all([
          fetchAPI('/doctors'),
          fetchAPI('/appointments'),
        ]);

        const doctorsList = docsRes.data?.doctors || docsRes.doctors || docsRes.data || [];
        const appsList = appsRes.data?.appointments || appsRes.appointments || appsRes.data || [];

        setAppointments(appsList);
        setStats({
          doctorsCount: doctorsList.length,
          appointmentsCount: appsList.length,
          pendingAppointments: appsList.filter((a) => a.status === 'pending').length,
        });
      } catch (err) {
        setError(err.message || 'Failed to load system metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">Loading Admin Portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
          <p className="text-slate-500 text-sm">System-wide performance overview and records</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-semibold uppercase">Total Doctors</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{stats.doctorsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-semibold uppercase">Total Appointments</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stats.appointmentsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <p className="text-slate-500 text-xs font-semibold uppercase">Pending Requests</p>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingAppointments}</p>
          </div>
        </div>

        {/* System Appointments Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800">Recent System Appointments</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-semibold text-slate-500">
                <tr>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time Slot</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No system records found.
                    </td>
                  </tr>
                ) : (
                  appointments.map((app) => (
                    <tr key={app._id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">
                        {app.patient?.userId?.name || app.patient?.name || 'Patient'}
                      </td>
                      <td className="p-4">
                        Dr. {app.doctor?.userId?.name || app.doctor?.name || 'Doctor'}
                      </td>
                      <td className="p-4">{new Date(app.date).toLocaleDateString()}</td>
                      <td className="p-4">{app.timeSlot}</td>
                      <td className="p-4">
                        <span
                          className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                            app.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : app.status === 'completed'
                              ? 'bg-blue-100 text-blue-700'
                              : app.status === 'cancelled'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../lib/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logoutUser, loading } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [payingId, setPayingId] = useState(null);

  // Prescription Modal State
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', frequency: '' }]);
  const [viewPrescriptionAppt, setViewPrescriptionAppt] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else {
        fetchAppointments();

        const queryParams = new URLSearchParams(window.location.search);
        const reference = queryParams.get('reference');
        if (reference) {
          verifyPayment(reference);
        }
      }
    }
  }, [user, loading, router]);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get('/appointments/my');
      setAppointments(data.data);
    } catch (err) {
      console.error('Error fetching appointments', err);
    } finally {
      setFetching(false);
    }
  };

  const verifyPayment = async (reference) => {
    try {
      const { data } = await API.get(`/payments/verify/${reference}`);
      alert(data.message || 'Payment verified successfully!');
      window.history.replaceState({}, document.title, window.location.pathname);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Payment verification failed');
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await API.put(`/appointments/${appointmentId}/status`, { status: newStatus });
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handlePayment = async (appointmentId) => {
    setPayingId(appointmentId);
    try {
      const { data } = await API.post('/payments/initialize', { appointmentId });
      window.location.href = data.authorization_url;
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to initialize payment');
    } finally {
      setPayingId(null);
    }
  };

  // Medicine Field Handler
  const handleMedChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '' }]);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/appointments/${selectedAppt._id}/prescription`, {
        diagnosis,
        notes,
        medicines: medicines.filter((m) => m.name.trim() !== ''),
      });
      alert('Prescription saved successfully!');
      setSelectedAppt(null);
      setDiagnosis('');
      setNotes('');
      setMedicines([{ name: '', dosage: '', frequency: '' }]);
      fetchAppointments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save prescription');
    }
  };

  if (loading || (user && fetching)) {
    return <div className="p-8 text-center text-gray-500">Loading your profile...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-500 text-sm mt-1">
              Logged in as <span className="capitalize font-semibold text-blue-600">{user?.role}</span> ({user?.email})
            </p>
          </div>
          
          <div className="flex space-x-3">
            {user?.role === 'patient' && (
              <Link href="/doctors" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Find Doctors
              </Link>
            )}
            {user?.role === 'doctor' && (
              <Link href="/doctor/profile" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
                Edit Doctor Profile
              </Link>
            )}
            <button onClick={logoutUser} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition">
              Logout
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">My Appointments</h2>

          {appointments.length === 0 ? (
            <div className="bg-white p-8 rounded-xl shadow-sm text-center text-gray-500">
              No appointments found.{' '}
              {user?.role === 'patient' && (
                <Link href="/doctors" className="text-blue-600 font-medium hover:underline">
                  Book one now!
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      {user?.role === 'doctor' ? `Patient: ${appt.patient?.name}` : `Doctor: ${appt.doctor?.user?.name || 'Assigned Specialist'}`}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      📅 Date: <strong>{new Date(appt.date).toLocaleDateString()}</strong> at ⏰ <strong>{appt.timeSlot}</strong>
                    </p>
                    <p className="text-sm text-gray-500">Reason: {appt.reason}</p>
                    <p className="text-xs mt-1 font-semibold">
                      Payment Status: <span className={appt.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-500'}>{appt.paymentStatus?.toUpperCase()}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                      appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      appt.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appt.status}
                    </span>

                    {/* Patient Pay Fee Button */}
                    {user?.role === 'patient' && appt.paymentStatus === 'unpaid' && (
                      <button onClick={() => handlePayment(appt._id)} disabled={payingId === appt._id} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition">
                        {payingId === appt._id ? 'Processing...' : 'Pay Fee'}
                      </button>
                    )}

                    {/* Doctor Action Buttons */}
                    {user?.role === 'doctor' && appt.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button onClick={() => handleStatusChange(appt._id, 'confirmed')} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-green-700">Confirm</button>
                        <button onClick={() => handleStatusChange(appt.
                        _id, 'cancelled')} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-medium hover:bg-red-700">Cancel</button>
                      </div>
                    )}

                    {/* Write Prescription (Doctor) */}
                    {user?.role === 'doctor' && (appt.status === 'confirmed' || appt.status === 'completed') && (
                      <button onClick={() => { setSelectedAppt(appt); setDiagnosis(appt.prescription?.diagnosis || ''); setNotes(appt.prescription?.notes || ''); setMedicines(appt.prescription?.medicines?.length ? appt.prescription.medicines : [{ name: '', dosage: '', frequency: '' }]); }} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                        {appt.prescription?.diagnosis ? 'Edit Rx / Notes' : 'Write Rx'}
                      </button>
                    )}

                    {/* View Prescription (Patient) */}
                    {user?.role === 'patient' && appt.prescription?.diagnosis && (
                      <button onClick={() => setViewPrescriptionAppt(appt)} className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
                        View Prescription
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Doctor Add/Edit Prescription Modal */}
      {selectedAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900">Medical Notes & Prescription</h3>
            <p className="text-sm text-gray-500">Patient: {selectedAppt.patient?.name}</p>

            <form onSubmit={handleSavePrescription} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase">Diagnosis</label>
                <input type="text" required value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="e.g. Acute Bronchitis" className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase">Doctor Notes</label>
                <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Clinical notes, rest recommendations, etc." className="w-full mt-1 border border-gray-300 rounded-lg p-2 text-sm" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-2">Prescribed Medicines</label>
                {medicines.map((med, idx) => (
                  <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                    <input type="text" placeholder="Medicine" value={med.name} onChange={(e) => handleMedChange(idx, 'name', e.target.value)} className="border border-gray-300 rounded-md p-1.5 text-xs" />
                    <input type="text" placeholder="Dosage (500mg)" value={med.dosage} onChange={(e) => handleMedChange(idx, 'dosage', e.target.value)} className="border border-gray-300 rounded-md p-1.5 text-xs" />
                    <input type="text" placeholder="Freq (2x daily)" value={med.frequency} onChange={(e) => handleMedChange(idx, 'frequency', e.target.value)} className="border border-gray-300 rounded-md p-1.5 text-xs" />
                  </div>
                ))}
                <button type="button" onClick={addMedicineRow} className="text-xs text-blue-600 font-semibold hover:underline mt-1">+ Add Medicine</button>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t">
                <button type="button" onClick={() => setSelectedAppt(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700">Save & Complete</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient View Prescription Modal */}
      {viewPrescriptionAppt && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full space-y-4">
            <div className="border-b pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Official Medical Prescription</h3>
                <p className="text-xs text-gray-500">Doctor: {viewPrescriptionAppt.doctor?.user?.name}</p>
              </div>
              <span className="text-xs text-gray-400">{new Date(viewPrescriptionAppt.prescription?.updatedAt).toLocaleDateString()}</span>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase">Diagnosis</p>
              <p className="text-sm font-semibold text-gray-800">{viewPrescriptionAppt.prescription?.diagnosis}</p>
            </div>

            {viewPrescriptionAppt.prescription?.notes && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase">Doctor Notes</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2.5 rounded-lg border border-gray-100">{viewPrescriptionAppt.prescription?.notes}</p>
              </div>
            )}

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Prescribed Medications</p>
              <div className="space-y-2">
                {viewPrescriptionAppt.prescription?.medicines?.map((m, i) => (
                  <div key={i} className="flex justify-between items-center bg-blue-50 p-2.5 rounded-lg text-xs">
                    <span className="font-bold text-blue-900">{m.name}</span>
                    <span className="text-blue-700">{m.dosage} — {m.frequency}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t">
              <button onClick={() => setViewPrescriptionAppt(null)} className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
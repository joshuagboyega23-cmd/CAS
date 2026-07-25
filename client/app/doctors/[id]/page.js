'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '../../../lib/api';

export default function DoctorProfilePage() {
  const { id } = useParams();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;

    const getDoctorProfile = async () => {
      try {
        const res = await fetchAPI(`/doctors/${id}`);
        const doctorData = res.data?.doctor || res.doctor || res.data;
        setDoctor(doctorData);
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    getDoctorProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">Loading doctor profile...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-slate-50 p-8 flex flex-col items-center justify-center">
        <p className="text-red-600 font-medium mb-4">{error || 'Doctor not found.'}</p>
        <Link href="/doctors" className="text-blue-600 underline">
          &larr; Back to Doctors
        </Link>
      </div>
    );
  }

  const doctorName = doctor.userId?.name || doctor.name || 'Dr. Medical Professional';
  const doctorAvatar = doctor.userId?.avatar || doctor.avatar || 'https://via.placeholder.com/150';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/doctors" className="text-blue-600 hover:underline text-sm font-medium">
          &larr; Back to Doctor Listing
        </Link>

        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          <img
            src={doctorAvatar}
            alt={doctorName}
            className="w-28 h-28 rounded-full object-cover border-2 border-blue-100"
          />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-slate-800">{doctorName}</h1>
            <p className="text-blue-600 font-semibold mt-1">{doctor.specialization}</p>
            <p className="text-slate-500 text-sm mt-1">Phone: {doctor.phone || 'N/A'}</p>

            <div className="mt-4 flex flex-wrap gap-4 justify-center sm:justify-start text-sm">
              <span className="bg-slate-100 px-3 py-1 rounded-md text-slate-700">
                Fee: <strong className="text-slate-900">${doctor.consultationFee}</strong>
              </span>
              <span className="bg-slate-100 px-3 py-1 rounded-md text-slate-700">
                Rating: ⭐️ <strong className="text-slate-900">{doctor.rating || 'N/A'}</strong> ({doctor.totalReviews || 0} reviews)
              </span>
            </div>
          </div>

          <div>
            <Link
              href={`/appointments/book/${doctor._id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors block text-center shadow-sm"
            >
              Book Appointment
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-3">About Doctor</h2>
          <p className="text-slate-600 leading-relaxed">
            {doctor.bio || 'No background summary provided.'}
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchAPI } from '../../lib/api';

const SPECIALIZATIONS = [
  'All',
  'General',
  'Cardiology',
  'Dermatology',
  'Pediatrics',
  'Orthopedics',
  'Neurology',
  'Psychiatry',
  'Gynecology',
  'Ophthalmology',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpec, setSelectedSpec] = useState('All');

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const res = await fetchAPI('/doctors');
        const doctorData = res.data?.doctors || res.doctors || res.data || [];
        setDoctors(doctorData);
        setFilteredDoctors(doctorData);
      } catch (err) {
        setError(err.message || 'Failed to fetch doctors.');
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Filter handlers
  useEffect(() => {
    let result = doctors;

    if (selectedSpec !== 'All') {
      result = result.filter(
        (doc) => doc.specialization?.toLowerCase() === selectedSpec.toLowerCase()
      );
    }

    if (searchTerm.trim() !== '') {
      result = result.filter((doc) => {
        const name = doc.userId?.name || doc.name || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    setFilteredDoctors(result);
  }, [searchTerm, selectedSpec, doctors]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-600 font-medium">Loading available doctors...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-bold text-slate-900">Find a Doctor</h1>
          <p className="text-slate-600 mt-1">
            Book an appointment with specialist doctors in your area.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search doctor by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
            />
          </div>

          <div className="w-full md:w-1/3 flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
              Specialization:
            </label>
            <select
              value={selectedSpec}
              onChange={(e) => setSelectedSpec(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 bg-white"
            >
              {SPECIALIZATIONS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 mb-6">
            {error}
          </div>
        )}

        {/* Doctor Grid */}
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-lg">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doc) => {
              const doctorName = doc.userId?.name || doc.name || 'Dr. Medical Professional';
              const doctorAvatar = doc.userId?.avatar || doc.avatar || 'https://via.placeholder.com/150';

              return (
                <div
                  key={doc._id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={doctorAvatar}
                        alt={doctorName}
                        className="w-16 h-16 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">{doctorName}</h3>
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full mt-1">
                          {doc.specialization}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                      {doc.bio || 'No bio available for this doctor.'}
                    </p>

                    <div className="flex items-center justify-between text-sm text-slate-700 border-t border-slate-100 pt-3 mb-4">
                      <span>
                        Fee: <strong className="text-slate-900">${doc.consultationFee || 0}</strong>
                      </span>
                      <span>
                        Rating: ⭐️ <strong className="text-slate-900">{doc.rating || 'N/A'}</strong>
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/doctors/${doc._id}`}
                    className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-colors block"
                  >
                    View Profile & Book
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
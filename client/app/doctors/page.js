'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DoctorsListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAPI('/doctors')
      .then((res) => {
        const list = Array.isArray(res) ? res : res.data || [];
        setDoctors(list);
      })
      .catch((err) => console.error('Error loading doctors:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredDoctors = doctors.filter((doc) => {
    const name = doc.user?.name || doc.name || '';
    const spec = doc.specialization || '';
    const query = search.toLowerCase();
    return name.toLowerCase().includes(query) || spec.toLowerCase().includes(query);
  });

  if (loading) {
    return <div className="p-8 text-center">Loading available doctors...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Find a Doctor</h1>
          <p className="text-gray-500 text-sm">Book an appointment with top specialists</p>
        </div>

        <input
          type="text"
          placeholder="Search by name or specialization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-72 p-2 border rounded-md text-sm shadow-sm"
        />
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="bg-white p-8 rounded-lg border text-center text-gray-500">
          No doctors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => {
            const docName = doctor.user?.name || doctor.name || 'Doctor';
            const imgUrl = doctor.profilePicture || doctor.image || doctor.avatar;

            return (
              <div
                key={doctor._id}
                className="bg-white border rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Doctor Header & Avatar */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-blue-100 border flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden shrink-0">
                      {imgUrl ? (
                        <img
                          src={imgUrl}
                          alt={docName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        'Dr'
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold text-lg">{docName}</h3>
                      <p className="text-sm text-blue-600 font-medium">
                        {doctor.specialization || 'General Practitioner'}
                      </p>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-1.5 text-sm text-gray-600 mb-4">
                    <p>
                      <strong className="text-gray-800">Qualifications:</strong>{' '}
                      {doctor.qualifications || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-gray-800">Experience:</strong>{' '}
                      {doctor.experienceYears || doctor.experience || 0} years
                    </p>
                    <p>
                      <strong className="text-gray-800">Fee:</strong> ${doctor.consultationFee || doctor.fees || doctor.fee || 0}
                    </p>
                  </div>
                </div>

                <Link href={`/doctors/${doctor._id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Book Appointment
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
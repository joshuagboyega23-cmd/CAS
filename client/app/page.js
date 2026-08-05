'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  const router = useRouter();
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    async function loadFeaturedDoctors() {
      try {
        const data = await fetchAPI('/doctors');
        const docs = data.doctors || data.data || [];
        setFeaturedDoctors(docs.slice(0, 3)); // Display top 3 featured doctors
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
      }
    }
    loadFeaturedDoctors();
  }, []);

  const handleProtectedAction = (targetPath) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    if (!token) {
      setShowAuthModal(true);
    } else {
      router.push(targetPath);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* 1. Hero Section */}
      <section className="py-16 md:py-24 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Quality Healthcare, Simplified
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Find certified doctors, schedule instant appointments, and manage your health consultations effortlessly.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
              onClick={() => handleProtectedAction('/doctors')}
            >
              Find a Doctor
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-300"
              onClick={() => handleProtectedAction('/doctors')}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Featured Doctors Section */}
      {featuredDoctors.length > 0 && (
        <section className="bg-blue-50/50 py-16 md:py-20 border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Doctors</h2>
                <p className="text-gray-600 text-sm mt-1">Book directly with our top available specialists</p>
              </div>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                onClick={() => handleProtectedAction('/doctors')}
              >
                View All Doctors
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredDoctors.map((doc) => {
                const docName = doc.user?.name || doc.name || 'Doctor';
                const imgUrl = doc.profilePicture || doc.image || doc.avatar;

                return (
                  <div key={doc._id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-full bg-blue-100 border flex items-center justify-center text-blue-600 font-bold overflow-hidden shrink-0">
                        {imgUrl ? (
                          <img src={imgUrl} alt={docName} className="w-full h-full object-cover" />
                        ) : (
                          'Dr'
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{docName}</h3>
                        <p className="text-xs text-blue-600 font-medium">
                          {doc.specialization || 'General Practice'}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-4">
                      Fee: <strong>${doc.consultationFee || doc.fee || 0}</strong> | Experience: <strong>{doc.experienceYears || doc.experience || 0} yrs</strong>
                    </p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm"
                      onClick={() => handleProtectedAction(`/doctors/${doc._id}`)}
                    >
                      Book Consultation
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 3. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg">ClinicCare</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Modern online appointment booking platform bringing quality healthcare to your fingertips.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              <li>
                <button onClick={() => handleProtectedAction('/doctors')} className="hover:text-white text-left">
                  Find a Doctor
                </button>
              </li>
              <li><Link href="/login" className="hover:text-white">Patient Portal</Link></li>
              <li><Link href="/register" className="hover:text-white">Register Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Working Hours</h4>
            <ul className="space-y-2 text-xs">
              <li>Mon - Fri: 8:00 AM - 8:00 PM</li>
              <li>Saturday: 9:00 AM - 5:00 PM</li>
              <li>Sunday: Emergency Only</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Emergency Contact</h4>
            <p className="text-xs text-gray-400 mb-1">Hotline: +1 (800) 555-CARE</p>
            <p className="text-xs text-gray-400">Email: support@cliniccare.com</p>
          </div>
        </div>

        <div className="container mx-auto px-6 max-w-6xl border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ClinicCare Inc. All rights reserved.
        </div>
      </footer>

      {/* 4. Auth Guard Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full space-y-4 text-center shadow-2xl">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto text-xl font-bold">
              🔒
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sign In Required</h3>
              <p className="text-gray-500 text-xs mt-1">
                You need to be logged in to search for doctors or book an appointment.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push('/register')}
              >
                Create an Account
              </Button>
            </div>

            <button
              onClick={() => setShowAuthModal(false)}
              className="text-xs text-gray-400 hover:text-gray-600 underline pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const [featuredDoctors, setFeaturedDoctors] = useState([]);

  useEffect(() => {
    fetchAPI('/doctors')
      .then((res) => {
        const list = Array.isArray(res) ? res : res.data || [];
        setFeaturedDoctors(list.slice(0, 3));
      })
      .catch((err) => console.error('Error fetching featured doctors:', err));
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* 1. Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/60 to-white py-12 md:py-20">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
              ✨ Modern Digital Healthcare
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
              Quality Healthcare Made Simple &amp; Accessible
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              Connect with top-rated medical specialists, schedule instant appointments, and manage your health records seamlessly online with ClinicCare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/doctors">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-base font-semibold shadow-md">
                  Find a Doctor
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="w-full sm:w-auto px-8 py-3 text-base border-blue-600 text-blue-600 hover:bg-blue-50">
                  Book Appointment
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"
                alt="ClinicCare Medical Team"
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Floating Rating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 text-lg">
                ⭐️
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">4.9 / 5.0 Rating</p>
                <p className="text-xs text-gray-500">Over 10,000+ Happy Patients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Trust Metrics Bar */}
      <section className="border-y border-gray-100 bg-gray-50/50 py-10">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-extrabold text-blue-600">50+</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">Certified Specialists</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-600">10,000+</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">Patients Served</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-600">99%</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">On-Time Visits</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-blue-600">24/7</p>
            <p className="text-sm text-gray-600 mt-1 font-medium">Online Slot Booking</p>
          </div>
        </div>
      </section>

      {/* 3. About ClinicCare Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1000&q=80"
              alt="Clinic Center Interior"
              className="rounded-2xl shadow-lg border border-gray-100 object-cover w-full h-[380px]"
            />
          </div>
          <div className="space-y-5">
            <span className="text-blue-600 font-semibold text-sm tracking-wide uppercase">About Our Center</span>
            <h2 className="text-3xl font-bold text-gray-900">Dedicated to Compassionate &amp; World-Class Medical Care</h2>
            <p className="text-gray-600 leading-relaxed">
              At ClinicCare, we blend modern digital tools with experienced medical professionals. Our facility is designed to provide comprehensive care across multiple disciplines, eliminating long wait times with real-time slot scheduling.
            </p>
            <ul className="space-y-3 text-sm text-gray-700 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                Fully Verified &amp; Experienced Medical Practitioners
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                Transparent Online Fee Calculation &amp; Checkout
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">✓</span>
                Instant Appointment Confirmations &amp; Patient Reminders
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 4. Specialties Grid */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Core Medical Specialties</h2>
            <p className="text-gray-600 mt-2">Comprehensive health services tailored to your family&apos;s needs</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                ❤️
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Cardiology</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Comprehensive heart assessments, ECG evaluations, and cardiovascular preventative care.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                🩺
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">General Medicine</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Routine health checkups, preventative screenings, and personalized primary healthcare.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                👶
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Pediatrics</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Specialized wellness care, immunizations, and developmental tracking for newborn children and youths.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-4">
                💻
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">Telehealth</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Virtual consultations with licensed specialists right from the comfort of your home.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How ClinicCare Works</h2>
            <p className="text-gray-600 mt-2">Book your consultation in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white border rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                01
              </div>
              <h3 className="font-semibold text-lg mb-2">Find Your Doctor</h3>
              <p className="text-gray-500 text-sm">
                Browse our list of accredited specialists, review qualifications, and compare fees.
              </p>
            </div>

            <div className="text-center p-6 bg-white border rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                02
              </div>
              <h3 className="font-semibold text-lg mb-2">Pick a Slot &amp; Checkout</h3>
              <p className="text-gray-500 text-sm">
                Choose a date and time slot that fits your schedule, and complete instant online payment.
              </p>
            </div>

            <div className="text-center p-6 bg-white border rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg mx-auto mb-4">
                03
              </div>
              <h3 className="font-semibold text-lg mb-2">Track on Dashboard</h3>
              <p className="text-gray-500 text-sm">
                Receive live reminders on your dashboard and keep track of all upcoming appointments.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Doctors Section */}
      {featuredDoctors.length > 0 && (
        <section className="bg-blue-50/50 py-16 md:py-20 border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Doctors</h2>
                <p className="text-gray-600 text-sm mt-1">Book directly with our top available specialists</p>
              </div>
              <Link href="/doctors">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                  View All Doctors
                </Button>
              </Link>
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
                    <Link href={`/doctors/${doc._id}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
                        Book Consultation
                      </Button>
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 7. Footer */}
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
              <li><Link href="/doctors" className="hover:text-white">Find a Doctor</Link></li>
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
    </div>
  );
}
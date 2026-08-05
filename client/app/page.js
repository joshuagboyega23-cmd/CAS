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
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    async function loadFeaturedDoctors() {
      try {
        const data = await fetchAPI('/doctors');
        const docs = data.doctors || data.data || [];
        setFeaturedDoctors(docs.slice(0, 3));
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

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      {/* 1. Hero Section */}
      <section className="relative bg-gradient-to-b from-blue-50/50 to-white py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-left">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
              24/7 Premium Care
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
              Quality Healthcare, <br className="hidden sm:inline" />
              <span className="text-blue-600">Simplified</span> For Everyone
            </h1>
            <p className="text-gray-600 text-base md:text-lg leading-relaxed">
              Connect with top certified medical specialists, schedule instant consultations, 
              and take full control of your family's health journey in one place.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                onClick={() => handleProtectedAction('/doctors')}
              >
                Find a Doctor
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-300 hover:bg-gray-50"
                onClick={() => handleProtectedAction('/doctors')}
              >
                Book Appointment
              </Button>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="w-full max-w-md h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl border-4 border-white relative bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                alt="Clinic Healthcare Team"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur p-4 rounded-xl shadow-lg border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-lg">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Verified Specialists</p>
                  <p className="text-xs text-gray-500">Over 50+ board-certified doctors available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar Section */}
      <section className="border-y border-gray-100 bg-white py-10">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-extrabold text-blue-600">10,000+</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Patients Served</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-extrabold text-blue-600">50+</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Specialist Doctors</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-extrabold text-blue-600">99.8%</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Satisfaction Rate</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl md:text-4xl font-extrabold text-blue-600">24/7</p>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Emergency Support</p>
          </div>
        </div>
      </section>

      {/* 3. Hospital Details & Key Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose ClinicCare?</h2>
            <p className="text-gray-600 text-sm mt-2">
              Our modern hospital facilities bring seamless medical booking and patient management right to your screen.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border bg-slate-50/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                🩺
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Expert Doctors</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Access top-rated general practitioners and specialists across cardiology, pediatrics, neurology, and more.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-slate-50/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                ⚡️
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Instant Confirmation</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Book your preferred slot directly with instant automated verification and instant email receipts.
              </p>
            </div>

            <div className="p-6 rounded-xl border bg-slate-50/50 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">
                🔒
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your medical history and payment transactions are protected with enterprise-grade encryption standard.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Specialties Section */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Explore Medical Specialties</h2>
            <p className="text-gray-600 text-sm mt-2">
              Find experienced healthcare practitioners tailored to your specific health needs.
              </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { title: 'Cardiology', icon: '❤️', count: '12 Doctors' },
              { title: 'Pediatrics', icon: '👶', count: '8 Doctors' },
              { title: 'Neurology', icon: '🧠', count: '6 Doctors' },
              { title: 'Dermatology', icon: '✨', count: '10 Doctors' },
              { title: 'Orthopedics', icon: '🦴', count: '9 Doctors' },
              { title: 'General Care', icon: '🏥', count: '15 Doctors' },
            ].map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleProtectedAction('/doctors')}
                className="bg-white p-4 rounded-xl border text-center hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h4 className="font-bold text-sm text-gray-900">{item.title}</h4>
                <p className="text-[10px] text-gray-400 mt-1">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How ClinicCare Works</h2>
            <p className="text-gray-600 text-sm mt-2">
              Get quality medical consultation in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mx-auto text-xl shadow-md">
                1
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Choose Your Doctor</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Filter by medical specialty, consultation fees, and experience level to find the right fit.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mx-auto text-xl shadow-md">
                2
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Schedule Time Slot</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Pick a convenient date and time slot directly from the doctor's real-time schedule.
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-14 h-14 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mx-auto text-xl shadow-md">
                3
              </div>
              <h3 className="font-bold text-gray-900 text-lg">Pay & Get Confirmed</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Complete secure checkout with Paystack and receive automated confirmation receipts instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Featured Doctors Section */}
      {featuredDoctors.length > 0 && (
        <section className="bg-blue-50/40 py-16 md:py-20 border-t border-gray-100">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Doctors</h2>
                <p className="text-gray-600 text-sm mt-1">Book directly with our top rated specialists</p>
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
                const rating = doc.rating || 4.9;

                return (
                  <div key={doc._id} className="bg-white p-5 rounded-xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div>
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
                          <div className="flex items-center gap-1 mt-1">
                            <span className="text-amber-400 text-xs">★</span>
                            <span className="text-xs font-bold text-gray-700">{rating}</span>
                            <span className="text-[10px] text-gray-400">(50+ reviews)</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-4">
                        Fee: <strong>${doc.consultationFee || doc.fee || 50}</strong> | Experience: <strong>{doc.experienceYears || doc.experience || 5} yrs</strong>
                      </p>
                    </div>

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

      {/* 7. Patient Testimonials Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What Our Patients Say</h2>
            <p className="text-gray-600 text-sm mt-2">
              Real feedback from patients who booked appointments through ClinicCare
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border bg-slate-50/50 space-y-4">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "Booking an appointment used to take hours of waiting in line. With ClinicCare, I booked a pediatrician for my son within 2 minutes."
              </p>
              <div>
                <p className="font-bold text-xs text-gray-900">Sarah Jenkins</p>
                <p className="text-[10px] text-gray-400">Verified Patient</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-slate-50/50 space-y-4">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "The email reminders and instant Paystack integration were super convenient. Dr. David was extremely professional and thorough."
              </p>
              <div>
                <p className="font-bold text-xs text-gray-900">Michael Adebayo</p>
                <p className="text-[10px] text-gray-400">Verified Patient</p>
              </div>
            </div>

            <div className="p-6 rounded-xl border bg-slate-50/50 space-y-4">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "Very clean interface and seamless experience! The patient dashboard keeps all my scheduled clinic appointments in one organized place."
              </p>
              <div>
                <p className="font-bold text-xs text-gray-900">Elena Rostova</p>
                <p className="text-[10px] text-gray-400">Verified Patient</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions */}
      <section className="py-16 bg-slate-50 border-t border-gray-100">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-sm mt-2">Have questions? We have quick answers.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'How do I book an appointment with a specialist?',
                a: 'Simply register or sign in, select "Find a Doctor" from the main menu, pick your preferred specialist, choose an available date and time slot, and confirm your payment.'
              },
              {
                q: 'What payment methods are supported?',
                a: 'We process secure online payments through Paystack, supporting major debit cards, credit cards, and instant bank transfers.'
              },
              {
                q: 'Can I view or reschedule my booked appointments?',
                a: 'Yes, all your upcoming and past medical consultations are safely stored and visible directly on your Patient Dashboard.'
              },
              {
                q: 'How do I know if my booking is confirmed?',
                a: 'Once payment is successfully processed, you will see a confirmation badge on your dashboard and receive an immediate email receipt.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="bg-white border rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 font-bold text-sm text-gray-900 flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  <span className="text-blue-600 font-bold text-base">{openFaq === idx ? '−' : '+'}</span>
                </button>
                {openFaq === idx && (
                  <div className="px-4 pb-4 text-xs text-gray-600 leading-relaxed border-t pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Call to Action Banner */}
      <section className="bg-blue-600 text-white py-16 text-center px-6">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl font-bold">Ready to Experience Modern Healthcare?</h2>
          <p className="text-blue-100 text-sm">
            Join thousands of satisfied patients. Book your doctor's appointment today in just a few clicks.
          </p>
          <div className="pt-2">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 font-bold"
              onClick={() => handleProtectedAction('/doctors')}
            >
              Get Started Now
              </Button>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
        <div className="container mx-auto px-6 max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
          <div className="space-y-3">
            <h3 className="text-white font-bold text-lg">ClinicCare</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Modern online appointment booking platform bringing quality healthcare directly to your fingertips.
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

      {/* 11. Auth Guard Modal */}
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
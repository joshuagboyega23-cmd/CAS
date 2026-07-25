'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 text-center">
      <div className="max-w-3xl mx-auto space-y-6">
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Clinic Appointment System
        </span>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight">
          Modern Healthcare Booking Made Simple
        </h1>

        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Find qualified specialist doctors, schedule appointments in seconds, and manage your health journey all in one place.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/doctors"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md"
          >
            Find a Doctor
          </Link>
          <Link
            href="/login"
            className="bg-white hover:bg-slate-100 text-slate-800 font-semibold px-6 py-3 rounded-lg border border-slate-300 transition-colors shadow-sm"
          >
            Sign In to Account
          </Link>
        </div>
      </div>
    </div>
  );
}
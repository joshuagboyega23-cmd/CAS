'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
          🏥 <span>ClinicCare</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link href="/doctors" className="hover:text-blue-600 transition-colors">
            Doctors
          </Link>

          {user ? (
            <>
              {user.role === 'patient' && (
                <Link href="/patient" className="hover:text-blue-600 transition-colors">
                  My Dashboard
                </Link>
              )}
              {user.role === 'doctor' && (
                <Link href="/doctor" className="hover:text-blue-600 transition-colors">
                  Doctor Schedule
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="hover:text-blue-600 transition-colors">
                  Admin Panel
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                Logout ({user.name?.split(' ')[0] || 'User'})
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          ClinicCare
        </Link>

        <nav className="flex items-center gap-6">
          {/* Points to the active doctors list page */}
          <Link 
            href="/doctors" 
            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
          >
            Doctors
          </Link>

          {/* Points to the active Doctor Profile & Schedule settings page */}
          {user?.role === 'doctor' && (
            <Link 
              href="/doctor/profile" 
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              Doctor Schedule
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={logout}>
                Logout ({user.name?.split(' ')[0] || 'User'})
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
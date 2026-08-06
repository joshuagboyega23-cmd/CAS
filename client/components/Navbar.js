'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { fetchAPI } from '@/lib/api';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'doctor') {
      const loadNotifications = async () => {
        try {
          const data = await fetchAPI('/appointments/doctor/my-appointments');
          setUnreadCount(data.unreadCount || 0);
        } catch (err) {
          console.error('Failed to load doctor notifications:', err);
        }
      };

      loadNotifications();
      const interval = setInterval(loadNotifications, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">
          ClinicCare
        </Link>

        <nav className="flex items-center gap-6">
          {user?.role === 'doctor' && (
            <div className="flex items-center gap-4">
              <Link 
                href="/doctor/profile" 
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Profile & Schedule
              </Link>

              {/* Doctor Notification Bell - Hidden for Patients */}
              <Link 
                href="/doctor/appointments" 
                className="relative text-gray-700 hover:text-blue-600 flex items-center p-1"
                title="View Doctor Bookings"
              >
                <span className="text-xl">🔔</span>
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            </div>
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
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
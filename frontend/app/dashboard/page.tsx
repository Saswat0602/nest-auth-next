'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth-context';
import { useSession } from 'next-auth/react';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user, token, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for NextAuth session or custom token
    if (status === 'loading') return;
    const isAuthed = !!token || status === 'authenticated';
    if (!isAuthed) {
      router.push('/signin');
      return;
    }
    setLoading(false);
  }, [status, token, router]);

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <Button variant="outline" onClick={logout}>
            Sign Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Your Profile</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  <p className="font-medium">{user?.name ?? session?.user?.name ?? 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Email Address</p>
                  <p className="font-medium">{user?.email ?? session?.user?.email ?? 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">User ID</p>
                  <p className="font-medium">{user?.id || 'N/A'}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="font-medium capitalize">{user?.role?.toLowerCase() || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Dashboard Widgets */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md overflow-hidden text-white p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-2">Welcome!</h3>
            <p className="opacity-90">
              Your account has been successfully verified and you're now logged in.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-md overflow-hidden text-white p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-2">Account Security</h3>
            <p className="opacity-90">
              Your account is protected with secure authentication.
            </p>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md overflow-hidden text-white p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="font-semibold text-lg mb-2">Get Started</h3>
            <p className="opacity-90">
              Build amazing things with this authentication system.
            </p>
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
}

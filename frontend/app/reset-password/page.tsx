'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth-context';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, error } = useAuth();
  
  const token = searchParams?.get('token') || '';
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState({ password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
    }
  }, [token, router]);

  const validateForm = () => {
    const errors = { password: '', confirmPassword: '' };
    let isValid = true;
    
    if (!password) {
      errors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await resetPassword(token, password);
      setIsSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/signin');
      }, 3000);
    } catch (error) {
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        {isSuccess ? (
          <div className="text-center">
            <div className="mb-6 text-green-500 inline-flex p-3 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Successful</h1>
            <p className="text-gray-600 mb-6">
              Your password has been successfully reset. You'll be redirected to the login page.
            </p>
            <Link href="/signin">
              <Button variant="primary" fullWidth>
                Go to Login
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create New Password</h1>
              <p className="text-gray-600 mt-2">
                Enter your new password below
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="New Password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={formErrors.password}
              />
              
              <Input
                label="Confirm New Password"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={formErrors.confirmPassword}
              />
              
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="mt-2"
              >
                Reset Password
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/signin" className="text-indigo-600 hover:text-indigo-800 text-sm">
                Return to login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <Suspense fallback={<LoadingFallback />}>
        <ResetPasswordContent />
      </Suspense>
    </motion.div>
  );
} 
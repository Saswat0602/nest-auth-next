'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { useAuth } from '@/lib/auth-context';

export default function ForgotPasswordPage() {
  const { requestPasswordReset, error } = useAuth();
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid');
      return false;
    }
    
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Password reset request error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mb-6 text-green-500 inline-flex p-3 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Password Reset Link Sent</h1>
              <p className="text-gray-600 mb-6">
                We've sent an email to <span className="font-medium">{email}</span> with instructions to reset your password.
              </p>
              <Link href="/signin">
                <Button variant="primary" fullWidth>
                  Return to Login
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                />
                
                <Button
                  type="submit"
                  fullWidth
                  isLoading={isLoading}
                  className="mt-2"
                >
                  Send Reset Link
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
    </motion.div>
  );
}

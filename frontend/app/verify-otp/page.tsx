'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth-context'

function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOtp, error } = useAuth()

  const email = searchParams?.get('email') || ''
  const _userId = searchParams?.get('userId') || ''
  
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
  
  useEffect(() => {
    if (!email) {
      router.push('/signup')
      return
    }
    
    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(timer)
  }, [email, router])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const validateForm = () => {
    if (!otp.trim()) {
      setOtpError('OTP is required')
      return false
    }
    
    if (!/^\d{6}$/.test(otp)) {
      setOtpError('OTP must be 6 digits')
      return false
    }
    
    setOtpError('')
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await verifyOtp(email, otp)
      // verifyOtp in useAuth will handle navigation to signin
    } catch (error) {
      console.error('OTP verification error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="text-gray-600 mt-2">
            We've sent a 6-digit code to {email}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="6-Digit OTP Code"
            type="text"
            name="otp"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={otpError}
            maxLength={6}
            className="text-center text-lg tracking-widest"
          />
          
          <div className="mt-2 mb-6 text-center">
            <p className={`text-sm ${countdown > 0 ? 'text-indigo-600' : 'text-red-600'}`}>
              {countdown > 0 ? (
                `Code expires in ${formatTime(countdown)}`
              ) : (
                'OTP has expired, please request a new one'
              )}
            </p>
          </div>
          
          <Button
            type="submit"
            fullWidth
            isLoading={isLoading}
            disabled={countdown === 0}
          >
            Verify Email
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Didn't receive the code?{' '}
            <button 
              className="text-indigo-600 hover:text-indigo-800 font-medium"
              onClick={() => router.push(`/signup`)}
            >
              Try again
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    </div>
  )
}

export default function VerifyOTPPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 p-4"
    >
      <Suspense fallback={<LoadingFallback />}>
        <VerifyOTPContent />
      </Suspense>
    </motion.div>
  )
}

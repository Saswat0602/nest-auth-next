'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth-context'
import { FcGoogle } from 'react-icons/fc'

export default function SignUpPage() {
  const router = useRouter()
  const { register, googleLogin, error } = useAuth()
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
    
    let isValid = true
    
    if (!formState.name.trim()) {
      errors.name = 'Name is required'
      isValid = false
    }
    
    if (!formState.email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formState.email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }
    
    if (!formState.password) {
      errors.password = 'Password is required'
      isValid = false
    } else if (formState.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
      isValid = false
    }
    
    if (formState.password !== formState.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await register(formState.name, formState.email, formState.password)
      router.push(`/verify-otp?email=${encodeURIComponent(formState.email)}&userId=${response.userId}`)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    try {
      await googleLogin()
    } catch (error) {
      console.error('Google login error:', error)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Form */}
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
            <p className="mt-2 text-gray-600">
              Join our community and get started
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Sign Up Button */}
        <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg p-3 mb-6 shadow-sm hover:shadow transition-all"
        >
            {isGoogleLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-gray-500 border-t-transparent rounded-full"></div>
            ) : (
              <>
          <FcGoogle size={22} />
                <span className="text-gray-700 font-medium">Continue with Google</span>
              </>
            )}
        </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              name="name"
              placeholder="John Doe"
              value={formState.name}
              onChange={handleChange}
              error={formErrors.name}
            />
            
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={formState.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formState.password}
              onChange={handleChange}
              error={formErrors.password}
            />
            
            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formState.confirmPassword}
              onChange={handleChange}
              error={formErrors.confirmPassword}
            />
            
            <div className="pt-2">
              <Button
                type="submit"
                fullWidth
                isLoading={isLoading}
                className="py-3"
              >
                Create Account
              </Button>
            </div>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/signin" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Right side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-90"></div>
        <Image 
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2064&auto=format&fit=crop" 
          alt="Sign Up" 
          fill 
          className="object-cover mix-blend-overlay" 
          priority
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-4xl font-bold mb-6">Join Our Community</h1>
          <p className="text-xl max-w-md text-center text-white/90">
            Create an account today and start your journey with our platform.
          </p>
        </div>
      </div>
    </div>
  )
}

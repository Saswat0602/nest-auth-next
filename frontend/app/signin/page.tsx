'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { useAuth } from '@/lib/auth-context'
import { FcGoogle } from 'react-icons/fc'

export default function SignInPage() {
  const router = useRouter()
  const { login, error } = useAuth()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  const validateForm = () => {
    const errors = { email: '', password: '' }
    let isValid = true
    
    if (!email.trim()) {
      errors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid'
      isValid = false
    }
    
    if (!password) {
      errors.password = 'Password is required'
      isValid = false
    }
    
    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      await login(email, password)
      // login function in useAuth will handle the navigation to dashboard
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Image */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-900 opacity-90"></div>
        <Image 
          src="https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop" 
          alt="Login" 
          fill 
          className="object-cover mix-blend-overlay" 
          priority
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
          <p className="text-xl max-w-md text-center text-white/90">
            Sign in to access your account and continue your journey with us.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
    <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white"
      >
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
            <p className="mt-2 text-gray-600">
              Enter your credentials to access your account
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
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
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={formErrors.email}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={formErrors.password}
            />
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="remember-me" className="ml-2 text-gray-600">
                  Remember me
                </label>
              </div>
              
              <Link href="/forgot-password" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              className="mt-8 py-3"
            >
              Sign In
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/signup" className="text-indigo-600 hover:text-indigo-800 font-medium">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
      </div>
  )
}

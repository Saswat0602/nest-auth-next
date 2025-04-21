'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/Button'

export default function LandingPage() {
  return (
    <main className="w-full">
      {/* Hero Section */}
      <div
        className="w-full h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Secure Authentication <br/> Made Simple
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto opacity-90"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Complete authentication system with email verification, OTP confirmation, 
            and secure password management.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link href="/signin" className="block">
              <Button variant="primary" className="text-lg px-8 py-3">
                Sign In
              </Button>
            </Link>
            <Link href="/signup" className="block">
              <Button variant="outline" className="text-lg px-8 py-3 bg-white/10 hover:bg-white/20">
                Sign Up
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900">Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Secure Authentication",
                description: "Industry-standard security practices with JWT token-based authentication.",
                icon: "🔐"
              },
              {
                title: "Email Verification",
                description: "Verify new accounts with one-time passwords sent directly to email.",
                icon: "✉️"
              },
              {
                title: "Password Recovery",
                description: "Simple password reset flow for users who forget their credentials.",
                icon: "🔄"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                className="bg-gray-50 p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full bg-indigo-900 text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg md:text-xl mb-10 opacity-90">
            Create your account now and experience our secure authentication system.
          </p>
          <Link href="/signup">
            <Button variant="primary" className="text-lg px-8 py-3 bg-white text-indigo-900 hover:bg-gray-100">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </main>
  )
}

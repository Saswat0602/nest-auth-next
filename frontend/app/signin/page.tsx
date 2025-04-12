'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-xl shadow-xl bg-white w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign In</h2>
        {/* Form inputs */}
        <input type="email" placeholder="Email" className="mb-2 w-full border rounded p-2" />
        <input type="password" placeholder="Password" className="mb-4 w-full border rounded p-2" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>
        <div className="mt-4 text-center text-sm">
          <Link href="/signup" className="text-blue-500">Don’t have an account?</Link>
        </div>
      </div>
    </motion.div>
  )
}

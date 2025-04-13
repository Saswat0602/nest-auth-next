'use client'
import { useVerifyOtp } from '@/hooks/useVerifyOtp'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function VerifyOtpPage() {
  const { verifyOtp } = useVerifyOtp()
  const [otp, setOtp] = useState('')

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center">
      <div className="p-6 bg-white rounded shadow-xl max-w-md w-full">
        <h2 className="text-lg font-semibold mb-2">Verify OTP</h2>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} className="mb-4 w-full border rounded p-2" placeholder="Enter OTP" />
        <button onClick={() => verifyOtp(otp)} className="bg-blue-600 text-white px-4 py-2 rounded w-full">Verify</button>
      </div>
    </motion.div>
  )
}

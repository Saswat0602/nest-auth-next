'use client'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const router = useRouter()
  
  const handleSubmit = async () => {
    // simulate API call
    await new Promise(res => setTimeout(res, 500))
    router.push('/verify-otp')
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="min-h-screen flex items-center justify-center">
      <div className="p-6 rounded-xl shadow-xl bg-white w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Sign Up</h2>
        <input placeholder="Email" className="mb-2 w-full border rounded p-2" />
        <input placeholder="Password" className="mb-2 w-full border rounded p-2" />
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded w-full">Register</button>
      </div>
    </motion.div>
  )
}

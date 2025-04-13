'use client'
import { useRouter } from 'next/navigation'

export const useVerifyOtp = () => {
  const router = useRouter()

  const verifyOtp = async (otp: string) => {
    if (otp === '1234') {
      router.push('/dashboard')
    } else {
      alert('Invalid OTP')
    }
  }

  return { verifyOtp }
}

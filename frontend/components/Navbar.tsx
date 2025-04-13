'use client'
import Link from 'next/link'

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur bg-white/10 text-white">
    <Link href="/" className="text-xl font-bold">AuthApp</Link>
    <div className="flex gap-4 font-medium">
      <Link href="/signin" className="hover:underline">Sign In</Link>
      <Link href="/signup" className="hover:underline">Sign Up</Link>
    </div>
  </div>
  )
}
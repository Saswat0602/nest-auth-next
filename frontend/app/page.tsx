'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'

const sections = [
  {
    title: 'Welcome to Auth App',
    subtitle: 'Modern authentication with email, OTP, and Google login.',
    image: 'https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=2100&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    title: 'Fast and Secure',
    subtitle: 'Built with Next.js, NextAuth, Tailwind & Framer Motion.',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1986&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
  {
    title: 'Get Started Now',
    subtitle: 'Click below to sign in or register instantly.',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3',
  },
]

export default function LandingPage() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

  return (
<motion.main
  ref={ref}
  className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
>
      <Navbar />

      {sections.map((section, i) => (
        <section
          key={i}
          className="snap-start h-screen w-full relative flex flex-col items-center justify-center text-white overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 z-0"
            style={{ scale }}
          >
            <Image
              src={section.image}
              alt="bg"
              fill
              className="object-cover filter brightness-75"
              priority
            />
          </motion.div>

          <motion.div
            className="z-10 text-center px-6"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{section.title}</h1>
            <p className="text-lg md:text-xl max-w-xl mx-auto mb-8">{section.subtitle}</p>

            {i === 2 && (
              <div className="flex justify-center gap-4">
                <Link
                  href="/signin"
                  className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold shadow hover:scale-105 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold shadow hover:scale-105 transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        </section>
      ))}
</motion.main>
  )
}

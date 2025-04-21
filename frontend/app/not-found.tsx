'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <h1 className="text-6xl font-bold text-indigo-600">404</h1>
        <h2 className="text-3xl font-semibold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-gray-600 mt-3 mb-8">
          The page you're looking for doesn't exist or you don't have permission to access it.
        </p>
        
        <Link href="/">
          <Button variant="primary" fullWidth>
            Return to Home
          </Button>
        </Link>
      </motion.div>
    </div>
  );
} 
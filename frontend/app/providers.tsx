// app/providers.tsx
'use client'

import React from 'react';
import { AuthProvider } from '@/lib/auth-context';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  );
}

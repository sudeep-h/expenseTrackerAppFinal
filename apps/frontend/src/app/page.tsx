'use client';

import { useEffect } from 'react';
import type { Metadata } from 'next'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { buildPageMetadata } from '@/lib/metadata'

export const metadata: Metadata = buildPageMetadata({
  title: 'Welcome',
  description: 'Sign in or create an account to continue',
})

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    
    if (session) {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Expense Tracker
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Track your expenses and manage your finances with ease
          </p>
        </div>
        
        <div className="space-y-4">
          <Link href="/login">
            <Button className="w-full" size="lg">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" className="w-full" size="lg">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

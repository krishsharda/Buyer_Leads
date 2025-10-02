'use client';

import { useEffect } from 'react';
import { MainLayout } from '@/components/main-layout';
import Link from 'next/link';

export default function BuyerError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Buyer page error:', error);
  }, [error]);

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-6xl font-bold text-red-500">⚠️</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Something went wrong!
            </h2>
            <p className="mt-4 text-gray-600">
              There was an error loading this buyer's details.
            </p>
            {error.message && (
              <p className="mt-2 text-sm text-red-600 font-mono">
                {error.message}
              </p>
            )}
          </div>
          
          <div className="mt-8 space-y-4">
            <button
              onClick={reset}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            
            <div className="mt-4 space-x-4">
              <Link
                href="/buyers"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Buyers
              </Link>
              
              <Link
                href="/buyers/debug"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Debug Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
import { MainLayout } from '@/components/main-layout';
import Link from 'next/link';

export default function NotFound() {
  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <div>
            <h1 className="text-6xl font-bold text-red-500">404</h1>
            <h2 className="mt-6 text-3xl font-bold text-gray-900">
              Page Not Found
            </h2>
            <p className="mt-4 text-gray-600">
              The page you're looking for doesn't exist.
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <Link
              href="/buyers"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Dashboard
            </Link>
            
            <div className="mt-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
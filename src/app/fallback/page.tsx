import Link from 'next/link';

export default function ServerErrorFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Buyer Leads App
          </h1>
          
          <p className="text-gray-600 mb-6">
            Welcome to the Mini Buyer Lead Intake Application
          </p>
          
          <div className="space-y-3">
            <Link 
              href="/api/health" 
              className="block w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Check App Health
            </Link>
            
            <Link 
              href="/diagnostic" 
              className="block w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
            >
              View Diagnostics
            </Link>
            
            <Link 
              href="/buyers" 
              className="block w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Manage Buyers
            </Link>
          </div>
          
          <div className="mt-6 text-xs text-gray-500">
            Environment: {process.env.NODE_ENV || 'development'}
          </div>
        </div>
      </div>
    </div>
  );
}
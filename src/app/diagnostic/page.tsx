import { auth } from '@/lib/auth';
import { db } from '@/db';
import { users } from '@/db/schema';

export default async function DiagnosticPage() {
  let diagnostics = {
    authWorking: false,
    databaseWorking: false,
    session: null,
    userCount: 0,
    error: null,
  };

  try {
    // Test auth
    const session = await auth();
    diagnostics.session = session;
    diagnostics.authWorking = true;
  } catch (error) {
    diagnostics.error = `Auth error: ${error}`;
  }

  try {
    // Test database
    const userCount = await db.select().from(users);
    diagnostics.userCount = userCount.length;
    diagnostics.databaseWorking = true;
  } catch (error) {
    diagnostics.error = `Database error: ${error}`;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Railway App Diagnostics</h1>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Environment:</span>
            <span className="font-mono">{process.env.NODE_ENV}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>NextAuth URL:</span>
            <span className="font-mono text-sm">{process.env.NEXTAUTH_URL || 'Not set'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>NextAuth Secret:</span>
            <span className="font-mono">{process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Database URL:</span>
            <span className="font-mono text-sm">{process.env.DATABASE_URL ? 'Set' : 'Not set'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Railway Domain:</span>
            <span className="font-mono text-sm">{process.env.RAILWAY_PUBLIC_DOMAIN || 'Not set'}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Auth Working:</span>
            <span className={`px-2 py-1 rounded text-sm ${diagnostics.authWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {diagnostics.authWorking ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>Database Working:</span>
            <span className={`px-2 py-1 rounded text-sm ${diagnostics.databaseWorking ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {diagnostics.databaseWorking ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <span>User Count:</span>
            <span className="font-mono">{diagnostics.userCount}</span>
          </div>
          
          {diagnostics.session && (
            <div className="p-3 bg-green-50 rounded">
              <strong>Session:</strong>
              <pre className="mt-2 text-sm overflow-x-auto">{JSON.stringify(diagnostics.session, null, 2)}</pre>
            </div>
          )}
          
          {diagnostics.error && (
            <div className="p-3 bg-red-50 rounded">
              <strong>Error:</strong>
              <pre className="mt-2 text-sm text-red-800">{diagnostics.error}</pre>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <a href="/" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
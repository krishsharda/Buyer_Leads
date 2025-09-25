'use client';

import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (!session) {
    return (
      <div className="min-h-screen hero-section flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center">
          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/buyers', current: pathname === '/buyers' },
    { name: 'New Lead', href: '/buyers/new', current: pathname === '/buyers/new' },
  ];

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold gradient-text">PropertyLead Pro</h1>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-4 py-2 border rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {session.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-gray-700">
                    {session.user?.name || 'User'}
                  </div>
                </div>
              </div>
              <button onClick={handleSignOut} className="btn-secondary text-sm">
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {pathname === '/buyers' && (
        <div className="hero-section py-20 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-5xl font-bold mb-6 drop-shadow-lg">Manage Your Property Leads</h2>
            <p className="text-xl opacity-95 mb-8 max-w-2xl mx-auto">
              Transform prospects into successful property deals
            </p>
            <Link href="/buyers/new" className="btn-primary text-lg px-8 py-4 shadow-xl">
              Add New Lead
            </Link>
          </div>
        </div>
      )}

      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="fade-in">{children}</div>
        </div>
      </main>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';

export default function BuyerDebugPage() {
  const router = useRouter();
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/debug-buyers')
      .then(res => res.json())
      .then(data => {
        console.log('Debug buyers data:', data);
        setBuyers(data.buyers || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching debug buyers:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Loading Buyers Debug Info...</h1>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Buyers Debug Information</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Available Buyers ({buyers.length})</h2>
          
          {buyers.length === 0 ? (
            <p className="text-gray-500">No buyers found in store</p>
          ) : (
            <div className="space-y-2">
              {buyers.map((buyer) => (
                <div key={buyer.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <strong>ID:</strong> {buyer.id} | <strong>Name:</strong> {buyer.fullName}
                  </div>
                  <button
                    onClick={() => router.push(`/buyers/${buyer.id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6">
            <button
              onClick={() => router.push('/buyers')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Back to Buyers List
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
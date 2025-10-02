import { notFound, redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { buyers, users, buyerHistory } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { MainLayout } from '@/components/main-layout';
import { BuyerDetailsView } from '@/components/buyer-details-view';
import { BuyerEditForm } from '@/components/buyer-edit-form';

interface BuyerPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}

export default async function BuyerPage({ params, searchParams }: BuyerPageProps) {
  try {
    const session = await auth();
    if (!session) {
      redirect('/auth/signin');
    }

    const { id } = await params;
    const { edit } = await searchParams;
    
    console.log('🔍 Looking for buyer with ID:', id);
    
    // STATIC SOLUTION: Get buyer from in-memory store with error handling
    let storedBuyer;
    let allBuyers = [];
    
    try {
      const { getBuyerById, getAllBuyers } = await import('@/lib/buyers-store');
      storedBuyer = getBuyerById(id);
      allBuyers = getAllBuyers();
      
      console.log('📊 Available buyers:', allBuyers.map(b => ({ id: b.id, name: b.fullName })));
      console.log('🎯 Found buyer:', storedBuyer ? storedBuyer.fullName : 'NOT FOUND');
    } catch (storeError) {
      console.error('❌ Error accessing buyers store:', storeError);
      notFound();
    }

    if (!storedBuyer) {
      console.log('❌ Buyer not found, calling notFound()');
      notFound();
    }

    // Safely format buyer to match expected structure
    const buyer = {
      id: storedBuyer.id || 'unknown',
      fullName: storedBuyer.fullName || 'Unknown Buyer',
      email: storedBuyer.email || null,
      phone: storedBuyer.phone || 'N/A',
      city: storedBuyer.city || 'N/A',
      propertyType: storedBuyer.propertyType || 'N/A',
      bhk: storedBuyer.bhk || 'N/A',
      purpose: storedBuyer.purpose || 'N/A',
      budgetMin: storedBuyer.budgetMin || 0,
      budgetMax: storedBuyer.budgetMax || 0,
      timeline: storedBuyer.timeline || 'N/A',
      source: storedBuyer.source || 'N/A',
      status: storedBuyer.status || 'New',
      notes: storedBuyer.notes || null,
      tags: Array.isArray(storedBuyer.tags) ? storedBuyer.tags : [],
      createdAt: storedBuyer.createdAt ? new Date(storedBuyer.createdAt * 1000) : new Date(),
      updatedAt: storedBuyer.updatedAt ? new Date(storedBuyer.updatedAt * 1000) : new Date(),
      owner: {
        id: session.user?.id || 'unknown',
        name: session.user?.name || 'Unknown User',
        email: session.user?.email || 'unknown@example.com',
      },
    };

    // For now, provide empty history (no database operations)
    const history: any[] = [];

    const canEdit = buyer.owner?.id === session.user?.id || session.user?.isAdmin || false;
    const isEditing = edit === 'true' && canEdit;

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <div className="flex items-center">
                  <a href="/buyers" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                    Buyers
                  </a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-500">
                    {buyer.fullName}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {isEditing ? (
          <BuyerEditForm buyer={buyer} canEdit={canEdit} />
        ) : (
          <BuyerDetailsView buyer={buyer} history={history} canEdit={canEdit} />
        )}
      </div>
    </MainLayout>
  );
  
  } catch (error) {
    console.error('🚨 Error in BuyerPage:', error);
    notFound();
  }
}
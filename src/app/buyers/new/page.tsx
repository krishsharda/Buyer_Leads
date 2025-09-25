import { MainLayout } from '@/components/main-layout';
import { CreateBuyerForm } from '@/components/create-buyer-form';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function NewBuyerPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Add New Buyer Lead</h1>
            <p className="mt-2 text-sm text-gray-600">
              Fill in the buyer information to create a new lead
            </p>
          </div>
          
          <CreateBuyerForm />
        </div>
      </div>
    </MainLayout>
  );
}
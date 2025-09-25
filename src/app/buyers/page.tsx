import { MainLayout } from '@/components/main-layout';
import { BuyersList } from '@/components/buyers-list';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function BuyersPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <MainLayout>
      <div className="px-4 sm:px-6 lg:px-8">
        <BuyersList searchParams={searchParams} />
      </div>
    </MainLayout>
  );
}
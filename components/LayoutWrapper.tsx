'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/portfolio/ui/Header';
import Footer from '@/components/portfolio/ui/Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <>
      {!isAdminPage && <Header />}
      <main className="grow">
        {children}
      </main>
      {!isAdminPage && <Footer />}
    </>
  );
}

import { AdminRootProviders } from '@/layouts/AdminRootProviders';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import './globals.css';

export const metadata: Metadata = {
  title: 'CityQuest Admin',
  description: 'Administrative panel for managing CityQuest destinations and routes.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <AdminRootProviders>{children}</AdminRootProviders>
      </body>
    </html>
  );
}

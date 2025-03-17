import type { Metadata } from 'next';
import RootLayoutClient from './layout-client';
import { Toaster } from 'sonner';
export const runtime = 'edge';
export const metadata: Metadata = {
  title: 'New Concept English Listening',
  description: 'New Concept English Listening',
  viewport:
    'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayoutClient>
      <Toaster position='top-center' />
      {children}
    </RootLayoutClient>
  );
}

import { Metadata } from 'next';
import ClientLayout from './client-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'WildSpots - Find Your Perfect Campsite',
  description: 'Discover and book unique camping experiences on private land',
  keywords: ['camping', 'outdoors', 'glamping', 'nature', 'adventure'],
  themeColor: '#10b981',
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'WildSpots - Find Your Perfect Campsite',
    description: 'Discover and book unique camping experiences on private land',
    type: 'website',
    locale: 'en_US',
    url: 'https://wildspots.app',
    siteName: 'WildSpots',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WildSpots - Find Your Perfect Campsite',
    description: 'Discover and book unique camping experiences on private land',
    creator: '@wildspots',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ClientLayout>{children}</ClientLayout>;
}

'use client';

import { useEffect, useState } from 'react';
import { FavoritesProvider } from '../src/contexts/FavoritesContext';
import { AuthProvider } from '../src/contexts/AuthContext';
import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if dark mode is enabled in localStorage
    const isDark = localStorage.theme === 'dark' || 
      (!('theme' in localStorage) && 
      window.matchMedia('(prefers-color-scheme: dark)').matches);
    
    // Set the initial theme class
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <html lang="en" className={`h-full ${inter.variable}`}>
      <head>
        <title>WildSpots - Find Your Perfect Campsite</title>
        <meta name="description" content="Discover and book unique camping experiences on ranches, farms, vineyards, and public parks across the country." />
      </head>
      <body className="font-sans h-full bg-white dark:bg-gray-900">
        <AuthProvider>
          <FavoritesProvider>
            {mounted ? children : null}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
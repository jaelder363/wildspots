// app/client-layout.tsx
'use client';

import { AuthProvider } from '@/src/contexts/AuthContext';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </AuthProvider>
  );
}
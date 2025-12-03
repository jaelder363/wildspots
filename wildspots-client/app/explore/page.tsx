// app/explore/page.tsx
'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Simple layout to ensure content is visible
function SimpleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

// Dynamically import the SearchBox component
const SearchBox = dynamic(() => import('@/src/components/SearchBox'), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <div className="h-12 bg-gray-100 rounded-md animate-pulse"></div>
    </div>
  ),
});

// Mock data for campsites
const mockCampsites = [
  {
    id: 1,
    name: 'Lakeside Retreat',
    location: 'Lake Tahoe, CA',
    price: 75,
    rating: 4.8,
    reviewCount: 124,
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 2,
    name: 'Mountain View RV Park',
    location: 'Aspen, CO',
    price: 95,
    rating: 4.6,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1504280390367-361c6e9c5c27?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
  }
];

// Campsite card component
function CampsiteCard({ campsite }: { campsite: typeof mockCampsites[0] }) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 bg-gray-200 relative">
        <img 
          src={campsite.image} 
          alt={campsite.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-sm font-medium">
          ${campsite.price}/night
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{campsite.name}</h3>
        <p className="text-gray-600 mt-1">{campsite.location}</p>
        <div className="mt-2 flex items-center">
          <span className="text-yellow-400">★</span>
          <span className="ml-1 text-gray-700">{campsite.rating}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span className="text-sm text-gray-500">{campsite.reviewCount} reviews</span>
        </div>
      </div>
    </div>
  );
}

// Main page content
function ExploreContent() {
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Explore Campsites</h1>
      <SearchBox />
      
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900">Featured Campsites</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCampsites.map((campsite) => (
            <CampsiteCard key={campsite.id} campsite={campsite} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Page component
export default function ExplorePage() {
  return (
    <SimpleLayout>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <ExploreContent />
      </Suspense>
    </SimpleLayout>
  );
}
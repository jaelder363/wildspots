// app/campsites/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Layout from '@/src/components/Layout';

interface Campsite {
  id: string;
  name: string;
  location: string;
  price: number;
  description: string;
  rating: number;
  image: string;
  amenities: string[];
}

export default function CampsitePage() {
  const params = useParams<{ id: string }>();
  
  // Add null check for params and params.id
  if (!params?.id) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900">Campsite not found</h2>
            <p className="mt-2 text-gray-600">The requested campsite could not be found.</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Mock data - in a real app, this would come from an API
  const campsite: Campsite = {
    id: params.id,
    name: 'Lakeside Retreat',
    location: 'Lake Tahoe, CA',
    price: 45,
    description: 'A beautiful campsite by the lake with stunning views and great fishing spots.',
    rating: 4.8,
    image: '/images/campsite-1.jpg',
    amenities: ['Lake View', 'Fishing', 'Hiking Trails', 'Fire Pit', 'Restrooms']
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">{campsite.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{campsite.location}</p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Price per night</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  ${campsite.price}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {campsite.description}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rating</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {campsite.rating} / 5
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Amenities</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="flex flex-wrap gap-2">
                    {campsite.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Layout>
  );
}
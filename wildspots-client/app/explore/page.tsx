'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Layout from '@/src/components/Layout';
import SearchAndFilter from '@/src/components/SearchAndFilter';

// Mock data - in a real app, this would come from your API
const mockCampsites = [
  {
    id: 1,
    name: 'Lakeside Retreat',
    location: 'Lake Tahoe, CA',
    price: 75,
    type: 'tent',
    rating: 4.8,
    reviewCount: 124,
    amenities: ['water', 'toilets', 'showers'],
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    coordinates: [-120.032, 39.0968],
  },
  {
    id: 2,
    name: 'Mountain View RV Park',
    location: 'Aspen, CO',
    price: 95,
    type: 'rv',
    rating: 4.6,
    reviewCount: 89,
    amenities: ['water', 'electricity', 'wifi', 'pets'],
    image: 'https://images.unsplash.com/photo-1504280390367-361c6e9c5c27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    coordinates: [-106.8232, 39.1911],
  },
  {
    id: 3,
    name: 'Riverside Glamping',
    location: 'Sedona, AZ',
    price: 150,
    type: 'glamping',
    rating: 4.9,
    reviewCount: 203,
    amenities: ['water', 'electricity', 'wifi', 'toilets', 'showers'],
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
    coordinates: [-111.7605, 34.8697],
  },
  // Add more mock data as needed
];

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const [filteredCampsites, setFilteredCampsites] = useState(mockCampsites);
  const [isLoading, setIsLoading] = useState(true);

  // Filter campsites based on search params
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      let results = [...mockCampsites];
      
      // Filter by search query
      const query = searchParams.get('q')?.toLowerCase();
      if (query) {
        results = results.filter(
          site => 
            site.name.toLowerCase().includes(query) || 
            site.location.toLowerCase().includes(query)
        );
      }
      
      // Filter by property type
      const type = searchParams.get('type');
      if (type) {
        results = results.filter(site => site.type === type);
      }
      
      // Filter by amenities
      const amenities = searchParams.get('amenities')?.split(',');
      if (amenities?.length) {
        results = results.filter(site => 
          amenities.every(amenity => site.amenities.includes(amenity))
        );
      }
      
      // Filter by price range
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      if (minPrice || maxPrice) {
        const min = minPrice ? parseInt(minPrice) : 0;
        const max = maxPrice ? parseInt(maxPrice) : Infinity;
        results = results.filter(site => site.price >= min && site.price <= max);
      }
      
      setFilteredCampsites(results);
      setIsLoading(false);
    }, 500); // Simulate network delay
    
    return () => clearTimeout(timer);
  }, [searchParams]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Find Your Perfect Campsite</h1>
        </div>
        
        <SearchAndFilter />
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCampsites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCampsites.map((campsite) => (
              <div key={campsite.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={campsite.image} 
                    alt={campsite.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium text-gray-800">
                    ${campsite.price}/night
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-medium text-gray-900">{campsite.name}</h3>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-sm text-gray-600">{campsite.rating}</span>
                      <span className="mx-1 text-gray-300">•</span>
                      <span className="text-sm text-gray-500">{campsite.reviewCount} reviews</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-1">{campsite.location}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {campsite.amenities.map((amenity) => (
                      <span key={amenity} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4">
                    <a
                      href={`/campsites/${campsite.id}`}
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No campsites found</h3>
            <p className="mt-1 text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                onClick={() => window.location.search = ''}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

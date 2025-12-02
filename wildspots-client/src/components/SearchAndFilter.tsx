'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const propertyTypes = [
  { id: 'all', label: 'All Types' },
  { id: 'tent', label: 'Tent Camping' },
  { id: 'rv', label: 'RV Sites' },
  { id: 'cabin', label: 'Cabins' },
  { id: 'glamping', label: 'Glamping' },
];

const amenities = [
  { id: 'water', label: 'Water Access' },
  { id: 'electricity', label: 'Electricity' },
  { id: 'toilets', label: 'Toilets' },
  { id: 'showers', label: 'Showers' },
  { id: 'wifi', label: 'WiFi' },
  { id: 'pets', label: 'Pets Allowed' },
];

export default function SearchAndFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (selectedType !== 'all') params.set('type', selectedType);
    if (selectedAmenities.length) params.set('amenities', selectedAmenities.join(','));
    if (priceRange[0] > 0 || priceRange[1] < 500) {
      params.set('minPrice', priceRange[0].toString());
      params.set('maxPrice', priceRange[1].toString());
    }
    
    router.push(`/explore?${params.toString()}`);
  };

  const toggleAmenity = (amenityId: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenityId)
        ? prev.filter(id => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md h-12"
                placeholder="Search by location or campsite name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 h-12"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 h-12"
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Property Type</h3>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <div key={type.id} className="flex items-center">
                      <input
                        id={`type-${type.id}`}
                        name="property-type"
                        type="radio"
                        className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        checked={selectedType === type.id}
                        onChange={() => setSelectedType(type.id)}
                      />
                      <label htmlFor={`type-${type.id}`} className="ml-3 text-sm text-gray-700">
                        {type.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}+</span>
                  </div>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="10"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-2">Amenities</h3>
                <div className="space-y-2">
                  {amenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center">
                      <input
                        id={`amenity-${amenity.id}`}
                        name="amenities"
                        type="checkbox"
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={() => toggleAmenity(amenity.id)}
                      />
                      <label htmlFor={`amenity-${amenity.id}`} className="ml-3 text-sm text-gray-700">
                        {amenity.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

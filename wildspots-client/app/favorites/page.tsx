'use client';

import { useFavorites } from '../../src/contexts/FavoritesContext';
import { CampsiteCard } from '../../src/components/CampsiteCard';
import { campsites } from '../../src/data/campsites';
import { Header } from '../../src/components/Header';

export default function FavoritesPage() {
  const { isFavorite } = useFavorites();
  const favoriteCampsites = campsites.filter(campsite => isFavorite(campsite.id));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-8 text-3xl font-bold text-gray-900 dark:text-white">
          Your Favorite Campsites
        </h1>
        {favoriteCampsites.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
              No favorite campsites yet
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Start adding campsites to your favorites to see them here!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {favoriteCampsites.map(campsite => (
              <CampsiteCard key={campsite.id} {...campsite} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

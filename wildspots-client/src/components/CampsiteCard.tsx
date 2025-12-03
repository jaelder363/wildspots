'use client';

import { useFavorites } from '../contexts/FavoritesContext';
import { Heart, MapPin, Star, Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface CampsiteCardProps {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  distance: string;
  available: string;
  image: string;
}

export function CampsiteCard({
  id,
  title,
  location,
  price,
  rating,
  distance,
  available,
  image,
}: CampsiteCardProps) {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  return (
    <div className="group relative block h-full overflow-hidden rounded-lg bg-white shadow-md transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800">
      <Link href={`/campsites/${id}`}>
        <div className="relative h-40 w-full">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={false}
          />
        </div>
      </Link>
      <button
        onClick={toggleFavorite}
        className="absolute right-2 top-2 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white"
        aria-label={isFavorite(id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart
          className={`h-5 w-5 ${isFavorite(id) ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
        />
      </button>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{location}</span>
            </p>
          </div>
          <div className="flex items-center">
            <Star className="h-5 w-5 flex-shrink-0 text-yellow-400" />
            <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{rating}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="flex items-center text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="mr-1 h-4 w-4 flex-shrink-0" />
              <span>{available}</span>
            </p>
            <p className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
              <MapPin className="mr-1 h-4 w-4 flex-shrink-0" />
              <span>{distance} away</span>
            </p>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">${price}<span className="text-sm font-normal text-gray-600 dark:text-gray-300">/night</span></p>
        </div>
      </div>
    </div>
  );
}
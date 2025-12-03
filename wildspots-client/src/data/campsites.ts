import { Campsite } from '../types';

export const campsites: Campsite[] = [
  {
    id: 1,
    title: 'Mountain View Camp',
    location: 'Aspen, Colorado',
    price: 89,
    rating: 4.8,
    distance: '12 miles',
    available: 'Jun 1-7',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Lakeside Retreat',
    location: 'Lake Tahoe, California',
    price: 120,
    rating: 4.9,
    distance: '25 miles',
    available: 'Jun 15-22',
    image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Forest Haven',
    location: 'Portland, Oregon',
    price: 75,
    rating: 4.7,
    distance: '8 miles',
    available: 'Jun 5-12',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
];

'use client';

import React, { useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { campsites } from '../src/data/campsites';
import { motion } from 'framer-motion';

// Import components with error boundaries
const Header = dynamic(() => import('../src/components/Header').then(mod => mod.Header), {
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 shadow-sm" />,
  ssr: false
});

const CampsiteCard = dynamic(() => import('../src/components/CampsiteCard').then(mod => mod.CampsiteCard), {
  loading: () => (
    <div className="h-80 rounded-lg bg-white dark:bg-gray-800 shadow-md animate-pulse" />
  ),
  ssr: false
});

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="p-4 text-red-600">Something went wrong. Please try again.</div>;
    }
    return this.props.children;
  }
}

// Smooth scroll helper
const scrollToSection = (id: string) => {
  if (typeof window !== 'undefined') {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
};

export default function Home() {
  // Add smooth scroll effect for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLAnchorElement;
      if (target.matches('a[href^="#"]')) {
        e.preventDefault();
        const id = target.getAttribute('href')?.substring(1);
        if (id) scrollToSection(id);
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Suspense fallback={<div className="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-sm" />}>
          <Header />
        </Suspense>
        
        {/* Enhanced Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500 py-20 md:py-28 text-white">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/20"></div>
          <div className="container relative mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm mb-6 border border-white/20">
                <span className="h-2 w-2 rounded-full bg-green-300 mr-2 animate-pulse"></span>
                <span className="text-sm font-medium">Discover the great outdoors</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                <span className="block">Your Next</span>
                <span className="block bg-gradient-to-r from-yellow-300 via-green-200 to-teal-200 bg-clip-text text-transparent">
                  Adventure Awaits
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-7 text-green-50 md:text-xl">
                Discover and book unique camping experiences on ranches, farms, and public parks. <br className="hidden md:block" />Connect with nature like never before.
              </p>
              <div className="mt-10 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => scrollToSection('campsites')}
                  className="group relative overflow-hidden rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-green-700 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700"
                >
                  <span className="relative z-10">Explore Campsites</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-green-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </button>
                <button className="group relative overflow-hidden rounded-xl border-2 border-white bg-transparent px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all duration-300 hover:bg-white/10 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-700">
                  Learn More
                </button>
              </div>
            </motion.div>
          </div>
        </div>

      {/* Campsites Grid */}
      <section id="campsites" className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900/30 dark:text-green-300 mb-4">
              Explore Unique Stays
            </span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
              Discover Your Perfect <span className="text-green-600 dark:text-green-400">Getaway</span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Handpicked campsites for an unforgettable outdoor experience
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {campsites.map((campsite, index) => (
              <motion.div
                key={campsite.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="group"
              >
                <Suspense fallback={
                  <div className="h-96 rounded-2xl bg-white dark:bg-gray-800 shadow-lg animate-pulse" />
                }>
                  <CampsiteCard 
                    id={campsite.id}
                    title={campsite.title}
                    location={campsite.location}
                    price={campsite.price}
                    rating={campsite.rating}
                    distance={campsite.distance}
                    available={campsite.available}
                    image={campsite.image}
                  />
                </Suspense>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              View All Campsites
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Why Choose WildSpots?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-gray-600 dark:text-gray-300">
              Experience the best in outdoor accommodations with our curated selection of unique camping spots.
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: '🏕️',
                title: 'Unique Locations',
                description: 'Discover hidden gems and unique camping experiences you\'ll love.'
              },
              {
                icon: '🔒',
                title: 'Secure Booking',
                description: 'Easy and secure booking process with instant confirmation.'
              },
              {
                icon: '🌟',
                title: 'Verified Reviews',
                description: 'Real reviews from campers who have stayed at these locations.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5 }}
                className="rounded-xl bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-700"
              >
                <div className="mb-4 text-4xl">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Stay Updated
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-green-100">
            Subscribe to our newsletter for the latest camping spots and exclusive offers.
          </p>
          <div className="mx-auto mt-8 flex max-w-md flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 rounded-lg border-0 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-green-300"
            />
            <button className="rounded-lg bg-white px-6 py-3 font-semibold text-green-700 transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-600">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-xl font-bold">WildSpots</h3>
              <p className="text-gray-400">Find your perfect camping experience with WildSpots.</p>
              <div className="mt-4 flex space-x-4">
                {['twitter', 'facebook', 'instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-white"
                    aria-label={social}
                  >
                    <span className="sr-only">{social}</span>
                    <span className="text-2xl">📱</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Explore</h4>
              <ul className="space-y-2">
                {['Popular campsites', 'New locations', 'Seasonal offers', 'Featured hosts'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Company</h4>
              <ul className="space-y-2">
                {['About us', 'Careers', 'Blog', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-lg font-semibold">Support</h4>
              <ul className="space-y-2">
                {['Help Center', 'Contact us', 'Privacy Policy', 'Terms of Service'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} WildSpots. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
    </ErrorBoundary>
  );
}
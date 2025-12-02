'use client';

import { Fragment, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/src/contexts/AuthContext';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

const NavLink = ({
  href,
  children,
  className = '',
  activeClassName = 'text-green-600 font-medium',
  inactiveClassName = 'text-gray-700 hover:text-green-600 transition-colors',
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`${className} ${isActive ? activeClassName : inactiveClassName}`}
    >
      {children}
    </Link>
  );
};

interface MenuItemProps {
  children: ReactNode;
  as?: React.ElementType;
  className?: string;
  activeClassName?: string;
  inactiveClassName?: string;
  [key: string]: any;
}

const MenuItem = ({
  children,
  as: Component = 'button',
  className = '',
  activeClassName = 'bg-gray-100 text-gray-900',
  inactiveClassName = 'text-gray-700',
  ...props
}: MenuItemProps) => (
  <Menu.Item>
    {({ active }: { active: boolean }) => (
      <Component
        className={classNames(
          active ? activeClassName : inactiveClassName,
          'block w-full text-left px-4 py-2 text-sm',
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )}
  </Menu.Item>
);

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="text-xl font-bold text-green-600">
                  WildSpots
                </Link>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <NavLink 
                  href="/explore"
                  className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  activeClassName="border-green-500 text-gray-900"
                  inactiveClassName="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                >
                  Explore
                </NavLink>
                {user && (
                  <NavLink 
                    href="/host"
                    className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                    activeClassName="border-green-500 text-gray-900"
                    inactiveClassName="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    Host
                  </NavLink>
                )}
              </nav>
            </div>
            
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : user ? (
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button 
                  type="button"
                  className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="sr-only">View notifications</span>
                  <svg 
                    className="h-6 w-6" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                </button>

                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                      <span className="sr-only">Open user menu</span>
                      <img 
                        className="h-8 w-8 rounded-full" 
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4CAF50&color=fff`} 
                        alt={user.name} 
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <MenuItem as={Link} href="/profile">
                        Your Profile
                      </MenuItem>
                      <MenuItem as={Link} href="/trips">
                        Your Trips
                      </MenuItem>
                      <MenuItem as={Link} href="/host/listings">
                        Your Listings
                      </MenuItem>
                      <MenuItem onClick={handleLogout}>
                        Sign out
                      </MenuItem>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            ) : (
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                <Link
                  href="/auth/login"
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {/* Mobile menu button */}
            <div className="-mr-2 flex items-center sm:hidden">
              <button 
                type="button" 
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <NavLink 
              href="/explore"
              className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              activeClassName="bg-green-50 border-green-500 text-green-700"
              inactiveClassName="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
            >
              Explore
            </NavLink>
            {user && (
              <NavLink 
                href="/host"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
                activeClassName="bg-green-50 border-green-500 text-green-700"
                inactiveClassName="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              >
                Host
              </NavLink>
            )}
          </div>
          
          {user ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img 
                    className="h-10 w-10 rounded-full" 
                    src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=4CAF50&color=fff`} 
                    alt={user.name} 
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user.name}</div>
                  <div className="text-sm font-medium text-gray-500">{user.email}</div>
                </div>
                <button 
                  type="button"
                  className="ml-auto bg-white flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <span className="sr-only">View notifications</span>
                  <svg 
                    className="h-6 w-6" 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor" 
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <NavLink 
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium"
                  activeClassName="bg-gray-100 text-gray-900"
                  inactiveClassName="text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Your Profile
                </NavLink>
                <NavLink 
                  href="/trips"
                  className="block px-4 py-2 text-base font-medium"
                  activeClassName="bg-gray-100 text-gray-900"
                  inactiveClassName="text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Your Trips
                </NavLink>
                <NavLink 
                  href="/host/listings"
                  className="block px-4 py-2 text-base font-medium"
                  activeClassName="bg-gray-100 text-gray-900"
                  inactiveClassName="text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Your Listings
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/register"
                  className="block w-full text-center px-4 py-2 text-base font-medium text-green-700 hover:text-white hover:bg-green-600 border border-green-600 rounded-md"
                >
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
            <div className="px-5 py-2">
              <Link href="/about" className="text-base text-gray-500 hover:text-gray-900">
                About
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/blog" className="text-base text-gray-500 hover:text-gray-900">
                Blog
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/terms" className="text-base text-gray-500 hover:text-gray-900">
                Terms
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/privacy" className="text-base text-gray-500 hover:text-gray-900">
                Privacy
              </Link>
            </div>
            <div className="px-5 py-2">
              <Link href="/contact" className="text-base text-gray-500 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-400">
            &copy; {new Date().getFullYear()} WildSpots. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

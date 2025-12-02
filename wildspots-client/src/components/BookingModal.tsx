'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  campsite: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
  onBook: (bookingData: {
    startDate: Date;
    endDate: Date;
    guests: number;
  }) => Promise<void>;
}

export default function BookingModal({ isOpen, onClose, campsite, onBook }: BookingModalProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  // In a real app, you would fetch booked dates from your API
  useEffect(() => {
    // Mock: Simulate fetching booked dates
    const fetchBookedDates = async () => {
      // In a real app, you would call your API here
      // const response = await fetch(`/api/campsites/${campsite.id}/booked-dates`);
      // const data = await response.json();
      // setBookedDates(data.dates.map((date: string) => new Date(date)));
      
      // Mock data for demonstration
      const mockBookedDates = [
        new Date(2025, 11, 10), // Dec 10, 2025
        new Date(2025, 11, 15), // Dec 15, 2025
        new Date(2025, 11, 16), // Dec 16, 2025
      ];
      setBookedDates(mockBookedDates);
    };

    if (isOpen) {
      fetchBookedDates();
    }
  }, [isOpen, campsite.id]);

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * campsite.price;
  };

  const isDateBooked = (date: Date) => {
    return bookedDates.some(
      (bookedDate) => date.toDateString() === bookedDate.toDateString()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setError('Please select both check-in and check-out dates');
      return;
    }
    
    if (startDate >= endDate) {
      setError('Check-out date must be after check-in date');
      return;
    }
    
    if (guests < 1) {
      setError('Number of guests must be at least 1');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await onBook({
        startDate,
        endDate,
        guests,
      });
      
      // Reset form
      setStartDate(null);
      setEndDate(null);
      setGuests(1);
      onClose();
    } catch (err) {
      setError('Failed to book. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition.Root show={isOpen} as="div">
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as="div"
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="absolute right-0 top-0 pr-4 pt-4">
                  <button
                    type="button"
                    className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Book {campsite.name}
                    </Dialog.Title>
                    
                    <div className="mt-4">
                      <img
                        src={campsite.image}
                        alt={campsite.name}
                        className="h-40 w-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                      {error && (
                        <div className="rounded-md bg-red-50 p-4">
                          <div className="flex">
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-red-800">{error}</h3>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="check-in" className="block text-sm font-medium text-gray-700">
                          Check-in
                        </label>
                        <div className="mt-1">
                          <DatePicker
                            selected={startDate}
                            onChange={(date) => {
                              setStartDate(date);
                              if (endDate && date && date >= endDate) {
                                setEndDate(null);
                              }
                            }}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            minDate={new Date()}
                            excludeDates={bookedDates}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            placeholderText="Select check-in date"
                            id="check-in"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="check-out" className="block text-sm font-medium text-gray-700">
                          Check-out
                        </label>
                        <div className="mt-1">
                          <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            minDate={startDate || new Date()}
                            excludeDates={bookedDates}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                            placeholderText="Select check-out date"
                            id="check-out"
                            disabled={!startDate}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="guests" className="block text-sm font-medium text-gray-700">
                          Guests
                        </label>
                        <div className="mt-1">
                          <input
                            type="number"
                            id="guests"
                            min="1"
                            max="10"
                            value={guests}
                            onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>${campsite.price} x {calculateNights()} nights</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <div className="mt-2 flex justify-between font-medium text-gray-900">
                          <span>Total</span>
                          <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <div className="mt-5 sm:mt-6">
                        <button
                          type="submit"
                          disabled={isLoading || !startDate || !endDate}
                          className={`w-full flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm 
                            ${isLoading || !startDate || !endDate 
                              ? 'bg-green-300' 
                              : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                            }`}
                        >
                          {isLoading ? 'Booking...' : 'Book Now'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

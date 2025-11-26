import { Configuration, ProfilesApi, CampsitesApi, ReviewsApi } from './api';

const config = new Configuration({
  basePath: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
});

export const profilesApi = new ProfilesApi(config);
export const campsitesApi = new CampsitesApi(config);
export const reviewsApi = new ReviewsApi(config);

// Helper function to handle API errors
export function handleApiError(error: any): never {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    console.error('Status:', error.response.status);
    console.error('Headers:', error.response.headers);
    throw new Error(error.response.data?.message || 'API request failed');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received:', error.request);
    throw new Error('No response received from the server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Request setup error:', error.message);
    throw new Error('Error setting up the request');
  }
}

// Helper function to get auth token
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
}

// Helper function to set auth token
export function setAuthToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
}

// Helper function to remove auth token
export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
}

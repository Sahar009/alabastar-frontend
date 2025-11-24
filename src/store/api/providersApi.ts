import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Provider } from '../../types/provider';

// Normalize base URL to always include `/api`
const RAW_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://backend.alabastar.ng';
const BASE_URL = RAW_BASE.endsWith('/api')
  ? RAW_BASE
  : `${RAW_BASE.replace(/\/$/, '')}/api`;

console.log('🔧 Providers API Base URL:', BASE_URL);

export interface ProviderSearchParams {
  search?: string;
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  availability?: boolean;
  verified?: boolean;
}

export interface ProviderResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    providers: Provider[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface SingleProviderResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: Provider;
}

// Lightweight booking type for listings
export interface BookingItem {
  id: string;
  userId: string;
  providerId: string;
  serviceId: string;
  scheduledAt: string;
  status: string;
  totalAmount: number | string;
  currency?: string;
  locationCity?: string;
  locationState?: string;
  providerProfile?: {
    id?: string;
    User?: { id?: string; fullName?: string; email?: string; phone?: string };
    locationCity?: string;
    locationState?: string;
  };
  service?: { id: string; title: string };
}

export interface BookingsResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    bookings: BookingItem[];
    pagination?: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    }
  } | BookingItem[]; // some backends might just return array
}

export interface ProviderRegistrationData {
  userId: string;
  businessName: string;
  businessType: string;
  description: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  services: string[];
  pricingType: 'fixed' | 'hourly' | 'negotiable';
  basePrice: number;
  availability: {
    monday: { start: string; end: string; available: boolean };
    tuesday: { start: string; end: string; available: boolean };
    wednesday: { start: string; end: string; available: boolean };
    thursday: { start: string; end: string; available: boolean };
    friday: { start: string; end: string; available: boolean };
    saturday: { start: string; end: string; available: boolean };
    sunday: { start: string; end: string; available: boolean };
  };
  documents: {
    businessLicense?: string;
    insuranceCertificate?: string;
    taxCertificate?: string;
    idCard?: string;
  };
}

export const providersApi = createApi({
  reducerPath: 'providersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage or state
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Provider', 'ProviderProfile'],
  endpoints: (builder) => ({
    // Get all providers with search and filters
    getProviders: builder.query<ProviderResponse, ProviderSearchParams>({
      query: (params) => {
        console.log('🔍 API Query called with params:', params);
        const searchParams = new URLSearchParams();
        
        if (params.search) searchParams.append('search', params.search);
        if (params.category) searchParams.append('category', params.category);
        if (params.location) searchParams.append('location', params.location);
        if (params.latitude) searchParams.append('latitude', params.latitude.toString());
        if (params.longitude) searchParams.append('longitude', params.longitude.toString());
        if (params.radius) searchParams.append('radius', params.radius.toString());
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.priceMin) searchParams.append('priceMin', params.priceMin.toString());
        if (params.priceMax) searchParams.append('priceMax', params.priceMax.toString());
        if (params.rating) searchParams.append('rating', params.rating.toString());
        if (params.availability !== undefined) searchParams.append('availability', params.availability.toString());
        if (params.verified !== undefined) searchParams.append('verified', params.verified.toString());

        const url = `/providers/search?${searchParams.toString()}`;
        console.log('🔍 API Query URL:', BASE_URL + url);
        
        return {
          url,
          method: 'GET',
        };
      },
      providesTags: ['Provider'],
    }),

    // Get a provider's active services
    getProviderServices: builder.query<{ success: boolean; data: { services: Array<{ id: string; title: string; description: string; pricingType: string; basePrice: number; isActive: boolean }> } }, string>({
      query: (providerId) => ({
        url: `/providers/${providerId}/services`,
        method: 'GET',
      }),
      providesTags: ['Provider'],
    }),

    // Get providers by category
    getProvidersByCategory: builder.query<ProviderResponse, { category: string; params?: Partial<ProviderSearchParams> }>({
      query: ({ category, params = {} }) => {
        const searchParams = new URLSearchParams();
        
        if (params.search) searchParams.append('search', params.search);
        if (params.location) searchParams.append('location', params.location);
        if (params.latitude) searchParams.append('latitude', params.latitude.toString());
        if (params.longitude) searchParams.append('longitude', params.longitude.toString());
        if (params.radius) searchParams.append('radius', params.radius.toString());
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.limit) searchParams.append('limit', params.limit.toString());
        if (params.sortBy) searchParams.append('sortBy', params.sortBy);
        if (params.priceMin) searchParams.append('priceMin', params.priceMin.toString());
        if (params.priceMax) searchParams.append('priceMax', params.priceMax.toString());
        if (params.rating) searchParams.append('rating', params.rating.toString());
        if (params.availability !== undefined) searchParams.append('availability', params.availability.toString());
        if (params.verified !== undefined) searchParams.append('verified', params.verified.toString());

        return {
          url: `/providers/category/${category}?${searchParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Provider'],
    }),

    // Get single provider profile
    getProviderProfile: builder.query<SingleProviderResponse, string>({
      query: (providerId) => ({
        url: `/providers/profile/${providerId}`,
        method: 'GET',
      }),
      providesTags: (result, error, providerId) => [
        { type: 'ProviderProfile', id: providerId },
      ],
    }),

    // Register new provider
    registerProvider: builder.mutation<SingleProviderResponse, ProviderRegistrationData>({
      query: (data) => ({
        url: '/providers/register',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Provider'],
    }),

    // Update provider profile
    updateProviderProfile: builder.mutation<SingleProviderResponse, { providerId: string; data: Partial<ProviderRegistrationData> }>({
      query: ({ providerId, data }) => ({
        url: `/providers/profile/${providerId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { providerId }) => [
        { type: 'ProviderProfile', id: providerId },
        'Provider',
      ],
    }),

    // Upload provider documents
    uploadProviderDocument: builder.mutation<{ success: boolean; message: string; file: unknown }, FormData>({
      query: (formData) => ({
        url: '/providers/documents/upload',
        method: 'POST',
        body: formData,
        headers: {
          // Don't set content-type, let the browser set it for FormData
        },
      }),
      invalidatesTags: ['Provider'],
    }),

    // Get provider availability
    getProviderAvailability: builder.query<{ success: boolean; data: { date: string; availableSlots: Array<{ time: string; displayTime: string }>; bookedSlots: number } }, { providerId: string; date: string }>({
      query: ({ providerId, date }) => ({
        url: `/bookings/provider/${providerId}/availability?date=${date}`,
        method: 'GET',
      }),
    }),

    // Create booking
    createBooking: builder.mutation<{ success: boolean; message: string; data: { id: string; scheduledAt: string; totalAmount: number | string; providerProfile?: { User?: { fullName?: string } }; service?: { title?: string } } }, { providerId: string; serviceId: string; scheduledAt: string; totalAmount: number; locationAddress?: string; locationCity?: string; locationState?: string; latitude?: number; longitude?: number; notes?: string }>({
      query: (body) => ({
        url: '/bookings',
        method: 'POST',
        body,
      }),
    }),

    // Get current user's bookings
    getMyBookings: builder.query<BookingsResponse, { status?: string; page?: number; limit?: number } | void>({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params && params.status) sp.append('status', params.status);
        if (params && params.page) sp.append('page', String(params.page));
        if (params && params.limit) sp.append('limit', String(params.limit));
        const qs = sp.toString();
        return {
          url: `/bookings${qs ? `?${qs}` : ''}`,
          method: 'GET',
        };
      },
    }),
  }),
});

export const {
  useGetProvidersQuery,
  useGetProvidersByCategoryQuery,
  useGetProviderProfileQuery,
  useGetProviderServicesQuery,
  useRegisterProviderMutation,
  useUpdateProviderProfileMutation,
  useUploadProviderDocumentMutation,
  useGetProviderAvailabilityQuery,
  useCreateBookingMutation,
  useGetMyBookingsQuery,
} = providersApi;

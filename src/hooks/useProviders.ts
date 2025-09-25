import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setProviders,
  setFilteredProviders,
  setLoading,
  setError,
  setSearchTerm,
  setSelectedCategory,
  setSelectedLocation,
  setViewMode,
  setShowFilters,
  setSortBy,
  setPagination,
  setFilters,
  clearFilters,
} from '../store/slices/providersSlice';
import {
  useGetProvidersQuery,
  useGetProvidersByCategoryQuery,
  useGetProviderProfileQuery,
} from '../store/api/providersApi';
import { providersService } from '../services/providersService';
import { Provider } from '../types/provider';

export const useProviders = () => {
  const dispatch = useAppDispatch();
  const {
    providers,
    filteredProviders,
    selectedProvider,
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedLocation,
    viewMode,
    showFilters,
    sortBy,
    pagination,
    filters,
  } = useAppSelector((state) => state.providers);

  // Normalize API payload to our Provider type
  const normalizeProvider = (p: any): Provider => {
    const userObj = p.user || p.User || {};
    const ra = p.ratingAverage ?? p.rating;
    const rc = p.ratingCount ?? p.reviewCount;
    const hourly = p.hourlyRate ?? p.basePrice;
    const startPrice = p.startingPrice ?? p.basePrice;

    return {
      id: p.id,
      providerUserId: p.userId || userObj.id,
      user: {
        id: userObj.id,
        fullName: userObj.fullName || '',
        email: userObj.email || '',
        phone: userObj.phone || '',
        alternativePhone: userObj.alternativePhone,
        avatarUrl: userObj.avatarUrl,
      },
      category: p.category || '',
      subcategories: Array.isArray(p.subcategories) ? p.subcategories : [],
      yearsOfExperience: typeof p.yearsOfExperience === 'number' ? p.yearsOfExperience : parseInt(String(p.yearsOfExperience || 0)) || 0,
      bio: p.bio || p.description || '',
      hourlyRate: typeof hourly === 'number' ? hourly : parseFloat(String(hourly || 0)) || 0,
      startingPrice: typeof startPrice === 'number' ? startPrice : parseFloat(String(startPrice || 0)) || 0,
      locationCity: p.locationCity || p.city || '',
      locationState: p.locationState || p.state || '',
      latitude: typeof p.latitude === 'number' ? p.latitude : (p.latitude ? parseFloat(String(p.latitude)) : undefined),
      longitude: typeof p.longitude === 'number' ? p.longitude : (p.longitude ? parseFloat(String(p.longitude)) : undefined),
      ratingAverage: typeof ra === 'number' ? ra : parseFloat(String(ra || 0)) || 0,
      ratingCount: typeof rc === 'number' ? rc : parseInt(String(rc || 0)) || 0,
      verificationStatus: p.verificationStatus || (p.isVerified ? 'verified' : 'unverified'),
      isAvailable: typeof p.isAvailable === 'boolean' ? p.isAvailable : true,
      estimatedArrival: p.estimatedArrival || '15-20 mins',
    };
  };

  // API query parameters
  const searchParams = {
    search: searchTerm || undefined,
    category: selectedCategory || undefined,
    location: selectedLocation || undefined,
    page: pagination.currentPage,
    limit: pagination.itemsPerPage,
    sortBy,
    priceMin: filters.priceRange[0],
    priceMax: filters.priceRange[1],
    rating: filters.rating || undefined,
    availability: filters.availability || undefined,
    verified: filters.verified || undefined,
  };

  // Debug search parameters
  useEffect(() => {
    console.log('🔍 Search params:', searchParams);
  }, [searchParams]);

  // API queries - always make request with default parameters
  const {
    data: providersData,
    error: providersError,
    isLoading: providersLoading,
    refetch: refetchProviders,
  } = useGetProvidersQuery(searchParams, {
    // Always fetch providers, even with empty search params
    skip: false
  });

  const {
    data: categoryData,
    error: categoryError,
    isLoading: categoryLoading,
    refetch: refetchCategory,
  } = useGetProvidersByCategoryQuery(
    { category: selectedCategory, params: searchParams },
    { skip: !selectedCategory }
  );

  // Update Redux state when API data changes
  useEffect(() => {
    console.log('🔍 Providers data received:', providersData);
    if (providersData?.data) {
      const normalized = (providersData.data.providers || []).map(normalizeProvider);
      console.log('✅ Setting providers:', normalized.length);
      dispatch(setProviders(normalized));
      dispatch(setPagination(providersData.data.pagination));
    }
  }, [providersData, dispatch]);

  useEffect(() => {
    if (categoryData?.data) {
      const normalized = (categoryData.data.providers || []).map(normalizeProvider);
      dispatch(setProviders(normalized));
      dispatch(setPagination(categoryData.data.pagination));
    }
  }, [categoryData, dispatch]);

  // No fallback data - use live API data only

  useEffect(() => {
    dispatch(setLoading(providersLoading || categoryLoading));
  }, [providersLoading, categoryLoading, dispatch]);

  useEffect(() => {
    if (providersError || categoryError) {
      console.error('❌ API Error:', { providersError, categoryError });
      dispatch(setError('Failed to fetch providers'));
    }
  }, [providersError, categoryError, dispatch]);

  // Filter and sort providers
  useEffect(() => {
    console.log('🔍 Filtering providers:', { 
      providersCount: providers.length, 
      searchTerm, 
      selectedCategory, 
      selectedLocation 
    });
    
    if (providers.length > 0) {
      const filtered = providersService.filterProviders(providers, {
        searchTerm,
        category: selectedCategory,
        location: selectedLocation,
        priceRange: filters.priceRange,
        rating: filters.rating,
        availability: filters.availability,
        verified: filters.verified,
      });

      console.log('🔍 Filtered providers:', filtered.length);

      const sorted = providersService.sortProviders(filtered, sortBy);
      console.log('🔍 Sorted providers:', sorted.length);
      
      dispatch(setFilteredProviders(sorted));
    }
  }, [
    providers,
    searchTerm,
    selectedCategory,
    selectedLocation,
    filters,
    sortBy,
    dispatch,
  ]);

  // Actions
  const handleSearch = useCallback((term: string) => {
    dispatch(setSearchTerm(term));
  }, [dispatch]);

  const handleCategoryChange = useCallback((category: string) => {
    dispatch(setSelectedCategory(category));
  }, [dispatch]);

  const handleLocationChange = useCallback((location: string) => {
    dispatch(setSelectedLocation(location));
  }, [dispatch]);

  const handleViewModeChange = useCallback((mode: 'list' | 'map') => {
    dispatch(setViewMode(mode));
  }, [dispatch]);

  const handleShowFilters = useCallback((show: boolean) => {
    dispatch(setShowFilters(show));
  }, [dispatch]);

  const handleSortChange = useCallback((sort: string) => {
    dispatch(setSortBy(sort));
  }, [dispatch]);

  const handleFilterChange = useCallback((newFilters: Partial<typeof filters>) => {
    dispatch(setFilters(newFilters));
  }, [dispatch, filters]);

  const handleClearFilters = useCallback(() => {
    dispatch(clearFilters());
  }, [dispatch]);

  const handlePageChange = useCallback((page: number) => {
    dispatch(setPagination({ currentPage: page }));
  }, [dispatch]);

  const refreshProviders = useCallback(() => {
    if (selectedCategory) {
      refetchCategory();
    } else {
      refetchProviders();
    }
  }, [selectedCategory, refetchCategory, refetchProviders]);

  return {
    // State
    providers: filteredProviders,
    allProviders: providers,
    selectedProvider,
    loading,
    error,
    searchTerm,
    selectedCategory,
    selectedLocation,
    viewMode,
    showFilters,
    sortBy,
    pagination,
    filters,

    // Actions
    handleSearch,
    handleCategoryChange,
    handleLocationChange,
    handleViewModeChange,
    handleShowFilters,
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    refreshProviders,

    // API status
    isError: !!error,
    isSuccess: !loading && !error,
  };
};

export const useProviderProfile = (providerId: string) => {
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
    refetch: refetchProfile,
  } = useGetProviderProfileQuery(providerId, {
    skip: !providerId,
  });

  return {
    provider: profileData?.data,
    loading: profileLoading,
    error: profileError,
    refetch: refetchProfile,
  };
};

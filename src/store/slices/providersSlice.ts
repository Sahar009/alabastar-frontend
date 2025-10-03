import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Provider } from '../../types/provider';

interface ProvidersState {
  providers: Provider[];
  filteredProviders: Provider[];
  selectedProvider: Provider | null;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedCategory: string;
  selectedLocation: string;
  viewMode: 'list' | 'map';
  showFilters: boolean;
  sortBy: string;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  filters: {
    priceRange: [number, number];
    rating: number;
    availability: boolean;
    verified: boolean;
  };
}

const initialState: ProvidersState = {
  providers: [],
  filteredProviders: [],
  selectedProvider: null,
  loading: false,
  error: null,
  searchTerm: '',
  selectedCategory: '',
  selectedLocation: '',
  viewMode: 'list',
  showFilters: false,
  sortBy: 'rating',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  },
  filters: {
    priceRange: [0, 100000],
    rating: 0,
    availability: false,
    verified: false,
  },
};

const providersSlice = createSlice({
  name: 'providers',
  initialState,
  reducers: {
    setProviders: (state, action: PayloadAction<Provider[]>) => {
      state.providers = action.payload;
      state.filteredProviders = action.payload;
    },
    setFilteredProviders: (state, action: PayloadAction<Provider[]>) => {
      state.filteredProviders = action.payload;
    },
    setSelectedProvider: (state, action: PayloadAction<Provider | null>) => {
      state.selectedProvider = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<string>) => {
      state.selectedLocation = action.payload;
    },
    setViewMode: (state, action: PayloadAction<'list' | 'map'>) => {
      state.viewMode = action.payload;
    },
    setShowFilters: (state, action: PayloadAction<boolean>) => {
      state.showFilters = action.payload;
    },
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    setPagination: (state, action: PayloadAction<Partial<ProvidersState['pagination']>>) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    setFilters: (state, action: PayloadAction<Partial<ProvidersState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.searchTerm = '';
      state.selectedCategory = '';
      state.selectedLocation = '';
    },
    resetProvidersState: () => initialState,
  },
});

export const {
  setProviders,
  setFilteredProviders,
  setSelectedProvider,
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
  resetProvidersState,
} = providersSlice.actions;

export default providersSlice.reducer;

















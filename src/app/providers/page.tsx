"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, MapPin, Star, Filter, User, Award, Clock, Map, List,
  Wrench, Droplets, Zap as ZapIcon, Sparkles, Package, Snowflake, Hammer,
  Palette, Bug, Shirt, Square, Video, Sprout, Settings, Key, Sofa,
  Navigation, Loader2, CheckCircle, AlertCircle, X, Edit3, Check
} from "lucide-react";
import dynamic from "next/dynamic";
import { Provider } from "../../types/provider";
import Avatar from "../../components/Avatar";
import ProviderProfileModal from "../../components/ProviderProfileModal";
import BookingModal from "../../components/BookingModal";
import LocationPicker from "../../components/LocationPicker";
import { useAuth } from "../../contexts/AuthContext";
import { useProviders } from "../../hooks/useProviders";
import { providersService } from "../../services/providersService";
import { useCreateBookingMutation, useGetProviderServicesQuery } from "../../store/api/providersApi";

// Dynamically import the map component to avoid SSR issues
const ProviderMap = dynamic(() => import("../../components/ProviderMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-slate-200 dark:bg-slate-700 rounded-3xl flex items-center justify-center">
      <div className="text-slate-500 dark:text-slate-400">Loading map...</div>
    </div>
  )
});

// Custom Naira symbol component
const NairaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2v-2zm0 4h2v6h-2v-6zm0 8h2v2h-2v-2z"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">₦</text>
  </svg>
);

export default function ProvidersPage() {
  const router = useRouter();
  const { user } = useAuth();
  
  // Get search parameters from URL
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const urlSearch = decodeURIComponent(searchParams.get('search') || '');
  const urlCategory = decodeURIComponent(searchParams.get('category') || '');
  const urlLocation = decodeURIComponent(searchParams.get('location') || '');
  const urlLat = searchParams.get('lat');
  const urlLng = searchParams.get('lng');
  const urlAddress = decodeURIComponent(searchParams.get('address') || '');
  
  // State for the new Uber/Bolt-style flow
  const [currentStep, setCurrentStep] = useState<'location' | 'search' | 'results'>('search');
  const [userLocation, setUserLocation] = useState<{
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    streetNumber?: string;
    streetName?: string;
    postalCode?: string;
    country?: string;
  } | null>(null);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Provider[]>([]);
  const [searchResultsCount, setSearchResultsCount] = useState(0);
  const [searchRadius, setSearchRadius] = useState(5); // Default 5km radius
  const [showRadiusExpansion, setShowRadiusExpansion] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showNoResultsModal, setShowNoResultsModal] = useState(false);
  
  // Existing state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileProvider, setProfileProvider] = useState<Provider | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  // Use Redux hooks
  const {
    providers: filteredProviders,
    loading,
    error,
    searchTerm,
    selectedLocation,
    viewMode,
    showFilters,
    sortBy,
    pagination,
    filters,
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
  } = useProviders();

  const [createBooking] = useCreateBookingMutation();

  const categories = [
    { value: '', label: 'All Services', image: '/images/tool.jpg' },
    { value: 'plumbing', label: 'Plumbing', image: '/images/plumber2d.png' },
    { value: 'electrical', label: 'Electrical', image: '/images/mechanic2d.png' },
    { value: 'cleaning', label: 'Cleaning', image: '/images/cleaner2d.png' },
    { value: 'moving', label: 'Moving', image: '/images/mover2d.png' },
    { value: 'ac_repair', label: 'AC Repair', image: '/images/ac2d.png' },
    { value: 'carpentry', label: 'Carpentry', image: '/images/carpenter2d.png' },
    { value: 'painting', label: 'Painting', image: '/images/paint2d.png' },
    { value: 'pest_control', label: 'Pest Control', image: '/images/pest2d.png' },
    { value: 'laundry', label: 'Laundry', image: '/images/laundry2d.png' },
    { value: 'tiling', label: 'Tiling', image: '/images/tiler2d.png' },
    { value: 'cctv', label: 'CCTV', image: '/images/cctv2d.png' },
    { value: 'gardening', label: 'Gardening', image: '/images/gardener2d.png' },
    { value: 'appliance_repair', label: 'Appliance Repair', image: '/images/mechanic2d.png' },
    { value: 'locksmith', label: 'Locksmith', image: '/images/mechanic2d.png' },
    { value: 'carpet_cleaning', label: 'Carpet Cleaning', image: '/images/cleaner2d.png' }
  ];

  // Search suggestions data
  const searchSuggestionsData = [
    // Service names
    'plumber', 'electrician', 'cleaner', 'painter', 'carpenter', 'gardener',
    'locksmith', 'appliance repair', 'AC repair', 'moving service', 'pest control',
    'laundry service', 'tiling', 'CCTV installation', 'carpet cleaning',
    
    // Specific services
    'pipe repair', 'leak fix', 'toilet repair', 'faucet installation',
    'wiring', 'socket repair', 'light installation', 'electrical panel',
    'house cleaning', 'office cleaning', 'window cleaning', 'deep cleaning',
    'wall painting', 'exterior painting', 'interior painting', 'color consultation',
    'furniture repair', 'door repair', 'window repair', 'cabinet installation',
    'lawn mowing', 'tree trimming', 'garden design', 'plant care',
    'lock repair', 'key duplication', 'security system', 'safe installation',
    'refrigerator repair', 'washing machine repair', 'oven repair', 'dishwasher repair',
    'moving boxes', 'packing service', 'furniture moving', 'office relocation',
    'termite control', 'cockroach control', 'rodent control', 'bed bug treatment',
    'dry cleaning', 'ironing service', 'clothes repair', 'alteration service',
    'floor tiling', 'wall tiling', 'bathroom tiling', 'kitchen tiling',
    'security camera', 'surveillance system', 'alarm installation', 'monitoring service',
    'carpet shampoo', 'upholstery cleaning', 'rug cleaning', 'stain removal'
  ];

  // Auto-detect user location on component mount
  useEffect(() => {
    // Wait for component to be mounted and get fresh URL params
    const currentSearchParams = new URLSearchParams(window.location.search);
    const currentUrlSearch = decodeURIComponent(currentSearchParams.get('search') || '');
    const currentUrlCategory = decodeURIComponent(currentSearchParams.get('category') || '');
    const currentUrlLocation = decodeURIComponent(currentSearchParams.get('location') || '');
    const currentUrlLat = currentSearchParams.get('lat');
    const currentUrlLng = currentSearchParams.get('lng');
    const currentUrlAddress = decodeURIComponent(currentSearchParams.get('address') || '');
    
    console.log('useEffect running with URL params:', { 
      currentUrlSearch, 
      currentUrlCategory, 
      currentUrlLocation, 
      currentUrlLat, 
      currentUrlLng, 
      currentUrlAddress 
    });
    
    // If we have location data from URL, use it
    if (currentUrlLat && currentUrlLng && currentUrlAddress) {
      console.log('Using URL location data');
      setUserLocation({
        address: currentUrlAddress,
        city: currentUrlLocation,
        state: currentUrlLocation, // We'll use location as state for now
        latitude: parseFloat(currentUrlLat),
        longitude: parseFloat(currentUrlLng)
      });
      
      // Set search state from URL
      if (currentUrlSearch) {
        setSearchQuery(currentUrlSearch);
      }
      if (currentUrlCategory) {
        setSelectedCategory(currentUrlCategory);
      }
      
      // If we have search parameters, auto-search immediately
      if (currentUrlSearch || currentUrlCategory) {
        console.log('Auto-searching with URL parameters');
        setCurrentStep('results');
        // Trigger auto-search immediately without delay
        setTimeout(() => {
          console.log('About to call handleSearchSubmit');
          handleSearchSubmit();
        }, 100); // Small delay to ensure state is set
      }
    } else {
      console.log('No URL location data, detecting location');
      // Otherwise detect location normally
      detectUserLocation();
    }
  }, []); // Remove dependencies to prevent re-running

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get full address
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await response.json();
        
        // Build comprehensive address
        const addressParts = [];
        if (data.streetNumber) addressParts.push(data.streetNumber);
        if (data.streetName) addressParts.push(data.streetName);
        if (data.locality) addressParts.push(data.locality);
        if (data.principalSubdivision) addressParts.push(data.principalSubdivision);
        if (data.countryName) addressParts.push(data.countryName);
        
        const fullAddress = addressParts.join(', ') || `${data.locality || data.city || 'Unknown'}, ${data.principalSubdivision || data.state || 'Unknown'}, ${data.countryName || 'Nigeria'}`;
        
        setUserLocation({
          address: fullAddress,
          city: data.locality || data.city || 'Unknown City',
          state: data.principalSubdivision || data.state || 'Unknown State',
          latitude,
          longitude,
          // Additional address components for better context
          streetNumber: data.streetNumber || '',
          streetName: data.streetName || '',
          postalCode: data.postcode || '',
          country: data.countryName || 'Nigeria'
        });
        
        // Only set to search step if we don't have URL parameters
        if (!urlSearch && !urlCategory) {
          setCurrentStep('search');
        }
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        setUserLocation({
          address: 'Current Location',
          city: 'Unknown City',
          state: 'Unknown State',
          latitude,
          longitude,
          streetNumber: '',
          streetName: '',
          postalCode: '',
          country: 'Nigeria'
        });
        
        // Only set to search step if we don't have URL parameters
        if (!urlSearch && !urlCategory) {
          setCurrentStep('search');
        }
      }
    } catch (error) {
      console.error('Geolocation failed:', error);
      // Fallback to manual location selection only if no URL parameters
      if (!urlSearch && !urlCategory) {
        setCurrentStep('search');
      }
    }
  };

  // Search suggestion functions
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.trim().length > 0) {
      const filteredSuggestions = searchSuggestionsData
        .filter(suggestion => 
          suggestion.toLowerCase().includes(value.toLowerCase())
        )
        .slice(0, 8); // Limit to 8 suggestions
      setSearchSuggestions(filteredSuggestions);
      setShowSuggestions(filteredSuggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setSearchSuggestions([]);
  };

  const handleSearchInputFocus = () => {
    setIsInputFocused(true);
    if (searchQuery.trim().length > 0 && searchSuggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleSearchInputBlur = () => {
    setIsInputFocused(false);
    // Delay hiding suggestions to allow click events
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleSearchSubmit = async () => {
    console.log('handleSearchSubmit called with:', { searchQuery, selectedCategory, userLocation });
    
    if (!searchQuery.trim() && !selectedCategory) {
      console.log('No search query or category, returning');
      return;
    }
    
    setIsSearching(true);
    setCurrentStep('results');
    setShowRadiusExpansion(false);
    
    // Get current location (including any edits)
    const currentLocation = userLocation;
    
    try {
      // Fetch real providers from API
      const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const base = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
      
      let apiUrl = '';
      const searchParams = new URLSearchParams();
      
      if (selectedCategory) {
        // Use category endpoint
        apiUrl = `${base}/providers/category/${selectedCategory}`;
        if (searchQuery.trim()) searchParams.append('search', searchQuery.trim());
        if (currentLocation?.city) searchParams.append('location', currentLocation.city);
      } else if (searchQuery.trim()) {
        // Use search endpoint
        apiUrl = `${base}/providers/search`;
        searchParams.append('search', searchQuery.trim());
        if (currentLocation?.city) searchParams.append('location', currentLocation.city);
      } else {
        // Default: get all providers (use search endpoint with empty search)
        apiUrl = `${base}/providers/search`;
        searchParams.append('search', '');
        if (currentLocation?.city) searchParams.append('location', currentLocation.city);
      }
      
      const fullUrl = searchParams.toString() ? `${apiUrl}?${searchParams.toString()}` : apiUrl;
      console.log('Fetching providers from API:', fullUrl);
      
      const response = await fetch(fullUrl);
      const data = await response.json();
      
      console.log('API Response:', data);
      
      if (data.success && data.data?.providers) {
        const allProviders: Provider[] = data.data.providers.map((provider: any) => ({
          id: provider.id,
          user: {
            fullName: provider.User?.fullName || 'Provider',
            email: provider.User?.email || '',
            phone: provider.User?.phone || '',
            avatarUrl: provider.User?.avatarUrl || ''
          },
          businessName: provider.businessName || provider.User?.fullName || 'Business',
          category: provider.category,
          subcategories: provider.subcategories || [],
          locationCity: provider.locationCity || currentLocation?.city || 'Lagos',
          locationState: provider.locationState || currentLocation?.state || 'Lagos',
          ratingAverage: provider.ratingAverage || 4.5,
          ratingCount: provider.ratingCount || 0,
          startingPrice: provider.startingPrice || 5000,
          hourlyRate: provider.hourlyRate || 2000,
          bio: provider.bio || `Professional ${provider.category} service provider`,
          verificationStatus: provider.verificationStatus || 'verified',
          isAvailable: provider.isAvailable !== false,
          estimatedArrival: provider.estimatedArrival || '30 mins',
          yearsOfExperience: provider.yearsOfExperience || 3,
          brandImages: provider.brandImages || []
        }));
        
        // Apply radius-based filtering (simplified for demo)
        const radiusFilteredResults = allProviders.filter((_, index) => {
          if (searchRadius <= 5) {
            return index < Math.max(1, Math.floor(Math.random() * 2) + 1);
          } else if (searchRadius <= 10) {
            return index < Math.max(2, Math.floor(Math.random() * 2) + 2);
          } else {
            return true; // Show all results for large radius
          }
        });
        
        setSearchResults(radiusFilteredResults);
        setSearchResultsCount(radiusFilteredResults.length);
        
        // Check if we should show no results modal
        if (radiusFilteredResults.length === 0) {
          setShowNoResultsModal(true);
          setShowRadiusExpansion(false);
        } else {
          setShowNoResultsModal(false);
          // Show radius expansion prompt for few results
          if (radiusFilteredResults.length <= 1 && searchRadius <= 10) {
            setShowRadiusExpansion(true);
          } else {
            setShowRadiusExpansion(false);
          }
        }
        
        setIsSearching(false);
      } else {
        // Fallback to mock data if API fails
        console.log('API failed, using mock data');
        setSearchResults([]);
        setSearchResultsCount(0);
        setShowNoResultsModal(true);
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
      setSearchResultsCount(0);
      setShowNoResultsModal(true);
      setIsSearching(false);
    }
  };

  const expandSearchRadius = () => {
    setSearchRadius(prev => Math.min(prev + 5, 25)); // Increase by 5km, max 25km
    setShowRadiusExpansion(false);
    setShowNoResultsModal(false);
    // Trigger new search with expanded radius
    handleSearchSubmit();
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSearchResults([]);
    setSearchResultsCount(0);
    setShowNoResultsModal(false);
    setShowRadiusExpansion(false);
    setCurrentStep('search');
  };

  const closeNoResultsModal = () => {
    setShowNoResultsModal(false);
  };

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };

  const getCategoryIcon = (category: string) => {
    // Return a default icon since we're using images now
    return Wrench;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleBookProvider = (provider: Provider) => {
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    setSelectedProvider(provider);
    setShowBookingModal(true);
  };

  const handleViewProfile = (provider: Provider) => {
    setProfileProvider(provider);
    setShowProfileModal(true);
  };

  const handleContactProvider = (provider: Provider) => {
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    console.log('Contacting provider:', provider);
    alert(`Contacting ${provider.user.fullName} - Coming Soon!`);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setProfileProvider(null);
  };

  const handleLocationEdit = () => {
    setIsEditingLocation(true);
  };

  const handleLocationSave = () => {
    setIsEditingLocation(false);
  };

  const handleLocationCancel = () => {
    setIsEditingLocation(false);
  };

  const handleLocationSelect = (location: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setUserLocation(prev => prev ? {
      ...prev,
      address: location.address,
      city: location.city,
      state: location.state,
      latitude: location.latitude,
      longitude: location.longitude
    } : null);
    setIsEditingLocation(false);
  };

  // Render different steps
  if (currentStep === 'location') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Navigation className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Getting Your Location
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                We're detecting your current location to find nearby service providers
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              <span className="text-blue-600 font-medium">Detecting location...</span>
            </div>
            
            <button
              onClick={() => setCurrentStep('search')}
              className="w-full px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              Skip location detection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'search') {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Find Product/Service Providers</h1>
                {userLocation && (
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4" />
                    {isEditingLocation ? (
                      <div className="w-80">
                        <LocationPicker
                          onLocationSelect={handleLocationSelect}
                          initialCity={userLocation.city}
                          initialState={userLocation.state}
                          initialLat={userLocation.latitude}
                          initialLng={userLocation.longitude}
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>{userLocation.address}</span>
                        <button
                          onClick={handleLocationEdit}
                          className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
              </div>
            </div>
            
            
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      

          {/* Enhanced Search Section */}
          <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-800 dark:via-slate-900 dark:to-blue-900/20 rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8 mb-8 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#2563EB] to-[#14B8A6] rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#14B8A6] to-[#2563EB] rounded-full blur-2xl transform -translate-x-24 translate-y-24"></div>
            </div>
            
            {/* Header with Enhanced Design */}
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-2xl flex items-center justify-center shadow-xl">
                    <Search className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Find Your Perfect Service Provider
                </h2>
                  <p className="text-slate-600 dark:text-slate-400 text-base">
                    Discover skilled professionals ready to help you in minutes
                </p>
              </div>
            </div>
            
            {/* Enhanced Location Context */}
            {userLocation && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Searching near:</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                        {userLocation.address}
                      </p>
                    </div>
                  </div>
                  {isEditingLocation && (
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></div>
                      <span className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm font-medium shadow-sm">
                        Editing location
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Enhanced Search Input */}
            <div className="mb-6">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                  <div className="w-6 h-6 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-lg flex items-center justify-center shadow-lg">
                    <Search className="w-3 h-3 text-white" />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="What service do you need? (e.g., plumber, electrician, cleaner...)"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchInputFocus}
                  onBlur={handleSearchInputBlur}
                  className={`w-full pl-14 pr-12 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm text-slate-900 dark:text-slate-100 transition-all text-base placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0 shadow-lg hover:shadow-xl ${
                    isInputFocused 
                      ? 'border-[#2563EB] shadow-xl shadow-[#2563EB]/20 bg-white dark:bg-slate-700' 
                      : 'hover:border-slate-300 dark:hover:border-slate-500'
                  }`}
                />
                {searchQuery && (
              <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      setSearchSuggestions([]);
                    }}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-slate-100 dark:bg-slate-600 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all hover:bg-slate-200 dark:hover:bg-slate-500"
                  >
                    <X className="w-4 h-4" />
              </button>
                )}
              
                {/* Enhanced Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-600/50 rounded-2xl shadow-2xl z-50 max-h-72 overflow-y-auto">
                    <div className="p-2">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-gradient-to-r hover:from-[#2563EB]/10 hover:to-[#14B8A6]/10 dark:hover:from-[#2563EB]/20 dark:hover:to-[#14B8A6]/20 transition-all rounded-xl flex items-center space-x-3 group"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB]/20 to-[#14B8A6]/20 rounded-lg flex items-center justify-center group-hover:from-[#2563EB]/30 group-hover:to-[#14B8A6]/30 transition-all">
                            <Search className="w-3 h-3 text-[#2563EB]" />
                          </div>
                          <span className="font-medium">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Category Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Popular Services
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Choose from our most requested services
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-full">
                  <div className="w-2 h-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Tap to select</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {categories.slice(1).map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`group relative flex flex-col items-center space-y-3 p-4 rounded-2xl text-xs font-medium transition-all duration-300 hover:scale-105 ${
                      selectedCategory === cat.value
                        ? 'bg-gradient-to-br from-[#2563EB] to-[#14B8A6] text-white shadow-2xl shadow-[#2563EB]/30 transform scale-105'
                        : 'bg-white/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200/50 dark:border-slate-600/50 hover:border-[#2563EB]/30 hover:shadow-xl backdrop-blur-sm'
                    }`}
                  >
                    {/* Enhanced Image Container */}
                    <div className={`relative w-14 h-14 rounded-2xl overflow-hidden transition-all duration-300 shadow-lg ${
                      selectedCategory === cat.value ? 'animate-pulse shadow-xl' : 'group-hover:scale-110'
                    }`}>
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover transition-all duration-300"
                      />
                      {selectedCategory === cat.value && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/20 to-[#14B8A6]/20"></div>
                      )}
                      {selectedCategory === cat.value && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Enhanced Label */}
                    <span className={`text-center leading-tight transition-colors duration-300 text-xs font-semibold ${
                      selectedCategory === cat.value 
                        ? 'text-white font-bold' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                    }`}>
                      {cat.label}
                    </span>
                    
                    {/* Enhanced Hover Effect */}
                    {!selectedCategory || selectedCategory !== cat.value ? (
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2563EB]/5 to-[#14B8A6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    ) : null}
                  </button>
                ))}
              </div>
              
              {/* Enhanced Selected Category Indicator */}
              {selectedCategory && (
                <div className="mt-6 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white px-6 py-3 rounded-2xl text-sm font-semibold shadow-xl flex items-center space-x-3">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span>Selected: {getCategoryLabel(selectedCategory)}</span>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="ml-2 hover:bg-white/20 rounded-full p-1 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Search Button */}
            <div className="relative">
            <button
              onClick={handleSearchSubmit}
              disabled={(!searchQuery.trim() && !selectedCategory) || isEditingLocation}
                className={`w-full py-5 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 flex items-center justify-center space-x-3 ${
                  (!searchQuery.trim() && !selectedCategory) || isEditingLocation 
                    ? 'cursor-not-allowed' 
                    : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span>
                    {isEditingLocation ? 'Save Location First' : 'Find Service Providers'}
                  </span>
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
            </button>
              
              {/* Button Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-2xl blur-lg opacity-30 -z-10"></div>
            </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        {/* Header */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={resetSearch}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {searchQuery || getCategoryLabel(selectedCategory)}
                  </h1>
                  {userLocation && (
                    <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{userLocation.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
              </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {isSearching ? (
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-12 text-center">
              <div className="mb-6">
                {/* Zooming/Scaling Loader Animation */}
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] animate-ping opacity-75"></div>
                  <div className="absolute inset-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] animate-pulse"></div>
                  <div className="absolute inset-4 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center">
                    <Search className="w-6 h-6 text-[#2563EB] animate-bounce" />
                  </div>
                </div>
                
                {/* Pulsing Text Animation */}
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 animate-pulse">
                  Searching for {searchQuery || getCategoryLabel(selectedCategory)}...
                </h2>
                <p className="text-slate-600 dark:text-slate-400 animate-pulse">
                  Finding the best providers near you
                </p>
                
                {/* Progress Dots */}
                <div className="flex justify-center space-x-2 mt-6">
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-[#2563EB] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Results Header */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-1 sm:mt-0" />
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100">
                        Found {searchResultsCount} providers
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        <span>Available for {searchQuery || getCategoryLabel(selectedCategory)} near</span>
                        {userLocation && (
                          <div className="flex items-center space-x-1 min-w-0">
                            {isEditingLocation ? (
                              <div className="w-full sm:w-80">
                                <LocationPicker
                                  onLocationSelect={handleLocationSelect}
                                  initialCity={userLocation.city}
                                  initialState={userLocation.state}
                                  initialLat={userLocation.latitude}
                                  initialLng={userLocation.longitude}
                                />
                              </div>
                            ) : (
                              <div className="flex items-center space-x-1 min-w-0">
                                <span className="font-medium truncate">{userLocation.address}</span>
                                <button
                                  onClick={handleLocationEdit}
                                  className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex-shrink-0"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={resetSearch}
                    className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 w-full sm:w-auto"
                  >
                    New Search
                  </button>
                </div>
              </div>

              {/* Radius Expansion Prompt */}
              {showRadiusExpansion && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
                    {/* Left Section - Icon and Content */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                      {/* Icon */}
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                        <div className="absolute inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-bounce" />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                          Limited providers in your area
                        </h3>
                        
                        {/* Stats Card */}
                        <div className="bg-white/60 dark:bg-slate-700/60 rounded-xl p-3 sm:p-4 mb-3">
                          <p className="text-amber-800 dark:text-amber-200 text-sm sm:text-base lg:text-lg">
                            We found <span className="font-bold text-[#2563EB]">{searchResultsCount}</span> provider{searchResultsCount !== 1 ? 's' : ''} within <span className="font-bold text-[#2563EB]">{searchRadius}km</span>
                          </p>
                          {userLocation && (
                            <p className="text-amber-700 dark:text-amber-300 text-xs sm:text-sm flex items-center space-x-1 mt-1">
                              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                              <span className="truncate">near {userLocation.address}</span>
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <p className="text-amber-700 dark:text-amber-300 text-sm sm:text-base lg:text-lg">
                            Would you like to expand the search radius to find more options?
                          </p>
                          <Navigation className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400 animate-pulse flex-shrink-0" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Right Section - Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-3 w-full sm:w-auto lg:w-auto">
                      <button
                        onClick={() => setShowRadiusExpansion(false)}
                        className="group px-4 sm:px-6 py-3 text-amber-700 dark:text-amber-300 hover:text-amber-900 dark:hover:text-amber-100 transition-all duration-300 font-semibold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 flex items-center justify-center space-x-2 w-full sm:w-auto lg:w-auto"
                      >
                        <X className="w-4 h-4 group-hover:rotate-90 transition-transform flex-shrink-0" />
                        <span className="text-sm sm:text-base">Keep Current</span>
                      </button>
                      <button
                        onClick={expandSearchRadius}
                        className="group px-4 sm:px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2 w-full sm:w-auto lg:w-auto"
                      >
                        <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="text-sm sm:text-base">Expand to {Math.min(searchRadius + 5, 25)}km</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Providers List - 2 per row on larger screens */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {searchResults.length > 0 ? (
                  searchResults.map((provider) => (
                  <div
                    key={provider.id}
                    className="group bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 p-6 sm:p-8 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 relative overflow-hidden"
                  >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/5 to-[#14B8A6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <div className="flex flex-row items-stretch gap-6 h-full">
                        {/* Avatar - 30% width, full height */}
                        <div className="w-[30%] flex-shrink-0">
                          <div className="h-full flex items-center justify-center p-2">
                            <div className="w-full h-full max-w-none max-h-none">
                          <Avatar
                                src={provider.brandImages && provider.brandImages.length > 0 ? (provider.brandImages[0].url || provider.brandImages[0]) : (provider.user?.avatarUrl || '')}
                                alt={provider.businessName || provider.user?.fullName || 'Provider'}
                                fallback={provider.businessName || provider.user?.fullName || 'P'}
                                size="xl"
                            showVerification={true}
                            isVerified={provider.verificationStatus === 'verified'}
                            showAvailability={true}
                            isAvailable={provider.isAvailable}
                                className="w-full h-full rounded-2xl object-cover"
                          />
                            </div>
                          </div>
                        </div>
                        
                        {/* Content - 70% width */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <h3 className="text-lg sm:text-lg font-bold bg-gradient-to-r from-[#2563EB] to-[#14B8A6] bg-clip-text text-transparent truncate">
                                {provider.businessName || 'Business Name'}
                            </h3>
                              {/* {provider.user?.fullName && provider.businessName && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                                  by {provider.user.fullName}
                                </p>
                              )} */}
                            </div>
                            <div className="flex items-center gap-2 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 px-3 py-1.5 rounded-full">
                              <img
                                src={categories.find(cat => cat.value === provider.category)?.image || '/images/tool.jpg'}
                                alt={getCategoryLabel(provider.category)}
                                className="w-5 h-5 object-cover rounded"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">
                                {getCategoryLabel(provider.category)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Enhanced Info Cards */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                            {/* Location Card */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                              <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                                  <MapPin className="w-4 h-4 text-white" />
                            </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-1">Location</p>
                                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                                    {provider.locationCity}, {provider.locationState}
                                  </p>
                                </div>
                            </div>
                          </div>
                          
                            {/* Availability Card */}
                            <div className={`rounded-xl p-4 border ${
                              provider.isAvailable 
                                ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800'
                                : 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-orange-200 dark:border-orange-800'
                            }`}>
                              <div className="flex items-center space-x-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                  provider.isAvailable ? 'bg-green-500' : 'bg-orange-500'
                                }`}>
                                  <Clock className="w-4 h-4 text-white" />
                            </div>
                                <div className="min-w-0 flex-1">
                                  <p className={`text-xs font-medium mb-1 ${
                                    provider.isAvailable 
                                      ? 'text-green-700 dark:text-green-300' 
                                      : 'text-orange-700 dark:text-orange-300'
                                  }`}>
                                    Status
                                  </p>
                                  <p className={`text-sm font-semibold truncate ${
                                    provider.isAvailable 
                                      ? 'text-green-800 dark:text-green-200' 
                                      : 'text-orange-800 dark:text-orange-200'
                                  }`}>
                                    {provider.isAvailable ? `Available - ${provider.estimatedArrival}` : 'Currently Busy'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Brand Images - Enhanced Grid Cards */}
                          <div className="mb-6">
                            <div className="flex items-center space-x-2 mb-3">
                              <div className="w-2 h-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full animate-pulse"></div>
                              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Brand Images</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              {(() => {
                                // Use real brand images if available, otherwise fallback to mock images
                                const brandImages = provider.brandImages && provider.brandImages.length > 0 
                                  ? provider.brandImages.slice(0, 3).map((img: any) => img.url || img)
                                  : (() => {
                                      // Fallback to mock images based on provider category
                                const getWorkImages = (category: string) => {
                                  const imageSets = {
                                    plumbing: [
                                            'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D',
                                            'https://images.unsplash.com/photo-1538474705339-e87de81450e8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D',
                                            'https://images.unsplash.com/photo-1542013936693-884638332954?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGx1bWJpbmd8ZW58MHx8MHx8fDA%3D'
                                    ],
                                    electrical: [
                                            'https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZWxlY3RyaWNhbHxlbnwwfHwwfHx8MA%3D%3D',
                                            'https://images.unsplash.com/photo-1566417110090-6b15a06ec800?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGVsZWN0cmljYWx8ZW58MHx8MHx8fDA%3D',
                                            'https://images.unsplash.com/photo-1530240852689-f7a9c6d9f6c7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGVsZWN0cmljYWx8ZW58MHx8MHx8fDA%3D'
                                    ],
                                    cleaning: [
                                            'https://images.unsplash.com/photo-1550963295-019d8a8a61c5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGNsZWFuZXJ8ZW58MHx8MHx8fDA%3D',
                                            'https://images.unsplash.com/photo-1529220502050-f15e570c634e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNsZWFuZXJ8ZW58MHx8MHx8fDA%3D',
                                            'https://images.unsplash.com/photo-1610141160723-d2d346e73766?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNsZWFuZXJ8ZW58MHx8MHx8fDA%3D'
                                    ]
                                  };
                                  return imageSets[category as keyof typeof imageSets] || imageSets.plumbing;
                                };
                                      return getWorkImages(provider.category).slice(0, 3);
                                    })();
                                
                                return (
                                  <>
                                    {brandImages.map((image, index) => (
                                      <div
                                        key={index}
                                        className="relative group cursor-pointer"
                                      >
                                        <div className="w-full h-20 sm:h-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group/image">
                                          <img
                                            src={image}
                                            alt={`Brand Image ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              // Hide image if it fails to load
                                              e.currentTarget.style.display = 'none';
                                            }}
                                          />
                                        </div>
                                        {/* Enhanced hover overlay */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#14B8A6]/0 group-hover:from-[#2563EB]/20 group-hover:to-[#14B8A6]/20 transition-all duration-300 rounded-xl flex items-center justify-center">
                                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                                            <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                              <div className="w-3 h-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full"></div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {/* More indicator if there are more images */}
                                    {(provider.brandImages && provider.brandImages.length > 3) && (
                                      <div className="w-full h-20 sm:h-24 rounded-lg bg-gradient-to-br from-[#2563EB]/10 to-[#14B8A6]/10 dark:from-[#2563EB]/20 dark:to-[#14B8A6]/20 border border-[#2563EB]/30 dark:border-[#14B8A6]/30 shadow-md flex items-center justify-center group cursor-pointer hover:scale-105 transition-all duration-300">
                                        <div className="text-center">
                                          <div className="w-6 h-6 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-1">
                                            <span className="text-white font-bold text-xs">+</span>
                                    </div>
                                          <span className="text-xs font-bold text-[#2563EB] dark:text-[#14B8A6]">{provider.brandImages.length - 3} more</span>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Enhanced Rating Section */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
                            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 px-4 py-2 rounded-full w-fit border border-yellow-200 dark:border-yellow-800">
                              <div className="flex items-center space-x-1">
                                <Star className="w-5 h-5 text-yellow-500 fill-current flex-shrink-0" />
                                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {Number(provider.ratingAverage || 0).toFixed(1)}
                              </span>
                              </div>
                              <div className="w-px h-4 bg-yellow-300 dark:bg-yellow-700"></div>
                              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                {provider.ratingCount} reviews
                              </span>
                            </div>
                            
                            {/* <div className="flex items-center space-x-1">
                              <NairaIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                From {formatPrice(provider.startingPrice)}
                              </span>
                            </div> */}
                          </div>
                          
                          {/* Provider Description */}
                          {provider.bio && (
                            <div className="mb-4">
                              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                {(() => {
                                  const words = provider.bio.split(' ');
                                  if (words.length <= 20) {
                                    return provider.bio;
                                  }
                                  return words.slice(0, 20).join(' ') + '...';
                                })()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Enhanced Action Buttons - Spacious for 2-column */}
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => handleBookProvider(provider)}
                          disabled={!provider.isAvailable}
                          className={`px-6 py-4 rounded-xl font-bold text-sm transition-all duration-300 cursor-pointer w-full shadow-lg hover:shadow-xl ${
                            provider.isAvailable
                              ? 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white hover:opacity-90 hover:scale-105 hover:-translate-y-0.5'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {provider.isAvailable ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                              <span>Book Now</span>
                            </div>
                          ) : (
                            'Unavailable'
                          )}
                        </button>
                        
                          <button
                            onClick={() => handleViewProfile(provider)}
                          className="px-6 py-3 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:from-slate-200 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:to-slate-500 transition-all duration-300 text-sm font-semibold cursor-pointer w-full shadow-md hover:shadow-lg hover:scale-105"
                          >
                            View Profile
                          </button>
                      </div>
                          
                          {/* <button
                            onClick={() => handleContactProvider(provider)}
                            className="px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm cursor-pointer flex-1 sm:flex-none lg:flex-none"
                          >
                            Contact
                          </button> */}
                        </div>
                      </div>
                  
                
                ))
                ) : (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Search className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          No providers found
                        </h3>
                <p className="text-slate-600 dark:text-slate-400">
                          Try adjusting your search or expanding the radius
                </p>
                      </div>
                    </div>
              </div>
            )}
          </div>
            </>
          )}
        </div>

        {/* No Results Modal */}
        {showNoResultsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4">
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={closeNoResultsModal}
                    className="w-7 h-7 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                  </button>
                </div>

                {/* Animated Icon */}
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Search className="w-6 h-6 text-white animate-bounce" />
                  </div>
                </div>
                
                {/* Friendly Message */}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    No {getCategoryLabel(selectedCategory) || 'providers'} found
                  </h3>
                  <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      {selectedCategory ? (
                        <>
                          No available <span className="font-semibold text-[#2563EB]">{getCategoryLabel(selectedCategory).toLowerCase()}</span> in your area
                        </>
                      ) : (
                        <>
                          No providers matching <span className="font-semibold text-[#2563EB]">"{searchQuery}"</span>
                        </>
                      )}
                    </p>
                    {userLocation && (
                      <p className="text-slate-600 dark:text-slate-400 text-xs flex items-center justify-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>near {userLocation.address}</span>
                      </p>
                    )}
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Expand your search? 🌟
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mb-6">
                  <button
                    onClick={resetSearch}
                    className="group px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl hover:opacity-90 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Try Different Search</span>
                  </button>
                  <button
                    onClick={expandSearchRadius}
                    className="group px-6 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-600 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <Navigation className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Expand Search Area</span>
                  </button>
                </div>
                
                {/* Helpful Tips - Compact */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                  <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center justify-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Search Tips</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2 text-xs text-blue-800 dark:text-blue-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Try broader terms like "plumber" or "electrician"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Search for specific services like "pipe repair"</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Expand your search radius for more options</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      <span>Check back later for new providers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBookingModal && selectedProvider && (
          <BookingModal
            provider={selectedProvider}
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedProvider(null);
            }}
          />
        )}

        {/* Provider Profile Modal */}
        {showProfileModal && profileProvider && (
          <ProviderProfileModal
            provider={profileProvider}
            isOpen={showProfileModal}
            onClose={handleCloseProfileModal}
            onBook={() => {
              setShowProfileModal(false);
              setSelectedProvider(profileProvider);
              setShowBookingModal(true);
            }}
            onContact={handleContactProvider}
          />
        )}
    </div>
  );
  }

  return null;
}
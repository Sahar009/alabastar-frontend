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
  
  // State for the new Uber/Bolt-style flow
  const [currentStep, setCurrentStep] = useState<'location' | 'search' | 'results'>('location');
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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
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
    { value: '', label: 'All Services', icon: Wrench },
    { value: 'plumbing', label: 'Plumbing', icon: Droplets },
    { value: 'electrical', label: 'Electrical', icon: ZapIcon },
    { value: 'cleaning', label: 'Cleaning', icon: Sparkles },
    { value: 'moving', label: 'Moving', icon: Package },
    { value: 'ac_repair', label: 'AC Repair', icon: Snowflake },
    { value: 'carpentry', label: 'Carpentry', icon: Hammer },
    { value: 'painting', label: 'Painting', icon: Palette },
    { value: 'pest_control', label: 'Pest Control', icon: Bug },
    { value: 'laundry', label: 'Laundry', icon: Shirt },
    { value: 'tiling', label: 'Tiling', icon: Square },
    { value: 'cctv', label: 'CCTV', icon: Video },
    { value: 'gardening', label: 'Gardening', icon: Sprout },
    { value: 'appliance_repair', label: 'Appliance Repair', icon: Settings },
    { value: 'locksmith', label: 'Locksmith', icon: Key },
    { value: 'carpet_cleaning', label: 'Carpet Cleaning', icon: Sofa }
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
    detectUserLocation();
  }, []);

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
        
        setCurrentStep('search');
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
        setCurrentStep('search');
      }
    } catch (error) {
      console.error('Geolocation failed:', error);
      // Fallback to manual location selection
      setCurrentStep('search');
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
    if (!searchQuery.trim() && !selectedCategory) return;
    
    setIsSearching(true);
    setCurrentStep('results');
    setShowRadiusExpansion(false);
    
    // Get current location (including any edits)
    const currentLocation = userLocation;
    
    // Simulate search delay
    setTimeout(async () => {
      try {
        // Enhanced search logic with category/subcategory matching
        const searchTerm = searchQuery.toLowerCase().trim();
        const selectedCat = selectedCategory;
        
        // All available providers with diverse categories and subcategories
        const allProviders: Provider[] = [
          // Plumbing providers
          {
            id: '1',
            user: { 
              fullName: 'John Doe', 
              email: 'john@example.com',
              phone: '+2348123456789',
              avatarUrl: '' 
            },
            category: 'plumbing',
            subcategories: ['Pipe Repair', 'Drain Cleaning', 'Water Heater'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.8,
            ratingCount: 23,
            startingPrice: 5000,
            hourlyRate: 2000,
            bio: `Professional plumber with 5 years experience serving ${currentLocation?.address || 'your area'}`,
            verificationStatus: 'verified',
            isAvailable: true,
            estimatedArrival: '15 mins',
            yearsOfExperience: 5
          },
          {
            id: '4',
            user: { 
              fullName: 'David Brown', 
              email: 'david@example.com',
              phone: '+2348123456792',
              avatarUrl: '' 
            },
            category: 'plumbing',
            subcategories: ['Water Heater', 'Toilet Repair', 'Faucet Installation'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.6,
            ratingCount: 32,
            startingPrice: 6000,
            hourlyRate: 2500,
            bio: `Expert plumber specializing in water systems near ${currentLocation?.address || 'your area'}`,
            verificationStatus: 'verified',
            isAvailable: true,
            estimatedArrival: '25 mins',
            yearsOfExperience: 7
          },
          // Electrical providers
          {
            id: '2',
            user: { 
              fullName: 'Sarah Johnson', 
              email: 'sarah@example.com',
              phone: '+2348123456790',
              avatarUrl: '' 
            },
            category: 'electrical',
            subcategories: ['Wiring', 'Outlet Installation', 'Light Fixtures'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.9,
            ratingCount: 45,
            startingPrice: 7000,
            hourlyRate: 3000,
            bio: `Licensed electrician specializing in home repairs near ${currentLocation?.address || 'your location'}`,
            verificationStatus: 'verified',
            isAvailable: true,
            estimatedArrival: '20 mins',
            yearsOfExperience: 8
          },
          {
            id: '5',
            user: { 
              fullName: 'Lisa Green', 
              email: 'lisa@example.com',
              phone: '+2348123456793',
              avatarUrl: '' 
            },
            category: 'electrical',
            subcategories: ['Light Fixtures', 'Generator', 'Circuit Breaker'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.5,
            ratingCount: 28,
            startingPrice: 8000,
            hourlyRate: 3500,
            bio: `Certified electrician with generator expertise serving ${currentLocation?.address || 'your area'}`,
            verificationStatus: 'verified',
            isAvailable: false,
            estimatedArrival: '35 mins',
            yearsOfExperience: 6
          },
          // Cleaning providers
          {
            id: '3',
            user: { 
              fullName: 'Mike Wilson', 
              email: 'mike@example.com',
              phone: '+2348123456791',
              avatarUrl: '' 
            },
            category: 'cleaning',
            subcategories: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.7,
            ratingCount: 18,
            startingPrice: 3000,
            hourlyRate: 1500,
            bio: `Professional cleaning services for homes and offices in ${currentLocation?.address || 'your area'}`,
            verificationStatus: 'verified',
            isAvailable: false,
            estimatedArrival: '30 mins',
            yearsOfExperience: 3
          },
          // AC Repair providers
          {
            id: '6',
            user: { 
              fullName: 'Tony Martinez', 
              email: 'tony@example.com',
              phone: '+2348123456794',
              avatarUrl: '' 
            },
            category: 'ac_repair',
            subcategories: ['AC Installation', 'AC Repair', 'AC Maintenance'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.4,
            ratingCount: 15,
            startingPrice: 12000,
            hourlyRate: 4000,
            bio: `AC specialist with 4 years experience serving ${currentLocation?.address || 'your area'}`,
            verificationStatus: 'verified',
            isAvailable: true,
            estimatedArrival: '40 mins',
            yearsOfExperience: 4
          },
          // Carpentry providers
          {
            id: '7',
            user: { 
              fullName: 'Robert Kim', 
              email: 'robert@example.com',
              phone: '+2348123456795',
              avatarUrl: '' 
            },
            category: 'carpentry',
            subcategories: ['Furniture Repair', 'Cabinet Making', 'Door Installation'],
            locationCity: currentLocation?.city || 'Lagos',
            locationState: currentLocation?.state || 'Lagos',
            ratingAverage: 4.6,
            ratingCount: 22,
            startingPrice: 8000,
            hourlyRate: 3000,
            bio: `Skilled carpenter specializing in furniture and cabinets near ${currentLocation?.address || 'your area'}`,
            verificationStatus: 'verified',
            isAvailable: true,
            estimatedArrival: '45 mins',
            yearsOfExperience: 6
          }
        ];
        
        // Smart search filtering based on query and category
        let filteredResults: Provider[] = [];
        
        if (selectedCat) {
          // If category is selected, filter by category first
          filteredResults = allProviders.filter(provider => provider.category === selectedCat);
        } else if (searchTerm) {
          // If search query is provided, search across categories and subcategories
          filteredResults = allProviders.filter(provider => {
            const categoryMatch = provider.category.toLowerCase().includes(searchTerm);
            const subcategoryMatch = provider.subcategories.some(sub => 
              sub.toLowerCase().includes(searchTerm)
            );
            const bioMatch = provider.bio.toLowerCase().includes(searchTerm);
            
            return categoryMatch || subcategoryMatch || bioMatch;
          });
        } else {
          // No specific search criteria, return all providers
          filteredResults = allProviders;
        }
        
        // Apply location-based radius filtering
        // For demo purposes, simulate radius-based results
        const radiusFilteredResults = filteredResults.filter((_, index) => {
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
      } catch (error) {
        console.error('Search failed:', error);
        setIsSearching(false);
      }
    }, 2000);
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
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Wrench;
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
            
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      

          {/* Search Section */}
          <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 mb-6">
            {/* Header with Icon */}
            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-xl flex items-center justify-center shadow-lg">
                <Search className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  What product/service do you need?
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                 Who/what you need might be few seconds away
                </p>
              </div>
            </div>
            
            {/* Location Context - Compact */}
            {userLocation && (
              <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <MapPin className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <span className="text-slate-600 dark:text-slate-400">Searching near:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100 ml-1">
                        {userLocation.address}
                      </span>
                    </div>
                  </div>
                  {isEditingLocation && (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                      <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-xs font-medium">
                        Editing location
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Search Input - Compact with Autocomplete */}
            <div className="mb-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-[#2563EB] transition-colors" />
                <input
                  type="text"
                  placeholder="Type service name (e.g., plumber, electrician...)"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  onFocus={handleSearchInputFocus}
                  onBlur={handleSearchInputBlur}
                  className={`w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-0 ${
                    isInputFocused 
                      ? 'border-b-4 border-b-[#2563EB] border-t-slate-200 dark:border-t-slate-600 border-l-slate-200 dark:border-l-slate-600 border-r-slate-200 dark:border-r-slate-600' 
                      : ''
                  }`}
                />
                {searchQuery && (
              <button
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      setSearchSuggestions([]);
                    }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                  >
                    <X className="w-4 h-4" />
              </button>
                )}
              
                {/* Search Suggestions Dropdown */}
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchSuggestions.map((suggestion, index) => (
              <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center space-x-3"
              >
                        <Search className="w-4 h-4 text-slate-400" />
                        <span>{suggestion}</span>
              </button>
                    ))}
            </div>
                )}
        </div>
      </div>

            {/* Category Selection - Compact */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Popular Services
                </h3>
                <div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Choose</span>
                </div>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {categories.slice(1).map(cat => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`group relative flex flex-col items-center space-y-1 p-2 rounded-xl text-xs font-medium transition-all duration-300 hover:scale-105 ${
                      selectedCategory === cat.value
                        ? 'bg-gradient-to-br from-[#2563EB] to-[#14B8A6] text-white shadow-lg shadow-[#2563EB]/25'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-slate-100 dark:hover:from-slate-600 dark:hover:to-slate-500 hover:text-slate-900 dark:hover:text-slate-100 border border-slate-200 dark:border-slate-600 hover:border-[#2563EB]/30 hover:shadow-md'
                    }`}
                  >
                    {/* Icon with enhanced styling */}
                    <div className={`relative ${selectedCategory === cat.value ? 'animate-pulse' : ''}`}>
                      <cat.icon className={`w-4 h-4 transition-all duration-300 ${
                        selectedCategory === cat.value 
                          ? 'text-white drop-shadow-sm' 
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-[#2563EB] group-hover:scale-110'
                      }`} />
                      {selectedCategory === cat.value && (
                        <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full flex items-center justify-center">
                          <div className="w-1 h-1 bg-[#2563EB] rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Label with better typography */}
                    <span className={`text-center leading-tight transition-colors duration-300 text-xs ${
                      selectedCategory === cat.value 
                        ? 'text-white font-semibold' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100'
                    }`}>
                      {cat.label}
                    </span>
                    
                    {/* Hover effect overlay */}
                    {!selectedCategory || selectedCategory !== cat.value ? (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#2563EB]/5 to-[#14B8A6]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    ) : null}
                  </button>
                ))}
              </div>
              
              {/* Selected category indicator - Compact */}
              {selectedCategory && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span>Selected: {getCategoryLabel(selectedCategory)}</span>
                    <button
                      onClick={() => setSelectedCategory('')}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearchSubmit}
              disabled={(!searchQuery.trim() && !selectedCategory) || isEditingLocation}
              className="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isEditingLocation ? 'Save Location First' : 'Search for Services'}
            </button>
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
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
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

              {/* Providers List */}
              <div className="space-y-4">
                {searchResults.length > 0 ? (
                  searchResults.map((provider) => (
                  <div
                    key={provider.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 transition-all hover:shadow-xl hover:scale-[1.01]"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
                        <div className="flex-shrink-0">
                          <Avatar
                            src={provider.user?.avatarUrl || ''}
                            alt={provider.user?.fullName || 'Provider'}
                            fallback={provider.user?.fullName || 'P'}
                            size="lg"
                            showVerification={true}
                            isVerified={provider.verificationStatus === 'verified'}
                            showAvailability={true}
                            isAvailable={provider.isAvailable}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
                              {provider.user?.fullName || 'Provider'}
                            </h3>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const IconComponent = getCategoryIcon(provider.category);
                                return <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-[#14B8A6] flex-shrink-0" />;
                              })()}
                              <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                                {getCategoryLabel(provider.category)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Mobile-first responsive info grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{provider.locationCity}, {provider.locationState}</span>
                            </div>
                            {/* <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4 flex-shrink-0" />
                              <span>{provider.yearsOfExperience} years exp</span>
                            </div> */}
                            <div className="flex items-center space-x-1 sm:col-span-2 lg:col-span-1">
                              <Clock className="w-4 h-4 flex-shrink-0" />
                              <span className={provider.isAvailable ? 'text-green-600' : 'text-orange-600'}>
                                {provider.isAvailable ? `Available - ${provider.estimatedArrival}` : 'Busy'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Product/Services Images - Circular Design */}
                          <div className="mb-3">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full"></div>
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Product/Services</span>
                            </div>
                            <div className="flex -space-x-2">
                              {(() => {
                                // Get work-related images based on provider category
                                const getWorkImages = (category: string) => {
                                  const imageSets = {
                                    plumbing: [
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Plumbing work
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Pipe repair
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Water heater
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Drain cleaning
                                    ],
                                    electrical: [
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center', // Electrical work
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Wiring
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Light fixtures
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center' // Electrical panel
                                    ],
                                    cleaning: [
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // House cleaning
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Office cleaning
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Window cleaning
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Deep cleaning
                                    ],
                                    moving: [
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center', // Moving boxes
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Moving truck
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Packing
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center' // Furniture moving
                                    ],
                                    ac_repair: [
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // AC unit
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // AC repair
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // HVAC work
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Air conditioning
                                    ],
                                    carpentry: [
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Woodworking
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Cabinet making
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Furniture repair
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Custom carpentry
                                    ],
                                    painting: [
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center', // House painting
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Interior painting
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Exterior painting
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center' // Wall painting
                                    ],
                                    pest_control: [
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Pest control
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Termite treatment
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Rodent control
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Insect control
                                    ],
                                    laundry: [
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Laundry service
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Dry cleaning
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Ironing
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Fabric care
                                    ],
                                    tiling: [
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center', // Tile installation
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Bathroom tiling
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Kitchen tiling
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center' // Floor tiling
                                    ],
                                    cctv: [
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // CCTV installation
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Security cameras
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Surveillance system
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Security setup
                                    ],
                                    gardening: [
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Garden maintenance
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Landscaping
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Plant care
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Lawn care
                                    ],
                                    appliance_repair: [
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center', // Appliance repair
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Refrigerator repair
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Washing machine
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center' // Oven repair
                                    ],
                                    locksmith: [
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Lock installation
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Key making
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Lock repair
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Security locks
                                    ],
                                    carpet_cleaning: [
                                      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=60&h=60&fit=crop&crop=center', // Carpet cleaning
                                      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=60&h=60&fit=crop&crop=center', // Deep cleaning
                                      'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=60&h=60&fit=crop&crop=center', // Upholstery cleaning
                                      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=60&h=60&fit=crop&crop=center' // Rug cleaning
                                    ]
                                  };
                                  return imageSets[category as keyof typeof imageSets] || imageSets.plumbing;
                                };
                                
                                const workImages = getWorkImages(provider.category).slice(0, 3);
                                return (
                                  <>
                                    {workImages.map((image, index) => (
                                      <div
                                        key={index}
                                        className="relative group cursor-pointer"
                                      >
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110">
                                          <img
                                            src={image}
                                            alt={`Product/Service ${index + 1}`}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                        {/* Hover overlay */}
                                        <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                    {/* More indicator */}
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center">
                                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">+2</span>
                                    </div>
                                  </>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Rating and Price - Responsive */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                            <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full w-fit">
                              <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {Number(provider.ratingAverage || 0).toFixed(1)}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({provider.ratingCount} reviews)
                              </span>
                            </div>
                            
                            {/* <div className="flex items-center space-x-1">
                              <NairaIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                From {formatPrice(provider.startingPrice)}
                              </span>
                            </div> */}
                          </div>
                          
                          {/* {provider.bio && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {provider.bio}
                            </p>
                          )} */}
                        </div>
                      </div>
                      
                      {/* Action Buttons - Responsive */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-3 lg:gap-2 w-full sm:w-auto lg:w-auto">
                        <button
                          onClick={() => handleBookProvider(provider)}
                          disabled={!provider.isAvailable}
                          className={`px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm transition-all cursor-pointer w-full sm:w-auto lg:w-auto ${
                            provider.isAvailable
                              ? 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white hover:opacity-90 hover:scale-105 shadow-lg hover:shadow-xl'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {provider.isAvailable ? 'Book Now' : 'Unavailable'}
                        </button>
                        
                        <div className="flex gap-2 sm:gap-3 lg:flex-col lg:gap-2">
                          <button
                            onClick={() => handleViewProfile(provider)}
                            className="px-3 sm:px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium cursor-pointer flex-1 sm:flex-none lg:flex-none"
                          >
                            View Profile
                          </button>
                          
                          {/* <button
                            onClick={() => handleContactProvider(provider)}
                            className="px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm cursor-pointer flex-1 sm:flex-none lg:flex-none"
                          >
                            Contact
                          </button> */}
                        </div>
                      </div>
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
            onSubmit={(bookingData) => {
              console.log('Booking submitted:', bookingData);
              // Handle booking submission here
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
          />
        )}
    </div>
  );
  }

  return null;
}
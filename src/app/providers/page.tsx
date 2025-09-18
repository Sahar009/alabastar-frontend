"use client";
import { useState, useEffect, useCallback } from "react";
import { 
  Search, MapPin, Star, Filter, User, Award, Clock, Map, List,
  Wrench, Droplets, Zap as ZapIcon, Sparkles, Package, Snowflake, Hammer,
  Palette, Bug, Shirt, Square, Video, Sprout, Settings, Key, Sofa
} from "lucide-react";
import dynamic from "next/dynamic";
import { Provider } from "../../types/provider";
import Avatar from "../../components/Avatar";
import ProviderProfileModal from "../../components/ProviderProfileModal";

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
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("rating");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileProvider, setProfileProvider] = useState<Provider | null>(null);

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

  const locations = [
    { value: '', label: 'All Locations' },
    { value: 'lagos', label: 'Lagos' },
    { value: 'abuja', label: 'Abuja' },
    { value: 'port-harcourt', label: 'Port Harcourt' },
    { value: 'kano', label: 'Kano' },
    { value: 'ibadan', label: 'Ibadan' },
    { value: 'benin', label: 'Benin' },
    { value: 'kaduna', label: 'Kaduna' }
  ];

  const sortOptions = [
    { value: 'rating', label: 'Highest Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
    { value: 'experience', label: 'Most Experienced' },
    { value: 'distance', label: 'Nearest First' }
  ];

  const fetchProviders = useCallback(async () => {
    setLoading(true);
    
    // Always use mock data for now since API might not be ready
    try {
      // Check if we should try API call (only if backend is available)
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      if (selectedLocation) params.append('location', selectedLocation);
      params.append('sort', sortBy);
      
      // Try API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      try {
        const response = await fetch(`${base}/api/providers/search?${params}`, {
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          const providersData = data.data?.providers || [];
          if (providersData.length > 0) {
            setFilteredProviders(providersData);
            return;
          }
        }
      } catch (apiError) {
        clearTimeout(timeoutId);
        console.log('API not available, using mock data:', apiError);
      }
      
      // Fallback to mock data
      const mockProviders = generateMockProviders();
      setFilteredProviders(mockProviders);
      
    } catch (error) {
      console.error('Error in fetchProviders:', error);
      // Use mock data as final fallback
      const mockProviders = generateMockProviders();
      setFilteredProviders(mockProviders);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory, selectedLocation, sortBy]);

  const generateMockProviders = (): Provider[] => {
    const mockData = [
      {
        id: '1',
        user: { 
          fullName: 'John Adebayo', 
          email: 'john@example.com', 
          phone: '+2348012345678',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        },
        category: 'plumbing',
        subcategories: ['Pipe Repair', 'Drain Cleaning'],
        yearsOfExperience: 5,
        bio: 'Professional plumber with 5+ years experience in residential and commercial plumbing.',
        hourlyRate: 2500,
        startingPrice: 5000,
        locationCity: 'Lagos',
        locationState: 'Lagos',
        latitude: 6.5244,
        longitude: 3.3792,
        ratingAverage: 4.8,
        ratingCount: 127,
        verificationStatus: 'verified',
        isAvailable: true,
        estimatedArrival: '15-20 mins'
      },
      {
        id: '2',
        user: { 
          fullName: 'Sarah Okafor', 
          email: 'sarah@example.com', 
          phone: '+2348023456789',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        },
        category: 'electrical',
        subcategories: ['Wiring', 'Outlet Installation'],
        yearsOfExperience: 8,
        bio: 'Licensed electrician specializing in home electrical systems and repairs.',
        hourlyRate: 3000,
        startingPrice: 6000,
        locationCity: 'Abuja',
        locationState: 'FCT',
        latitude: 9.0765,
        longitude: 7.3986,
        ratingAverage: 4.9,
        ratingCount: 89,
        verificationStatus: 'verified',
        isAvailable: true,
        estimatedArrival: '20-25 mins'
      },
      {
        id: '3',
        user: { 
          fullName: 'Mike Johnson', 
          email: 'mike@example.com', 
          phone: '+2348034567890',
          avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        },
        category: 'cleaning',
        subcategories: ['House Cleaning', 'Deep Cleaning'],
        yearsOfExperience: 3,
        bio: 'Professional cleaner offering comprehensive cleaning services for homes and offices.',
        hourlyRate: 2000,
        startingPrice: 4000,
        locationCity: 'Lagos',
        locationState: 'Lagos',
        latitude: 6.4474,
        longitude: 3.3903,
        ratingAverage: 4.7,
        ratingCount: 156,
        verificationStatus: 'verified',
        isAvailable: false,
        estimatedArrival: '30-35 mins'
      },
      {
        id: '4',
        user: { 
          fullName: 'Aisha Mohammed', 
          email: 'aisha@example.com', 
          phone: '+2348045678901',
          avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        },
        category: 'painting',
        subcategories: ['Interior Painting', 'Exterior Painting'],
        yearsOfExperience: 6,
        bio: 'Creative painter with expertise in both interior and exterior painting projects.',
        hourlyRate: 2200,
        startingPrice: 4500,
        locationCity: 'Port Harcourt',
        locationState: 'Rivers',
        latitude: 4.8156,
        longitude: 7.0498,
        ratingAverage: 4.6,
        ratingCount: 98,
        verificationStatus: 'verified',
        isAvailable: true,
        estimatedArrival: '25-30 mins'
      },
      {
        id: '5',
        user: { 
          fullName: 'David Okonkwo', 
          email: 'david@example.com', 
          phone: '+2348056789012',
          avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        },
        category: 'carpentry',
        subcategories: ['Furniture Repair', 'Custom Woodwork'],
        yearsOfExperience: 7,
        bio: 'Skilled carpenter specializing in custom furniture and home repairs.',
        hourlyRate: 2800,
        startingPrice: 5500,
        locationCity: 'Kano',
        locationState: 'Kano',
        latitude: 12.0022,
        longitude: 8.5920,
        ratingAverage: 4.9,
        ratingCount: 112,
        verificationStatus: 'verified',
        isAvailable: true,
        estimatedArrival: '18-22 mins'
      }
    ];
    return mockData;
  };

  useEffect(() => {
    fetchProviders();
  }, [fetchProviders]);

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

  const handleProviderSelect = (provider: Provider) => {
    setSelectedProvider(provider);
  };

  const handleBookProvider = (provider: Provider) => {
    // TODO: Implement booking functionality
    console.log('Booking provider:', provider);
    alert(`Booking ${provider.user.fullName} - Coming Soon!`);
  };

  const handleViewProfile = (provider: Provider) => {
    setProfileProvider(provider);
    setShowProfileModal(true);
  };

  const handleContactProvider = (provider: Provider) => {
    // TODO: Implement contact functionality
    console.log('Contacting provider:', provider);
    alert(`Contacting ${provider.user.fullName} - Coming Soon!`);
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    setProfileProvider(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-white/20 dark:border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Find Providers</h1>
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                <MapPin className="w-4 h-4" />
                <span>{selectedLocation || 'All Locations'}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                {viewMode === 'list' ? <Map className="w-4 h-4" /> : <List className="w-4 h-4" />}
                <span className="hidden sm:inline">{viewMode === 'list' ? 'Map View' : 'List View'}</span>
              </button>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#2563EB] text-white hover:bg-[#2563EB]/90 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search and Filters Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search providers, services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Filters</h3>
              
              {/* Service Category */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Service Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0, 8).map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`flex items-center space-x-2 p-3 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === cat.value
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                      }`}
                    >
                      {cat.icon && <cat.icon className="w-5 h-5" />}
                      <span className="truncate">{cat.label}</span>
                    </button>
                  ))}
                </div>
                {categories.length > 8 && (
                  <button className="w-full mt-2 text-sm text-[#2563EB] hover:text-[#2563EB]/80">
                    View all categories
                  </button>
                )}
              </div>

              {/* Location */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Location</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                >
                  {locations.map(loc => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* Active Filters */}
              {(searchTerm || selectedCategory || selectedLocation) && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Active filters:</span>
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded-full text-sm">
                        Search: &quot;{searchTerm}&quot;
                        <button onClick={() => setSearchTerm("")} className="ml-1 hover:text-[#2563EB]/70">×</button>
                      </span>
                    )}
                    {selectedCategory && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#14B8A6]/10 text-[#14B8A6] rounded-full text-sm">
                        {categories.find(c => c.value === selectedCategory)?.label}
                        <button onClick={() => setSelectedCategory("")} className="ml-1 hover:text-[#14B8A6]/70">×</button>
                      </span>
                    )}
                    {selectedLocation && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-600 rounded-full text-sm">
                        {locations.find(l => l.value === selectedLocation)?.label}
                        <button onClick={() => setSelectedLocation("")} className="ml-1 hover:text-purple-600/70">×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Providers List/Map */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
                      <div className="flex-1">
                        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                      </div>
                      <div className="w-24 h-10 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'map' ? (
              <ProviderMap
                providers={filteredProviders}
                selectedProvider={selectedProvider}
                onProviderSelect={handleProviderSelect}
                onProviderDeselect={() => setSelectedProvider(null)}
              />
            ) : filteredProviders.length > 0 ? (
              <div className="space-y-4">
                {filteredProviders.map((provider) => (
                  <div
                    key={provider.id}
                    className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-xl hover:scale-[1.02] cursor-pointer ${
                      selectedProvider?.id === provider.id ? 'ring-2 ring-[#2563EB]' : ''
                    }`}
                    onClick={() => handleProviderSelect(provider)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar
                          src={provider.user.avatarUrl}
                          alt={provider.user.fullName}
                          fallback={provider.user.fullName}
                          size="lg"
                          showVerification={true}
                          isVerified={provider.verificationStatus === 'verified'}
                          showAvailability={true}
                          isAvailable={provider.isAvailable}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                              {provider.user.fullName}
                            </h3>
                            {(() => {
                              const IconComponent = getCategoryIcon(provider.category);
                              return <IconComponent className="w-6 h-6 text-[#14B8A6]" />;
                            })()}
                          </div>
                          
                          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium mb-2">
                            {getCategoryLabel(provider.category)}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{provider.locationCity}, {provider.locationState}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4" />
                              <span>{provider.yearsOfExperience} years exp</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span className={provider.isAvailable ? 'text-green-600' : 'text-orange-600'}>
                                {provider.isAvailable ? `Available - ${provider.estimatedArrival}` : 'Busy'}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center space-x-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {provider.ratingAverage.toFixed(1)}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                ({provider.ratingCount} reviews)
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-1">
                              <NairaIcon className="w-4 h-4 text-green-600" />
                              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                From {formatPrice(provider.startingPrice)}
                              </span>
                            </div>
                          </div>
                          
                          {provider.bio && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {provider.bio}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookProvider(provider);
                          }}
                          disabled={!provider.isAvailable}
                          className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all ${
                            provider.isAvailable
                              ? 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white hover:opacity-90 hover:scale-105 shadow-lg hover:shadow-xl'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          {provider.isAvailable ? 'Book Now' : 'Unavailable'}
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewProfile(provider);
                          }}
                          className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                        >
                          View Profile
                        </button>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactProvider(provider);
                          }}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm"
                        >
                          Contact
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <User className="mx-auto h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">No providers found</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Try adjusting your search criteria or check back later for new providers.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Profile Modal */}
      <ProviderProfileModal
        provider={profileProvider}
        isOpen={showProfileModal}
        onClose={handleCloseProfileModal}
        onBook={handleBookProvider}
        onContact={handleContactProvider}
      />
    </div>
  );
}
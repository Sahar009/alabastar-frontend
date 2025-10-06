"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Search, MapPin, Star, Filter, User, Award, Clock, Map, List,
  Wrench, Droplets, Zap as ZapIcon, Sparkles, Package, Snowflake, Hammer,
  Palette, Bug, Shirt, Square, Video, Sprout, Settings, Key, Sofa
} from "lucide-react";
import dynamic from "next/dynamic";
import { Provider } from "../../types/provider";
import Avatar from "../../components/Avatar";
import ProviderProfileModal from "../../components/ProviderProfileModal";
import { useAuth } from "../../contexts/AuthContext";
import { useProviders } from "../../hooks/useProviders";
import { providersService } from "../../services/providersService";

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

export default function ProvidersPageRedux() {
  const router = useRouter();
  const { user } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profileProvider, setProfileProvider] = useState<Provider | null>(null);

  // Use Redux hooks
  const {
    providers: filteredProviders,
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

  const categories = [
    { value: '', label: 'All Services', icon: Wrench },
    { value: 'plumbing', label: 'Plumbing', icon: Droplets },
    { value: 'electrical', label: 'Electrical', icon: ZapIcon },
    { value: 'cleaning', label: 'Cleaning', icon: Sparkles },
    { value: 'moving', label: 'Moving', icon: Package },
    { value: 'painting', label: 'Painting', icon: Palette },
    { value: 'gardening', label: 'Gardening', icon: Sprout },
    { value: 'carpentry', label: 'Carpentry', icon: Hammer },
    { value: 'hvac', label: 'HVAC', icon: Snowflake },
    { value: 'appliance', label: 'Appliance', icon: Settings },
    { value: 'handyman', label: 'Handyman', icon: Wrench },
    { value: 'fashion', label: 'Fashion', icon: Shirt },
    { value: 'photography', label: 'Photography', icon: Square },
    { value: 'videography', label: 'Videography', icon: Video },
    { value: 'pest_control', label: 'Pest Control', icon: Bug },
    { value: 'locksmith', label: 'Locksmith', icon: Key },
    { value: 'furniture', label: 'Furniture', icon: Sofa }
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
    { value: 'distance', label: 'Nearest First' },
    { value: 'name', label: 'Name A-Z' },
    { value: 'recent', label: 'Most Recent' }
  ];

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat ? cat.icon : Wrench;
  };

  // Event handlers
  const handleBookProvider = (provider: Provider) => {
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    console.log('Booking provider:', provider);
    alert(`Booking ${provider.user.fullName} - Coming Soon!`);
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

  // Load mock data if no providers are loaded
  if (!loading && filteredProviders.length === 0) {
    const mockProviders = providersService.generateMockProviders(20);
    // In a real app, this would be handled by Redux
    // For now, we'll show the mock data
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              Find Trusted Service Providers
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Book verified professionals for your home and business needs
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search services or providers..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Services</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <select
                value={selectedLocation}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
              >
                <option value="">All Locations</option>
                {locations.map((location) => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Additional Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleViewModeChange('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleViewModeChange('map')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'map'
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Map className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange({
                        priceRange: [parseInt(e.target.value) || 0, filters.priceRange[1]]
                      })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange({
                        priceRange: [filters.priceRange[0], parseInt(e.target.value) || 100000]
                      })}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => handleFilterChange({ rating: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={1}>1+ Stars</option>
                    <option value={2}>2+ Stars</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                </div>

                <div className="flex items-end gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.availability}
                      onChange={(e) => handleFilterChange({ availability: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                      Available Now
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verified}
                      onChange={(e) => handleFilterChange({ verified: e.target.checked })}
                      className="rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                    />
                    <span className="ml-2 text-sm text-slate-700 dark:text-slate-300">
                      Verified Only
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2563EB] mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading providers...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <button
              onClick={refreshProviders}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Try Again
            </button>
          </div>
        ) : filteredProviders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No providers found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={handleClearFilters}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {filteredProviders.length} Provider{filteredProviders.length !== 1 ? 's' : ''} Found
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {selectedCategory && `in ${categories.find(c => c.value === selectedCategory)?.label}`}
                  {selectedLocation && ` • ${locations.find(l => l.value === selectedLocation)?.label}`}
                </p>
              </div>
            </div>

            {/* Content */}
            {viewMode === 'list' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProviders.map((provider) => {
                  const CategoryIcon = getCategoryIcon(provider.category);
                  return (
                    <div
                      key={provider.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <Avatar
                              src={provider.user.avatarUrl}
                              name={provider.user.fullName}
                              size="lg"
                              isVerified={provider.isVerified}
                              isAvailable={provider.isAvailable}
                            />
                            <div>
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {provider.user.fullName}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {provider.businessName}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {provider.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              ({provider.reviewCount})
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <CategoryIcon className="w-4 h-4 text-[#2563EB]" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {providersService.getCategoryDisplayName(provider.category)}
                          </span>
                        </div>

                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
                          {provider.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            <NairaIcon className="w-4 h-4 text-green-600" />
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {providersService.formatPrice(provider.hourlyRate)}
                            </span>
                            <span className="text-sm text-slate-500 dark:text-slate-400">/hr</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                            <Clock className="w-4 h-4" />
                            <span>{provider.estimatedArrival}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewProfile(provider)}
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleBookProvider(provider)}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl hover:opacity-90 transition-opacity text-sm font-medium"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
                <ProviderMap
                  providers={filteredProviders}
                  onProviderSelect={handleViewProfile}
                />
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-slate-600 dark:text-slate-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Provider Profile Modal */}
      {showProfileModal && profileProvider && (
        <ProviderProfileModal
          provider={profileProvider}
          isOpen={showProfileModal}
          onClose={handleCloseProfileModal}
          onBook={handleBookProvider}
          onContact={handleContactProvider}
        />
      )}
    </div>
  );
}



















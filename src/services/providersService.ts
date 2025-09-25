import { Provider } from '../types/provider';

export interface SearchFilters {
  searchTerm: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  priceRange: [number, number];
  rating: number;
  availability: boolean;
  verified: boolean;
  sortBy: string;
  page: number;
  limit: number;
}

export interface ProviderSearchResult {
  providers: Provider[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export class ProvidersService {
  private static instance: ProvidersService;

  public static getInstance(): ProvidersService {
    if (!ProvidersService.instance) {
      ProvidersService.instance = new ProvidersService();
    }
    return ProvidersService.instance;
  }

  // Filter providers based on search criteria
  filterProviders(providers: Provider[], filters: Partial<SearchFilters>): Provider[] {
    let filtered = [...providers];

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(provider =>
        provider.user.fullName.toLowerCase().includes(searchTerm) ||
        provider.bio?.toLowerCase().includes(searchTerm) ||
        provider.subcategories?.some(subcategory => 
          subcategory.toLowerCase().includes(searchTerm)
        )
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(provider =>
        provider.category === filters.category
      );
    }

    // Location filter
    if (filters.location) {
      const location = filters.location.toLowerCase();
      filtered = filtered.filter(provider =>
        provider.locationCity?.toLowerCase().includes(location) ||
        provider.locationState?.toLowerCase().includes(location)
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(provider =>
        provider.hourlyRate >= minPrice && provider.hourlyRate <= maxPrice
      );
    }

    // Rating filter
    if (filters.rating && filters.rating > 0) {
      filtered = filtered.filter(provider =>
        provider.ratingAverage >= filters.rating!
      );
    }

    // Availability filter
    if (filters.availability) {
      filtered = filtered.filter(provider =>
        provider.isAvailable === true
      );
    }

    // Verified filter
    if (filters.verified) {
      filtered = filtered.filter(provider =>
        provider.verificationStatus === 'verified'
      );
    }

    return filtered;
  }

  // Sort providers based on criteria
  sortProviders(providers: Provider[], sortBy: string): Provider[] {
    const sorted = [...providers];

    switch (sortBy) {
      case 'rating':
        return sorted.sort((a, b) => b.ratingAverage - a.ratingAverage);
      case 'price_low':
        return sorted.sort((a, b) => a.hourlyRate - b.hourlyRate);
      case 'price_high':
        return sorted.sort((a, b) => b.hourlyRate - a.hourlyRate);
      case 'distance':
        return sorted.sort((a, b) => {
          if (a.distance && b.distance) {
            return a.distance - b.distance;
          }
          return 0;
        });
      case 'name':
        return sorted.sort((a, b) => 
          a.user.fullName.localeCompare(b.user.fullName)
        );
      case 'experience':
        return sorted.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
      default:
        return sorted;
    }
  }

  // Calculate distance between two coordinates
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Add distance to providers if user location is available
  addDistanceToProviders(
    providers: Provider[],
    userLat?: number,
    userLon?: number
  ): Provider[] {
    if (!userLat || !userLon) {
      return providers;
    }

    return providers.map(provider => ({
      ...provider,
      distance: this.calculateDistance(
        userLat,
        userLon,
        provider.latitude,
        provider.longitude
      )
    }));
  }

  // Generate mock providers for testing
  generateMockProviders(count: number = 10): Provider[] {
    const categories = [
      'plumbing', 'electrical', 'cleaning', 'moving', 'painting',
      'gardening', 'carpentry', 'hvac', 'appliance', 'handyman'
    ];

    const names = [
      'John Smith', 'Sarah Johnson', 'Mike Wilson', 'Lisa Brown',
      'David Davis', 'Emma Miller', 'Chris Anderson', 'Amy Taylor',
      'James Thomas', 'Jessica Garcia', 'Robert Martinez', 'Ashley Robinson'
    ];

    const cities = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'];
    const states = ['Lagos', 'FCT', 'Rivers', 'Kano', 'Oyo'];

    return Array.from({ length: count }, (_, index) => ({
      id: `provider-${index + 1}`,
      user: {
        id: `user-${index + 1}`,
        fullName: names[index % names.length],
        email: `provider${index + 1}@example.com`,
        phone: `+234${800000000 + index}`,
        avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + index}?w=100&h=100&fit=crop&crop=face`
      },
      businessName: `${names[index % names.length]} Services`,
      category: categories[index % categories.length],
      description: `Professional ${categories[index % categories.length]} services with ${5 + (index % 5)} years of experience.`,
      rating: 3.5 + (index % 3),
      reviewCount: 10 + (index % 50),
      hourlyRate: 2000 + (index * 500),
      isAvailable: Math.random() > 0.3,
      isVerified: Math.random() > 0.4,
      city: cities[index % cities.length],
      state: states[index % states.length],
      address: `${100 + index} Service Street`,
      latitude: 6.5244 + (Math.random() - 0.5) * 0.1,
      longitude: 3.3792 + (Math.random() - 0.5) * 0.1,
      services: [
        categories[index % categories.length],
        categories[(index + 1) % categories.length]
      ],
      photos: [
        `https://images.unsplash.com/photo-${1600000000000 + index}?w=400&h=300&fit=crop`,
        `https://images.unsplash.com/photo-${1600000000001 + index}?w=400&h=300&fit=crop`
      ],
      estimatedArrival: `${15 + (index % 30)} mins`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }));
  }

  // Format price for display
  formatPrice(amount: number, currency: string = 'NGN'): string {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format distance for display
  formatDistance(distance: number): string {
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    }
    return `${distance.toFixed(1)}km`;
  }

  // Get category display name
  getCategoryDisplayName(category: string): string {
    const categoryMap: Record<string, string> = {
      plumbing: 'Plumbing',
      electrical: 'Electrical',
      cleaning: 'Cleaning',
      moving: 'Moving',
      painting: 'Painting',
      gardening: 'Gardening',
      carpentry: 'Carpentry',
      hvac: 'HVAC',
      appliance: 'Appliance Repair',
      handyman: 'Handyman',
    };
    return categoryMap[category] || category;
  }
}

export const providersService = ProvidersService.getInstance();

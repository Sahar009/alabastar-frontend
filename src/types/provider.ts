export interface Provider {
  id: string;
  providerUserId?: string;
  user: {
    id?: string;
    fullName: string;
    email: string;
    phone: string;
    alternativePhone?: string;
    avatarUrl?: string;
  };
  businessName?: string;
  category: string;
  subcategories: string[];
  yearsOfExperience: number;
  bio: string;
  hourlyRate: number;
  startingPrice: number;
  locationCity: string;
  locationState: string;
  latitude?: number;
  longitude?: number;
  ratingAverage: number;
  ratingCount: number;
  verificationStatus: string;
  isAvailable: boolean;
  estimatedArrival: string;
  brandImages?: any[];
  isTopListed?: boolean;
  daysRemaining?: number;
}



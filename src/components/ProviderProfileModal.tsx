"use client";
import { useState, useEffect } from "react";
import { X, Star, MapPin, Clock, Phone, Mail, MessageCircle, Heart, Share2, Shield, Award, Calendar, Zap } from "lucide-react";
import { Provider } from "../types/provider";
import Avatar from "./Avatar";

// Custom Naira symbol component
const NairaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2v-2zm0 4h2v6h-2v-6zm0 8h2v2h-2v-2z"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">₦</text>
  </svg>
);

interface ProviderProfileModalProps {
  provider: Provider | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (provider: Provider) => void;
  onContact: (provider: Provider) => void;
}

type Review = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  service: string;
};

// Mock reviews data
const generateMockReviews = (): Review[] => [
  {
    id: '1',
    userName: 'Sarah Johnson',
    userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    comment: 'Excellent work! Very professional and completed the job ahead of schedule. Highly recommended.',
    date: '2 days ago',
    service: 'Pipe Repair'
  },
  {
    id: '2',
    userName: 'Michael Brown',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    rating: 4,
    comment: 'Good service, arrived on time and fixed the issue. Would use again.',
    date: '1 week ago',
    service: 'Drain Cleaning'
  },
  {
    id: '3',
    userName: 'Emily Davis',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    rating: 5,
    comment: 'Outstanding work! Very clean and professional. The quality exceeded my expectations.',
    date: '2 weeks ago',
    service: 'Water Heater Installation'
  }
];

// Mock portfolio images
const generateMockPortfolio = () => [
  'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=400&h=300&fit=crop'
];

export default function ProviderProfileModal({ provider, isOpen, onClose, onBook, onContact }: ProviderProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch provider details when modal opens
  useEffect(() => {
    if (isOpen && provider) {
      fetchProviderDetails();
    }
  }, [isOpen, provider]);

  const fetchProviderDetails = async () => {
    if (!provider) return;
    
    setLoading(true);
    try {
      // Try to fetch real data from API
      // Normalize API base
      const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const base = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
      
      // Fetch reviews
      try {
        const reviewsResponse = await fetch(`${base}/providers/${provider.id}/reviews`);
        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData.data?.reviews || generateMockReviews());
        } else {
          setReviews(generateMockReviews());
        }
      } catch (error) {
        console.log('Using mock reviews:', error);
        setReviews(generateMockReviews());
      }

      // Fetch portfolio images
      try {
        const portfolioResponse = await fetch(`${base}/providers/${provider.id}/portfolio`);
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          setPortfolioImages(portfolioData.data?.images || generateMockPortfolio());
        } else {
          setPortfolioImages(generateMockPortfolio());
        }
      } catch (error) {
        console.log('Using mock portfolio:', error);
        setPortfolioImages(generateMockPortfolio());
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setReviews(generateMockReviews());
      setPortfolioImages(generateMockPortfolio());
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !provider) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const getCategoryLabel = (category: string) => {
    const categories = [
      { value: 'plumbing', label: 'Plumbing' },
      { value: 'electrical', label: 'Electrical' },
      { value: 'cleaning', label: 'Cleaning' },
      { value: 'moving', label: 'Moving' },
      { value: 'ac_repair', label: 'AC Repair' },
      { value: 'carpentry', label: 'Carpentry' },
      { value: 'painting', label: 'Painting' },
      { value: 'pest_control', label: 'Pest Control' },
      { value: 'laundry', label: 'Laundry' },
      { value: 'tiling', label: 'Tiling' },
      { value: 'cctv', label: 'CCTV' },
      { value: 'gardening', label: 'Gardening' },
      { value: 'appliance_repair', label: 'Appliance Repair' },
      { value: 'locksmith', label: 'Locksmith' },
      { value: 'carpet_cleaning', label: 'Carpet Cleaning' }
    ];
    
    const cat = categories.find(c => c.value === category);
    return cat ? cat.label : category;
  };


  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
              <Avatar
                src={provider.user.avatarUrl}
                alt={provider.user.fullName}
                fallback={provider.user.fullName}
                size="xl"
                showVerification={true}
                isVerified={provider.verificationStatus === 'verified'}
                showAvailability={true}
                isAvailable={provider.isAvailable}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
                    {provider.user.fullName}
                  </h2>
                  {provider.verificationStatus === 'verified' && (
                    <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-900/20 px-2 py-1 rounded-full w-fit">
                      <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
                    </div>
                  )}
                </div>
                
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 mb-2">
                  {getCategoryLabel(provider.category)} • {provider.yearsOfExperience} years experience
                </p>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="truncate">{provider.locationCity}, {provider.locationState}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className={provider.isAvailable ? 'text-green-600' : 'text-orange-600'}>
                      {provider.isAvailable ? `Available - ${provider.estimatedArrival}` : 'Busy'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-col gap-2 sm:gap-2 w-full sm:w-auto">
              <button
                onClick={() => onBook(provider)}
                disabled={!provider.isAvailable}
                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto ${
                  provider.isAvailable
                    ? 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white hover:opacity-90 hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                }`}
              >
                {provider.isAvailable ? 'Book Now' : 'Unavailable'}
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={() => onContact(provider)}
                  className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center">
                  <Heart className="w-4 h-4" />
                </button>
                <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'portfolio', label: 'Portfolio' },
            { id: 'reviews', label: `Reviews (${reviews.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'overview' | 'portfolio' | 'reviews')}
              className={`px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? 'text-[#2563EB] border-b-2 border-[#2563EB]'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Bio */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">About</h3>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                  {provider.bio}
                </p>
              </div>

              {/* Services */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.subcategories.map((service, index) => (
                    <span
                      key={index}
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-[#2563EB]/10 to-[#14B8A6]/10 text-[#2563EB] text-xs sm:text-sm font-medium rounded-full border border-[#2563EB]/20"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Pricing</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-1">
                      <NairaIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Starting Price</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(provider.startingPrice)}
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-xl">
                    <div className="flex items-center space-x-2 mb-1">
                      <NairaIcon className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">Hourly Rate</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {formatPrice(provider.hourlyRate)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{provider.user.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                    <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                    <span className="text-xs sm:text-sm truncate">{provider.user.email}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 sm:mb-4">Portfolio</h3>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-24 sm:h-32 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : portfolioImages.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {portfolioImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group cursor-pointer"
                    >
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-xl hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-xl flex items-center justify-center">
                        <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm font-medium">
                          View
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Calendar className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">No portfolio images available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {provider.ratingAverage.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    ({provider.ratingCount} reviews)
                  </span>
                </div>
              </div>

              {loading ? (
                <div className="space-y-3 sm:space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-xl animate-pulse">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-200 dark:bg-slate-600 rounded-full"></div>
                        <div className="flex-1">
                          <div className="h-3 sm:h-4 bg-slate-200 dark:bg-slate-600 rounded w-1/4 mb-2"></div>
                          <div className="h-2 sm:h-3 bg-slate-200 dark:bg-slate-600 rounded w-1/2 mb-2"></div>
                          <div className="h-2 sm:h-3 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-slate-50 dark:bg-slate-700 p-3 sm:p-4 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <img
                          src={review.userAvatar}
                          alt={review.userName}
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <h4 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate">
                              {review.userName}
                            </h4>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {review.service} • {review.date}
                          </p>
                          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Star className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-slate-400 mb-3 sm:mb-4" />
                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">No reviews yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

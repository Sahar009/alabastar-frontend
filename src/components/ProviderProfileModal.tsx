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

// Mock product/service images
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
    
    console.log('Provider object:', provider);
    console.log('Provider brandImages:', provider.brandImages);
    
    setLoading(true);
    try {
      // Try to fetch real data from API
      // Normalize API base
      const raw = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const base = raw.endsWith('/api') ? raw : `${raw.replace(/\/$/, '')}/api`;
      console.log('API base URL:', base);
      
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

      // Fetch brand images
      try {
        console.log('Fetching brand images for provider:', provider.id);
        const brandImagesUrl = `${base}/providers/${provider.id}/documents?type=brand_image`;
        console.log('Brand images URL:', brandImagesUrl);
        const brandImagesResponse = await fetch(brandImagesUrl);
        console.log('Brand images response status:', brandImagesResponse.status);
        
        if (brandImagesResponse.ok) {
          const brandImagesData = await brandImagesResponse.json();
          console.log('Brand images data:', brandImagesData);
          const brandImages = brandImagesData.data?.documents || [];
          console.log('Brand images array:', brandImages);
          
          if (brandImages.length > 0) {
            const imageUrls = brandImages.map((doc: any) => doc.url);
            console.log('Setting portfolio images to:', imageUrls);
            setPortfolioImages(imageUrls);
          } else {
            console.log('No brand images from API, trying provider data');
            // Try to get brand images from provider data if available
            if (provider.brandImages && provider.brandImages.length > 0) {
              console.log('Using provider brand images:', provider.brandImages);
              setPortfolioImages(provider.brandImages.map((img: any) => img.url || img));
            } else {
              console.log('Using mock images');
              setPortfolioImages(generateMockPortfolio());
            }
          }
        } else {
          console.log('API request failed, status:', brandImagesResponse.status);
          // Fallback to provider's brand images if API fails
          if (provider.brandImages && provider.brandImages.length > 0) {
            console.log('Using provider brand images as fallback:', provider.brandImages);
            setPortfolioImages(provider.brandImages.map((img: any) => img.url || img));
          } else {
            console.log('Using mock images as fallback');
            setPortfolioImages(generateMockPortfolio());
          }
        }
      } catch (error) {
        console.log('Error fetching brand images:', error);
        // Fallback to provider's brand images if API fails
        if (provider.brandImages && provider.brandImages.length > 0) {
          console.log('Using provider brand images after error:', provider.brandImages);
          setPortfolioImages(provider.brandImages.map((img: any) => img.url || img));
        } else {
          console.log('Using mock images after error');
          setPortfolioImages(generateMockPortfolio());
        }
      }
    } catch (error) {
      console.error('Error fetching provider details:', error);
      setReviews(generateMockReviews());
      setPortfolioImages(generateMockPortfolio());
    } finally {
      setLoading(false);
      
      // Temporary test - if no images found, try to use provider's brand images directly
      if (portfolioImages.length === 0 && provider.brandImages && provider.brandImages.length > 0) {
        console.log('No images in portfolioImages, trying direct provider brand images');
        const directImages = provider.brandImages.map((img: any) => img.url || img);
        console.log('Direct images:', directImages);
        setPortfolioImages(directImages);
      }
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
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Section - Avatar and Basic Info */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 flex-1">
              <Avatar
                src={provider.brandImages && provider.brandImages.length > 0 ? (provider.brandImages[0].url || provider.brandImages[0]) : (provider.user.avatarUrl || '')}
                alt={provider.businessName || provider.user.fullName}
                fallback={provider.businessName || provider.user.fullName}
                size="xl"
                showVerification={true}
                isVerified={provider.verificationStatus === 'verified'}
                showAvailability={true}
                isAvailable={provider.isAvailable}
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <div className="flex flex-col">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 truncate">
                      {provider.businessName || 'Business Name'}
                    </h2>
                    {provider.user?.fullName && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        by {provider.user.fullName}
                      </p>
                    )}
                  </div>
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
            
            {/* Right Section - Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-2 sm:gap-2 w-full sm:w-auto lg:w-auto">
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

        {/* Brand Images Preview Section */}
        {provider.brandImages && provider.brandImages.length > 0 && (
          <div className="px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full animate-pulse"></div>
              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Brand Portfolio</h3>
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {provider.brandImages.slice(0, 4).map((image, index) => (
                <div
                  key={index}
                  className="relative group"
                >
                  <div className="w-full h-16 sm:h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <img
                      src={image.url || image}
                      alt={`Brand Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#2563EB]/0 to-[#14B8A6]/0 group-hover:from-[#2563EB]/20 group-hover:to-[#14B8A6]/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
                      <div className="w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* More indicator */}
              {provider.brandImages.length > 4 && (
                <div 
                  className="w-full h-16 sm:h-20 rounded-lg bg-gradient-to-br from-[#2563EB]/10 to-[#14B8A6]/10 dark:from-[#2563EB]/20 dark:to-[#14B8A6]/20 border border-[#2563EB]/30 dark:border-[#14B8A6]/30 shadow-md flex items-center justify-center group hover:scale-105 transition-all duration-300"
                >
                  <div className="text-center">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-1">
                      <span className="text-white font-bold text-xs">+</span>
                    </div>
                    <span className="text-xs font-bold text-[#2563EB] dark:text-[#14B8A6]">{provider.brandImages.length - 4} more</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-[60vh]">
          <div className="space-y-4 sm:space-y-6">
            {/* Bio */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 sm:mb-3">About</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                {provider.bio}
              </p>
            </div>

            {/* Brand Images - Using same logic from providers page */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full animate-pulse"></div>
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">Brand Images</h3>
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
                          <div className="w-full h-20 sm:h-24 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group/image">
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
                        <div className="w-full h-20 sm:h-24 rounded-xl bg-gradient-to-br from-[#2563EB]/10 to-[#14B8A6]/10 dark:from-[#2563EB]/20 dark:to-[#14B8A6]/20 border border-[#2563EB]/30 dark:border-[#14B8A6]/30 shadow-lg flex items-center justify-center group cursor-pointer hover:scale-105 transition-all duration-300">
                          <div className="text-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full flex items-center justify-center mx-auto mb-1">
                              <span className="text-white font-bold text-sm">+</span>
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

            {/* Reviews Section */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                <h3 className="text-base sm:text-lg font-semibold text-slate-900 dark:text-slate-100">Reviews</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-current flex-shrink-0" />
                    <span className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {Number(provider.ratingAverage || 0).toFixed(1)}
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
          </div>
        </div>
      </div>
    </div>
  );
}

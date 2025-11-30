"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { JSX } from "react";
import { Wrench, Zap, Truck, Fan, Hammer, PaintRoller, Bug, Shirt, Ruler, Camera, Layers, Search, ShieldCheck, Star, Apple, Play, Users, Settings, MapPin, ArrowRight, CheckCircle, UserPlus, Navigation, Cog, Pill, Store, GraduationCap, Home, Scale, Bed } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FAQComponent from "@/components/FAQ";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import BookingStatusModal from "@/components/BookingStatusModal";

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  
  // Search and location state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [userLocation, setUserLocation] = useState<{
    address: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Booking status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [bookingForStatus, setBookingForStatus] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);

  // Auto-detect user location on component mount
  useEffect(() => {
    detectUserLocation();
  }, []);

  // Fetch bookings and auto-open modal for authenticated users with active bookings
  useEffect(() => {
    if (!user || user.role === 'provider' || showStatusModal) return;

    const fetchBookings = async () => {
      setIsLoadingBookings(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/bookings?userType=customer`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) return;

        const data = await response.json();
        const bookingList = Array.isArray(data?.data) ? data?.data : data?.data?.bookings || [];
        
        setBookings(bookingList);

        // Find active bookings
        const activeBookings = bookingList.filter((booking: any) => 
          booking.status === 'requested' || 
          booking.status === 'accepted' || 
          booking.status === 'in_progress'
        );

        // Auto-open modal for most recent active booking
        if (activeBookings.length > 0 && !bookingForStatus) {
          const mostRecentBooking = activeBookings.sort((a: any, b: any) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];
          
          setBookingForStatus(mostRecentBooking);
          setShowStatusModal(true);
        }
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoadingBookings(false);
      }
    };

    fetchBookings();
  }, [user, showStatusModal, bookingForStatus]);

  const handleStatusUpdate = () => {
    // Refetch bookings
    setBookings([]);
    setBookingForStatus(null);
    setShowStatusModal(false);
  };

  // Handle scroll for pagination
  useEffect(() => {
    const container = document.getElementById('popular-services-scroll');
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const cardWidth = 280; // w-64 + gap-6 = 256px + 24px
      const currentPage = Math.round(scrollLeft / cardWidth);
      setCurrentPage(currentPage);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const detectUserLocation = async () => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by this browser.');
      return;
    }

    setIsDetectingLocation(true);
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
          longitude
        });
      } catch (error) {
        console.error('Reverse geocoding failed:', error);
        setUserLocation({
          address: 'Current Location',
          city: 'Unknown City',
          state: 'Unknown State',
          latitude,
          longitude
        });
      }
    } catch (error) {
      console.error('Geolocation failed:', error);
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSearch = () => {
    if (!searchQuery.trim() && !selectedCategory) {
      toast.error("Please enter a search term or select a service category");
      return;
    }

    // Build search parameters
    const searchParams = new URLSearchParams();
    
    if (searchQuery.trim()) {
      searchParams.append('search', searchQuery.trim());
    }
    
    if (selectedCategory) {
      searchParams.append('category', selectedCategory);
    }
    
    if (userLocation) {
      searchParams.append('location', userLocation.city);
      searchParams.append('lat', userLocation.latitude.toString());
      searchParams.append('lng', userLocation.longitude.toString());
      searchParams.append('address', userLocation.address);
    }

    // Navigate to providers page with search parameters
    const queryString = searchParams.toString();
    router.push(`/providers?${queryString}`);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search query when category is selected
    
    // Navigate to providers page with selected category
    const searchParams = new URLSearchParams();
    searchParams.append('category', category);
    
    if (userLocation) {
      searchParams.append('location', userLocation.city);
      searchParams.append('lat', userLocation.latitude.toString());
      searchParams.append('lng', userLocation.longitude.toString());
      searchParams.append('address', userLocation.address);
    }

    const queryString = searchParams.toString();
    router.push(`/providers?${queryString}`);
  };

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${base}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      const msg = data?.message || (res.ok ? "Subscribed!" : "Subscription failed");
      setStatus(msg);
      if (res.ok) {
        toast.success(msg);
        setEmail("");
      } else {
        toast.error(msg);
      }
    } catch {
      setStatus("Failed");
      toast.error("Network error. Please try again.");
    }
  };

  // Hero carousel assets (replace with real screenshots later)
  const heroImages = [
    "/images/plumber.png",
    "/images/mechanic.png",
    "/images/painter.png",
    "/images/bakery.png",
    "/images/carpenter.png",
    "/images/gardener.png"
  ];

  const heroImages2 = [ 
    "/images/apply.png",
  
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [bgActiveIdx, setBgActiveIdx] = useState(0);
  
  // Background images for slider
  const backgroundImages = [
    "/images/slider14.png",
    "/images/slider3.jpg", 
    "/images/slider13.png",
    "/images/slider15.png",
    "/images/slider6.jpg",
    "/images/slider17.png",
    "/images/slider18.png",
    "/images/slider16.png"
  ];

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % heroImages.length), 3000);
    return () => clearInterval(id);
  }, [heroImages.length]);

  useEffect(() => {
    const id = setInterval(() => setBgActiveIdx((i) => (i + 1) % backgroundImages.length), 4000);
    return () => clearInterval(id);
  }, [backgroundImages.length]);

  // Trusted by avatars (replace with real users/customers)
  const trustedAvatars = [
    'https://images.unsplash.com/photo-1611432579402-7037e3e2c1e4?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmxhY2slMjB3b21hbnxlbnwwfHwwfHx8MA%3D%3D',
    'https://images.unsplash.com/photo-1694463814421-5eff6fd605c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YmxhY2slMjB1c2VyfGVufDB8fDB8fHww',
    'https://images.unsplash.com/photo-1507152927179-bc4ebfef7103?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGJsYWNrJTIwd29tYW58ZW58MHx8MHx8fDA%3D',
    'https://orchidhotels.com/wp-content/uploads/2021/03/ORCHID-HOTELS-LOGO-EN.svg',
    'https://images.unsplash.com/photo-1565884280295-98eb83e41c65?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmxhY2slMjBtYW58ZW58MHx8MHx8fDA%3D'
  ];

  // Border palettes that switch when image changes
  const borderPalettes: [string, string][] = [
    ["#2563EB", "#14B8A6"],
    ["#a855f7", "#22d3ee"],
    ["#ef4444", "#f59e0b"],
    ["#0ea5e9", "#22c55e"],
    ["#f472b6", "#8b5cf6"],
    ["#06b6d4", "#10b981"],
  ];
  const [c1, c2] = borderPalettes[activeIdx % borderPalettes.length];

  // Titles and descriptions aligned with hero images
  const heroTitles = [
    "Plumbing on demand",
    "Instant booking",
    "Verified providers",
    "Top reviews",
    "Fast support",
    "Quality service"
  ];
  const heroDescriptions = [
    "Fix leaks, install heaters, and more with trusted plumbers near you.",
    "Book in seconds. Real-time scheduling that works around you.",
    "Secure payments with verified providers you can trust.",
    "Every pro is verified with documents and continuous performance checks.",
    "Hire confidently with transparent ratings and real customer feedback.",
    "We're here 24/7. Get help whenever you need it."
  ];

  // Marquee categories with images
  const categories: { label: string; image: string }[] = [
    { label: 'Plumbing', image: '/images/plumber2d.png' },
    { label: 'Electrical', image: '/images/cctv2d.png' },
    { label: 'Cleaning', image: '/images/cleaner2d.png' },
    { label: 'Moving', image: '/images/mover2d.png' },
    { label: 'AC Repair', image: '/images/ac2d.png' },
    { label: 'Carpentry', image: '/images/carpenter2d.png' },
    { label: 'Painting', image: '/images/paint2d.png' },
    { label: 'Pest Control', image: '/images/pest2d.png' },
    { label: 'Laundry', image: '/images/laundry2d.png' },
    { label: 'Tiling', image: '/images/tiler2d.png' },
    { label: 'CCTV', image: '/images/cctv2d.png' },
    { label: 'Gardening', image: '/images/gardener2d.png' },
    { label: 'Bakery', image: '/images/baker2d.png' },
    { label: 'Mechanic', image: '/images/mechanic2d.png' },
  ];

  const StepChip = ({ icon, label }: { icon: JSX.Element; label: string }) => (
    <div className="orbit-marker flex items-center gap-2 rounded-full bg-white/80 dark:bg-slate-900/70 border border-white/30 dark:border-white/10 backdrop-blur-xl px-3 py-2 shadow">
      {icon}
      <span className="text-xs font-semibold not-italic text-slate-800 dark:text-slate-100">{label}</span>
    </div>
  );

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 md:pt-32 lg:pt-40 min-h-screen flex items-center">
        {/* Background image slider with fade effect */}
        <div className="absolute inset-0">
          {backgroundImages.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt="Background"
              fill
              priority={i === 0}
              className={`object-cover object-center transition-opacity duration-1000 ${
                i === bgActiveIdx ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
          ))}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        {/* Subtle tech overlay - Hidden on mobile, visible on larger screens */}
        <div className="absolute inset-0 opacity-10 hidden lg:block">
          <div className="absolute top-20 left-20 text-white/20 font-mono text-xs">
            {`const services = {
  plumbing: "24/7",
  electrical: "certified", 
  cleaning: "eco-friendly",
  carpentry: "skilled"
}`}
          </div>
          <div className="absolute bottom-32 right-32 text-white/20 font-mono text-xs">
            {`function bookService() {
  return "instant booking";
}`}
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12 lg:py-12">
          <div className="max-w-5xl">
            {/* Main heading - Responsive typography */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold leading-tight text-white mb-4 sm:mb-6">
              <span className="block">Connect with</span>
              <span className="block">trusted business owners,</span>
              <span className="block">retail shops, and service providers
              </span>
            </h1>
            
            {/* Subtitle - Responsive text */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
            Book skilled professionals, merchants, and artisans for all your needs. 
              Secure payments, verified providers, instant booking.
            </p>

            {/* Search bar - Responsive design */}
            <div className="mb-6 sm:mb-8 w-full max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for services or providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded-xl bg-white/90 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-16 text-sm sm:text-base lg:text-lg outline-none focus:ring-2 focus:ring-white/50 shadow-lg"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isDetectingLocation}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 rounded-lg p-2 sm:p-3 transition-colors"
                >
                  {isDetectingLocation ? (
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Search size={16} className="sm:w-5 sm:h-5 text-white" />
                  )}
                </button>
              </div>
              
              {/* Location indicator - Responsive */}
              {userLocation && (
                <div className="mt-2 flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                  <MapPin size={14} className="sm:w-4 sm:h-4" />
                  <span className="truncate">Searching near: {userLocation.address}</span>
                </div>
              )}
            </div>

            {/* Service category buttons - Horizontal scroll on mobile */}
            <div className="mb-6  sm:mb-8">
              <div className="flex sm:flex-wrap gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide pt-3">
              <button 
                onClick={() => handleCategorySelect('pharmacy')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'pharmacy' 
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:bg-orange-500 text-white'
                }`}
              >
                <span>Pharmacy</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => handleCategorySelect('schools')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'schools' 
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:bg-orange-500 text-white'
                }`}
              >
                <span>Schools</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => handleCategorySelect('Retail stores')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'Retail stores' 
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:bg-orange-500 text-white'
                }`}
              >
                <span>Retail stores</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => handleCategorySelect('Estate')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'Estate' 
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:bg-orange-500 text-white'
                }`}
              >
                <span>Estate Agents</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                  onClick={() => handleCategorySelect('lesson teacher')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 relative ${
                    selectedCategory === 'Lesson Teacher' 
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white' 
                    : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:bg-orange-500 text-white'
                }`}
              >
                  <span>Lesson Teacher</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 sm:px-2 py-0.5 rounded-full">NEW</span>
              </button>
              </div>
            </div>

            {/* Action buttons - Responsive layout */}
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link 
                href="/providers" 
                className="group flex-1 sm:flex-none rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 text-white font-semibold hover:bg-white/30 hover:border-white/50 hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                <span>Book a Provider</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link 
                href="/become-provider" 
                className="group flex-1 sm:flex-none rounded-xl border-2 border-white/30 bg-white/20 backdrop-blur-xl px-4 sm:px-6 py-3 sm:py-4 text-white font-semibold hover:bg-white/30 hover:border-white/50 hover:scale-105 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Become a Provider</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

            {/* Trusted by section - Responsive */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex -space-x-2 sm:-space-x-3">
                {trustedAvatars.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt="trusted user"
                    width={32}
                    height={32}
                    className="h-6 w-6 sm:h-8 sm:w-8 lg:h-9 lg:w-9 rounded-full ring-2 ring-white/80 dark:ring-slate-800 animate-float object-cover"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-white/80 text-center sm:text-left">Trusted by 10,000+ homeowners and businesses</p>
            </div>
          </div>
        </div>

        {/* Background slider indicators - Responsive */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2">
          {backgroundImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setBgActiveIdx(i)}
              className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                i === bgActiveIdx ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

   
      {/* Most Popular Services Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Most Popular Categories
            </h2>
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
              <ArrowRight size={12} className="text-white rotate-45" />
            </div>
          </div>
          <Link href="/providers" className="flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200 group">
            View All
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors duration-200">
              <ArrowRight size={12} className="text-white" />
            </div>
          </Link>
        </div>

        {/* Services Scroll Container */}
        <div className="relative">
          {/* Scrollable Services */}
          <div 
            id="popular-services-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {/* Pharmacy */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Pharmacy')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/40 to-pink-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/pharmacy.jpg"
                  alt="Pharmacy"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Pill className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Pharmacy
                </h3>
              </div>
            </div>

            {/* Legal */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Legal')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 to-indigo-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/legal.jpg"
                  alt="Legal"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Scale className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Legal
                </h3>
              </div>
            </div>

            {/* Carpentry */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Carpentry')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/40 to-orange-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/carpenter.png"
                  alt="Carpentry"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Hammer className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Carpentry
                </h3>
              </div>
            </div>

            {/* Schools */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Schools')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/40 to-emerald-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/school.jpg"
                  alt="Schools"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Schools
                </h3>
              </div>
            </div>

            {/* Plumber */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Plumber')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-orange-500/40 to-orange-600/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/plumber.png"
                  alt="Plumber"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Plumber
                </h3>
              </div>
            </div>

            {/* Hotel and Lounges */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Hotel and Lounges')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/40 to-pink-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/hotel.jpg"
                  alt="Hotel and Lounges"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Bed className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Hotel & Lounges
                </h3>
              </div>
            </div>

            {/* Electrician */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Electrician')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/40 to-orange-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/slider6.jpg"
                  alt="Electrician"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Electrician
                </h3>
              </div>
            </div>

            {/* Retail Stores */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Retail Stores')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-teal-500/40 to-cyan-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/slider3.jpg"
                  alt="Retail Stores"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Retail Stores
                </h3>
              </div>
            </div>

            {/* Painter */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Painter')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/40 to-purple-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/painter.jpg"
                  alt="Painter"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <PaintRoller className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Painter
                </h3>
              </div>
            </div>

            {/* Estate Agency */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Estate Agency')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/40 to-blue-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/astateagent.jpg"
                  alt="Estate Agency"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Home className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Estate Agency
                </h3>
              </div>
            </div>

            {/* Tutor */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Tutor')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-green-500/40 to-teal-500/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/slider2.jpg"
                  alt="Tutor"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Tutor
                </h3>
              </div>
            </div>

            {/* Mechanic */}
            <div className="group cursor-pointer relative overflow-hidden rounded-2xl h-64 w-64 flex-shrink-0 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                 onClick={() => handleCategorySelect('Mechanic')}
                 style={{ scrollSnapAlign: 'start' }}>
              <div className="absolute inset-0 bg-gradient-to-b from-gray-600/40 to-gray-700/40"></div>
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/8 transition-all duration-300"></div>
              
              {/* Background Image */}
              <div className="absolute inset-0 opacity-60">
                <Image
                  src="/images/mechanic.png"
                  alt="Mechanic"
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Cog className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-wide">
                  Mechanic
                </h3>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Left Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('popular-services-scroll');
                if (container) {
                  container.scrollBy({ left: -280, behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200">
              <ArrowRight size={20} className="text-slate-600 dark:text-slate-300 rotate-180" />
            </button>

            {/* Pagination Dots */}
            <div className="flex items-center gap-2">
              {[0, 1, 2].map((page) => (
                <div
                  key={page}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === page
                      ? 'bg-orange-500 scale-110'
                      : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500'
                  }`}
                  onClick={() => {
                    const container = document.getElementById('popular-services-scroll');
                    if (container) {
                      container.scrollTo({ left: page * 280, behavior: 'smooth' });
                    }
                  }}
                />
              ))}
            </div>
            
            {/* Right Arrow */}
            <button 
              onClick={() => {
                const container = document.getElementById('popular-services-scroll');
                if (container) {
                  container.scrollBy({ left: 280, behavior: 'smooth' });
                }
              }}
              className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200">
              <ArrowRight size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      </section>

      {/* How do we serve our customers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 text-center mb-16">
          How do we serve our customers
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Professional services directly from verified providers */}
       
        </div>

        {/* Full width comprehensive solutions section */}
        <div className="relative overflow-hidden rounded-3xl h-[500px] group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/mechanic.png"
              alt="Comprehensive solutions"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/70 to-blue-800/80 group-hover:from-purple-600/60 group-hover:to-blue-800/70 transition-all duration-500" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
          
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-12 left-16 w-32 h-32 bg-purple-400 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-16 right-24 w-24 h-24 bg-blue-500 rounded-full blur-xl animate-bounce" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-indigo-300 rounded-full blur-3xl animate-ping" />
          </div>
          
          <div className="relative h-full p-6 flex flex-col justify-between">
            {/* Top section - Icon and Title */}
            <div className="flex-1 flex flex-col justify-center items-center">
              {/* Icon */}
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-white/10 rounded-full blur-xl animate-pulse"></div>
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-md"></div>
                  <div className="relative bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md rounded-full p-4 border border-white/40 shadow-lg">
                    <Layers className="w-8 h-8 text-white drop-shadow-lg" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -inset-1 bg-white/10 rounded-full blur-sm animate-ping opacity-75"></div>
                </div>
              </div>
              
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 leading-tight text-center">
                Complete solutions
                <br />
                for every need
              </h3>
              <p className="text-white/90 text-sm sm:text-base mb-4 text-center max-w-xl mx-auto leading-relaxed">
              From daily consumables to professional services, Alabastar connects you with reliable businesses and verified providers offering desired products and services whenever and wherever needed
              </p>
            </div>
            
            {/* Middle section - Feature highlights */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-white text-xs font-medium">24/7 Support</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-white text-xs font-medium">Quality Guaranteed</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-white text-xs font-medium">Secure Payments</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                <span className="text-white text-xs font-medium">Instant Booking</span>
              </div>
            </div>
            
            {/* Bottom section - Hover arrow and App buttons */}
            <div className="flex flex-col items-center">
              {/* Hover arrow */}
              <div className="flex justify-center mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight className="w-5 h-5 text-white animate-pulse" />
              </div>
              
              {/* App store buttons */}
              <div className="flex gap-3 justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                      <Apple className="w-4 h-4 text-black" />
                    </div>
                    <div className="text-white">
                      <div className="text-xs">Download on the</div>
                      <div className="text-xs font-semibold">App Store</div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                      <Play className="w-4 h-4 text-black" />
                    </div>
                    <div className="text-white">
                      <div className="text-xs">Get it on</div>
                      <div className="text-xs font-semibold">Google Play</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full blur-sm animate-pulse" />
          <div className="absolute bottom-6 left-6 w-16 h-16 bg-purple-400/20 rounded-full blur-md animate-bounce" />
        </div>
      </section>

    


      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Section - Features Text */}
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-pink-600 dark:text-pink-500 leading-tight">
              Discover Our Outstanding Features
            </h2>
            
            {/* Feature Cards */}
            <div className="space-y-6">
              {/* Feature 1 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Verified Professional Providers
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      All our service providers are thoroughly vetted, licensed, and background-checked to ensure you receive the highest quality service from trusted professionals in your area.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Instant Booking & Real-time Tracking
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      Book services instantly with our streamlined platform and track your provider's arrival in real-time. Get updates every step of the way for complete peace of mind.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      Secure Payment & Quality Guarantee
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    We have protocols and guidelines in place to constantly improve customer satisfaction and optimise payment security.
Our dedicated customer service team is ready and willing to offer assistance whenever the need arises.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* See More Link */}
            <div className="pt-4">
              <a href="#" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-semibold transition-colors duration-200 group">
                See More
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </a>
            </div>
          </div>

          {/* Right Section - Image Collage */}
          <div className="relative">
            {/* Decorative dotted pattern */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
              <div className="grid grid-cols-4 gap-2 h-full">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="w-2 h-2 bg-pink-500 rounded-full"></div>
                ))}
              </div>
            </div>

            {/* Curved arrow */}
            <div className="absolute top-8 left-8 z-10">
              <svg width="80" height="60" viewBox="0 0 80 60" className="text-orange-500">
                <path
                  d="M10 50 Q40 10 70 20"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                  className="animate-pulse"
                />
                <path
                  d="M65 15 L70 20 L65 25"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </div>

            {/* Image collage */}
            <div className="relative flex items-center justify-center space-x-4">
              {/* Circular image */}
              <div className="relative z-20">
                <div className="w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-slate-800">
                  <Image
                    src="/images/mechanic.png"
                    alt="Professional handshake"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Vertical rectangular images */}
              <div className="space-y-4">
                {/* First vertical image */}
                <div className="w-32 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 relative z-10">
                  <Image
                    src="/images/slider14.png"
                    alt="Professional working on laptop"
                    width={128}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Second vertical image */}
                <div className="w-32 h-48 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-slate-800 relative z-10">
                  <Image
                    src="/images/plumber.png"
                    alt="Professional writing notes"
                    width={128}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow">
          <div className="absolute -inset-px opacity-10 bg-gradient-to-r from-pink-600 to-orange-500" />
          <div className="relative text-center">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Stay updated</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300">Get the latest updates on new features and providers in your area.</p>
            <form onSubmit={subscribe} className="mt-6 flex w-full max-w-md mx-auto items-center gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-pink-500/40"
              />
              <button className="rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-5 py-3 text-white font-semibold shadow-md shadow-pink-500/20 active:scale-[.98]">
                Subscribe
              </button>
            </form>
            {status && (
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{status}</p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {/* <FAQComponent /> */}

      {/* App Download (coming soon) */}
      {/* <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
        <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -inset-px opacity-10 bg-gradient-to-r from-[#2563EB] to-[#14B8A6]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Mobile apps</p>
            <h3 className="mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-50">Download the app</h3>
            <p className="mt-2 text-slate-600 dark:text-slate-300 max-w-xl">Alabastar is coming to iOS and Android. Get ready for a faster way to book trusted services.</p>
          </div>
          <div className="relative flex items-center gap-3">
            <button className="group relative inline-flex items-center gap-3 rounded-2xl border border-slate-300/60 dark:border-white/10 px-4 py-3 bg-white/80 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 shadow hover:shadow-md cursor-not-allowed">
              <Apple size={20} />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Download on the</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
              <span className="absolute -top-2 -right-2 rounded-full bg-slate-900 text-white text-[9px] px-2 py-[2px] dark:bg_white dark:text-slate-900">Soon</span>
            </button>
            <button className="group relative inline-flex items-center gap-3 rounded-2xl border border-slate-300/60 dark:border-white/10 px-4 py-3 bg-white/80 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 shadow hover:shadow-md cursor-not-allowed">
              <Play size={20} />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-slate-500 dark:text-slate-400">Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
              <span className="absolute -top-2 -right-2 rounded-full bg-slate-900 text-white text-[9px] px-2 py-[2px] dark:bg_white dark:text-slate-900">Soon</span>
            </button>
          </div>
        </div>
      </section> */}

      {/* Booking Status Modal */}
      <BookingStatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        booking={bookingForStatus}
        onStatusUpdate={handleStatusUpdate}
      />
    </div>
  );
}

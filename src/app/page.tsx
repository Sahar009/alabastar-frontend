"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { JSX } from "react";
import { Wrench, Zap, Truck, Fan, Hammer, PaintRoller, Bug, Shirt, Ruler, Camera, Sparkles, Search, ShieldCheck, Star, Apple, Play, Users, Settings, MapPin, ArrowRight, CheckCircle, Wrench2, Sparkles2, UserPlus, Navigation } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FAQComponent from "@/components/FAQ";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
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

  // Auto-detect user location on component mount
  useEffect(() => {
    detectUserLocation();
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
    "/images/slider1.jpg",
    "/images/slider2.jpg", 
    "/images/slider3.jpg",
    "/images/slider4.jpg",
    "/images/slider5.jpg",
    "/images/slider6.jpg",
    "/images/slider7.jpg",
    "/images/slider8.jpg"
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

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full py-8 sm:py-12 lg:py-16">
          <div className="max-w-4xl">
            {/* Main heading - Responsive typography */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-white mb-4 sm:mb-6">
              <span className="block">Connect with</span>
              <span className="block">trusted service</span>
              <span className="block">providers</span>
            </h1>
            
            {/* Subtitle - Responsive text */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl leading-relaxed">
              Book skilled professionals for plumbing, electrical work, cleaning, carpentry and more. 
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
            <div className="mb-6 sm:mb-8">
              <div className="flex sm:flex-wrap gap-2 sm:gap-4 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              <button 
                onClick={() => handleCategorySelect('plumbing')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'plumbing' 
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#0f766e] text-white' 
                    : 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white'
                }`}
              >
                <span>Plumbing</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => handleCategorySelect('electrical')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'electrical' 
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#0f766e] text-white' 
                    : 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white'
                }`}
              >
                <span>Electrical</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => handleCategorySelect('cleaning')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'cleaning' 
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#0f766e] text-white' 
                    : 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white'
                }`}
              >
                <span>Cleaning</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => handleCategorySelect('carpentry')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 ${
                  selectedCategory === 'carpentry' 
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#0f766e] text-white' 
                    : 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white'
                }`}
              >
                <span>Carpentry</span>
                  <ArrowRight size={12} className="sm:w-4 sm:h-4" />
              </button>
              <button 
                  onClick={() => handleCategorySelect('lesson teacher')}
                  className={`flex items-center justify-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl sm:rounded-3xl transition-all duration-300 hover:scale-105 shadow-lg text-xs sm:text-sm font-medium whitespace-nowrap flex-shrink-0 relative ${
                    selectedCategory === 'Lesson Teacher' 
                    ? 'bg-gradient-to-r from-[#1d4ed8] to-[#0f766e] text-white' 
                    : 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:from-[#1d4ed8] hover:to-[#0f766e] text-white'
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

   

      {/* Manual Scroll Categories */}
      <section className="relative mt-20">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/5 dark:to-slate-50/[.02]" />
        
        {/* Scroll Controls */}
        <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#2563EB] to-[#14B8A6] bg-clip-text text-transparent">
            Popular Services
          </h2>
          
          {/* Desktop Scroll Arrows */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => {
                const container = document.getElementById('categories-scroll');
                if (container) {
                  container.scrollBy({ left: -300, behavior: 'smooth' });
                }
              }}
              className="p-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Scroll left"
            >
              <ArrowRight size={20} className="text-white rotate-180" />
            </button>
            <button
              onClick={() => {
                const container = document.getElementById('categories-scroll');
                if (container) {
                  container.scrollBy({ left: 300, behavior: 'smooth' });
                }
              }}
              className="p-2 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Scroll right"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
              </div>
            </div>

        {/* Scrollable Categories Container */}
        <div className="relative">
          {/* Mobile Scroll Hint */}
          <div className="sm:hidden text-center mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Swipe to explore more services
            </p>
        </div>

          {/* Categories Scroll Container */}
          <div 
            id="categories-scroll"
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {categories.map(({ label, image }, i) => (
              <div 
                key={i} 
                className="group cursor-pointer bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl hover:shadow-2xl border border-slate-200/50 dark:border-slate-700/50 min-w-[280px] transition-all duration-500 hover:-translate-y-2 hover:scale-105 flex-shrink-0"
                onClick={() => handleCategorySelect(label)}
                style={{ scrollSnapAlign: 'start' }}
              >
                {/* Service Header */}
                <div className="bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-2xl px-4 py-3 mb-4">
                  <h3 className="text-white font-bold text-lg text-center">
                    {label}
                  </h3>
                </div>
                
                {/* Service Illustration */}
                <div className="relative h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-2xl overflow-hidden group-hover:from-blue-100 group-hover:to-purple-100 dark:group-hover:from-blue-900/30 dark:group-hover:to-purple-900/30 transition-all duration-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-28 h-28 bg-white/90 dark:bg-slate-800/90 rounded-2xl shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Image
                        src={image}
                        alt={label}
                        width={60}
                        height={60}
                        className="object-cover rounded-xl"
                      />
                    </div>
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute top-2 right-2 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                {/* Service Description */}
                <div className="mt-4 text-center">
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">
                    Professional {label.toLowerCase()} services
                  </p>
                  <div className="mt-2 flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-[#2563EB] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#14B8A6] rounded-full"></div>
                    <div className="w-2 h-2 bg-[#0EA5E9] rounded-full"></div>
                  </div>
                </div>
            </div>
          ))}
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
          <div className="relative overflow-hidden rounded-3xl h-[400px] group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/images/tool.jpg"
                alt="Professional services"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/70 to-blue-800/80 group-hover:from-blue-600/60 group-hover:to-blue-800/70 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-20 right-16 w-32 h-32 bg-blue-500 rounded-full blur-2xl animate-bounce" />
              <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-300 rounded-full blur-lg animate-ping" />
            </div>
            
            <div className="relative h-full p-8 flex flex-col justify-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/30">
                    <Users className="w-8 h-8 text-white animate-bounce" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4 leading-tight text-center">
                Professional services
                <br />
                Direct from verified
                <br />
                providers
              </h3>
              <p className="text-white/90 text-lg text-center">
                Connecting you directly with skilled professionals for all your service needs
              </p>
              
              {/* Hover arrow */}
              <div className="flex justify-center mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-6 right-6 w-16 h-16 bg-white/10 rounded-full blur-sm animate-pulse" />
            <div className="absolute bottom-6 left-6 w-12 h-12 bg-blue-400/20 rounded-full blur-md animate-bounce" />
          </div>

          {/* Customized to your specific needs */}
          <div className="relative overflow-hidden rounded-3xl h-[400px] group cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-2xl">
            {/* Background image */}
            <div className="absolute inset-0">
              <Image
                src="/images/apply.png"
                alt="Customized services"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/70 to-teal-800/80 group-hover:from-emerald-600/60 group-hover:to-teal-800/70 transition-all duration-500" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
            
            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-16 right-12 w-24 h-24 bg-emerald-400 rounded-full blur-xl animate-pulse" />
              <div className="absolute bottom-12 left-20 w-28 h-28 bg-teal-500 rounded-full blur-2xl animate-bounce" />
              <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-emerald-300 rounded-full blur-lg animate-ping" />
            </div>
            
            <div className="relative h-full p-8 flex flex-col justify-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-4 border border-white/30">
                    <Settings className="w-8 h-8 text-white animate-spin" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-white text-2xl sm:text-3xl font-bold mb-4 leading-tight text-center">
                Customized to your
                <br />
                specific needs &
                <br />
                requirements
              </h3>
              <p className="text-white/90 text-lg text-center">
                Tailored solutions that match your exact specifications and preferences
              </p>
              
              {/* Hover arrow */}
              <div className="flex justify-center mt-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <ArrowRight className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute top-8 left-8 w-14 h-14 bg-white/10 rounded-full blur-sm animate-pulse" />
            <div className="absolute bottom-8 right-8 w-10 h-10 bg-emerald-400/20 rounded-full blur-md animate-bounce" />
          </div>
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
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-lg animate-pulse"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm rounded-full p-3 border border-white/30">
                    <Sparkles className="w-6 h-6 text-white animate-spin" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-3 leading-tight text-center">
                Complete solutions
                <br />
                for every need
              </h3>
              <p className="text-white/90 text-sm sm:text-base mb-4 text-center max-w-xl mx-auto leading-relaxed">
                From home repairs to professional services, Alabastar connects you with verified experts 
                who deliver excellence in every project.
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

    


      {/* CTA band */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2563EB] to-[#14B8A6] p-8">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 2px, transparent 2px)" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-2xl font-extrabold">Need urgent help?</h3>
              <p className="text-white/90">Tap emergency and get matched with the nearest available provider.</p>
            </div>
            <a href="#" className="rounded-xl bg-white/90 text-slate-900 font-semibold px-5 py-3 hover:bg-white">Emergency request</a>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow">
          <div className="absolute -inset-px opacity-10 bg-gradient-to-r from-[#2563EB] to-[#14B8A6]" />
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
                className="flex-1 rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/40"
              />
              <button className="rounded-xl bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-5 py-3 text-white font-semibold shadow-md shadow-sky-500/20 active:scale-[.98]">
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
    </div>
  );
}

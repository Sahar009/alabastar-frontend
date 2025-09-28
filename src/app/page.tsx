"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { JSX } from "react";
import { Wrench, Zap, Truck, Fan, Hammer, PaintRoller, Bug, Shirt, Ruler, Camera, Sparkles, Search, ShieldCheck, Star, Apple, Play, Users, Settings, MapPin, ArrowRight, CheckCircle, Wrench2, Sparkles2, UserPlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import FAQComponent from "@/components/FAQ";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);

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
  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % heroImages.length), 3000);
    return () => clearInterval(id);
  }, [heroImages.length]);

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
      <section className="relative overflow-hidden pt-20 sm:pt-28">
        {/* background mesh */}
        <Image src="/brand/mesh-bg.svg" alt="bg" fill priority className="object-cover opacity-[0.25] pointer-events-none select-none" />
        {/* gradient blobs */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#2563EB]/25 blur-3xl animate-blob"></div>
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#14B8A6]/25 blur-3xl animate-blob" style={{ animationDelay: "-6s" }}></div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 dark:bg-slate-900/50 px-3 py-1 text-xs text-slate-700 dark:text-slate-200 backdrop-blur-xl animate-shimmer" style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,.5), rgba(255,255,255,0))" }}>
                <span className="h-2 w-2 rounded-full bg-[#14B8A6]"></span>
                Verified providers • 24/7 support • Secure payments
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">
                Find trusted services near you
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">Fast. Safe. Guaranteed.</span>
        </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Book plumbers, electricians, cleaners and more. Secure payments with verified providers.
              </p>

              {/* Search bar */}
              <div className="mt-6 w-full max-w-lg">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search for services or providers..."
                    className="w-full rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-[#2563EB]/40"
                  />
                  <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/providers" 
                  className="group flex-1 sm:flex-none rounded-xl bg-gradient-to-r from-[#2563EB] to-[#14B8A6] px-6 py-4 text-white font-semibold shadow-lg shadow-sky-500/25 hover:shadow-xl hover:shadow-sky-500/40 hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Search className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Book a Provider</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  href="/become-provider" 
                  className="group flex-1 sm:flex-none rounded-xl border-2 border-slate-300/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl px-6 py-4 text-slate-700 dark:text-slate-200 font-semibold hover:bg-white/90 dark:hover:bg-slate-900/80 hover:border-[#2563EB]/50 dark:hover:border-[#14B8A6]/50 hover:scale-105 hover:shadow-lg hover:shadow-slate-500/20 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <UserPlus className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span>Become a Provider</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-3">
                {trustedAvatars.map((src, i) => (
                  <img
                    key={src}
                    src={src}
                    alt="trusted user"
                    width={36}
                    height={36}
                    className="h-9 w-9 rounded-full ring-2 ring-white/80 dark:ring-slate-800 animate-float object-cover"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">Trusted by 10,000+ homeowners and businesses</p>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              {/* Circular frame with animated conic gradient border */}
              <div className="relative h-80 w-80 sm:h-96 sm:w-96 rounded-full p-[3px]">
                <div
                  className="absolute -inset-0 rounded-full animate-rotate-slow blur-[2px] opacity-80"
                  style={{
                    background: `conic-gradient(${c1}, ${c2}, ${c1})`,
                    transition: 'background 700ms ease'
                  }}
                />
                <div className="relative h-full w-full rounded-full overflow-hidden border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl">
                  {heroImages.map((src, i) => (
   <Image
                      key={i}
                      src={src}
                      alt="hero"
                      fill
                      sizes="(max-width: 768px) 320px, 384px"
                      className={`object-cover transition-opacity duration-700 ${i === activeIdx ? 'opacity-100' : 'opacity-0'}`}
                      priority={i === 0}
                    />
                  ))}
      </div>
   
                {/* Floating icons */}
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full p-2 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow animate-float"
                  style={{ animationDelay: '0s' }}
                  aria-hidden
                >
                  <Wrench size={18} style={{ color: c1 }} />
                </span>
                <span
                  className="absolute top-1/2 -right-3 -translate-y-1/2 rounded-full p-2 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow animate-float"
                  style={{ animationDelay: '.2s' }}
                  aria-hidden
                >
                  <Zap size={18} style={{ color: c2 }} />
                </span>
                <span
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full p-2 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow animate-float"
                  style={{ animationDelay: '.4s' }}
                  aria-hidden
                >
                  <Sparkles size={18} style={{ color: c1 }} />
                </span>
                <span
                  className="absolute top-1/2 -left-3 -translate-y-1/2 rounded-full p-2 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow animate-float"
                  style={{ animationDelay: '.6s' }}
                  aria-hidden
                >
                  <Truck size={18} style={{ color: c2 }} />
                </span>
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#14B8A6] blur-2xl opacity-40"></div>

              {/* Description panel (desktop) */}
              <div className="hidden sm:block absolute -right-10 bottom-4 w-64 rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-lg p-4">
                <p className="text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-r" style={{ backgroundImage: `linear-gradient(90deg, ${c1}, ${c2})` }}>{heroTitles[activeIdx]}</p>
                {heroDescriptions.map((txt, i) => (
                  <p key={i} className={`mt-1 text-sm text-slate-700 dark:text-slate-300 transition-opacity duration-500 ${i === activeIdx ? 'opacity-100' : 'opacity-0 absolute'}`}>{txt}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

   

      {/* Scrolling marquee of categories */}
      <section className="relative mt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/5 dark:to-slate-50/[.02]" />
        
        {/* First marquee */}
        <div className="flex gap-8 animate-marquee">
          {[...categories, ...categories, ...categories].map(({ label, image }, i) => (
            <div key={i} className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/30 dark:border-white/10 min-w-fit">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={image}
                  alt={label}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-lg font-semibold whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Second marquee (offset for seamless loop) */}
        <div className="flex gap-8 animate-marquee-reverse mt-4">
          {[...categories, ...categories, ...categories].map(({ label, image }, i) => (
            <div key={`reverse-${i}`} className="flex items-center gap-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-white/30 dark:border-white/10 min-w-fit">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={image}
                  alt={label}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-lg font-semibold whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
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

      {/* How it works - circular cycle */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50">How it works</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Cycle diagram */}
          <div className="relative mx-auto h-[22rem] w-[22rem] sm:h-[26rem] sm:w-[26rem]">
            {/* Gradient ring */}
            <div className="absolute inset-0 rounded-full p-[10px]">
              <div className="absolute inset-0 rounded-full opacity-80" style={{ background: "conic-gradient(#2563EB, #14B8A6, #2563EB)", filter: "blur(2px)" }} />
              <div className="relative inset-0 h-full w-full rounded-full overflow-hidden border border-white/30 dark:border-white/10">
                <Image
                  src={heroImages2[0]}
                  alt="How it works"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Step markers fixed around the ring */}
            <div className="absolute inset-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <StepChip icon={<Search className="text-blue-600" size={18} />} label="Pick a service" />
              </div>
              <div className="absolute top-1/2 -right-5 -translate-y-1/2">
                <StepChip icon={<ShieldCheck className="text-blue-700" size={18} />} label="Book securely" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <StepChip icon={<Star className="text-indigo-600" size={18} />} label="Rate & repeat" />
              </div>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2">
                <StepChip icon={<Sparkles className="text-blue-800" size={18} />} label="Enjoy quality" />
              </div>
            </div>

            {/* Center label */}
            {/* <div className="absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">Cycle</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-slate-50">Choose → Book → Review</p>
              </div>
            </div> */}
          </div>

          {/* Explanations list */}
          <div className="space-y-4">
            {[
              {
                title: 'Pick a service',
                desc: 'Choose from verified providers across plumbing, electrical, cleaning and more.',
                Icon: Search,
                accent: 'from-blue-500 to-blue-600',
                text: 'text-blue-600'
              },
              {
                title: 'Book securely',
                desc: 'Secure booking with verified providers and transparent pricing.',
                Icon: ShieldCheck,
                accent: 'from-blue-600 to-indigo-600',
                text: 'text-blue-700'
              },
              {
                title: 'Rate & repeat',
                desc: 'Great experience? Leave a review and rebook your favorite pro in one tap.',
                Icon: Star,
                accent: 'from-indigo-500 to-blue-700',
                text: 'text-indigo-600'
              }
            ].map(({ title, desc, Icon, accent, text }, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-blue-200/30 dark:border-blue-400/20 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow">
                <div className={`absolute -inset-px opacity-10 bg-gradient-to-r ${accent}`} />
                <div className="relative flex items-start gap-4">
                  <div className={`shrink-0 rounded-xl bg-gradient-to-br ${accent} p-2 text-white shadow`}> <Icon size={18} /> </div>
                  <div>
                    <h3 className={`font-semibold ${text}`}>{title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
      <FAQComponent />

      {/* App Download (coming soon) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
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
      </section>
    </div>
  );
}

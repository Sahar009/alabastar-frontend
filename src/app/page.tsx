"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { JSX } from "react";
import { Wrench, Zap, Truck, Fan, Hammer, PaintRoller, Bug, Shirt, Ruler, Camera, Sparkles, Search, ShieldCheck, Star, Apple, Play } from "lucide-react";
import type { LucideIcon } from "lucide-react";

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
    } catch (_err) {
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

  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % heroImages.length), 3000);
    return () => clearInterval(id);
  }, [heroImages.length]);

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
    "Secure payments",
    "Verified providers",
    "Top reviews",
    "Fast support"
  ];
  const heroDescriptions = [
    "Fix leaks, install heaters, and more with trusted plumbers near you.",
    "Book in seconds. Real-time scheduling that works around you.",
    "Escrow holds your payment until you confirm the job is done.",
    "Every pro is verified with documents and continuous performance checks.",
    "Hire confidently with transparent ratings and real customer feedback.",
    "We’re here 24/7. Get help whenever you need it."
  ];

  // Marquee categories with icons and per-item colors
  const categories: { label: string; Icon: LucideIcon; color: string }[] = [
    { label: 'Plumbing', Icon: Wrench, color: 'text-sky-600' },
    { label: 'Electrical', Icon: Zap, color: 'text-amber-500' },
    { label: 'Cleaning', Icon: Sparkles, color: 'text-emerald-600' },
    { label: 'Moving', Icon: Truck, color: 'text-indigo-600' },
    { label: 'AC Repair', Icon: Fan, color: 'text-cyan-600' },
    { label: 'Carpentry', Icon: Hammer, color: 'text-rose-600' },
    { label: 'Painting', Icon: PaintRoller, color: 'text-fuchsia-600' },
    { label: 'Pest Control', Icon: Bug, color: 'text-lime-600' },
    { label: 'Laundry', Icon: Shirt, color: 'text-blue-600' },
    { label: 'Tiling', Icon: Ruler, color: 'text-orange-600' },
    { label: 'CCTV', Icon: Camera, color: 'text-slate-600' },
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
                Escrow-backed bookings • Verified providers • 24/7 support
              </div>
              <h1 className="mt-4 text-4xl sm:text-6xl font-extrabold leading-tight text-slate-900 dark:text-slate-50">
                Find trusted services near you
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#2563EB] to-[#14B8A6]">Fast. Safe. Guaranteed.</span>
        </h1>
              <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
                Book plumbers, electricians, cleaners and more. Payments are held in escrow until you confirm the job is done.
              </p>

              <form onSubmit={subscribe} className="mt-6 flex w-full max-w-md items-center gap-2">
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

              <div className="mt-8 flex items-center gap-6">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map((i) => (
                    <Image key={i} src="/vercel.svg" alt="avatar" width={36} height={36} className="rounded-full ring-2 ring-white/80 dark:ring-slate-800 animate-float" style={{ animationDelay: `${i * 0.2}s` }} />
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

      {/* Why Alabastar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="text-center">
          <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50">Why choose Alabastar</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Professional, secure, and built for speed — from booking to payout.</p>
        </div>

        {/* KPI stats */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[{
            label: 'Average rating', value: '4.9/5', accent: 'from-amber-400 to-orange-500', Icon: Star
          },{
            label: 'Jobs completed', value: '10k+', accent: 'from-emerald-500 to-teal-500', Icon: ShieldCheck
          },{
            label: 'Support', value: '24/7', accent: 'from-sky-500 to-cyan-500', Icon: Zap
          }].map(({label, value, accent, Icon}, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow">
              <div className={`absolute -inset-px opacity-10 bg-gradient-to-r ${accent}`} />
              <div className="relative flex items-center gap-3">
                <div className={`rounded-lg text-white p-2 bg-gradient-to-br ${accent}`}><Icon size={18} /></div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-slate-50">{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Feature grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Escrow protection', desc: 'Funds are held until you confirm the job is done.', Icon: ShieldCheck, accent: 'from-emerald-500 to-teal-500' },
            { title: 'Verified providers', desc: 'Identity checks and continuous performance monitoring.', Icon: ShieldCheck, accent: 'from-sky-500 to-cyan-500' },
            { title: 'Fast matching', desc: 'Get connected to nearby pros in minutes, not days.', Icon: Zap, accent: 'from-amber-400 to-orange-500' },
            { title: 'Transparent pricing', desc: 'Clear estimates and no hidden fees.', Icon: Ruler, accent: 'from-fuchsia-500 to-violet-500' },
            { title: 'Quality assurance', desc: 'Ratings and reviews keep standards high.', Icon: Star, accent: 'from-indigo-500 to-blue-500' },
            { title: 'Delightful experience', desc: 'Modern design, secure chat, and smooth workflows.', Icon: Sparkles, accent: 'from-rose-500 to-pink-500' },
          ].map(({ title, desc, Icon, accent }, i) => (
            <div key={i} className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow hover:shadow-lg transition-shadow">
              <div className={`absolute -inset-px opacity-10 bg-gradient-to-r ${accent}`} />
              <div className="relative flex items-start gap-4">
                <div className={`rounded-xl text-white p-2 bg-gradient-to-br ${accent}`}><Icon size={18} /></div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50">{title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonial / trust note */}
        <div className="mt-10 relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow">
          <div className="absolute -inset-px opacity-10 bg-gradient-to-r from-[#2563EB] to-[#14B8A6]" />
          <div className="relative flex items-center gap-4">
            <Image src="/vercel.svg" alt="avatar" width={40} height={40} className="rounded-full ring-2 ring-white/80 dark:ring-slate-800" />
            <p className="text-sm text-slate-700 dark:text-slate-300">
              “We booked an emergency electrician at midnight. He arrived in 20 minutes and fixed it. Payment released after we confirmed. Perfect.”
            </p>
          </div>
        </div>
      </section>

      {/* Scrolling marquee of categories */}
      <section className="relative mt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-slate-900/5 dark:to-slate-50/[.02]" />
        <div className="whitespace-nowrap flex gap-10 animate-marquee will-change-transform">
          {[...categories, ...categories].map(({ label, Icon, color }, i) => (
            <span key={i} className={`inline-flex items-center gap-2 text-xl font-semibold ${color}`}>
              <Icon size={20} /> {label}
            </span>
          ))}
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
              <div className="relative inset-0 h-full w-full rounded-full bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/30 dark:border-white/10" />
            </div>

            {/* Step markers fixed around the ring */}
            <div className="absolute inset-0">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <StepChip icon={<Search className="text-sky-600" size={18} />} label="Pick a service" />
              </div>
              <div className="absolute top-1/2 -right-5 -translate-y-1/2">
                <StepChip icon={<ShieldCheck className="text-emerald-600" size={18} />} label="Book securely" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                <StepChip icon={<Star className="text-amber-500" size={18} />} label="Rate & repeat" />
              </div>
              <div className="absolute top-1/2 -left-6 -translate-y-1/2">
                <StepChip icon={<Sparkles className="text-fuchsia-600" size={18} />} label="Enjoy quality" />
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
                accent: 'from-sky-500 to-cyan-500',
                text: 'text-sky-600'
              },
              {
                title: 'Book securely',
                desc: 'Pay into escrow. We only release funds when you confirm the job is done.',
                Icon: ShieldCheck,
                accent: 'from-emerald-500 to-teal-500',
                text: 'text-emerald-600'
              },
              {
                title: 'Rate & repeat',
                desc: 'Great experience? Leave a review and rebook your favorite pro in one tap.',
                Icon: Star,
                accent: 'from-amber-400 to-orange-500',
                text: 'text-amber-600'
              }
            ].map(({ title, desc, Icon, accent, text }, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow">
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

      {/* Featured providers */}
      <section id="providers" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-20">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50">Top-rated providers</h2>
          <a href="#" className="text-sm font-semibold text-[#2563EB]">See all</a>
        </div>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map((i) => (
            <div key={i} className="group rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#2563EB] to-[#14B8A6]" />
                <div>
                  <p className="font-semibold text-slate-900 dark:text-slate-50">Provider {i}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Plumbing • Lagos</p>
                </div>
                <div className="ml-auto text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded">4.9 ★</div>
              </div>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">“Always on time and professional. Highly recommend.”</p>
              <button className="mt-4 w-full rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 py-2 font-semibold group-hover:translate-y-[-1px] transition-transform">Book now</button>
            </div>
          ))}
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

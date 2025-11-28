"use client";
import { ShieldCheck, Users, Zap, Heart, Lightbulb, CheckCircle, Star, Handshake, TrendingUp, Globe, Award, Target } from "lucide-react";
import Image from "next/image";
import type React from "react";

export default function AboutPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-slate-50">
                About Alabastar
              </h1>
              <p className="mt-4 text-xl sm:text-2xl text-slate-600 dark:text-slate-300 font-medium">
                Connecting You to Trusted Service Providers Across Nigeria
              </p>
              <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Welcome to Alabastar — Nigeria's trusted online platform designed to connect everyday people with verified service providers, skilled artisans, and reliable vendors, all in one place.
              </p>
              <p className="mt-4 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
                We understand how stressful it can be to find dependable professionals — whether you're looking for an electrician, a fashion designer, a makeup artist, a photographer, a painter, a home cleaner or dependable businesses be it medical, educational, hospitality, legal, retail et al. Alabastar bridges that gap by providing a safe, simple, and transparent marketplace where customers can discover and contact verified experts near them, while service providers get visibility, credibility, and steady leads through our platform.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
                <Image
                  src="/about.png"
                  alt="About Alabastar"
                  width={500}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Target size={24} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Our Mission</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To simplify connections between service providers and customers through a trusted, transparent, and accessible digital platform that promotes genuine human relationships, skill empowerment, and business growth across Nigeria.
              </p>
            </div>

            <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white">
                  <Globe size={24} />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-50">Our Vision</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To become Nigeria's leading network of verified service providers — where trust meets opportunity, and where every skilled professional, artisan, small business owner as well as medium and large scale establishments have equal visibility, regardless of their background or size.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              What We Do
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Alabastar serves as a digital bridge — a place where customers find help and providers find clients.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<ShieldCheck size={24} />}
              title="We List Verified Service Providers"
              description="Every provider on Alabastar is required to register and subscribe annually. This process allows us to verify their identity, business details, and service credibility before they go live on the platform."
            />
            <FeatureCard
              icon={<Handshake size={24} />}
              title="We Connect Customers Directly to Experts"
              description="Customers can browse categories, view provider profiles, and contact them directly — all without paying any commission to Alabastar. Payments for services happen offline, directly between the provider and the client."
            />
            <FeatureCard
              icon={<TrendingUp size={24} />}
              title="We Empower Local Businesses"
              description="Alabastar gives small business owners, freelancers, and artisans the online visibility they need to reach new clients, grow their brand, and build credibility in today's digital economy."
            />
            <FeatureCard
              icon={<Award size={24} />}
              title="We Promote Safety & Trust"
              description="Every profile on our platform is reviewed to maintain professionalism, authenticity, and user safety. We monitor listings, reviews, and feedback to ensure that only credible providers remain active."
            />
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              Our Core Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <ValueCard
              icon={<ShieldCheck size={20} />}
              title="Trust"
              description="We value integrity and transparency. Every provider listed on Alabastar is verified to protect our users and maintain credibility."
            />
            <ValueCard
              icon={<Globe size={20} />}
              title="Accessibility"
              description="We believe in digital inclusion — giving everyone in Nigeria, from big cities to rural areas, access to trusted service providers."
            />
            <ValueCard
              icon={<Zap size={20} />}
              title="Empowerment"
              description="We exist to help local businesses grow, giving artisans and entrepreneurs the visibility they deserve."
            />
            <ValueCard
              icon={<Lightbulb size={20} />}
              title="Innovation"
              description="We constantly improve our platform to make the connection process faster, easier, and smarter for all users."
            />
            <ValueCard
              icon={<Users size={20} />}
              title="Community"
              description="Alabastar is more than a platform — it's a growing community of trusted professionals and everyday people helping one another."
            />
          </div>
        </div>
      </section>

      {/* How We're Different */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 md:p-12 shadow-lg">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
                How We're Different
              </h2>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Unlike most marketplaces that take commissions or manage payments, Alabastar runs on a subscription-based model.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">For Providers</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Providers pay a small annual fee to list their services and be discovered by thousands of potential clients.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white shrink-0">
                    <CheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">For Customers</h3>
                    <p className="text-slate-600 dark:text-slate-300 text-sm">
                      Customers browse and contact providers for free — no hidden charges, no middlemen, no extra costs.
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mt-6 text-center">
                This approach ensures fairness, direct interaction, and maximum value for everyone involved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              Our Categories
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              We feature a wide range of service providers, including:
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Home and Electrical Repairs",
              "Beauty and Fashion Experts",
              "Event Planners and Decorators",
              "Freelance Photographers and Videographers",
              "Cleaning and Maintenance Services",
              "Tech Support and Web Developers",
              "Tutors and Personal Trainers",
              "Health, Fitness, and Wellness Providers",
              "Transport and Logistics Services",
              "Educational Institutions at all levels",
              "Medical establishments across a broad spectrum",
              "…and many more."
            ].map((category, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-4 shadow text-center"
              >
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{category}</p>
              </div>
            ))}
          </div>
          <p className="text-center mt-8 text-lg font-semibold text-slate-900 dark:text-slate-50">
            Whatever you need — Alabastar helps you find it faster.
          </p>
        </div>
      </section>

      {/* Why Choose Alabastar */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-4">
              Why Choose Alabastar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck size={24} />,
                title: "Verified Providers Only",
                description: "We manually review and approve every professional."
              },
              {
                icon: <Heart size={24} />,
                title: "No Hidden Fees",
                description: "Customers connect directly with providers, free of charge."
              },
              {
                icon: <TrendingUp size={24} />,
                title: "Annual Subscription Model",
                description: "Affordable, transparent, and fair for service providers."
              },
              {
                icon: <Award size={24} />,
                title: "User Safety",
                description: "We monitor and verify all listings to ensure genuine connections."
              },
              {
                icon: <Users size={24} />,
                title: "Customer Support",
                description: "Our team is always ready to assist with inquiries, verification, or disputes."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow"
              >
                <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gradient-to-br from-pink-50/50 to-orange-50/50 dark:from-slate-900/50 dark:to-slate-800/50">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-8 md:p-12 shadow-lg text-center">
            <div className="h-16 w-16 grid place-items-center rounded-2xl bg-gradient-to-br from-pink-600 to-orange-500 text-white mx-auto mb-6">
              <Star size={32} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50 mb-6">
              Our Story
            </h2>
            <div className="space-y-4 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Alabastar was born from a simple idea: to make finding trusted help easy in Nigeria.
              </p>
              <p>
                Our founders noticed how many Nigerians relied on random referrals, WhatsApp groups, and word-of-mouth to hire service providers — a process often filled with risk, delays, and disappointment.
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-50">
                We built Alabastar to change that narrative.
              </p>
              <p>
                Today, Alabastar stands as a digital home for skilled Nigerians, giving them a platform to showcase their talents and connect with clients confidently and safely.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow">
      <div className="h-12 w-12 grid place-items-center rounded-xl bg-gradient-to-br from-pink-600 to-orange-500 text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-5 shadow text-center">
      <div className="h-10 w-10 grid place-items-center rounded-lg bg-gradient-to-br from-pink-600 to-orange-500 text-white mx-auto mb-3">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-2">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">{description}</p>
    </div>
  );
}


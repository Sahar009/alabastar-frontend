"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Check, X, Zap, Crown, DollarSign, Calendar, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  price: string;
  interval: string;
  benefits: string[];
  features: {
    priority: number;
    maxPhotos: number;
    maxVideos: number;
    topListingDays: number;
  };
}

export default function PricingPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/subscription-plans/plans`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      if (response.ok) {
        const data = await response.json();
        const availablePlans = Array.isArray(data?.data) ? data.data : [];
        setPlans(availablePlans);
      } else {
        // Fallback to default plans if API fails
        setPlans([
          {
            id: 'basic-plan',
            name: 'Basic Plan',
            slug: 'basic-plan',
            price: '2000',
            interval: 'yearly',
            benefits: [
              'Basic listing',
              '5 photos max',
              'No video',
              '2 weeks top listing'
            ],
            features: {
              priority: 1,
              maxPhotos: 5,
              maxVideos: 0,
              topListingDays: 14
            }
          },
          {
            id: 'premium-plan',
            name: 'Premium Plan',
            slug: 'premium-plan',
            price: '5000',
            interval: 'yearly',
            benefits: [
              'Premium listing',
              '15 photos max',
              '1 video',
              '1 month top listing'
            ],
            features: {
              priority: 2,
              maxPhotos: 15,
              maxVideos: 1,
              topListingDays: 30
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => plan.interval === activeTab);

  const getPlanIcon = (planName: string) => {
    if (planName.toLowerCase().includes('premium')) return Crown;
    return Zap;
  };

  const getPlanColor = (planName: string) => {
    if (planName.toLowerCase().includes('premium')) {
      return {
        bg: 'from-purple-600 to-pink-600',
        ring: 'ring-purple-300 dark:ring-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      };
    }
    return {
      bg: 'from-blue-600 to-cyan-600',
      ring: 'ring-blue-300 dark:ring-blue-700',
      button: 'bg-blue-600 hover:bg-blue-700',
      badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Select the perfect subscription plan for your business needs. 
            Start growing your client base today.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex items-center gap-3 p-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('yearly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'yearly'
                  ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Yearly
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'monthly'
                  ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-slate-600 dark:text-slate-400">Loading plans...</p>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => {
              const Icon = getPlanIcon(plan.name);
              const colors = getPlanColor(plan.name);
              const isPremium = plan.name.toLowerCase().includes('premium');

              return (
                <div
                  key={plan.id}
                  className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                    isPremium
                      ? 'border-purple-300 dark:border-purple-700 ring-4 ring-purple-100 dark:ring-purple-900/50'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {isPremium && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                        POPULAR
                      </span>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Plan Header */}
                    <div className="text-center mb-8">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${colors.bg} mb-4`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline justify-center gap-2">
                        <span className="text-4xl font-extrabold text-slate-900 dark:text-white">
                          ₦{Number(plan.price).toLocaleString()}
                        </span>
                        <span className="text-lg text-slate-600 dark:text-slate-400">
                          /{activeTab === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {plan.features.maxPhotos} Photos
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        {plan.features.maxVideos > 0 ? (
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={plan.features.maxVideos > 0 ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}>
                          {plan.features.maxVideos > 0 ? `${plan.features.maxVideos} Video` : 'No Video'}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {plan.features.topListingDays} Days Top Listing
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">
                          Priority {plan.features.priority} Listing
                        </span>
                      </li>
                      {plan.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link
                      href="/become-provider"
                      className={`block w-full text-center px-6 py-4 rounded-2xl font-semibold text-white bg-gradient-to-r ${colors.bg} hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2`}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}


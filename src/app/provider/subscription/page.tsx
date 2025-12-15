"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  ArrowLeft,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Crown,
  Shield,
  Award,
  AlertCircle,
  Loader2,
  Camera,
  DollarSign,
  RefreshCw,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Home,
  User,
  MessageSquare
} from "lucide-react";

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    duration: 'Free',
    features: {
      maxPhotos: 5,
      maxVideos: 0,
      videoMaxDuration: 0,
      topListingDuration: 14, // days
      rewardsAccess: false,
      tvRadioPromotion: false,
      prioritySupport: false,
      analyticsAccess: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    duration: 'Monthly',
    features: {
      maxPhotos: 10,
      maxVideos: 1,
      videoMaxDuration: 90,
      topListingDuration: 60, // days
      rewardsAccess: true,
      tvRadioPromotion: true,
      prioritySupport: true,
      analyticsAccess: true
    },
    isPopular: true
  }
];

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  duration: string;
  benefits?: string[];
  maxPhotos?: number;
  maxVideos?: number;
  topListingDuration?: number;
  features: {
    maxPhotos: number;
    maxVideos: number;
    videoMaxDuration: number;
    topListingDuration: number;
    rewardsAccess: boolean;
    tvRadioPromotion: boolean;
    prioritySupport: boolean;
    analyticsAccess: boolean;
  };
  isPopular?: boolean;
  isCurrent?: boolean;
}

interface CurrentSubscription {
  id: string;
  planId: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  amount: number;
  nextBillingDate?: string;
  cancellationDate?: string;
  SubscriptionPlan?: {
    id: string;
    name: string;
    slug: string;
    price: string;
    interval: string;
    benefits: string[];
    features: any;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface PaymentHistory {
  id: string;
  amount: number;
  status: 'success' | 'failed' | 'pending';
  date: string;
  planName: string;
  transactionId: string;
  method: string;
}

export default function SubscriptionManagement() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentSubscription, setCurrentSubscription] = useState<CurrentSubscription | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [featureLimits, setFeatureLimits] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [processing, setProcessing] = useState(false);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  // Helper function to validate plan data
  const validatePlan = (plan: any) => {
    // Convert price to number, handling both string and number formats
    let price = 0;
    if (typeof plan.price === 'number') {
      price = plan.price;
    } else if (typeof plan.price === 'string') {
      price = parseFloat(plan.price) || 0;
    }

    return {
      id: plan.id || 'unknown',
      name: plan.name || 'Plan',
      price: price,
      duration: plan.duration || plan.interval || 'month',
      benefits: plan.benefits || [],
      maxPhotos: plan.maxPhotos || plan.features?.maxPhotos || 5,
      maxVideos: plan.maxVideos || plan.features?.maxVideos || 0,
      topListingDuration: plan.topListingDuration || plan.features?.topListingDays || 14,
      isPopular: plan.isPopular || false,
      features: {
        maxPhotos: plan.maxPhotos || plan.features?.maxPhotos || 5,
        maxVideos: plan.maxVideos || plan.features?.maxVideos || 0,
        videoMaxDuration: plan.features?.videoMaxDuration || 60,
        topListingDuration: plan.topListingDuration || plan.features?.topListingDays || 14,
        rewardsAccess: plan.features?.rewardsAccess || false,
        tvRadioPromotion: plan.features?.tvRadioPromotion || false,
        prioritySupport: plan.features?.prioritySupport || false,
        analyticsAccess: plan.features?.analyticsAccess || false
      }
    };
  };

  // Helper function to validate current subscription data
  const validateCurrentSubscription = (subscription: any) => {
    if (!subscription) return null;
    
    // Convert amount to number, handling both string and number formats
    let amount = 0;
    if (typeof subscription.metadata?.payment_amount === 'number') {
      amount = subscription.metadata.payment_amount;
    } else if (typeof subscription.metadata?.payment_amount === 'string') {
      amount = parseFloat(subscription.metadata.payment_amount) || 0;
    } else if (typeof subscription.amount === 'number') {
      amount = subscription.amount;
    } else if (typeof subscription.amount === 'string') {
      amount = parseFloat(subscription.amount) || 0;
    }
    
    return {
      id: subscription.id || '',
      planId: subscription.planId || '',
      planName: subscription.SubscriptionPlan?.name || subscription.planName || 'Unknown Plan',
      status: subscription.status || 'inactive',
      startDate: subscription.currentPeriodStart || subscription.startDate || new Date().toISOString(),
      endDate: subscription.currentPeriodEnd || subscription.endDate || new Date().toISOString(),
      autoRenew: subscription.autoRenew || false,
      amount: amount,
      nextBillingDate: subscription.currentPeriodEnd || subscription.nextBillingDate || null,
      cancellationDate: subscription.cancellationDate || null,
      SubscriptionPlan: subscription.SubscriptionPlan || null
    };
  };

  // Fetch subscription data
  const fetchSubscriptionData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to view subscription');
        router.push('/provider/signin');
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Fetch current subscription using the real API
      const subscriptionResponse = await fetch(`${base}/api/subscriptions/my-subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        if (subscriptionData.success && subscriptionData.data) {
          setCurrentSubscription(subscriptionData.data);
        }
      }

      // Fetch subscription history (payment history)
      const historyResponse = await fetch(`${base}/api/subscriptions/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.success && historyData.data) {
          // Transform subscription data to payment history format
          const transformedHistory = historyData.data.map((subscription: any) => ({
            id: subscription.id,
            amount: parseFloat(subscription.metadata?.payment_amount || subscription.SubscriptionPlan?.price || '0'),
            status: subscription.status === 'active' ? 'success' : subscription.status === 'cancelled' ? 'failed' : 'pending',
            date: subscription.metadata?.payment_date || subscription.createdAt,
            planName: subscription.SubscriptionPlan?.name || 'Unknown Plan',
            transactionId: subscription.metadata?.payment_reference || subscription.metadata?.registrationPaymentReference || subscription.id,
            method: 'Paystack'
          }));
          setPaymentHistory(transformedHistory);
        }
      }

      // Fetch feature limits
      const limitsResponse = await fetch(`${base}/api/providers/feature-limits`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (limitsResponse.ok) {
        const limitsData = await limitsResponse.json();
        if (limitsData.success && limitsData.data) {
          setFeatureLimits(limitsData.data);
        }
      }

      // Fetch available subscription plans
      const plansResponse = await fetch(`${base}/api/subscription-plans/plans`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        console.log('Available plans data:', plansData); // Debug log
        if (plansData.success && plansData.data) {
          setAvailablePlans(plansData.data);
        } else if (Array.isArray(plansData)) {
          setAvailablePlans(plansData);
        } else {
          setAvailablePlans([]);
        }
      } else {
        console.error('Failed to fetch plans:', plansResponse.status);
        // Fallback to hardcoded plans if API fails
        setAvailablePlans(subscriptionPlans);
      }

    } catch (error) {
      console.error('Error fetching subscription data:', error);
      toast.error('Error loading subscription data');
      // Fallback to hardcoded plans if all API calls fail
      setAvailablePlans(subscriptionPlans);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Handle plan upgrade/downgrade
  const handlePlanChange = async (plan: SubscriptionPlan) => {
    try {
      if (!plan) {
        toast.error('Invalid plan selected');
        return;
      }
      
      setProcessing(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // For free plan, we can directly update without payment
      if ((plan.price || 0) === 0) {
        // Handle downgrade to free plan
        toast.success('Downgraded to Basic plan successfully!');
        await fetchSubscriptionData();
        setShowUpgradeModal(false);
        return;
      }

      // For paid plans, initialize payment
      const response = await fetch(`${base}/api/subscriptions/initialize-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          planId: plan.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.authorization_url) {
          // Redirect to Paystack payment page
          window.location.href = data.data.authorization_url;
        } else {
          throw new Error(data.message || 'Failed to initialize payment');
        }
      } else {
        throw new Error('Failed to initialize payment');
      }
    } catch (error: any) {
      console.error('Error changing plan:', error);
      toast.error(error.message || 'Failed to change subscription plan');
    } finally {
      setProcessing(false);
    }
  };

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
      return;
    }

    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (!currentSubscription?.id) {
        throw new Error('No active subscription found');
      }

      const response = await fetch(`${base}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: currentSubscription.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Subscription cancelled successfully');
          await fetchSubscriptionData();
        } else {
          throw new Error(data.message || 'Failed to cancel subscription');
        }
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error: any) {
      console.error('Error cancelling subscription:', error);
      toast.error(error.message || 'Failed to cancel subscription');
    } finally {
      setProcessing(false);
    }
  };

  // Handle subscription renewal
  const handleRenewSubscription = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      if (!currentSubscription?.id) {
        throw new Error('No subscription found to renew');
      }

      const response = await fetch(`${base}/api/subscriptions/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: currentSubscription.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          toast.success('Subscription renewed successfully!');
          await fetchSubscriptionData();
        } else {
          throw new Error(data.message || 'Failed to renew subscription');
        }
      } else {
        throw new Error('Failed to renew subscription');
      }
    } catch (error: any) {
      console.error('Error renewing subscription:', error);
      toast.error(error.message || 'Failed to renew subscription');
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('providerProfile');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedProfile) {
      setProviderProfile(JSON.parse(storedProfile));
    }

    fetchSubscriptionData();
  }, [fetchSubscriptionData]);

  // Handle payment verification on return from Paystack
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment');
    const reference = urlParams.get('reference');

    if (paymentStatus === 'success' && reference) {
      // Verify payment
      const verifyPayment = async () => {
        try {
          const token = localStorage.getItem('token');
          const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

          const response = await fetch(`${base}/api/subscriptions/verify-payment/${reference}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            toast.success('Subscription activated successfully!');
            await fetchSubscriptionData();
            // Clean URL
            window.history.replaceState({}, '', '/provider/subscription');
          } else {
            const errorData = await response.json();
            toast.error(errorData.message || 'Payment verification failed');
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast.error('Error verifying payment');
        }
      };

      verifyPayment();
    }
  }, [fetchSubscriptionData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('providerProfile');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/provider/dashboard",
      active: false
    },
    {
      title: "Bookings",
      icon: Calendar,
      href: "/provider/bookings",
      active: false
    },
    {
      title: "Earnings",
      icon: DollarSign,
      href: "/provider/earnings",
      active: false
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/provider/messages",
      active: false
    },
    {
      title: "Profile",
      icon: User,
      href: "/provider/profile",
      active: false
    },
    {
      title: "Subscription",
      icon: CreditCard,
      href: "/provider/subscription",
      active: true
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/provider/settings",
      active: false
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/provider/support",
      active: false
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-2xl border-r border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl transform transition-all duration-500 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0 shadow-3xl' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-800/80 dark:to-slate-900/80 backdrop-blur-sm">
            <div className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Award className="w-7 h-7 text-white group-hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">Alabastar</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Provider Portal</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Section */}
          <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-slate-50/50 to-white/50 dark:from-slate-800/50 dark:to-slate-900/50">
            <div className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-r from-[#FF6B35] to-[#EC4899] rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <User className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate group-hover:text-pink-600 transition-colors duration-200">
                  {user?.fullName || 'Provider'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'provider@example.com'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 ${
                providerProfile?.verificationStatus === 'verified' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900 dark:to-emerald-900 dark:text-green-200'
                  : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 dark:from-amber-900 dark:to-yellow-900 dark:text-amber-200'
              }`}>
                {providerProfile?.verificationStatus === 'verified' ? '✓ Verified' : '⏳ Pending'}
              </div>
              <Shield className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  if (item.href === '/provider/dashboard') {
                    router.push('/provider/dashboard');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/bookings') {
                    router.push('/provider/bookings');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/earnings') {
                    router.push('/provider/earnings');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/messages') {
                    router.push('/provider/messages');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/profile') {
                    router.push('/provider/profile');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/subscription') {
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/settings') {
                    router.push('/provider/settings');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/support') {
                    router.push('/provider/support');
                    setSidebarOpen(false);
                  }
                }}
                className={`group w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  item.active 
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-gradient-to-r hover:from-slate-100 hover:to-slate-200 dark:hover:from-slate-700 dark:hover:to-slate-600 hover:text-slate-900 dark:hover:text-slate-100 hover:shadow-md'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    item.active 
                      ? 'bg-white/20' 
                      : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-white dark:group-hover:bg-slate-600'
                  }`}>
                    <item.icon className={`w-5 h-5 transition-all duration-300 ${
                      item.active 
                        ? 'text-white' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-100 group-hover:scale-110'
                    }`} />
                  </div>
                  <span className="transition-all duration-300">{item.title}</span>
                </div>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-r from-red-50/50 to-pink-50/50 dark:from-red-900/10 dark:to-pink-900/10">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-100 hover:to-pink-100 dark:hover:from-red-900/30 dark:hover:to-pink-900/30 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <div className="p-2 rounded-xl bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/50 transition-all duration-300">
                <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-gradient-to-r from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 backdrop-blur-xl">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 rounded-2xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push('/provider/dashboard')}
                    className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="text-3xl font-bold text-pink-600">
                      Subscription Management
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 font-medium">
                      Manage your subscription and billing
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={fetchSubscriptionData}
                  disabled={loading}
                  className="group p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                  title="Refresh subscription data"
                >
                  <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Current Subscription Status */}
          {(currentSubscription || featureLimits?.hasSubscription) && (() => {
            const validatedSubscription = validateCurrentSubscription(currentSubscription);
            if (!validatedSubscription && !featureLimits?.hasSubscription) return null;
            
            return (
            <div className="mb-8">
              <div className={`rounded-3xl shadow-xl p-8 border-2 ${
                validatedSubscription.status === 'active' 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-300 dark:border-green-400' 
                  : validatedSubscription.status === 'expired'
                  ? 'bg-gradient-to-r from-red-500 to-pink-600 border-red-300 dark:border-red-400'
                  : 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-300 dark:border-amber-400'
              } text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <CreditCard className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold">
                          {validatedSubscription?.planName || featureLimits?.planName || 'Subscription'}
                        </h2>
                        <p className="text-white/90">
                          {featureLimits?.hasSubscription ? 'Active Subscription' :
                           validatedSubscription?.status === 'active' ? 'Active Subscription' : 
                           validatedSubscription?.status === 'expired' ? 'Subscription Expired' : 
                           'Subscription Cancelled'}
                        </p>
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-full backdrop-blur-sm ${
                      (featureLimits?.hasSubscription || validatedSubscription?.status === 'active') ? 'bg-white/20' : 'bg-white/10'
                    }`}>
                      <span className="text-sm font-bold uppercase">
                        {featureLimits?.hasSubscription ? 'active' : validatedSubscription?.status || 'inactive'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-sm text-white/80 mb-2">Current Plan</p>
                      <p className="text-xl font-bold">{validatedSubscription.planName}</p>
                      <p className="text-sm text-white/70">₦{validatedSubscription.amount.toLocaleString()}/month</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-sm text-white/80 mb-2">
                        {validatedSubscription.status === 'active' ? 'Next Billing' : 'Expires On'}
                      </p>
                      <p className="text-xl font-bold">
                        {validatedSubscription.status === 'active' && validatedSubscription.nextBillingDate
                          ? new Date(validatedSubscription.nextBillingDate).toLocaleDateString()
                          : new Date(validatedSubscription.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-white/70">
                        {validatedSubscription.status === 'active' && validatedSubscription.nextBillingDate
                          ? 'Auto-renewal enabled'
                          : 'Manual renewal required'}
                      </p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-sm text-white/80 mb-2">Auto Renewal</p>
                      <p className="text-xl font-bold">
                        {validatedSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                      </p>
                      <p className="text-sm text-white/70">
                        {validatedSubscription.autoRenew ? 'Will renew automatically' : 'Manual renewal required'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {validatedSubscription.status === 'active' && (
                      <>
                        <button
                          onClick={() => setShowUpgradeModal(true)}
                          className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Crown className="w-5 h-5" />
                          <span>Upgrade Plan</span>
                        </button>
                        <button
                          onClick={handleCancelSubscription}
                          disabled={processing}
                          className="px-6 py-3 bg-red-500/80 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-red-500 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                        >
                          <XCircle className="w-5 h-5" />
                          <span>{processing ? 'Processing...' : 'Cancel Subscription'}</span>
                        </button>
                      </>
                    )}
                    {validatedSubscription.status === 'expired' && (
                      <button
                        onClick={handleRenewSubscription}
                        disabled={processing}
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300 flex items-center space-x-2 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-5 h-5 ${processing ? 'animate-spin' : ''}`} />
                        <span>{processing ? 'Processing...' : 'Renew Subscription'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            );
          })()}

          {/* Subscription Plans */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Available Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {availablePlans.length > 0 ? availablePlans.map((plan: any) => {
                const validatedPlan = validatePlan(plan);
                return (
                <div
                  key={validatedPlan.id}
                  className={`relative rounded-3xl shadow-xl p-8 border-2 transition-all duration-300 transform hover:scale-105 ${
                    validatedPlan.isPopular 
                      ? 'bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-300 dark:border-pink-600' 
                      : 'bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {validatedPlan.isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center mb-6">
                    <div className={`inline-flex p-4 rounded-2xl mb-4 ${
                      validatedPlan.isPopular 
                        ? 'bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30' 
                        : 'bg-slate-100 dark:bg-slate-700'
                    }`}>
                      <Crown className={`w-8 h-8 ${validatedPlan.isPopular ? 'text-pink-600' : 'text-slate-600 dark:text-slate-400'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">{validatedPlan.name}</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-pink-600">₦{(validatedPlan.price || 0).toLocaleString()}</span>
                      <span className="text-slate-600 dark:text-slate-400 ml-2">/{validatedPlan.duration}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {validatedPlan.benefits && validatedPlan.benefits.length > 0 ? (
                      validatedPlan.benefits.map((benefit: string, index: number) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {validatedPlan.maxPhotos} photos maximum
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          {validatedPlan.maxVideos > 0 ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-slate-400" />
                          )}
                          <span className="text-slate-700 dark:text-slate-300">
                            {validatedPlan.maxVideos > 0 ? `${validatedPlan.maxVideos} video(s)` : 'No video uploads'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span className="text-slate-700 dark:text-slate-300">
                            {validatedPlan.topListingDuration} days top listing
                          </span>
                        </div>
                      </>
                    )}
                  </div>

                  {(() => {
                    // Check if this plan is the current subscription plan
                    const isCurrentPlan = currentSubscription && 
                      currentSubscription.SubscriptionPlan && 
                      currentSubscription.SubscriptionPlan.id === validatedPlan.id;
                    
                    // Only hide button if this is the current plan (allow upgrades from Basic to Premium/Enterprise)
                    if (isCurrentPlan) {
                      return null; // Completely hide the button
                    }
                    
                    return (
                      <button
                        onClick={() => {
                          setSelectedPlan(validatedPlan);
                          setShowUpgradeModal(true);
                        }}
                        disabled={processing}
                        className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
                          validatedPlan.isPopular
                            ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white hover:shadow-lg hover:shadow-pink-500/25'
                            : 'bg-slate-600 text-white hover:bg-slate-700'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {processing ? (
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : validatedPlan.price === 0 ? (
                          'Downgrade to Free'
                        ) : (
                          `Upgrade to ${validatedPlan.name}`
                        )}
                      </button>
                    );
                  })()}
                </div>
                );
              }) : (
                <div className="text-center py-12 col-span-full">
                  <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 font-medium">No subscription plans available</p>
                </div>
              )}
            </div>
          </div>

          {/* Feature Usage */}
          {featureLimits && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Feature Usage</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-pink-600" />
                      Photos
                    </h3>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {featureLimits.currentPhotoCount || 0} / {featureLimits.features?.maxPhotos || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-pink-600 to-orange-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${((featureLimits.currentPhotoCount || 0) / (featureLimits.features?.maxPhotos || 1)) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {featureLimits.photosRemaining || 0} photos remaining
                  </p>
                </div>

                <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 flex items-center">
                      <Camera className="w-5 h-5 mr-2 text-purple-600" />
                      Videos
                    </h3>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {featureLimits.hasVideo ? '1' : '0'} / {featureLimits.features?.maxVideos || 0}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-pink-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${featureLimits.hasVideo ? 100 : 0}%` }}
                    />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    {featureLimits.features?.maxVideos > 0 ? 'Video uploads available' : 'No video uploads'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Payment History</h2>
              {/* <button className="px-4 py-2 bg-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button> */}
            </div>

            {paymentHistory.length > 0 ? (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-md transition-all duration-200">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        payment.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                        payment.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                        'bg-amber-100 dark:bg-amber-900/30'
                      }`}>
                        <CreditCard className={`w-5 h-5 ${
                          payment.status === 'success' ? 'text-green-600 dark:text-green-400' :
                          payment.status === 'failed' ? 'text-red-600 dark:text-red-400' :
                          'text-amber-600 dark:text-amber-400'
                        }`} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-slate-50">{payment.planName}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {new Date(payment.date).toLocaleDateString()} • {payment.method}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          Transaction: {payment.transactionId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900 dark:text-slate-50">
                        ₦{(() => {
                          let amount = 0;
                          if (typeof payment.amount === 'number') {
                            amount = payment.amount;
                          } else if (typeof payment.amount === 'string') {
                            amount = parseFloat(payment.amount) || 0;
                          }
                          return amount.toLocaleString();
                        })()}
                      </p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        payment.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        payment.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400 font-medium">No payment history yet</p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  Your payment history will appear here once you make your first subscription payment
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPlan && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full shadow-2xl shadow-pink-500/20 border border-white/20 dark:border-slate-700/50">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-2xl mb-4">
                  <Crown className="w-12 h-12 text-[#ec4899]" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  {(selectedPlan.price || 0) === 0 ? 'Downgrade to Free' : `Upgrade to ${selectedPlan.name || 'Plan'}`}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {(selectedPlan.price || 0) === 0 
                    ? 'You will lose access to premium features'
                    : 'Unlock more features and grow your business faster'
                  }
                </p>
              </div>

              {/* Plan Details */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 mb-6">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 mb-4">{selectedPlan.name || 'Plan'} Plan Features</h3>
                <div className="space-y-3">
                  {selectedPlan.benefits && selectedPlan.benefits.length > 0 ? (
                    selectedPlan.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700 dark:text-slate-300">{benefit}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {selectedPlan.maxPhotos || 5} photos maximum
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        {(selectedPlan.maxVideos || 0) > 0 ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-400" />
                        )}
                        <span className="text-slate-700 dark:text-slate-300">
                          {(selectedPlan.maxVideos || 0) > 0 ? `${selectedPlan.maxVideos} video(s)` : 'No video uploads'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-slate-700 dark:text-slate-300">
                          {selectedPlan.topListingDuration || 14} days top listing
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-pink-600 mb-2">
                  ₦{(selectedPlan.price || 0).toLocaleString()}
                </div>
                <p className="text-slate-600 dark:text-slate-400">
                  {(selectedPlan.price || 0) === 0 ? 'Free forever' : `per ${(selectedPlan.duration || 'month').toLowerCase()}`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePlanChange(selectedPlan)}
                  disabled={processing}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                >
                  {processing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (selectedPlan.price || 0) === 0 ? (
                    'Downgrade Now'
                  ) : (
                    'Upgrade Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

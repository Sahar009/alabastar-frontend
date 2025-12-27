"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  Bell, 
  BarChart3, 
  FileText, 
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  Shield,
  LogOut,
  Menu,
  X,
  Home,
  BookOpen,
  CreditCard,
  User,
  HelpCircle,
  ChevronRight,
  Activity,
  Award,
  MapPin,
  Phone,
  Mail,
  Check,
  Copy,
  Share2,
  Gift
} from "lucide-react";

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  category: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  imageUrl?: string;
}

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    rating: 0,
    reviews: 0,
    walletBalance: 0
  });

  // Referral states
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    completedReferrals: 0,
    totalCommissions: 0,
    pendingCommissions: 0
  });

  // Notification states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [profileCompletionChecked, setProfileCompletionChecked] = useState(false);

  // Check if user has completed profile registration
  const checkProfileCompletion = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/providers/register/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const progress = result.data;
          
          // If user has incomplete registration, redirect to become-provider
          if (progress && !progress.isComplete) {
            console.log('Profile incomplete, redirecting to become-provider');
            router.push('/become-provider');
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error checking profile completion:', error);
    } finally {
      setProfileCompletionChecked(true);
    }
  };

  // Fetch unread notification count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${base}/api/notifications/unread-count`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadCount(data.count || 0);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  // Fetch unread messages count
  const fetchUnreadMessagesCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${base}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const totalUnread = (data.data?.conversations || []).reduce(
          (sum: number, conv: any) => sum + (conv.unreadCount || 0), 
          0
        );
        setUnreadMessagesCount(totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread messages count:', error);
    }
  };

  // Fetch recent notifications
  const fetchNotifications = async () => {
    try {
      setNotificationsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${base}/api/notifications?limit=5`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationsLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && notifications.length === 0) {
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${base}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Fetch referral code and stats
  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Get provider profile to check if referral code exists
      const profileResponse = await fetch(`${base}/api/providers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('Profile response data:', profileData);
        if (profileData.success && profileData.data) {
          const profile = profileData.data;
          
          // If no referral code, generate one
          if (!profile.referralCode) {
            console.log('No referral code found, generating one...');
            const generateResponse = await fetch(`${base}/api/referrals/generate/${profile.id}`, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });

            console.log('Generate response status:', generateResponse.status);
            
            if (generateResponse.ok) {
              const generateData = await generateResponse.json();
              console.log('Generate response data:', generateData);
              if (generateData.success) {
                setReferralCode(generateData.referralCode);
                console.log('Referral code generated:', generateData.referralCode);
              } else {
                console.error('Failed to generate referral code:', generateData.message);
                toast.error(`Failed to generate referral code: ${generateData.message}`);
              }
            } else {
              const errorData = await generateResponse.json();
              console.error('Generate referral code error:', errorData);
              toast.error(`Error generating referral code: ${errorData.message || 'Unknown error'}`);
            }
          } else {
            setReferralCode(profile.referralCode);
            console.log('Using existing referral code:', profile.referralCode);
          }

          // Update wallet balance from profile
          if (profile.wallet) {
            setStats(prevStats => ({
              ...prevStats,
              walletBalance: profile.wallet.balance || 0
            }));
          }

          // Fetch referral stats
          const statsResponse = await fetch(`${base}/api/referrals/stats/${profile.id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (statsResponse.ok) {
            const statsData = await statsResponse.json();
            if (statsData.success && statsData.data) {
              setReferralStats({
                totalReferrals: statsData.data.stats.totalReferrals,
                completedReferrals: statsData.data.stats.completedReferrals,
                totalCommissions: statsData.data.stats.totalCommissions,
                pendingCommissions: statsData.data.stats.pendingCommissions
              });
            }
          }
        } else {
          console.error('Profile fetch failed - no data:', profileData);
          // Don't show error toast if profile doesn't exist yet (incomplete registration)
          if (profileData.message !== 'Provider not found') {
            toast.error('Failed to load provider profile');
          }
        }
      } else {
        const errorData = await profileResponse.json();
        console.error('Profile fetch error:', errorData);
        // Don't show error toast if profile doesn't exist yet (incomplete registration)
        if (errorData.message !== 'Provider not found') {
          toast.error(`Error loading profile: ${errorData.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
      toast.error('Error loading referral data');
    }
  };

  // Refresh all dashboard data
  const refreshDashboardData = async () => {
    await Promise.all([
      fetchBookings(),
      fetchReferralData(),
      fetchProviderRating()
    ]);
  };

  // Copy referral code to clipboard
  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success('Referral code copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy referral code');
    }
  };

  // Share referral code
  const shareReferralCode = async () => {
    const shareText = `Join me on Alabastar! Use my referral code: ${referralCode} to get started as a service provider.`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Alabastar with my referral code',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copying
        await navigator.clipboard.writeText(shareText);
        toast.success('Referral message copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(shareText);
      toast.success('Referral message copied to clipboard!');
    }
  };

  // Fetch provider rating data
  const fetchProviderRating = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Get provider profile first to get the provider ID
      const profileResponse = await fetch(`${base}/api/providers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        if (profileData.success && profileData.data) {
          const providerId = profileData.data.id;
          
          // Fetch rating statistics
          const ratingResponse = await fetch(`${base}/api/reviews/provider/${providerId}/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (ratingResponse.ok) {
            const ratingData = await ratingResponse.json();
            if (ratingData.success && ratingData.data) {
              setStats(prevStats => ({
                ...prevStats,
                rating: ratingData.data.averageRating || 0,
                reviews: ratingData.data.totalReviews || 0
              }));
            }
          }
        }
        // Don't show error if provider profile doesn't exist yet (incomplete registration)
      } else {
        const errorData = await profileResponse.json();
        if (errorData.message !== 'Provider not found') {
          console.error('Profile fetch error in rating:', errorData);
        }
      }
    } catch (error) {
      console.error('Error fetching provider rating:', error);
    }
  };

  // Fetch bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please sign in to view bookings');
        router.push('/provider/signin');
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/bookings`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        
        // Calculate stats from real data
        const totalBookings = data.bookings?.length || 0;
        const completedBookings = data.bookings?.filter((booking: any) => booking.status === 'completed').length || 0;
        const pendingBookings = data.bookings?.filter((booking: any) => booking.status === 'pending').length || 0;
        const totalEarnings = data.bookings?.reduce((sum: number, booking: any) => {
          return booking.status === 'completed' ? sum + (booking.amount || 0) : sum;
        }, 0) || 0;

        setStats(prevStats => ({
          ...prevStats,
          totalBookings,
          completedBookings,
          pendingBookings,
          totalEarnings
        }));
      } else {
        console.error('Failed to fetch bookings:', response.statusText);
        toast.error('Failed to load bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Error loading bookings');
    } finally {
      setLoading(false);
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

    // Fetch bookings and calculate real stats
    fetchBookings();

    // Fetch referral data
    fetchReferralData();

    // Fetch provider rating data
    fetchProviderRating();

    // Check profile completion first
    checkProfileCompletion();

    // Fetch notifications and messages
    fetchUnreadCount();
    fetchUnreadMessagesCount();
    
    // Poll for new notifications and messages every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
      fetchUnreadMessagesCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('providerProfile');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleComingSoon = (feature: string) => {
    toast(`🚧 ${feature} - Coming Soon!`, {
      duration: 3000,
      icon: '🚧'
    });
  };

  const navigationItems = [
    {
      title: "Dashboard",
      icon: Home,
      href: "/provider/dashboard",
      active: true
    },
    {
      title: "Bookings",
      icon: Calendar,
      href: "/provider/bookings",
      badge: stats.pendingBookings > 0 ? stats.pendingBookings : null,
      active: false
    },
    {
      title: "Earnings",
      icon: DollarSign,
      href: "/provider/earnings"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      href: "/provider/messages",
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : null
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
      href: "/provider/subscription"
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/provider/settings"
    },
    {
      title: "Help & Support",
      icon: HelpCircle,
      href: "/provider/support"
    }
  ];

  const quickActions = [
    {
      title: "View Bookings",
      icon: Calendar,
      onClick: () => {
        // Refresh bookings before navigating
        fetchBookings();
        router.push('/provider/bookings');
      },
      color: "bg-blue-500",
      description: "Manage your bookings"
    },
    {
      title: "Earnings",
      icon: DollarSign,
      onClick: () => router.push('/provider/earnings'),
      color: "bg-green-500",
      description: "Track your income"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      onClick: () => router.push('/provider/messages'),
      color: "bg-purple-500",
      description: "Customer communications"
    },
    {
      title: "Profile Settings",
      icon: User,
      onClick: () => router.push('/provider/profile'),
      color: "bg-gray-500",
      description: "Update your profile"
    }
  ];

  // Generate recent activities from real booking data
  const recentActivities = bookings.slice(0, 4).map((booking: any) => {
    const timeAgo = new Date(booking.createdAt).toLocaleDateString();
    const amount = booking.totalAmount ? `₦${parseFloat(booking.totalAmount).toLocaleString()}` : '';
    return {
      type: "booking",
      message: `${booking.status === 'pending' ? 'New booking request' : `Booking ${booking.status}`} from ${booking.customer?.fullName || 'Customer'}${amount ? ` - ${amount}` : ''}`,
      time: timeAgo,
      status: booking.status,
      booking: booking
    };
  });

  // Add mock review and payment activities if no bookings
  // Only show real booking activities, no mock data
  const allActivities = recentActivities.slice(0, 4);

  // Show loading while checking profile completion
  if (!profileCompletionChecked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Checking profile completion...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 shadow-xl border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
              <div>
              {/* <Image src="/brand/logo.png" alt="Alabastar" width={100} height={70} priority /> */}
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
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-14 h-14 bg-pink-600 rounded-xl flex items-center justify-center">
                  <User className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate">
                  {user?.fullName || 'Provider'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {user?.email || 'provider@example.com'}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center space-x-2">
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                providerProfile?.verificationStatus === 'verified' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
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
                    router.push('/provider/subscription');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/settings') {
                    router.push('/provider/settings');
                    setSidebarOpen(false);
                  } else if (item.href === '/provider/support') {
                    router.push('/provider/support');
                    setSidebarOpen(false);
                  } else {
                    handleComingSoon(item.title);
                  }
                }}
                className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  item.active 
                    ? 'bg-pink-600 text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    item.active 
                      ? 'bg-white/20' 
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}>
                    <item.icon className={`w-5 h-5 ${
                      item.active 
                        ? 'text-white' 
                        : 'text-slate-600 dark:text-slate-400'
                    }`} />
                  </div>
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <span className="px-2.5 py-1 text-xs bg-red-500 text-white rounded-full shadow-lg animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleLogout}
              className="group w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
            >
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <LogOut className="w-5 h-5" />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-3 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Dashboard
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Welcome back, <span className="font-medium text-slate-900 dark:text-white">{user?.fullName || 'Provider'}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={refreshDashboardData}
                  disabled={loading}
                  className="group p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200 disabled:opacity-50"
                  title="Refresh dashboard data"
                >
                  <div className={`w-6 h-6 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`}>
                    <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </div>
                </button>

                {/* Notification Bell with Dropdown */}
                <div className="relative">
                  <button
                    onClick={handleNotificationClick}
                    className="group relative p-3 rounded-2xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <Bell className="w-6 h-6 group-hover:animate-bounce" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                        <Link 
                          href="/notifications" 
                          className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400"
                          onClick={() => setShowNotifications(false)}
                        >
                          View All
                        </Link>
                      </div>

                      <div className="overflow-y-auto max-h-96">
                        {notificationsLoading ? (
                          <div className="p-8 text-center text-slate-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                          </div>
                        ) : notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            <Bell size={48} className="mx-auto mb-2 opacity-30" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              className={`p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors ${
                                !notification.isRead ? 'bg-pink-50 dark:bg-pink-900/10' : ''
                              }`}
                              onClick={() => {
                                if (!notification.isRead) {
                                  markAsRead(notification.id);
                                }
                                if (notification.actionUrl) {
                                  router.push(notification.actionUrl);
                                }
                                setShowNotifications(false);
                              }}
                            >
                              <div className="flex items-start gap-3">
                                {notification.imageUrl && (
                                  <Image 
                                    src={notification.imageUrl} 
                                    alt="" 
                                    width={40} 
                                    height={40} 
                                    className="rounded-lg"
                                  />
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">
                                      {notification.title}
                                    </h4>
                                    {!notification.isRead && (
                                      <span className="flex-shrink-0 w-2 h-2 bg-pink-600 rounded-full"></span>
                                    )}
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 mt-1">
                                    {notification.body}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      notification.priority === 'urgent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                      notification.priority === 'high' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                      'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                    }`}>
                                      {notification.category}
                                    </span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">
                                      {new Date(notification.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {notifications.length > 0 && (
                        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                          <Link
                            href="/notifications"
                            className="block text-center text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 font-medium"
                            onClick={() => setShowNotifications(false)}
                          >
                            View all notifications
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Bookings</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalBookings}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% from last month
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Completed</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completedBookings}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    {Math.round((stats.completedBookings / stats.totalBookings) * 100)}% completion rate
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Pending</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pendingBookings}</p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                    Requires attention
                  </p>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Earnings</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">₦{stats.totalEarnings.toLocaleString()}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-2">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% from last month
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                  <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Wallet Balance</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">₦{stats.walletBalance.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                    Available for withdrawal
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Listing Status Card */}
          {providerProfile && (
            <div className="mb-8">
              {providerProfile.topListingEndDate && new Date(providerProfile.topListingEndDate) > new Date() ? (
                <div className="bg-gradient-to-r from-pink-600 to-pink-700 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                          <Activity className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">Top Listing Active</h3>
                          <p className="text-sm text-white/90">Your profile is featured!</p>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-white/20 rounded-full">
                        <span className="text-sm font-bold">PREMIUM</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs text-white/80 mb-1">Days Remaining</p>
                        <p className="text-3xl font-bold">
                          {Math.ceil((new Date(providerProfile.topListingEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs text-white/80 mb-1">Ends On</p>
                        <p className="text-lg font-bold">
                          {new Date(providerProfile.topListingEndDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <p className="text-xs text-white/80 mb-1">Priority Level</p>
                        <p className="text-lg font-bold flex items-center">
                          <Award className="w-5 h-5 mr-2" />
                          Level {providerProfile.listingPriority || 1}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white/10 rounded-lg border border-white/20">
                      <p className="text-xs text-white/90">
                        <span className="font-semibold">✨ Benefits:</span> Your profile appears at the top of search results, increasing visibility and bookings.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                          <Activity className="w-6 h-6 text-slate-400" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50">Top Listing Inactive</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Boost your visibility</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      Upgrade to Premium to get featured at the top of search results and increase your bookings by up to 3x!
                    </p>
                    <Link 
                      href="/provider/settings"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                    >
                      <Award className="w-5 h-5" />
                      <span>Upgrade to Premium</span>
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rating & Profile Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Rating & Reviews</h3>
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">
                  {stats.reviews > 0 ? stats.rating.toFixed(1) : 'New'}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {stats.reviews > 0 ? (
                      [...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(stats.rating) ? 'text-yellow-500 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                        />
                      ))
                    ) : (
                      [...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-slate-300 dark:text-slate-600"
                        />
                      ))
                    )}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {stats.reviews > 0 ? `${stats.reviews} reviews` : 'No reviews yet'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Verification Status</h3>
                <Shield className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex items-center space-x-3 mb-3">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  providerProfile?.verificationStatus === 'verified' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : providerProfile?.verificationStatus === 'pending'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {providerProfile?.verificationStatus === 'verified' ? 'Verified' : 
                   providerProfile?.verificationStatus === 'pending' ? 'Pending Review' : 'Rejected'}
                </div>
                {providerProfile?.verificationStatus === 'pending' && (
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {providerProfile?.verificationStatus === 'verified' 
                  ? 'Your account is verified and active'
                  : providerProfile?.verificationStatus === 'pending'
                  ? 'Your documents are under review'
                  : 'Please contact support for assistance'}
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Business Info</h3>
                <Activity className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">Lagos, Nigeria</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{user?.phone || '+234 800 000 0000'}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-600 dark:text-slate-400">{user?.email || 'provider@example.com'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Referral Program Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Referral Program</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Referral Code Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Your Referral Code</h4>
                  <Gift className="w-6 h-6 text-pink-600" />
                </div>
                
                {referralCode ? (
                  <div className="space-y-4">
                    <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-4 border-2 border-dashed border-pink-200 dark:border-pink-800">
                      <div className="text-center">
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Share this code with new providers</p>
                        <div className="text-3xl font-bold text-pink-600 font-mono tracking-wider">
                          {referralCode}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={copyReferralCode}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        <span>Copy Code</span>
                      </button>
                      <button
                        onClick={shareReferralCode}
                        className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-slate-700 dark:bg-slate-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-slate-500 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                    </div>
                    
                    <div className="text-center">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Earn <span className="font-semibold text-pink-600">10% commission</span> when your referrals subscribe!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 dark:text-slate-400">Generating your referral code...</p>
                  </div>
                )}
              </div>

              {/* Referral Stats Card */}
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Referral Stats</h4>
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {referralStats.totalReferrals}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Total Referrals
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {referralStats.completedReferrals}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Completed
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Commissions</span>
                      </div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        ₦{referralStats.totalCommissions.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending</span>
                      </div>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        ₦{referralStats.pendingCommissions.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Commissions are paid when referrals complete their first subscription
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className="group bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`p-3 rounded-lg ${action.color} text-white`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-50">{action.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{action.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <button 
                onClick={() => {
                  refreshDashboardData();
                  router.push('/provider/bookings');
                }}
                className="group px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <span>View All Bookings</span>
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            </div>
            <div className="space-y-4">
                {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">Loading activities...</span>
                </div>
              ) : allActivities.length > 0 ? (
                allActivities.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className={`p-3 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                      activity.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                    }`}>
                      {activity.type === 'booking' && <Calendar className="w-5 h-5" />}
                      {activity.type === 'review' && <Star className="w-5 h-5" />}
                      {activity.type === 'payment' && <DollarSign className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-slate-50">{activity.message}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</p>
                      {'booking' in activity && activity.booking && (
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 space-y-1">
                          <p>Service: {activity.booking.serviceType || activity.booking.category || 'General Service'}</p>
                          {activity.booking.locationCity && (
                            <p>Location: {activity.booking.locationCity}, {activity.booking.locationState}</p>
                          )}
                          {activity.booking.scheduledAt && (
                            <p>Scheduled: {new Date(activity.booking.scheduledAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      activity.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : activity.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {activity.status}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">No recent activities</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Your booking activities will appear here</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}












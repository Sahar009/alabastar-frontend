"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Bell,
  Shield,
  CreditCard,
  Globe,
  Moon,
  Sun,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  Smartphone,
  MessageSquare,
  DollarSign,
  Clock,
  Languages,
  Trash2,
  LogOut,
  Download,
  FileText,
  X,
  ChevronRight
} from "lucide-react";

export default function ProviderSettings() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  
  // Account settings
  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailEnabled: true,
    smsEnabled: false,
    pushEnabled: true,
    inAppEnabled: true,
    bookingNotifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    transactionNotifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    messageNotifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    accountNotifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    marketingNotifications: {
      email: false,
      sms: false,
      push: false,
      inApp: false
    },
    systemNotifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    doNotDisturbStart: '',
    doNotDisturbEnd: '',
    timezone: 'Africa/Lagos',
    language: 'en'
  });

  // Privacy settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showPhone: true,
    showEmail: false,
    allowMessages: true,
    allowReviews: true
  });

  // Theme settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');

  // Subscription states
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [selectedPlanForPayment, setSelectedPlanForPayment] = useState<any>(null);
  const [initializingPayment, setInitializingPayment] = useState(false);
  const [loadingPlansModal, setLoadingPlansModal] = useState(false);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please sign in to view settings');
        router.push('/provider/signin');
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Fetch provider profile
      const profileResponse = await fetch(`${base}/api/providers/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const profile = profileData.data;
        const userData = profile.User || profile.user || {};
        
        setProviderProfile(profile);
        setUser(userData);
        setAccountData({
          fullName: userData.fullName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }

      // Fetch notification preferences
      const prefsResponse = await fetch(`${base}/api/notifications/preferences`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (prefsResponse.ok) {
        const prefsData = await prefsResponse.json();
        if (prefsData.data) {
          setNotificationPrefs(prev => ({
            ...prev,
            ...prefsData.data
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error loading settings');
    } finally {
      setLoading(false);
    }
  };

  // Fetch subscription data
  const fetchSubscriptionData = async () => {
    try {
      setLoadingSubscription(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Fetch active subscription
      const subResponse = await fetch(`${base}/api/subscriptions/my-subscription`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (subResponse.ok) {
        const subData = await subResponse.json();
        setActiveSubscription(subData.data);
      }

      // Fetch available plans
      const plansResponse = await fetch(`${base}/api/subscription-plans/plans`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (plansResponse.ok) {
        const plansData = await plansResponse.json();
        setAvailablePlans(plansData.data || plansData);
      }
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  // Cancel subscription
  const handleCancelSubscription = async () => {
    if (!activeSubscription) return;

    if (!confirm('Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period.')) {
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/subscriptions/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: activeSubscription.id
        })
      });

      if (response.ok) {
        toast.success('Subscription cancelled successfully');
        await fetchSubscriptionData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      toast.error('Error cancelling subscription');
    } finally {
      setSaving(false);
    }
  };

  // Reactivate subscription
  const handleReactivateSubscription = async () => {
    if (!activeSubscription) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/subscriptions/reactivate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: activeSubscription.id
        })
      });

      if (response.ok) {
        toast.success('Subscription reactivated successfully');
        await fetchSubscriptionData();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast.error('Error reactivating subscription');
    } finally {
      setSaving(false);
    }
  };

  // Fetch plans for modal
  const fetchPlansForModal = async () => {
    try {
      setLoadingPlansModal(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/subscription-plans/plans`, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailablePlans(data.data || data);
      } else {
        toast.error('Failed to load subscription plans');
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Error loading plans');
    } finally {
      setLoadingPlansModal(false);
    }
  };

  // Open plans modal and fetch plans
  const handleOpenPlansModal = () => {
    setShowPlansModal(true);
    if (availablePlans.length === 0) {
      fetchPlansForModal();
    }
  };

  // Initialize payment for subscription
  const handleSubscribeToPlan = async (plan: any) => {
    try {
      setInitializingPayment(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

      const data = await response.json();

      if (response.ok && data.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        toast.error(data.message || 'Failed to initialize payment');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast.error('Error initializing payment');
    } finally {
      setInitializingPayment(false);
    }
  };

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
            window.history.replaceState({}, '', '/provider/settings?tab=subscription');
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
  }, []);

  useEffect(() => {
    fetchUserData();
    fetchSubscriptionData();
  }, []);

  // Update account information
  const handleUpdateAccount = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Update basic info
      const response = await fetch(`${base}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: accountData.fullName,
          phone: accountData.phone
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update account');
      }

      toast.success('Account updated successfully!');
      
      // Update password if provided
      if (accountData.newPassword) {
        if (accountData.newPassword !== accountData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }

        if (!accountData.currentPassword) {
          toast.error('Please enter your current password');
          return;
        }

        const passwordResponse = await fetch(`${base}/api/auth/change-password`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            currentPassword: accountData.currentPassword,
            newPassword: accountData.newPassword
          })
        });

        if (passwordResponse.ok) {
          toast.success('Password updated successfully!');
          setAccountData(prev => ({
            ...prev,
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }));
        } else {
          const errorData = await passwordResponse.json();
          toast.error(errorData.message || 'Failed to update password');
        }
      }

      await fetchUserData();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    } finally {
      setSaving(false);
    }
  };

  // Update notification preferences
  const handleUpdateNotifications = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/notifications/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(notificationPrefs)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      toast.success('Notification preferences updated!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update preferences');
    } finally {
      setSaving(false);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    const confirmText = prompt('Type "DELETE" to confirm account deletion:');
    if (confirmText !== 'DELETE') {
      toast.error('Account deletion cancelled');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/auth/delete-account`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Account deleted successfully');
        localStorage.clear();
        router.push('/');
      } else {
        throw new Error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('providerProfile');
    toast.success('Logged out successfully');
    router.push('/');
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    // { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'subscription', label: 'Subscription', icon: CreditCard }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/provider/dashboard')}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-4xl font-bold text-[#ec4899] mb-2">
                Settings
              </h1>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                Manage your account preferences and settings
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-6 border border-slate-200/50 dark:border-slate-700/50 lg:sticky lg:top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-[#ec4899] text-white shadow-lg'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Quick Actions */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                      <User className="w-6 h-6 text-[#ec4899]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Account Settings</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Manage your personal information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={accountData.fullName}
                        onChange={(e) => setAccountData(prev => ({ ...prev, fullName: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={accountData.email}
                        disabled
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                        Email cannot be changed
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={accountData.phone}
                        onChange={(e) => setAccountData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Change Password Section */}
                  <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-[#ec4899]" />
                      Change Password
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            value={accountData.currentPassword}
                            onChange={(e) => setAccountData(prev => ({ ...prev, currentPassword: e.target.value }))}
                            className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={accountData.newPassword}
                              onChange={(e) => setAccountData(prev => ({ ...prev, newPassword: e.target.value }))}
                              className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                              placeholder="Enter new password"
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Confirm New Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              value={accountData.confirmPassword}
                              onChange={(e) => setAccountData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              className="w-full px-4 py-3 pr-12 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                              placeholder="Confirm new password"
                              minLength={8}
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleUpdateAccount}
                      disabled={saving}
                      className="px-8 py-3 bg-[#ec4899] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                      <Bell className="w-6 h-6 text-[#ec4899]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Notification Preferences</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Choose how you want to be notified</p>
                    </div>
                  </div>

                  {/* Global Notification Channels */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Notification Channels</h3>
                    <div className="space-y-4">
                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">Email Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications via email</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationPrefs.emailEnabled}
                          onChange={(e) => setNotificationPrefs(prev => ({ ...prev, emailEnabled: e.target.checked }))}
                          className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center space-x-3">
                          <Smartphone className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">SMS Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive notifications via SMS</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationPrefs.smsEnabled}
                          onChange={(e) => setNotificationPrefs(prev => ({ ...prev, smsEnabled: e.target.checked }))}
                          className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center space-x-3">
                          <Bell className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">Push Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Receive push notifications</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationPrefs.pushEnabled}
                          onChange={(e) => setNotificationPrefs(prev => ({ ...prev, pushEnabled: e.target.checked }))}
                          className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                        />
                      </label>

                      <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                        <div className="flex items-center space-x-3">
                          <MessageSquare className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">In-App Notifications</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Show notifications in the app</p>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={notificationPrefs.inAppEnabled}
                          onChange={(e) => setNotificationPrefs(prev => ({ ...prev, inAppEnabled: e.target.checked }))}
                          className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                        />
                      </label>
                    </div>
                  </div>

             

                  {/* Do Not Disturb */}
                

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleUpdateNotifications}
                      disabled={saving}
                      className="px-8 py-3 bg-[#ec4899] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Privacy Settings
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                      <Shield className="w-6 h-6 text-[#ec4899]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Privacy Settings</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Control your privacy and visibility</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Profile Visibility</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="public"
                            checked={privacySettings.profileVisibility === 'public'}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                            className="w-4 h-4 text-[#ec4899] focus:ring-[#ec4899]"
                          />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">Public</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Anyone can view your profile</p>
                          </div>
                        </label>
                        <label className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                          <input
                            type="radio"
                            name="profileVisibility"
                            value="private"
                            checked={privacySettings.profileVisibility === 'private'}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                            className="w-4 h-4 text-[#ec4899] focus:ring-[#ec4899]"
                          />
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">Private</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Only customers you've worked with can see your profile</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Contact Information</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">Show Phone Number</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Display your phone on profile</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showPhone}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, showPhone: e.target.checked }))}
                            className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">Show Email Address</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Display your email on profile</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.showEmail}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))}
                            className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                          />
                        </label>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Interactions</h3>
                      <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                          <div className="flex items-center space-x-3">
                            <MessageSquare className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">Allow Direct Messages</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Let customers message you directly</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.allowMessages}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowMessages: e.target.checked }))}
                            className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                          />
                        </label>

                        <label className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl cursor-pointer hover:shadow-md transition-all">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-slate-400" />
                            <div>
                              <p className="font-medium text-slate-900 dark:text-slate-100">Allow Reviews</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Let customers leave reviews</p>
                            </div>
                          </div>
                          <input
                            type="checkbox"
                            checked={privacySettings.allowReviews}
                            onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowReviews: e.target.checked }))}
                            className="w-5 h-5 text-[#ec4899] rounded focus:ring-[#ec4899]"
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={() => {
                        toast.success('Privacy settings updated!');
                      }}
                      disabled={saving}
                      className="px-8 py-3 bg-[#ec4899] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        <Save className="w-4 h-4" />
                        <span>Save Settings</span>
                      </div>
                    </button>
                  </div>
                </div>
              )} */}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                      <Lock className="w-6 h-6 text-[#ec4899]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Security Settings</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Manage your account security</p>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Two-Factor Authentication</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security</p>
                      </div>
                      <button
                        onClick={() => toast('🚧 Coming Soon!', { duration: 3000 })}
                        className="px-4 py-2 bg-[#ec4899] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                      >
                        Enable
                      </button>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-amber-600 dark:text-amber-400">
                      <AlertCircle className="w-4 h-4" />
                      <span>Not enabled</span>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Smartphone className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">Current Device</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Last active: Just now</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Login History */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Recent Login Activity</h3>
                    <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-700 rounded-xl">
                        <span>Last login</span>
                        <span className="font-medium">{user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Just now'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Settings */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                      <CreditCard className="w-6 h-6 text-[#ec4899]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Subscription</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Manage your subscription plan</p>
                    </div>
                  </div>

                  {loadingSubscription ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-8 h-8 text-[#ec4899] animate-spin" />
                    </div>
                  ) : activeSubscription ? (
                    <>
                      {/* Current Subscription */}
                      <div className="bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-pink-200 dark:border-pink-800">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Current Plan</h3>
                            <p className="text-2xl font-bold text-[#ec4899] mt-1">
                              {activeSubscription.SubscriptionPlan?.name || 'N/A'}
                            </p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            activeSubscription.status === 'active' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : activeSubscription.status === 'cancelled'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {activeSubscription.status.charAt(0).toUpperCase() + activeSubscription.status.slice(1)}
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center justify-between">
                            <span>{activeSubscription.SubscriptionPlan?.interval || 'Monthly'} fee</span>
                            <span className="font-semibold">
                              ₦{(activeSubscription.SubscriptionPlan?.price || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Next billing date</span>
                            <span className="font-semibold">
                              {new Date(activeSubscription.currentPeriodEnd).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Auto-renewal</span>
                            <span className={`font-semibold ${activeSubscription.autoRenew ? 'text-green-600' : 'text-red-600'}`}>
                              {activeSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-6 pt-4 border-t border-pink-200 dark:border-pink-800">
                          {activeSubscription.status === 'active' ? (
                            <button
                              onClick={handleCancelSubscription}
                              disabled={saving}
                              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Cancel Subscription
                            </button>
                          ) : activeSubscription.status === 'cancelled' ? (
                            <button
                              onClick={handleReactivateSubscription}
                              disabled={saving}
                              className="px-4 py-2 text-sm text-green-600 hover:text-green-700 dark:text-green-400 font-medium hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-50"
                            >
                              Reactivate Subscription
                            </button>
                          ) : null}
                        </div>
                      </div>

                      {/* Available Plans */}
                      {availablePlans.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Available Plans</h3>
                          <div className="space-y-3">
                            {availablePlans.map((plan: any) => (
                              <div 
                                key={plan.id} 
                                className="p-4 bg-white dark:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-600"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold text-slate-900 dark:text-slate-50">{plan.name}</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                      ₦{plan.price.toLocaleString()} / {plan.interval}
                                    </p>
                                  </div>
                                  {activeSubscription.planId === plan.id ? (
                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">Current Plan</span>
                                  ) : (
                                    <button
                                      onClick={() => handleSubscribeToPlan(plan)}
                                      disabled={initializingPayment}
                                      className="text-sm text-[#ec4899] hover:text-pink-700 font-medium disabled:opacity-50"
                                    >
                                      {initializingPayment ? 'Processing...' : 'Switch Plan'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No Active Subscription</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                        Subscribe to a plan to access all features
                      </p>
                      <button
                        onClick={handleOpenPlansModal}
                        className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        View Plans
                      </button>
                    </div>
                  )}

                  {/* Plans Modal */}
                  {showPlansModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                      <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-pink-500/20 border border-white/20 dark:border-slate-700/50 animate-in zoom-in-95 duration-300">
                        <div className="sticky top-0 bg-gradient-to-r from-white/90 to-pink-50/90 dark:from-slate-800/90 dark:to-pink-900/20 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 p-6 flex items-center justify-between z-10">
                          <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">Choose Your Plan</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Select a subscription plan that fits your needs</p>
                          </div>
                          <button
                            onClick={() => setShowPlansModal(false)}
                            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200 hover:scale-110"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </div>

                        <div className="p-6">
                          {loadingPlansModal ? (
                            <div className="flex flex-col items-center justify-center py-16">
                              <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mb-4" />
                              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading subscription plans...</p>
                            </div>
                          ) : availablePlans.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {availablePlans.map((plan: any, index: number) => (
                                <div
                                  key={plan.id}
                                  className="group relative bg-gradient-to-br from-white/80 to-pink-50/50 dark:from-slate-700/80 dark:to-pink-900/20 backdrop-blur-sm rounded-2xl p-6 border-2 border-slate-200/50 dark:border-slate-600/50 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/20 hover:scale-105 animate-in slide-in-from-bottom duration-500"
                                  style={{ animationDelay: `${index * 100}ms` }}
                                >
                                  {activeSubscription?.planId === plan.id && (
                                    <div className="absolute -top-3 -right-3 px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-lg shadow-green-500/50 animate-pulse">
                                      ✓ Current Plan
                                    </div>
                                  )}
                                  
                                  <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-3 group-hover:text-pink-600 transition-colors">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center mb-2">
                                      <span className="text-5xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent">₦{plan.price.toLocaleString()}</span>
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">per {plan.interval}</span>
                                  </div>

                                  {plan.benefits && plan.benefits.length > 0 && (
                                    <ul className="space-y-3 mb-6">
                                      {plan.benefits.map((benefit: string, idx: number) => (
                                        <li key={idx} className="flex items-start space-x-3 text-sm text-slate-700 dark:text-slate-300">
                                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                          <span className="leading-relaxed">{benefit}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  <button
                                    onClick={() => {
                                      setShowPlansModal(false);
                                      handleSubscribeToPlan(plan);
                                    }}
                                    disabled={initializingPayment || activeSubscription?.planId === plan.id}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                                      activeSubscription?.planId === plan.id
                                        ? 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400 shadow-slate-300/50'
                                        : 'bg-gradient-to-r from-pink-600 via-pink-500 to-orange-500 text-white hover:shadow-2xl hover:shadow-pink-500/50 hover:from-pink-500 hover:to-orange-600'
                                    }`}
                                  >
                                    {initializingPayment ? (
                                      <span className="flex items-center justify-center space-x-2">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Processing Payment...</span>
                                      </span>
                                    ) : activeSubscription?.planId === plan.id ? (
                                      <span className="flex items-center justify-center space-x-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span>Current Plan</span>
                                      </span>
                                    ) : (
                                      <span className="flex items-center justify-center space-x-2">
                                        <span>Subscribe Now</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                      </span>
                                    )}
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12">
                              <AlertCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                              <p className="text-slate-600 dark:text-slate-400">No subscription plans available</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  <div className="bg-slate-50 dark:bg-slate-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Payment Method</h3>
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-700 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <CreditCard className="w-5 h-5 text-slate-400" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-slate-100">Card ending in ****</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Managed by Paystack</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toast('🚧 Coming Soon!', { duration: 3000 })}
                        className="text-sm text-[#ec4899] hover:text-pink-700 font-medium"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Danger Zone */}
              {activeTab === 'security' && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-700">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <h3 className="text-lg font-semibold text-red-900 dark:text-red-100">Danger Zone</h3>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={saving}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Account</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
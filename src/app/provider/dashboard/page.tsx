"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  LogOut
} from "lucide-react";

export default function ProviderDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    completedBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    rating: 0,
    reviews: 0
  });

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

    // Mock stats data - replace with actual API calls
    setStats({
      totalBookings: 24,
      completedBookings: 18,
      pendingBookings: 6,
      totalEarnings: 125000,
      rating: 4.8,
      reviews: 23
    });
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

  const quickActions = [
    {
      title: "View Bookings",
      icon: Calendar,
      onClick: () => router.push('/provider/bookings'),
      color: "bg-blue-500"
    },
    {
      title: "Earnings",
      icon: DollarSign,
      onClick: () => handleComingSoon("Earnings Dashboard"),
      color: "bg-green-500"
    },
    {
      title: "Messages",
      icon: MessageSquare,
      onClick: () => handleComingSoon("Messages"),
      color: "bg-purple-500"
    },
    {
      title: "Profile Settings",
      icon: Settings,
      onClick: () => router.push('/provider/settings'),
      color: "bg-gray-500"
    }
  ];

  const recentActivities = [
    { type: "booking", message: "New booking request from John Doe", time: "2 hours ago", status: "pending" },
    { type: "review", message: "Received 5-star review from Sarah", time: "1 day ago", status: "completed" },
    { type: "payment", message: "Payment received: ₦15,000", time: "2 days ago", status: "completed" },
    { type: "booking", message: "Booking completed for plumbing service", time: "3 days ago", status: "completed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                Provider Dashboard
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Welcome back, {user?.fullName || 'Provider'}!
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleComingSoon("Notifications")}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <Bell className="w-6 h-6" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Bookings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{stats.totalBookings}</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.completedBookings}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pendingBookings}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Earnings</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Rating & Reviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Rating & Reviews</h3>
              <Star className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">{stats.rating}</div>
              <div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(stats.rating) ? 'text-yellow-500 fill-current' : 'text-slate-300 dark:text-slate-600'}`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">{stats.reviews} reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">Verification Status</h3>
              <Shield className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center space-x-3">
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
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {providerProfile?.verificationStatus === 'verified' 
                ? 'Your account is verified and active'
                : providerProfile?.verificationStatus === 'pending'
                ? 'Your documents are under review'
                : 'Please contact support for assistance'}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-50">{action.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Click to access</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <div className={`p-2 rounded-full ${
                  activity.status === 'completed' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400' :
                  activity.status === 'pending' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400' :
                  'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400'
                }`}>
                  {activity.type === 'booking' && <Calendar className="w-4 h-4" />}
                  {activity.type === 'review' && <Star className="w-4 h-4" />}
                  {activity.type === 'payment' && <DollarSign className="w-4 h-4" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-50">{activity.message}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}












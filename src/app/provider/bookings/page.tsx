
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  MapPin, 
  Phone,
  MessageSquare,
  Star,
  Filter,
  Search,
  ArrowLeft,
  RefreshCw,
  Eye,
  MoreVertical,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2
} from "lucide-react";

export default function ProviderBookings() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    totalEarnings: 0
  });

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
      const response = await fetch(`${base}/api/bookings?userType=provider`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings || []);
        
        // Calculate stats
        const total = data.bookings?.length || 0;
        const pending = data.bookings?.filter((b: any) => b.status === 'pending').length || 0;
        const confirmed = data.bookings?.filter((b: any) => b.status === 'confirmed').length || 0;
        const completed = data.bookings?.filter((b: any) => b.status === 'completed').length || 0;
        const cancelled = data.bookings?.filter((b: any) => b.status === 'cancelled').length || 0;
        const totalEarnings = data.bookings?.reduce((sum: number, b: any) => {
          return b.status === 'completed' ? sum + (b.totalAmount || 0) : sum;
        }, 0) || 0;

        setStats({ total, pending, confirmed, completed, cancelled, totalEarnings });
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
    fetchBookings();
  }, []);

  // Update booking status
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      setUpdating(bookingId);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${base}/api/bookings/${bookingId}?userType=provider`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        toast.success(`Booking ${newStatus} successfully!`);
        // Refresh bookings
        await fetchBookings();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Error updating booking status');
    } finally {
      setUpdating(null);
    }
  };

  const handleComingSoon = (feature: string) => {
    toast(`🚧 ${feature} - Coming Soon!`, {
      duration: 3000,
      icon: '🚧'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'confirmed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': 
        return (
          <div className="relative">
            <Clock className="w-4 h-4 text-green-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        );
      case 'confirmed': 
        return (
          <div className="relative">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        );
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/provider/dashboard')}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Bookings
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Manage your service bookings and track your progress
                </p>
              </div>
            </div>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="group px-4 py-2 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Pending</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Confirmed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Completed</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.completed}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Earnings</p>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search bookings by customer, service, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-600 focus:border-transparent transition-colors font-medium"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading bookings...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => (
              <div 
                key={booking.id} 
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                          {booking.service?.name || 'General Service'}
                        </h3>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 capitalize">{booking.status}</span>
                        </span>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <div className="flex items-center space-x-1">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-progress-dots" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-progress-dots" style={{ animationDelay: '200ms' }}></div>
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-progress-dots" style={{ animationDelay: '400ms' }}></div>
                            </div>
                            <span className="text-xs text-green-600 dark:text-green-400 ml-2">Processing...</span>
                          </div>
                        )}
                      </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{booking.customer?.fullName || 'Customer'}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                              <Phone className="w-4 h-4" />
                            </div>
                            <span>{booking.customer?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span>{booking.locationAddress || 'Location not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span>{new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white">
                            ₦{booking.totalAmount?.toLocaleString() || '0'}
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded-lg">
                              <strong>Notes:</strong> {booking.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'confirmed')}
                            disabled={updating === booking.id}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                          >
                            {updating === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            disabled={updating === booking.id}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                          >
                            {updating === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4" />
                            )}
                            <span>Decline</span>
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          disabled={updating === booking.id}
                          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                        >
                          {updating === booking.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4" />
                          )}
                          <span>Mark Complete</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleComingSoon("Customer Messages")}
                        className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg font-medium hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-pink-600 hover:text-pink-600 transition-colors flex items-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBookings.length === 0 && (
          <div className="text-center py-16">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="p-6 bg-pink-100 dark:bg-pink-900/20 rounded-full">
                <Calendar className="w-12 h-12 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 mb-4">
              {searchTerm || filter !== 'all' ? 'No bookings found' : 'No bookings yet'}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria to find what you\'re looking for.'
                : 'You don\'t have any bookings yet. Complete your profile and start offering services to receive booking requests.'}
            </p>
            {!searchTerm && filter === 'all' && (
              <button
                onClick={() => router.push('/provider/dashboard')}
                className="px-6 py-3 bg-pink-600 text-white rounded-lg font-medium hover:bg-pink-700 transition-colors"
              >
                <span className="flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowLeft className="w-4 h-4" />
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}












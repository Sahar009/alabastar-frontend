
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
      case 'pending': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
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
                <h1 className="text-4xl font-bold text-[#ec4899] mb-2">
                  Bookings
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Manage your service bookings and track your progress
                </p>
              </div>
            </div>
            <button
              onClick={fetchBookings}
              disabled={loading}
              className="group px-4 py-2 bg-[#ec4899] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                <span>Refresh</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="group bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Total Bookings</p>
                <p className="text-3xl font-bold text-[#ec4899]">{stats.total}</p>
              </div>
              <div className="p-3 bg-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Calendar className="w-6 h-6 text-[#ec4899] group-hover:animate-bounce" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-amber-50 to-white dark:from-slate-800 dark:via-amber-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Pending</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-amber-100 to-yellow-200 dark:from-amber-900/30 dark:to-yellow-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 group-hover:animate-pulse" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-pink-50 to-white dark:from-slate-800 dark:via-pink-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Confirmed</p>
                <p className="text-3xl font-bold text-[#ec4899]">{stats.confirmed}</p>
              </div>
              <div className="p-3 bg-pink-100 dark:from-pink-900/30 dark:to-pink-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-6 h-6 text-[#ec4899] group-hover:animate-bounce" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-green-50 to-white dark:from-slate-800 dark:via-green-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Completed</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.completed}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900/30 dark:to-emerald-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 group-hover:animate-pulse" />
              </div>
            </div>
          </div>

          <div className="group bg-gradient-to-br from-white via-emerald-50 to-white dark:from-slate-800 dark:via-emerald-900/20 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Earnings</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">₦{stats.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-200 dark:from-emerald-900/30 dark:to-emerald-800/30 rounded-2xl group-hover:scale-110 transition-transform duration-300">
               
                <span className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:animate-bounce">₦</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-lg p-6 border border-slate-200/50 dark:border-slate-700/50 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 group-hover:text-[#ec4899] transition-colors duration-200" />
                <input
                  type="text"
                  placeholder="Search bookings by customer, service, or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-3">
              <Filter className="w-5 h-5 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md font-medium"
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
                className="group bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Booking Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-50 group-hover:text-[#ec4899] transition-colors duration-200">
                          {booking.service?.name || 'General Service'}
                        </h3>
                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          <span className="ml-2 capitalize">{booking.status}</span>
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="font-medium">{booking.customer?.fullName || 'Customer'}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                              <Phone className="w-4 h-4" />
                            </div>
                            <span>{booking.customer?.phone || 'N/A'}</span>
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span>{booking.locationAddress || 'Location not specified'}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                            <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <span>{new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                          <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                            ₦{booking.totalAmount?.toLocaleString() || '0'}
                          </div>
                          {booking.notes && (
                            <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 p-3 rounded-xl">
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
                            className="group px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2"
                          >
                            {updating === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            )}
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleStatusChange(booking.id, 'cancelled')}
                            disabled={updating === booking.id}
                            className="group px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2"
                          >
                            {updating === booking.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            )}
                            <span>Decline</span>
                          </button>
                        </>
                      )}
                      
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking.id, 'completed')}
                          disabled={updating === booking.id}
                          className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 flex items-center space-x-2"
                        >
                          {updating === booking.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          )}
                          <span>Mark Complete</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleComingSoon("Customer Messages")}
                        className="group px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-[#ec4899] hover:text-[#ec4899] transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                      >
                        <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
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
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-[#ec4899]/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-4 bg-[#ec4899]/10 rounded-full"></div>
              <Calendar className="absolute inset-0 w-16 h-16 text-[#ec4899] mx-auto my-auto animate-bounce" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-4">
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
                className="group px-6 py-3 bg-[#ec4899] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span>Go to Dashboard</span>
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
                </span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}












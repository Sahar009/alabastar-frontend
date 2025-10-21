"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetMyBookingsQuery } from "../../store/api/providersApi";
import { 
  Loader2, Calendar, Clock, MapPin, ArrowLeft, CheckCircle, 
  XCircle, AlertCircle, User, RefreshCw, ChevronLeft, ChevronRight,
  Search, Filter, MessageSquare, Star, Eye, CheckCircle2, X,
  Phone, Mail, ShieldCheck, FileText, CalendarDays, MapPinIcon
} from "lucide-react";

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
  </svg>
);

export default function BookingsPage() {
  const router = useRouter();
  const { data, isLoading, refetch } = useGetMyBookingsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    refetch();
  }, [refetch]);

  const bookings = Array.isArray(data?.data) ? data?.data : data?.data?.bookings || [];
  
  // Calculate stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter((b: any) => b.status === 'pending').length,
    confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
    completed: bookings.filter((b: any) => b.status === 'completed').length,
    cancelled: bookings.filter((b: any) => b.status === 'cancelled').length
  };

  // Filter bookings
  const filteredBookings = bookings.filter((booking: any) => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.service?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.providerProfile?.User?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  
  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBookings = filteredBookings.slice(startIndex, endIndex);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleComingSoon = (feature: string) => {
    // Simple alert for coming soon features
    alert(`🚧 ${feature} - Coming Soon!`);
  };

  const viewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailsModal(true);
  };

  const handleWhatsAppMessage = (phoneNumber: string, message?: string) => {
    const cleanPhone = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const defaultMessage = message || "Hello! I have a question about my booking.";
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`, '_self');
  };

  const redirectToMessages = (booking: any) => {
    const providerId = booking.providerProfile?.User?.id;
    if (providerId) {
      // Redirect to messages page with provider ID as query parameter
      router.push(`/messages?provider=${providerId}&booking=${booking.id}`);
    } else {
      alert('Provider information not available');
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
                onClick={() => router.back()}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold text-[#ec4899] mb-2">
                  My Bookings
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Track your service bookings and manage your appointments
                </p>
              </div>
            </div>
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="group px-4 py-2 bg-[#ec4899] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
            >
              <div className="flex items-center space-x-2">
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                <span>Refresh</span>
              </div>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                  placeholder="Search bookings by service, provider, or notes..."
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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading bookings...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {currentBookings.map((booking: any, index: number) => {
              const dt = new Date(booking.scheduledAt);
              const city = booking.locationCity || booking.providerProfile?.locationCity;
              const state = booking.locationState || booking.providerProfile?.locationState;
              const service = booking.service?.title || 'Service';
              const provider = booking.providerProfile?.User?.fullName || 'Provider';
              
              return (
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
                            {service}
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
                              <span className="font-medium">{provider}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                <Calendar className="w-4 h-4" />
                              </div>
                              <span>{dt.toLocaleDateString()} at {dt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            </div>
                            <div className="flex items-center space-x-3 text-sm text-slate-600 dark:text-slate-400">
                              <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <span>{city}, {state}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
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
                        <button
                          onClick={() => viewBookingDetails(booking)}
                          className="group px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                        >
                          <Eye className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>View Details</span>
                        </button>

                        <button
                          onClick={() => redirectToMessages(booking)}
                          className="group px-6 py-3 bg-gradient-to-r from-[#ec4899] to-pink-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                        >
                          <MessageSquare className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                          <span>Message</span>
                        </button>

                        {booking.providerProfile?.User?.phone && (
                          <>
                            <button
                              onClick={() => handleWhatsAppMessage(booking.providerProfile.User.phone, `Hello! I have a question about my booking for ${service} scheduled on ${new Date(booking.scheduledAt).toLocaleDateString()}.`)}
                              className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                            >
                              <WhatsAppIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              <span>WhatsApp</span>
                            </button>
                            
                            <button
                              onClick={() => handleCall(booking.providerProfile.User.phone)}
                              className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                            >
                              <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              <span>Call</span>
                            </button>
                          </>
                        )}

                        {booking.status === 'completed' && (
                          <button
                            onClick={() => handleComingSoon("Rate Service")}
                            className="group px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
                          >
                            <Star className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                            <span>Rate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center space-x-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBookings.length === 0 && (
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
                : 'You haven\'t made any bookings yet. Start by finding a service provider that matches your needs.'}
            </p>
            {!searchTerm && filter === 'all' && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href="/providers" 
                  className="group px-6 py-3 bg-[#ec4899] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Find Providers</span>
                  </span>
                </Link>
                <Link 
                  href="/" 
                  className="group px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-semibold"
                >
                  <span className="flex items-center space-x-2">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back Home</span>
                  </span>
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Booking Details Modal */}
        {showDetailsModal && selectedBooking && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Booking Details
                  </h2>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Service Information */}
                <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700 dark:to-slate-800 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#ec4899]" />
                    Service Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                        {selectedBooking.service?.title || 'Service'}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400">
                        {selectedBooking.service?.description || 'No description available'}
                      </p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold shadow-sm ${getStatusColor(selectedBooking.status)}`}>
                        {getStatusIcon(selectedBooking.status)}
                        <span className="ml-2 capitalize">{selectedBooking.status}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provider Information */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Provider Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Provider Name</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {selectedBooking.providerProfile?.User?.fullName || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <Mail className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {selectedBooking.providerProfile?.User?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <Phone className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Phone</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {selectedBooking.providerProfile?.User?.phone || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Verification Status</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {selectedBooking.providerProfile?.verificationStatus === 'verified' ? 'Verified' : 'Pending'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                          <MapPinIcon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Business Location</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {selectedBooking.providerProfile?.businessAddress || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2 text-green-600" />
                    Booking Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Scheduled Date</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {new Date(selectedBooking.scheduledAt).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <Clock className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Scheduled Time</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {new Date(selectedBooking.scheduledAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <MapPin className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Service Location</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {selectedBooking.locationAddress || 'Location not specified'}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {selectedBooking.locationCity}, {selectedBooking.locationState}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                          <Calendar className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Booking Date</p>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                {selectedBooking.notes && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-amber-600" />
                      Additional Notes
                    </h3>
                    <div className="bg-white dark:bg-slate-700 p-4 rounded-xl">
                      <p className="text-slate-700 dark:text-slate-300">
                        {selectedBooking.notes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => redirectToMessages(selectedBooking)}
                    className="group px-6 py-3 bg-gradient-to-r from-[#ec4899] to-pink-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Message</span>
                  </button>

                  {selectedBooking.providerProfile?.User?.phone && (
                    <>
                      <button
                        onClick={() => handleWhatsAppMessage(selectedBooking.providerProfile.User.phone, `Hello! I have a question about my booking for ${selectedBooking.service?.title || 'Service'} scheduled on ${new Date(selectedBooking.scheduledAt).toLocaleDateString()}.`)}
                        className="group px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <WhatsAppIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span>WhatsApp</span>
                      </button>
                      
                      <button
                        onClick={() => handleCall(selectedBooking.providerProfile.User.phone)}
                        className="group px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        <span>Call</span>
                      </button>
                    </>
                  )}
                  
                  {selectedBooking.status === 'completed' && (
                    <button
                      onClick={() => handleComingSoon("Rate Service")}
                      className="group px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Star className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>Rate Service</span>
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="group px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-[#ec4899] hover:text-[#ec4899] transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Close</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



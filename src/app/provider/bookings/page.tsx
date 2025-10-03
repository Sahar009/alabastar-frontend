"use client";
import { useState } from "react";
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
  Search
} from "lucide-react";

export default function ProviderBookings() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock booking data
  const bookings = [
    {
      id: '1',
      customer: {
        name: 'John Doe',
        phone: '+2348123456789',
        email: 'john@example.com'
      },
      service: 'Plumbing Repair',
      date: '2024-01-15',
      time: '10:00 AM',
      location: 'Victoria Island, Lagos',
      status: 'pending',
      amount: 15000,
      description: 'Fix leaky faucet in kitchen'
    },
    {
      id: '2',
      customer: {
        name: 'Sarah Johnson',
        phone: '+2348123456790',
        email: 'sarah@example.com'
      },
      service: 'Electrical Wiring',
      date: '2024-01-14',
      time: '2:00 PM',
      location: 'Ikoyi, Lagos',
      status: 'completed',
      amount: 25000,
      description: 'Install new electrical outlets'
    },
    {
      id: '3',
      customer: {
        name: 'Mike Wilson',
        phone: '+2348123456791',
        email: 'mike@example.com'
      },
      service: 'AC Repair',
      date: '2024-01-16',
      time: '9:00 AM',
      location: 'Lekki, Lagos',
      status: 'confirmed',
      amount: 20000,
      description: 'AC unit not cooling properly'
    }
  ];

  const handleStatusChange = (bookingId: string, newStatus: string) => {
    toast.success(`Booking ${newStatus} successfully!`);
  };

  const handleComingSoon = (feature: string) => {
    toast(`🚧 ${feature} - Coming Soon!`, {
      duration: 3000,
      icon: '🚧'
    });
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Bookings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your service bookings</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-slate-200 dark:border-slate-700 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Booking Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">{booking.service}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-1 capitalize">{booking.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <User className="w-4 h-4" />
                          <span>{booking.customer.name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <Phone className="w-4 h-4" />
                          <span>{booking.customer.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.location}</span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.date} at {booking.time}</span>
                        </div>
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          ₦{booking.amount.toLocaleString()}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{booking.description}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'confirmed')}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleStatusChange(booking.id, 'cancelled')}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Decline</span>
                        </button>
                      </>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleStatusChange(booking.id, 'completed')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Mark Complete</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleComingSoon("Customer Messages")}
                      className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
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

        {/* Empty State */}
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">No bookings found</h3>
            <p className="text-slate-600 dark:text-slate-400">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You don\'t have any bookings yet. Complete your profile to start receiving requests.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}












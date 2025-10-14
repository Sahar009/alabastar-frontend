"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { LogOut, Settings, Bell, MessageCircle, Calendar } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

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


interface Booking {
  id: string;
  scheduledAt: string;
  status: string;
  totalAmount?: number | string;
  service?: { title?: string };
  providerProfile?: { 
    User?: { fullName?: string };
    locationCity?: string;
    locationState?: string;
  };
}

export default function Navbar() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showBookings, setShowBookings] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);

  // Fetch unread count
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      if (user.role !== 'provider') {
        fetchUnreadMessagesCount();
        fetchBookingsCount();
      }
      // Poll for new notifications and messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (user.role !== 'provider') {
          fetchUnreadMessagesCount();
          fetchBookingsCount();
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/unread-count`, {
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

  const fetchUnreadMessagesCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Calculate total unread messages from all conversations
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

  const fetchBookingsCount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const allBookings = Array.isArray(data?.data) ? data.data : data?.data?.bookings || [];
        setBookingsCount(allBookings.length);
      }
    } catch (error) {
      console.error('Error fetching bookings count:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      setBookingsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const allBookings = Array.isArray(data?.data) ? data.data : data?.data?.bookings || [];
        // Get latest 5 bookings
        setBookings(allBookings.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setBookingsLoading(false);
    }
  };

  const handleBookingsClick = () => {
    setShowBookings(!showBookings);
    if (!showBookings && bookings.length === 0) {
      fetchBookings();
    }
  };

  // Fetch recent notifications when dropdown opens
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications?limit=5`, {
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
      setLoading(false);
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };
  return (
    <header className="sticky top-0 z-50">
      <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/50 border-b border-white/20 dark:border-white/10 supports-[backdrop-filter]:bg-white/40 transition-colors">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:scale-[1.02] transition-transform">
              <Image src="/brand/logo.png" alt="Alabastar" width={120} height={100} priority />
             
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-base font-semibold">
           
              <Link href="#services" className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 transition-colors">Services</Link>
              <Link href="/providers" className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 transition-colors">Providers</Link>
              <Link href="#pricing" className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 transition-colors">Pricing</Link>
              <Link href="/contact" className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 transition-colors">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {/* Bookings Icon - Only for customers */}
                  {user.role !== 'provider' && (
                    <div className="relative">
                      <button
                        onClick={handleBookingsClick}
                        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Calendar size={20} className="text-slate-700 dark:text-slate-200" />
                        {bookingsCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            {bookingsCount > 9 ? '9+' : bookingsCount}
                          </span>
                        )}
                      </button>

                      {/* Bookings Dropdown */}
                      {showBookings && (
                        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 max-h-[500px] overflow-hidden flex flex-col">
                          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-900 dark:text-white">My Bookings</h3>
                            <Link 
                              href="/bookings" 
                              className="text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400"
                              onClick={() => setShowBookings(false)}
                            >
                              View All
                            </Link>
                          </div>

                          <div className="overflow-y-auto max-h-96">
                            {bookingsLoading ? (
                              <div className="p-8 text-center text-slate-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto"></div>
                              </div>
                            ) : bookings.length === 0 ? (
                              <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                                <Calendar size={48} className="mx-auto mb-2 opacity-30" />
                                <p>No bookings yet</p>
                                <Link
                                  href="/providers"
                                  className="inline-block mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium"
                                  onClick={() => setShowBookings(false)}
                                >
                                  Book a Service
                                </Link>
                              </div>
                            ) : (
                              bookings.map((booking) => {
                                const dt = new Date(booking.scheduledAt);
                                const service = booking.service?.title || 'Service';
                                const provider = booking.providerProfile?.User?.fullName || 'Provider';
                                const amount = Number(booking.totalAmount || 0);
                                const city = booking.providerProfile?.locationCity;
                                const state = booking.providerProfile?.locationState;
                                
                                return (
                                  <Link
                                    key={booking.id}
                                    href="/bookings"
                                    onClick={() => setShowBookings(false)}
                                    className="block p-4 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                                          {service}
                                        </h4>
                                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                          with {provider}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                                          <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {dt.toLocaleDateString()}
                                          </span>
                                          <span>
                                            {dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                          </span>
                                        </div>
                                        {city && state && (
                                          <p className="text-xs text-slate-500 mt-1">
                                            {city}, {state}
                                          </p>
                                        )}
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                          booking.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                          'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                        }`}>
                                          {booking.status}
                                        </span>
                                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                                          ₦{amount.toLocaleString('en-NG')}
                                        </span>
                                      </div>
                                    </div>
                                  </Link>
                                );
                              })
                            )}
                          </div>

                          {bookings.length > 0 && (
                            <div className="p-3 border-t border-slate-200 dark:border-slate-700">
                              <Link
                                href="/bookings"
                                className="block text-center text-sm text-pink-600 hover:text-pink-700 dark:text-pink-400 font-medium"
                                onClick={() => setShowBookings(false)}
                              >
                                View all bookings
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Messages Icon - Only for customers */}
                  {user.role !== 'provider' && (
                    <Link
                      href="/messages"
                      className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <MessageCircle size={20} className="text-slate-700 dark:text-slate-200" />
                      {unreadMessagesCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                          {unreadMessagesCount > 9 ? '9+' : unreadMessagesCount}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Notification Bell */}
                  <div className="relative">
                    <button
                      onClick={handleNotificationClick}
                      className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Bell size={20} className="text-slate-700 dark:text-slate-200" />
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
                          {loading ? (
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
                                    window.location.href = notification.actionUrl;
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

                  {/* Provider Dashboard Link */}
                  {user.role === 'provider' && (
                    <Link 
                      href="/provider/dashboard" 
                      className="inline-flex items-center rounded-full bg-pink-600 hover:bg-pink-700 px-4 py-2 text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-[.98]"
                    >
                      Dashboard
                    </Link>
                  )}
                  
                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.fullName?.charAt(0) || 'U'}
                      </div>
                      <span className="text-slate-700 dark:text-slate-200">{user.fullName}</span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 z-50">
                        {user.role === 'provider' && (
                          <Link
                            href="/provider/dashboard"
                            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                            onClick={() => setShowUserMenu(false)}
                          >
                            <Settings size={16} />
                            Provider Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings size={16} />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link href="/login" className="text-slate-700 hover:text-orange-600 dark:text-slate-200 dark:hover:text-orange-400 transition-colors">Sign In</Link>
              )}
              <Link href="/providers" className="inline-flex items-center rounded-full bg-pink-600 hover:bg-pink-700 px-4 py-2 text-white font-semibold shadow-sm hover:shadow-md transition-all active:scale-[.98]">Book a Service</Link>
            </div>

            <MobileMenu user={user} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    </header>
  );
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  provider: string;
}

function MobileMenu({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-800 dark:text-slate-100">
          <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 origin-top-right rounded-2xl border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-xl p-3 space-y-1 z-50">
          <Link href="#services" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Services</Link>
          <Link href="/providers" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Providers</Link>
          <Link href="#pricing" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link href="/contact" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
          
          <div className="h-px bg-gradient-to-r from-transparent via-slate-900/10 to-transparent dark:via-white/10 my-1" />
          
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 text-slate-800 dark:text-slate-100">
                <div className="w-6 h-6 bg-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <span className="text-sm">{user.fullName}</span>
              </div>
              {user.role !== 'provider' && (
                <>
                  <Link href="/bookings" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      <span>My Bookings</span>
                      {bookingsCount > 0 && (
                        <span className="ml-auto bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {bookingsCount}
                        </span>
                      )}
                    </div>
                  </Link>
                  <Link href="/messages" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>
                    <div className="flex items-center gap-2">
                      <MessageCircle size={16} />
                      <span>Messages</span>
                      {unreadMessagesCount > 0 && (
                        <span className="ml-auto bg-pink-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {unreadMessagesCount}
                        </span>
                      )}
                    </div>
                  </Link>
                </>
              )}
              {user.role === 'provider' && (
                <Link href="/provider/dashboard" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Provider Dashboard</Link>
              )}
              <Link href="/profile" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Profile</Link>
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full text-left rounded-lg px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">Sign Out</button>
            </>
          ) : (
            <Link href="/login" className="block rounded-lg px-3 py-2 text-slate-800 dark:text-slate-100 hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-orange-900/20 dark:hover:text-orange-400 transition-colors" onClick={() => setIsOpen(false)}>Sign In</Link>
          )}
          <Link href="/providers" className="block rounded-lg px-3 py-2 text-white text-center bg-pink-600 hover:bg-pink-700 font-semibold" onClick={() => setIsOpen(false)}>Book a Service</Link>
        </div>
      )}
    </div>
  );
}

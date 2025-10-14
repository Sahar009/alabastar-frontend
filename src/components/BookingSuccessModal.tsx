"use client";
import { X, CheckCircle, Calendar as CalendarIcon, Clock, User as UserIcon, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingUser { id?: string; fullName?: string; email?: string; phone?: string }
interface BookingService { id?: string; title?: string }
interface ProviderProfileData { User?: BookingUser; name?: string; locationCity?: string; locationState?: string }
export interface BookingSuccessData {
  id?: string;
  scheduledAt: string;
  totalAmount?: number | string;
  providerProfile?: ProviderProfileData;
  service?: BookingService;
}

interface BookingSuccessModalProps {
  data: BookingSuccessData;
  onClose: () => void;
  onViewBookings?: () => void;
  bookingsPath?: string;
}

export default function BookingSuccessModal({ data, onClose, onViewBookings, bookingsPath = "/bookings" }: BookingSuccessModalProps) {
  const router = useRouter();
  const [isCreatingConversation, setIsCreatingConversation] = useState(false);
  
  const when = useMemo(() => new Date(data.scheduledAt), [data]);
  const providerName = data.providerProfile?.User?.fullName || data.providerProfile?.name || "Provider";
  const serviceTitle = data.service?.title || "Service";
  const amount = Number(data.totalAmount || 0);
  const providerPhone = data.providerProfile?.User?.phone;
  const providerUserId = data.providerProfile?.User?.id;

  const goToBookings = () => {
    if (onViewBookings) return onViewBookings();
    router.push(bookingsPath);
  };

  const handleMessageProvider = async () => {
    const token = localStorage.getItem('token');
    
    if (!providerUserId || !token) {
      alert("Unable to start conversation. Please try again.");
      return;
    }

    try {
      setIsCreatingConversation(true);
      
      // Create or get direct conversation with provider
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations/direct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          recipientId: providerUserId
        })
      });

      const result = await response.json();

      if (result.success && result.data) {
        // Navigate to messages page with this conversation
        router.push(`/messages?conversation=${result.data.id}`);
      } else {
        throw new Error(result.message || 'Failed to create conversation');
      }
    } catch (error) {
      console.error('Error creating conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setIsCreatingConversation(false);
    }
  };

  const handleCallProvider = () => {
    if (providerPhone) {
      window.location.href = `tel:${providerPhone}`;
    } else {
      alert("Provider phone number not available");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] rounded-2xl bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Booking Created</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-3 text-sm text-emerald-700 dark:text-emerald-200">
            Your request was sent. The provider must accept to confirm this booking.
          </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <UserIcon className="w-4 h-4"/> 
                  <span>Provider</span>
                </div>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{providerName}</p>
              </div>
              
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">Service</div>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{serviceTitle}</p>
              </div>
              
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <CalendarIcon className="w-4 h-4"/> 
                    <span>Date</span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{when.toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4"/> 
                    <span>Time</span>
                  </div>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-4">
                <div className="text-sm text-slate-600 dark:text-slate-400">Amount</div>
                <p className="mt-1 text-xl font-bold text-slate-900 dark:text-slate-100">₦{amount.toLocaleString('en-NG')}</p>
              </div>
            </div>

            {/* Contact Provider Section */}
            <div className="pt-2">
              <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Contact Provider</div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleMessageProvider}
                  disabled={isCreatingConversation || !providerUserId}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">{isCreatingConversation ? 'Opening...' : 'Message'}</span>
                </button>
                <button
                  onClick={handleCallProvider}
                  disabled={!providerPhone}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  <span className="font-medium text-sm">Call</span>
                </button>
              </div>
              {!providerPhone && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                  Phone number not available
                </p>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              Close
            </button>
            <button onClick={goToBookings} className="px-6 py-2 rounded-xl text-white bg-pink-600 hover:bg-pink-700 transition-colors cursor-pointer">
              View My Bookings
            </button>
          </div>
      </div>
    </div>
  );
}



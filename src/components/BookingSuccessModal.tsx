"use client";
import { X, CheckCircle, Calendar as CalendarIcon, Clock, User as UserIcon, MessageCircle, Phone } from "lucide-react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface BookingUser { id?: string; fullName?: string; email?: string; phone?: string }
interface BookingService { id?: string; title?: string }
interface ProviderProfileData { User?: BookingUser; name?: string; locationCity?: string; locationState?: string; businessName?: string }
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
  const businessName = data.providerProfile?.businessName || data.providerProfile?.User?.fullName || "Provider";
  console.log(data);

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

  const handleWhatsAppMessage = () => {
    if (providerPhone) {
      // Remove any non-numeric characters and ensure it starts with country code
      const cleanPhone = providerPhone.replace(/\D/g, '');
      const whatsappPhone = cleanPhone.startsWith('234') ? cleanPhone : `234${cleanPhone.substring(1)}`;
      const message = `Hello! I have a booking with you for ${serviceTitle} on ${when.toLocaleDateString()} at ${when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Please confirm.`;
      const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert("Provider phone number not available");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] rounded-2xl bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Booking Created</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer">
              <X className="w-5 h-5"/>
            </button>
          </div>
          
          {/* Contact Provider Section - Moved to top */}
          <div>
            <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Contact Provider</div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleMessageProvider}
                disabled={isCreatingConversation || !providerUserId}
                className="group flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-gradient-to-r hover:from-pink-100 hover:to-orange-100 dark:hover:from-pink-900/40 dark:hover:to-orange-900/40 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-xs">{isCreatingConversation ? 'Opening...' : 'Message'}</span>
              </button>
              <button
                onClick={handleCallProvider}
                disabled={!providerPhone}
                className="group flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border border-pink-200 dark:border-pink-700 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 hover:bg-gradient-to-r hover:from-pink-100 hover:to-orange-100 dark:hover:from-pink-900/40 dark:hover:to-orange-900/40 hover:border-pink-300 dark:hover:border-pink-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium text-xs">Call</span>
              </button>
              <button
                onClick={handleWhatsAppMessage}
                disabled={!providerPhone}
                className="group flex flex-col items-center justify-center gap-1 px-3 py-3 rounded-xl border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/40 dark:hover:to-emerald-900/40 hover:border-green-300 dark:hover:border-green-600 hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                <span className="font-medium text-xs">WhatsApp</span>
              </button>
            </div>
            {!providerPhone && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 text-center">
                Phone number not available
              </p>
            )}
          </div>
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
             
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{businessName}</p>
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
    </div>
  );
}



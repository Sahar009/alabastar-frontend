"use client";
import { X, CheckCircle, Calendar as CalendarIcon, Clock, User as UserIcon } from "lucide-react";
import { useMemo } from "react";
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
  const when = useMemo(() => new Date(data.scheduledAt), [data]);
  const providerName = data.providerProfile?.User?.fullName || data.providerProfile?.name || "Provider";
  const serviceTitle = data.service?.title || "Service";
  const amount = Number(data.totalAmount || 0);

  const goToBookings = () => {
    if (onViewBookings) return onViewBookings();
    router.push(bookingsPath);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Animated gradient border */}
        <div className="absolute -inset-[1px] rounded-3xl bg-gradient-to-r from-[#2563EB] via-[#14B8A6] to-[#2563EB] opacity-70" aria-hidden></div>
        <div className="relative rounded-3xl bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/30 dark:border-white/10">
          <div className="flex items-center justify-between p-5 border-b border-white/30 dark:border-white/10">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Booking Created</h3>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"><X className="w-5 h-5"/></button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
            <div className="rounded-xl border border-emerald-400/30 dark:border-emerald-400/20 bg-emerald-50/60 dark:bg-emerald-900/20 p-3 text-sm text-emerald-800 dark:text-emerald-200">
              Your request was sent. The provider must accept to confirm this booking.
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><UserIcon className="w-4 h-4"/> Provider</div>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{providerName}</p>
              </div>
              <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4">
                <div className="text-slate-700 dark:text-slate-300">Service</div>
                <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{serviceTitle}</p>
              </div>
              <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4 grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><CalendarIcon className="w-4 h-4"/> Date</div>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{when.toLocaleDateString()}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><Clock className="w-4 h-4"/> Time</div>
                  <p className="mt-1 font-semibold text-slate-900 dark:text-slate-100">{when.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
              <div className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300"><span className="inline-block w-4 text-center">₦</span> Amount</div>
                <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">₦{amount.toLocaleString('en-NG')}</p>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-white/30 dark:border-white/10 flex items-center justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer">Close</button>
            <button onClick={goToBookings} className="px-5 py-2 rounded-xl text-white bg-gradient-to-r from-[#2563EB] to-[#14B8A6] font-semibold shadow hover:opacity-90 cursor-pointer">View My Bookings</button>
          </div>
        </div>
      </div>
    </div>
  );
}



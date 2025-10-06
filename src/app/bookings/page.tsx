"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useGetMyBookingsQuery } from "../../store/api/providersApi";
import { Loader2, Calendar, Clock, MapPin } from "lucide-react";

export default function BookingsPage() {
  const { data, isLoading, refetch } = useGetMyBookingsQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const bookings = Array.isArray(data?.data) ? data?.data : data?.data?.bookings || [];

  return (
    <div className="min-h-[70vh]">
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-50">My Bookings</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Track requests, statuses, and upcoming appointments.</p>
        </div>

        <div className="mt-10 relative overflow-hidden rounded-3xl border border-white/30 dark:border-white/10 bg-white/60 dark:bg-slate-900/50 backdrop-blur-xl p-6 shadow">
          <div className="absolute -inset-px opacity-10 bg-gradient-to-r from-pink-600 to-pink-600" />
          <div className="relative">
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Loader2 className="w-4 h-4 animate-spin"/> Loading bookings...</div>
            ) : bookings.length ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b: {
                  id: string;
                  scheduledAt: string;
                  locationCity?: string;
                  locationState?: string;
                  status: string;
                  totalAmount?: number | string;
                  service?: { title?: string };
                  providerProfile?: { User?: { fullName?: string }, locationCity?: string, locationState?: string };
                }) => {
                  const dt = new Date(b.scheduledAt);
                  const city = b.locationCity || b.providerProfile?.locationCity;
                  const state = b.locationState || b.providerProfile?.locationState;
                  const service = b.service?.title || 'Service';
                  const provider = b.providerProfile?.User?.fullName || 'Provider';
                  const amount = Number(b.totalAmount || 0);
                  return (
                    <div key={b.id} className="rounded-2xl border border-white/30 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl p-4 shadow">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{service}</h3>
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-900/5 dark:bg-white/10 text-slate-700 dark:text-slate-300">{b.status}</span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">with {provider}</p>
                      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4"/>{dt.toLocaleDateString()}</div>
                        <div className="flex items-center gap-2"><Clock className="w-4 h-4"/>{dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        <div className="flex items-center gap-2 col-span-2"><MapPin className="w-4 h-4"/>{city}, {state}</div>
                      </div>
                      <div className="mt-3 font-bold text-slate-900 dark:text-slate-100">₦{amount.toLocaleString('en-NG')}</div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  You have no bookings yet. Create one to see it here.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <Link href="/providers" className="rounded-xl bg-pink-600 px-5 py-3 text-white font-semibold shadow hover:bg-pink-700 cursor-pointer">Find Providers</Link>
                  <Link href="/" className="rounded-xl border border-slate-300/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/60 px-5 py-3 text-slate-700 dark:text-slate-200 hover:bg-white/80 dark:hover:bg-slate-900/80 cursor-pointer">Back Home</Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}



"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Calendar as CalendarIcon, Clock, MapPin, Loader2, User, Star, Shield, CheckCircle } from "lucide-react";
import BookingSuccessModal, { type BookingSuccessData } from "./BookingSuccessModal";
import toast from "react-hot-toast";
import { Provider } from "../types/provider";
import Avatar from "./Avatar";
import { useCreateBookingMutation, useGetProviderAvailabilityQuery } from "../store/api/providersApi";

interface BookingModalProps {
  provider: Provider;
  isOpen: boolean;
  onClose: () => void;
  onBooked?: (bookingId: string) => void;
}

type AvailabilitySlot = { time: string; displayTime: string };

export default function BookingModal({ provider, isOpen, onClose, onBooked }: BookingModalProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedSlot, setSelectedSlot] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [successData, setSuccessData] = useState<BookingSuccessData | null>(null);

  const { data: availabilityData, isLoading: availabilityLoading, refetch } = useGetProviderAvailabilityQuery({ providerId: provider.id, date }, { skip: !date });
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();

  useEffect(() => {
    if (isOpen) {
      setSelectedSlot("");
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    console.log('SuccessData changed:', successData);
  }, [successData]);

  const availableSlots: AvailabilitySlot[] = useMemo(() => {
    return (availabilityData?.data?.availableSlots as AvailabilitySlot[]) || [];
  }, [availabilityData]);


  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    
    try {
      const result = await createBooking({
        providerId: provider.providerUserId || provider.user.id || provider.id,
        scheduledAt: new Date(selectedSlot).toISOString(),
        locationCity: provider.locationCity,
        locationState: provider.locationState,
        notes
      }).unwrap();
      
      console.log('Booking successful:', result);
      onBooked?.(result?.data?.id || "");
      
      // Set success data and show modal
      const bookingData = result?.data as BookingSuccessData;
      console.log('Booking data to set:', bookingData);
      
      if (bookingData) {
        console.log('Setting success data...');
        setSuccessData(bookingData);
        console.log('Success data set, should show modal now');
        // Remove toast - let success modal handle the feedback
      } else {
        console.log('No booking data found in result');
        toast.error('Booking created but unable to show details');
      }
    } catch (e: any) {
      console.error('Booking error:', e);
      const message = e?.data?.message || e?.message || 'Failed to create booking';
      toast.error(message);
    }
  };


  if (successData) {
    console.log('Rendering success modal with data:', successData);
    return (
      <BookingSuccessModal 
        data={successData} 
        onClose={() => { 
          console.log('Closing success modal');
          setSuccessData(null); 
          onClose(); 
        }} 
      />
    );
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] rounded-3xl bg-white dark:bg-slate-800 shadow-2xl overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-pink-600 to-orange-500 p-6 text-white">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-5 h-5"/>
          </button>
          
          <div className="flex items-center space-x-4">
            <Avatar
              src={provider.brandImages && provider.brandImages.length > 0 ? (provider.brandImages[0].url || provider.brandImages[0]) : (provider.user.avatarUrl || '')}
              alt={provider.businessName || provider.user.fullName}
              fallback={provider.businessName || provider.user.fullName}
              size="lg"
              showVerification={true}
              isVerified={provider.verificationStatus === 'verified'}
            />
            
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">Book {provider.businessName || provider.user.fullName}</h3>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{Number(provider.ratingAverage || 0).toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{provider.locationCity}, {provider.locationState}</span>
                </div>
                {provider.verificationStatus === 'verified' && (
                  <div className="flex items-center space-x-1">
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {/* Date Selection */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-4 border border-blue-200/50 dark:border-blue-700/50">
            <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full"></div>
              <span>Select Date</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white"/>
              </div>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)} 
                className="flex-1 p-4 border border-blue-200 dark:border-blue-700 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-4 border border-green-200/50 dark:border-green-700/50">
            <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full"></div>
              <span>Available Time Slots</span>
              {!selectedSlot && <span className="text-red-500 ml-1">*</span>}
            </label>
            {availabilityLoading ? (
              <div className="flex items-center space-x-2 text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin"/>
                <span>Loading available slots...</span>
              </div>
            ) : availableSlots.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableSlots.map((slot) => (
                  <button 
                    key={slot.time} 
                    onClick={() => setSelectedSlot(slot.time)} 
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 flex items-center justify-center space-x-2 ${
                      selectedSlot === slot.time 
                        ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white border-transparent shadow-lg transform scale-105' 
                        : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-pink-300 dark:hover:border-pink-600'
                    }`}
                  >
                    <Clock className="w-4 h-4"/>
                    <span>{slot.displayTime}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock className="w-12 h-12 text-slate-400 mx-auto mb-2"/>
                <p className="text-slate-600 dark:text-slate-400">No available slots for the selected date</p>
              </div>
            )}
            {!selectedSlot && availableSlots.length > 0 && (
              <p className="text-xs text-red-500 mt-2 flex items-center space-x-1">
                <span>⚠️</span>
                <span>Please select a time slot</span>
              </p>
            )}
          </div>

          {/* Location */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-4 border border-purple-200/50 dark:border-purple-700/50">
            <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"></div>
              <span>Service Location</span>
            </label>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white"/>
              </div>
              <input 
                type="text" 
                defaultValue={`${provider.locationCity}, ${provider.locationState}`} 
                className="flex-1 p-4 border border-purple-200 dark:border-purple-700 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" 
                readOnly
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-2xl p-4 border border-orange-200/50 dark:border-orange-700/50">
            <label className="block text-sm font-semibold mb-3 text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <div className="w-2 h-2 bg-gradient-to-r from-orange-600 to-yellow-500 rounded-full"></div>
              <span>Additional Notes</span>
              <span className="text-xs text-slate-500">(optional)</span>
            </label>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              rows={3} 
              className="w-full p-4 border border-orange-200 dark:border-orange-700 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none" 
              placeholder="Any specific requirements or additional information for the provider..."
            />
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <CheckCircle className="w-4 h-4 text-green-500"/>
              <span>Secure booking • Instant confirmation</span>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onClose} 
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all font-medium"
              >
                Cancel
              </button>
              <button 
                disabled={!selectedSlot || creating} 
                onClick={handleConfirm} 
                className={`px-8 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
                  creating 
                    ? 'bg-gradient-to-r from-pink-400 to-orange-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-pink-600 to-orange-500 hover:from-pink-700 hover:to-orange-600 hover:shadow-lg hover:scale-105'
                }`}
              >
                {creating ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span>Booking...</span>
                  </div>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




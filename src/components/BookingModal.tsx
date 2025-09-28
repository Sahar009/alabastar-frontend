"use client";
import { useEffect, useMemo, useState } from "react";
import { X, Calendar as CalendarIcon, Clock, MapPin, Loader2 } from "lucide-react";
import BookingSuccessModal, { type BookingSuccessData } from "./BookingSuccessModal";
import toast from "react-hot-toast";
import { Provider } from "../types/provider";
type ServiceOption = { id: string; title: string; basePrice: number };
import { useCreateBookingMutation, useGetProviderServicesQuery, useGetProviderAvailabilityQuery } from "../store/api/providersApi";

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
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [successData, setSuccessData] = useState<BookingSuccessData | null>(null);

  const { data: servicesData, isLoading: servicesLoading } = useGetProviderServicesQuery(provider.id);
  const { data: availabilityData, isLoading: availabilityLoading, refetch } = useGetProviderAvailabilityQuery({ providerId: provider.id, date }, { skip: !date });
  const [createBooking, { isLoading: creating }] = useCreateBookingMutation();

  useEffect(() => {
    if (isOpen) {
      setSelectedSlot("");
      setSelectedServiceId("");
      refetch();
    }
  }, [isOpen, refetch]);

  useEffect(() => {
    if (!selectedServiceId && servicesData?.data?.services?.length) {
      setSelectedServiceId(servicesData.data.services[0].id);
    }
  }, [servicesData, selectedServiceId]);

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
        serviceId: selectedServiceId || null, // Make service optional
        scheduledAt: new Date(selectedSlot).toISOString(),
        totalAmount: provider.startingPrice || 0,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[80vh] rounded-2xl bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Book {provider.user.fullName}</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"><X className="w-5 h-5"/></button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto max-h-[60vh]">
          {/* Service */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Service (optional)</label>
            {servicesLoading ? (
              <div className="text-sm text-slate-500">Loading services...</div>
            ) : (
              <select 
                value={selectedServiceId} 
                onChange={(e) => setSelectedServiceId(e.target.value)} 
                className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="">Select a service (optional)</option>
                {(servicesData?.data?.services || []).map((s: ServiceOption) => (
                  <option key={s.id} value={s.id}>{s.title} — ₦{s.basePrice}</option>
                ))}
              </select>
            )}
            <p className="text-xs text-slate-500 mt-1">You can book without selecting a specific service</p>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Date</label>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-500"/>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="flex-1 p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"/>
            </div>
          </div>

          {/* Time slots */}
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Available Slots
              {!selectedSlot && <span className="text-red-500 ml-1">*</span>}
            </label>
            {availabilityLoading ? (
              <div className="flex items-center gap-2 text-slate-500 text-sm"><Loader2 className="w-4 h-4 animate-spin"/> Loading slots...</div>
            ) : availableSlots.length ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button 
                    key={slot.time} 
                    onClick={() => setSelectedSlot(slot.time)} 
                    className={`px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                      selectedSlot === slot.time 
                        ? 'bg-[#2563EB] text-white border-[#2563EB]' 
                        : 'border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Clock className="w-3 h-3 inline mr-1"/>{slot.displayTime}
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-500">No available slots for the selected date.</div>
            )}
            {!selectedSlot && availableSlots.length > 0 && (
              <p className="text-xs text-red-500 mt-1">Please select a time slot</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Location</label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-500"/>
              <input type="text" defaultValue={`${provider.locationCity}, ${provider.locationState}`} className="flex-1 p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100" readOnly/>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">Notes (optional)</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full p-3 border border-slate-200 dark:border-slate-600 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100" placeholder="Any additional information for the provider..."/>
          </div>
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">Cancel</button>
          <button disabled={!selectedSlot || creating} onClick={handleConfirm} className={`px-6 py-2 rounded-xl text-white cursor-pointer ${creating ? 'bg-[#2563EB]/60' : 'bg-[#2563EB] hover:bg-[#2563EB]/90'}`}>{creating ? 'Booking...' : 'Confirm Booking'}</button>
        </div>
      </div>
    </div>
  );
}




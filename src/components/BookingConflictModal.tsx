"use client";
import { useState } from "react";
import { X, AlertTriangle, CheckCircle, Clock, Trash2, Plus } from "lucide-react";

interface BookingConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (action: 'keep_previous' | 'cancel_previous', reason?: string) => void;
  activeBookings: Array<{
    id: string;
    scheduledAt: string;
    status: string;
    providerProfile?: {
      businessName?: string;
      User?: {
        fullName: string;
      };
    };
  }>;
}

export default function BookingConflictModal({
  isOpen,
  onClose,
  onConfirm,
  activeBookings
}: BookingConflictModalProps) {
  const [selectedAction, setSelectedAction] = useState<'keep_previous' | 'cancel_previous' | ''>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (!selectedAction) return;
    
    setIsSubmitting(true);
    try {
      await onConfirm(selectedAction, customReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedAction('');
    setCustomReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Booking Conflict Detected
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  You have {activeBookings.length} active booking{activeBookings.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Active Bookings Info */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Current Active Bookings
                </h3>
                {activeBookings.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {activeBookings.slice(0, 3).map((booking, index) => (
                      <div key={booking.id || index} className="bg-white dark:bg-slate-700 p-3 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">
                              {booking.providerProfile?.businessName || booking.providerProfile?.User?.fullName || 'Provider'}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {new Date(booking.scheduledAt).toLocaleDateString()} at {new Date(booking.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'requested' 
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : booking.status === 'accepted'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : booking.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {activeBookings.length > 3 && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                        +{activeBookings.length - 3} more booking{activeBookings.length - 3 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Selection */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              What would you like to do?
            </h3>
            <div className="space-y-3">
              {/* Keep Previous Booking */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedAction === 'keep_previous'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="action"
                  value="keep_previous"
                  checked={selectedAction === 'keep_previous'}
                  onChange={(e) => setSelectedAction(e.target.value as 'keep_previous')}
                  className="mt-1 w-4 h-4 text-blue-500 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1 rounded-lg ${
                      selectedAction === 'keep_previous'
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Plus className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      Keep Previous Booking & Book This Provider
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You&apos;ll have multiple active bookings. This is useful when you need different services or providers.
                  </p>
                </div>
              </label>

              {/* Cancel Previous Booking */}
              <label
                className={`flex items-start space-x-3 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                  selectedAction === 'cancel_previous'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                }`}
              >
                <input
                  type="radio"
                  name="action"
                  value="cancel_previous"
                  checked={selectedAction === 'cancel_previous'}
                  onChange={(e) => setSelectedAction(e.target.value as 'cancel_previous')}
                  className="mt-1 w-4 h-4 text-red-500 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className={`p-1 rounded-lg ${
                      selectedAction === 'cancel_previous'
                        ? 'bg-red-500 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">
                      Cancel Previous Booking & Book This Provider
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Cancel your most recent booking and proceed with this new provider instead.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Reason Input for Cancel Action */}
          {selectedAction === 'cancel_previous' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Why are you cancelling the previous booking? (optional)
              </label>
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Please provide details about why you're cancelling the previous booking..."
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={3}
              />
            </div>
          )}

          {/* Warning Message */}
          {selectedAction && (
            <div className={`rounded-2xl p-4 ${
              selectedAction === 'keep_previous' 
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
                : 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20'
            }`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-xl ${
                  selectedAction === 'keep_previous' 
                    ? 'bg-blue-100 dark:bg-blue-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  <CheckCircle className={`w-5 h-5 ${
                    selectedAction === 'keep_previous' 
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {selectedAction === 'keep_previous' ? 'Multiple Bookings Confirmation' : 'Cancellation Confirmation'}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {selectedAction === 'keep_previous' 
                      ? 'You will have multiple active bookings. Make sure you can manage all of them effectively.'
                      : 'This will cancel your most recent booking. The provider will be notified of the cancellation.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedAction || isSubmitting}
              className={`px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 ${
                selectedAction === 'keep_previous'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:shadow-blue-500'
                  : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-red-500'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>
                    {selectedAction === 'keep_previous' ? 'Proceed with Multiple Bookings' : 'Cancel & Book New Provider'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
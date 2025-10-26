import React, { useState } from 'react';
import { X, Clock, CheckCircle, XCircle, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

interface Booking {
  id: string;
  status: string;
  scheduledAt: string;
  providerProfile?: {
    businessName?: string;
    category?: string;
  };
}

interface BookingStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onStatusUpdate: () => void;
}

const BookingStatusModal: React.FC<BookingStatusModalProps> = ({
  isOpen,
  onClose,
  booking,
  onStatusUpdate,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !booking) return null;

  const currentStatus = booking.status;

  // Determine available statuses based on current status
  const getAvailableStatuses = () => {
    if (currentStatus === 'requested' || currentStatus === 'accepted') {
      return [
        { value: 'in_progress', label: 'Mark as In Progress', icon: Clock, color: 'bg-blue-500' },
        { value: 'completed', label: 'Complete Service', icon: CheckCircle, color: 'bg-green-500' },
        { value: 'cancelled', label: 'Cancel Booking', icon: XCircle, color: 'bg-red-500' },
      ];
    }
    if (currentStatus === 'in_progress') {
      return [
        { value: 'completed', label: 'Complete Service', icon: CheckCircle, color: 'bg-green-500' },
        { value: 'cancelled', label: 'Cancel Booking', icon: XCircle, color: 'bg-red-500' },
      ];
    }
    return [];
  };

  const availableStatuses = getAvailableStatuses();

  const handleStatusUpdate = async (newStatus: string) => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/bookings/${booking.id}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update booking status');
      }

      toast.success(`Booking marked as ${newStatus.replace('_', ' ')}`);
      onStatusUpdate();
      
      // Close modal after a short delay to allow state to reset
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      console.error('Error updating booking status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking status';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show different prompts based on current status
  const getPromptContent = () => {
    if (currentStatus === 'requested' || currentStatus === 'accepted') {
      return {
        title: 'Provider Arrival Confirmation',
        message: 'Has the provider arrived for this booking?',
        subMessage: 'Mark the booking as in progress to confirm the provider has arrived.',
      };
    }
    if (currentStatus === 'in_progress') {
      return {
        title: 'Booking Status Update',
        message: 'Would you like to complete this service or cancel the booking?',
        subMessage: 'Select an option to update the booking status.',
      };
    }
    return null;
  };

  const prompt = getPromptContent();

  if (!prompt) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {prompt.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Booking Info */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">
                {booking.providerProfile?.businessName || 'Service Booking'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {booking.providerProfile?.category || 'Service'}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
              <Clock className="w-4 h-4" />
              {currentStatus === 'requested' && 'Requested'}
              {currentStatus === 'accepted' && 'Accepted'}
              {currentStatus === 'in_progress' && 'In Progress'}
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <CalendarDays className="w-4 h-4" />
              <span>
                {new Date(booking.scheduledAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(booking.scheduledAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Prompt Message */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-2">{prompt.message}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{prompt.subMessage}</p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {availableStatuses.map((status) => {
            const Icon = status.icon;
            return (
              <button
                key={status.value}
                onClick={() => handleStatusUpdate(status.value)}
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-3 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  status.color === 'bg-blue-500'
                    ? 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : status.color === 'bg-green-500'
                    ? 'hover:bg-green-50 dark:hover:bg-green-900/20'
                    : 'hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Icon className={`w-5 h-5 ${status.color.replace('bg-', 'text-')}`} />
                <span className="font-medium text-gray-900 dark:text-white">
                  {status.label}
                </span>
              </button>
            );
          })}

          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
           No
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingStatusModal;


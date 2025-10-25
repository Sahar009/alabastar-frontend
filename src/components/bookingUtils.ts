// Booking conflict detection and management utilities

export interface BookingConflict {
  hasConflict: boolean;
  activeBookings: any[];
  conflictReason?: string;
}

export interface BookingReason {
  id: string;
  label: string;
  description: string;
  requiresConfirmation: boolean;
}

// Predefined reasons for booking another provider
export const BOOKING_REASONS: BookingReason[] = [
  {
    id: 'provider_not_responding',
    label: 'Provider Not Responding',
    description: 'The current provider is not responding to messages or calls',
    requiresConfirmation: true
  },
  {
    id: 'provider_busy',
    label: 'Provider Too Busy',
    description: 'The current provider is too busy or unavailable',
    requiresConfirmation: true
  },
  {
    id: 'service_different',
    label: 'Different Service Needed',
    description: 'I need a different type of service',
    requiresConfirmation: false
  },
  {
    id: 'location_different',
    label: 'Different Location',
    description: 'I need service at a different location',
    requiresConfirmation: false
  },
  {
    id: 'urgent_service',
    label: 'Urgent Service Required',
    description: 'I need urgent/immediate service',
    requiresConfirmation: true
  },
  {
    id: 'price_concern',
    label: 'Price Concern',
    description: 'Looking for better pricing',
    requiresConfirmation: false
  },
  {
    id: 'other',
    label: 'Other Reason',
    description: 'Other reason not listed above',
    requiresConfirmation: true
  }
];

// Check if user has active bookings with a specific provider
export const checkBookingConflict = async (providerId: string): Promise<BookingConflict> => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return {
        hasConflict: false,
        activeBookings: []
      };
    }

    const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${base}/api/bookings?userType=customer`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      const activeBookings = data.bookings?.filter((booking: any) => 
        booking.status === 'requested' || booking.status === 'accepted' || booking.status === 'in_progress'
      ) || [];
      
      return {
        hasConflict: activeBookings.length > 0,
        activeBookings: activeBookings,
        conflictReason: activeBookings.length > 0 ? 'You have active bookings' : undefined
      };
    } else {
      console.error('Failed to check booking conflict:', response.status);
      return {
        hasConflict: false,
        activeBookings: []
      };
    }
  } catch (error) {
    console.error('Error checking booking conflict:', error);
    return {
      hasConflict: false,
      activeBookings: []
    };
  }
};

// Get booking reason by ID
export const getBookingReason = (reasonId: string): BookingReason | undefined => {
  return BOOKING_REASONS.find(reason => reason.id === reasonId);
};

// Validate if a reason requires confirmation
export const requiresConfirmation = (reasonId: string): boolean => {
  const reason = getBookingReason(reasonId);
  return reason?.requiresConfirmation || false;
};

// Format active bookings for display
export const formatActiveBookings = (bookings: any[]): string => {
  if (bookings.length === 0) return '';
  
  if (bookings.length === 1) {
    const booking = bookings[0];
    return `You have a ${booking.status} booking for ${booking.service?.name || 'service'} scheduled for ${new Date(booking.scheduledAt).toLocaleDateString()}`;
  }
  
  return `You have ${bookings.length} active bookings with this provider`;
};

// Check if booking can proceed based on reason
export const canProceedWithBooking = (reasonId: string, customReason?: string): boolean => {
  const reason = getBookingReason(reasonId);
  if (!reason) return false;
  
  // If it's "other" reason, require custom explanation
  if (reasonId === 'other' && (!customReason || customReason.trim().length < 10)) {
    return false;
  }
  
  return true;
};

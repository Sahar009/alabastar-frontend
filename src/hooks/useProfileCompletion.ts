import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

interface RegistrationProgress {
  currentStep: number;
  isComplete: boolean;
  stepData: any;
}

export const useProfileCompletion = () => {
  const [showModal, setShowModal] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState<RegistrationProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, token } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user || !token) {
        setIsLoading(false);
        return;
      }

      // Check if this is a redirect after payment completion
      const paymentCompleted = searchParams.get('payment_completed');
      const refresh = searchParams.get('refresh');
      
      // If payment was completed, don't show modal regardless of progress
      if (paymentCompleted === 'true') {
        console.log('Payment completed - skipping profile completion modal');
        setIsLoading(false);
        return;
      }

      try {
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${base}/api/providers/register/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            const progress = result.data;
            setRegistrationProgress(progress);
            
            // Show modal if user has incomplete registration
            // Don't show modal if registration is complete OR if payment has been completed
            const isPaymentCompleted = progress.stepData?.step5?.paymentCompleted || 
                                     progress.stepData?.step4?.paymentCompleted ||
                                     (progress.currentStep >= 5 && progress.stepData?.step5);
            
            if (progress && !progress.isComplete && progress.currentStep > 1 && !isPaymentCompleted) {
              setShowModal(true);
            }
          }
        }
      } catch (error) {
        console.error('Error checking profile completion:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfileCompletion();

    // Listen for localStorage changes (payment completion from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'payment_completed' && e.newValue === 'true') {
        console.log('Payment completion detected from localStorage - closing modal');
        setShowModal(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [user, token, searchParams]);

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    registrationProgress,
    isLoading,
    closeModal
  };
};

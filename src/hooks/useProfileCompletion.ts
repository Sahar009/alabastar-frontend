import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

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

  useEffect(() => {
    const checkProfileCompletion = async () => {
      if (!user || !token) {
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
            if (progress && !progress.isComplete && progress.currentStep > 1) {
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
  }, [user, token]);

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

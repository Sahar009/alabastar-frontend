'use client';

import { useProfileCompletion } from '../hooks/useProfileCompletion';
import ProfileCompletionModal from '../components/ProfileCompletionModal';

export default function ProfileCompletionWrapper() {
  const { showModal, registrationProgress, closeModal } = useProfileCompletion();

  if (!registrationProgress) return null;

  return (
    <ProfileCompletionModal
      isOpen={showModal}
      onClose={closeModal}
      currentStep={registrationProgress.currentStep}
      totalSteps={5}
    />
  );
}

'use client';

import { Suspense } from 'react';
import { useProfileCompletion } from '../hooks/useProfileCompletion';
import ProfileCompletionModal from '../components/ProfileCompletionModal';

function ProfileCompletionWrapperContent() {
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

export default function ProfileCompletionWrapper() {
  return (
    <Suspense fallback={null}>
      <ProfileCompletionWrapperContent />
    </Suspense>
  );
}








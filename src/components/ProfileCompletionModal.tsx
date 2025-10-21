import React, { useState } from 'react';
import { X, User, MapPin, FileText, CreditCard, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  currentStep,
  totalSteps
}) => {
  const router = useRouter();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleCompleteProfile = () => {
    setIsCompleting(true);
    onClose(); // Close the modal first
    router.push('/become-provider');
  };

  const steps = [
    { number: 1, title: 'Personal Information', icon: User, description: 'Basic details and contact information' },
    { number: 2, title: 'Service Details', icon: MapPin, description: 'Category, location, and bio' },
    { number: 3, title: 'Documents & Images', icon: FileText, description: 'Upload required documents and brand images' },
    { number: 4, title: 'Subscription Plan', icon: CreditCard, description: 'Choose your subscription plan' },
    { number: 5, title: 'Payment', icon: CheckCircle, description: 'Complete your registration' }
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-pink-600 to-orange-500 p-6 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Complete Your Profile</h2>
              <p className="text-pink-100">Finish setting up your provider account</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Registration Progress
              </h3>
              <span className="text-sm text-slate-600 dark:text-slate-400">
                Step {currentStep} of {totalSteps}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-pink-600 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Steps List */}
          <div className="space-y-4 mb-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index + 1 < currentStep;
              const isCurrent = index + 1 === currentStep;
              
              return (
                <div 
                  key={step.number}
                  className={`flex items-center space-x-4 p-4 rounded-xl border transition-all ${
                    isCompleted 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : isCurrent
                      ? 'bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 border-pink-200 dark:border-pink-800'
                      : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent
                      ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white'
                      : 'bg-slate-300 dark:bg-slate-600 text-slate-600 dark:text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Icon size={20} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      isCompleted 
                        ? 'text-green-800 dark:text-green-200' 
                        : isCurrent
                        ? 'text-pink-800 dark:text-pink-200'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm ${
                      isCompleted 
                        ? 'text-green-600 dark:text-green-400' 
                        : isCurrent
                        ? 'text-pink-600 dark:text-pink-400'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  
                  {isCompleted && (
                    <div className="text-green-600 dark:text-green-400">
                      <CheckCircle size={20} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Complete Later
            </button>
            <button
              onClick={handleCompleteProfile}
              disabled={isCompleting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-700 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting ? 'Opening...' : 'Continue Registration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;








"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, success, error
  const [message, setMessage] = useState('Processing your payment...');

  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    // Use trxref if reference is not available (Paystack sometimes uses trxref)
    const paymentReference = reference || trxref;
    
    if (!paymentReference) {
      setStatus('error');
      setMessage('Payment reference not found');
      return;
    }

    // Complete the provider registration
    completeRegistration(paymentReference);
  }, [searchParams]);

  const completeRegistration = async (reference: string) => {
    try {
      setStatus('processing');
      setMessage('Completing your registration...');

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/payments/complete-registration/${reference}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setMessage('Registration completed successfully!');
        toast.success('Welcome! Your provider account has been activated.');
        
        // Clear cached data and redirect to provider dashboard after 3 seconds
        setTimeout(() => {
          // Clear localStorage to force fresh data fetch
          localStorage.removeItem('providerProfile');
          localStorage.removeItem('registrationProgress');
          
          // Set payment completion flag
          localStorage.setItem('payment_completed', 'true');
          
          // Add refresh parameter to force data reload
          router.push('/provider/dashboard?refresh=true&payment_completed=true');
        }, 3000);
      } else {
        setStatus('error');
        setMessage(result.message || 'Failed to complete registration');
        toast.error(result.message || 'Registration completion failed');
      }
    } catch (error) {
      console.error('Registration completion error:', error);
      setStatus('error');
      setMessage('Network error. Please try again.');
      toast.error('Network error. Please try again.');
    }
  };

  const handleRetry = () => {
    const reference = searchParams.get('reference') || searchParams.get('trxref');
    if (reference) {
      completeRegistration(reference);
    }
  };

  const handleGoToDashboard = () => {
    // Clear cached data before redirecting
    localStorage.removeItem('providerProfile');
    localStorage.removeItem('registrationProgress');
    
    // Set payment completion flag
    localStorage.setItem('payment_completed', 'true');
    
    // Add refresh parameter to force data reload
    router.push('/provider/dashboard?refresh=true&payment_completed=true');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
          {/* Status Icon */}
          <div className="mb-6">
            {status === 'processing' && (
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            )}
            {status === 'success' && (
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            )}
            {status === 'error' && (
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>

          {/* Status Message */}
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            {status === 'processing' && 'Processing Payment'}
            {status === 'success' && 'Registration Complete!'}
            {status === 'error' && 'Registration Failed'}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 mb-6">
            {message}
          </p>

          {/* Action Buttons */}
          {status === 'success' && (
            <div className="space-y-3">
              <button
                onClick={handleGoToDashboard}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Go to Dashboard
              </button>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={handleRetry}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/become-provider')}
                className="w-full px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Back to Registration
              </button>
            </div>
          )}

          {status === 'processing' && (
            <div className="space-y-3">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Please wait while we complete your registration...
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Having trouble? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
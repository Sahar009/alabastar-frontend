"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { CheckCircle, Loader2, AlertCircle } from "lucide-react";

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const reference = searchParams.get('reference') || searchParams.get('trxref');
        
        if (!reference) {
          setStatus('error');
          setMessage('Payment reference not found');
          return;
        }

        // Verify payment with backend
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${base}/api/payments/verify/${reference}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setStatus('success');
          setMessage('Payment successful! Your provider account has been created.');
          
          // Show success toast
          toast.success('Registration completed successfully! Welcome to Alabastar!');
          
          // Auto-redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push('/provider/dashboard');
          }, 3000);
        } else {
          setStatus('error');
          setMessage(data.message || 'Payment verification failed');
          toast.error('Payment verification failed. Please contact support.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        setMessage('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Verifying Payment
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Please wait while we verify your payment...
            </p>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Payment Successful!
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Payment verified</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Provider account created</span>
              </div>
              <div className="flex items-center justify-center space-x-2 text-green-600 dark:text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Redirecting to dashboard...</span>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={() => router.push('/provider/dashboard')}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Go to Dashboard
              </button>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Payment Failed
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {message}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/become-provider')}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="w-full py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

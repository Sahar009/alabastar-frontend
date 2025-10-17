"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw, Heart } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-100/20 to-orange-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-lg w-full text-center relative z-10">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl border-4 border-white/50 dark:border-slate-700/50">
            <AlertTriangle className="w-16 h-16 text-pink-600 dark:text-pink-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-4">
            Oops! Something went wrong
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-3 font-medium">
            We encountered an unexpected error
          </p>
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 border border-pink-200/50 dark:border-slate-700/50 shadow-lg">
            <p className="text-slate-500 dark:text-slate-400 text-sm font-mono">
              {error.message || "An unknown error occurred"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-2xl hover:shadow-lg hover:shadow-pink-500/25 hover:scale-105 transition-all duration-300 font-semibold text-lg"
            >
              <RefreshCw className="w-5 h-5 mr-3" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 border-2 border-pink-200 dark:border-pink-700 text-pink-700 dark:text-pink-300 rounded-2xl hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-300 font-semibold text-lg hover:scale-105"
            >
              <Home className="w-5 h-5 mr-3" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-10 p-6 bg-gradient-to-r from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-2xl border border-pink-200/50 dark:border-slate-700/50 backdrop-blur-sm">
          <div className="flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-pink-500 mr-2" />
            <span className="text-pink-600 dark:text-pink-400 font-semibold">Need Help?</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            If this problem persists, please{" "}
            <Link 
              href="/contact" 
              className="text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 font-semibold hover:underline transition-colors"
            >
              contact our support team
            </Link>
            {" "}and we'll help you get back on track!
          </p>
        </div>

        {/* Additional Decorative Elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
}

























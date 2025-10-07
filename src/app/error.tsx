"use client";
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Error Illustration */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Something went wrong!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-2">
            We encountered an unexpected error.
          </p>
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            {error.message || "An unknown error occurred"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-xl hover:opacity-90 hover:scale-105 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-semibold"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            If this problem persists, please <Link href="/contact" className="text-[#2563EB] hover:underline">contact support</Link>
          </p>
        </div>
      </div>
    </div>
  );
}























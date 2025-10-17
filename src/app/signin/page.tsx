"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Users, 
  Briefcase, 
  ArrowRight, 
  Star, 
  Shield, 
  Zap, 
  Heart,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

export default function UnifiedSignIn() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<'user' | 'provider' | null>(null);

  const userFeatures = [
    { icon: Star, text: "Find trusted service providers" },
    { icon: Shield, text: "Verified and background-checked" },
    { icon: Heart, text: "Easy booking and payment" },
    { icon: CheckCircle, text: "Quality guaranteed services" }
  ];

  const providerFeatures = [
    { icon: Briefcase, text: "Grow your business" },
    { icon: Zap, text: "Get more customers" },
    { icon: Star, text: "Build your reputation" },
    { icon: Shield, text: "Secure payments" }
  ];

  const handleTypeSelection = (type: 'user' | 'provider') => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType === 'user') {
      router.push('/login');
    } else if (selectedType === 'provider') {
      router.push('/provider/signin');
    }
  };

  const handleBack = () => {
    setSelectedType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-200/30 to-orange-200/30 dark:from-pink-800/20 dark:to-orange-800/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <Image 
              src="/brand/logo.png" 
              alt="Alabastar" 
              width={120} 
              height={80} 
              className="mx-auto hover:scale-105 transition-transform duration-300"
            />
          </Link>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-4">
            Welcome to Alabastar
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Choose how you'd like to sign in and start your journey with us
          </p>
        </div>

        {/* Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* User Card */}
          <div 
            className={`group relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 transition-all duration-500 transform hover:scale-105 cursor-pointer ${
              selectedType === 'user' 
                ? 'border-pink-500 shadow-pink-500/25 scale-105' 
                : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600'
            }`}
            onClick={() => handleTypeSelection('user')}
          >
            <div className="p-8">
              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                selectedType === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25'
                  : 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-pink-100 group-hover:to-orange-100 dark:group-hover:from-pink-900/30 dark:group-hover:to-orange-900/30'
              }`}>
                <Users className={`w-10 h-10 transition-colors duration-300 ${
                  selectedType === 'user' 
                    ? 'text-white' 
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-pink-600'
                }`} />
              </div>

              {/* Title */}
              <h3 className={`text-2xl font-bold text-center mb-4 transition-colors duration-300 ${
                selectedType === 'user'
                  ? 'text-pink-600'
                  : 'text-slate-900 dark:text-slate-50 group-hover:text-pink-600'
              }`}>
                I'm a Customer
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6 leading-relaxed">
                Looking for reliable service providers? Find and book trusted professionals for all your needs.
              </p>

              {/* Features */}
              <div className="space-y-3">
                {userFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      selectedType === 'user'
                        ? 'bg-pink-100 dark:bg-pink-900/30'
                        : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30'
                    }`}>
                      <feature.icon className={`w-4 h-4 transition-colors duration-300 ${
                        selectedType === 'user'
                          ? 'text-pink-600'
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-pink-600'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      selectedType === 'user'
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Selection indicator */}
              {selectedType === 'user' && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Provider Card */}
          <div 
            className={`group relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl border-2 transition-all duration-500 transform hover:scale-105 cursor-pointer ${
              selectedType === 'provider' 
                ? 'border-pink-500 shadow-pink-500/25 scale-105' 
                : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600'
            }`}
            onClick={() => handleTypeSelection('provider')}
          >
            <div className="p-8">
              {/* Icon */}
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                selectedType === 'provider'
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg shadow-pink-500/25'
                  : 'bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 group-hover:from-pink-100 group-hover:to-orange-100 dark:group-hover:from-pink-900/30 dark:group-hover:to-orange-900/30'
              }`}>
                <Briefcase className={`w-10 h-10 transition-colors duration-300 ${
                  selectedType === 'provider' 
                    ? 'text-white' 
                    : 'text-slate-600 dark:text-slate-400 group-hover:text-pink-600'
                }`} />
              </div>

              {/* Title */}
              <h3 className={`text-2xl font-bold text-center mb-4 transition-colors duration-300 ${
                selectedType === 'provider'
                  ? 'text-pink-600'
                  : 'text-slate-900 dark:text-slate-50 group-hover:text-pink-600'
              }`}>
                I'm a Service Provider
              </h3>

              {/* Description */}
              <p className="text-slate-600 dark:text-slate-400 text-center mb-6 leading-relaxed">
                Ready to grow your business? Join our platform and connect with customers who need your services.
              </p>

              {/* Features */}
              <div className="space-y-3">
                {providerFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      selectedType === 'provider'
                        ? 'bg-pink-100 dark:bg-pink-900/30'
                        : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-pink-100 dark:group-hover:bg-pink-900/30'
                    }`}>
                      <feature.icon className={`w-4 h-4 transition-colors duration-300 ${
                        selectedType === 'provider'
                          ? 'text-pink-600'
                          : 'text-slate-600 dark:text-slate-400 group-hover:text-pink-600'
                      }`} />
                    </div>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      selectedType === 'provider'
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Selection indicator */}
              {selectedType === 'provider' && (
                <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {selectedType && (
            <>
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back</span>
              </button>
              
              <button
                onClick={handleContinue}
                className="flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-xl font-semibold hover:from-pink-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg shadow-lg"
              >
                <span>Continue to Sign In</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link 
              href="/become-provider" 
              className="text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold hover:underline"
            >
              Become a Provider
            </Link>
            {' '}or{' '}
            <Link 
              href="/register" 
              className="text-pink-600 hover:text-pink-700 dark:text-pink-400 font-semibold hover:underline"
            >
              Register as Customer
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

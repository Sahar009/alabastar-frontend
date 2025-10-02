"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ImageSlider from "../../components/ImageSlider";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/");

  useEffect(() => {
    const url = searchParams.get('returnUrl');
    if (url) {
      setReturnUrl(decodeURIComponent(url));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(formData.email, formData.password);
    if (success) {
      router.push(returnUrl);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    const success = await loginWithGoogle();
    if (success) {
      router.push(returnUrl);
    }
  };

  // Slider data for login page
  const sliderImages = [
    '/images/slider1.jpg',
    '/images/slider2.jpg',
    '/images/slider3.jpg',
    '/images/slider4.jpg',
    '/images/slider5.jpg',
    '/images/slider6.jpg',
    '/images/slider7.jpg',
    '/images/slider8.jpg'
  ];

  const sliderTexts = [
    {
      title: "Welcome Back",
      subtitle: "Continue Your Journey",
      description: "Access your account and continue discovering amazing services from verified professionals."
    },
    {
      title: "Your Dashboard",
      subtitle: "Manage Everything",
      description: "Track your bookings, manage your profile, and access all your service history in one place."
    },
    {
      title: "Quick Access",
      subtitle: "Book Services Instantly",
      description: "With your account, you can quickly book services, save favorites, and get personalized recommendations."
    },
    {
      title: "Secure Login",
      subtitle: "Your Data is Safe",
      description: "We use industry-standard security measures to protect your personal information and account data."
    },
    {
      title: "Stay Connected",
      subtitle: "Never Miss Updates",
      description: "Get notified about booking confirmations, service updates, and special offers from your favorite providers."
    },
    {
      title: "Easy Management",
      subtitle: "Control Your Experience",
      description: "Manage your preferences, update your profile, and customize your service discovery experience."
    },
    {
      title: "Trusted Platform",
      subtitle: "Reliable Service",
      description: "Join thousands of satisfied customers who trust Alabastar for all their service needs."
    },
    {
      title: "Ready to Continue?",
      subtitle: "Sign In Now",
      description: "Access your account and continue enjoying seamless service experiences with Alabastar."
    }
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image Slider (60% width on desktop) */}
      <div className="hidden lg:flex lg:w-3/5 relative">
        <ImageSlider 
          images={sliderImages} 
          texts={sliderTexts}
          autoSlideInterval={6000}
        />
      </div>

      {/* Right Side - Login Form (40% width on desktop, full width on mobile) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/brand/logo-icon.svg" alt="Alabastar" width={40} height={40} priority />
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">ALABASTAR</span>
          </Link> */}
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                <Mail className="inline w-4 h-4 mr-2" />
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#2563EB] focus:ring-[#2563EB]/50 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#2563EB] hover:text-[#2563EB]/80">
                  Forgot password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#2563EB] to-[#14B8A6] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2563EB]/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Or continue with</span>
              </div>
            </div>

            {/* Google Sign In */}
            <div className="mt-6">
              <button
                onClick={handleGoogleAuth}
                className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="font-medium text-[#2563EB] hover:text-[#2563EB]/80">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Provider Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you a service provider?{" "}
            <Link href="/become-provider" className="font-medium text-[#14B8A6] hover:text-[#14B8A6]/80">
              Join as a provider
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-slate-700 dark:text-slate-300">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

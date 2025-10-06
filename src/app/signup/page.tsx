"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Check } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import ImageSlider from "../../components/ImageSlider";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, loginWithGoogle } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [returnUrl, setReturnUrl] = useState("/");

  // Phone number formatting function
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // If it starts with 234, format as +234
    if (cleaned.startsWith('234')) {
      return '+' + cleaned;
    }
    
    // If it starts with 0, keep as is (Nigerian local format)
    if (cleaned.startsWith('0')) {
      return cleaned;
    }
    
    // If it's 11 digits and starts with 8, assume it's missing the 0
    if (cleaned.length === 11 && cleaned.startsWith('8')) {
      return '0' + cleaned;
    }
    
    // If it's 10 digits and starts with 8, add 0
    if (cleaned.length === 10 && cleaned.startsWith('8')) {
      return '0' + cleaned;
    }
    
    return cleaned;
  };

  useEffect(() => {
    const url = searchParams.get('returnUrl');
    if (url) {
      setReturnUrl(decodeURIComponent(url));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    // Format phone numbers
    if (name === 'phone') {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({ 
        ...prev, 
        [name]: formattedValue
      }));
    } else {
      setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);

    const success = await register({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone.trim() || undefined,
      password: formData.password
    });

    if (success) {
      router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    const success = await loginWithGoogle();
    if (success) {
      router.push(returnUrl);
    }
  };

  const passwordRequirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.password) },
    { text: 'Contains number', met: /\d/.test(formData.password) }
  ];

  // Slider data for signup page
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
      title: "Welcome to Alabastar",
      subtitle: "Your Trusted Service Partner",
      description: "Connect with verified professionals for all your home and business needs. From repairs to renovations, we've got you covered."
    },
    {
      title: "Quality Services",
      subtitle: "Verified Professionals",
      description: "Every service provider on our platform is thoroughly vetted and verified. Quality and reliability are our top priorities."
    },
    {
      title: "Easy Booking",
      subtitle: "Book in Minutes",
      description: "Find, compare, and book services in just a few clicks. No more endless searching for the right professional."
    },
    {
      title: "Secure Payments",
      subtitle: "Safe & Protected",
      description: "Your payments are secure and protected. Pay only when you're satisfied with the service provided."
    },
    {
      title: "24/7 Support",
      subtitle: "Always Here for You",
      description: "Our customer support team is available around the clock to help you with any questions or concerns."
    },
    {
      title: "Real Reviews",
      subtitle: "Honest Feedback",
      description: "Read genuine reviews from real customers to make informed decisions about your service providers."
    },
    {
      title: "Instant Quotes",
      subtitle: "Get Prices Fast",
      description: "Receive instant quotes from multiple providers. Compare prices and choose the best option for your budget."
    },
    {
      title: "Join Our Community",
      subtitle: "Be Part of Something Great",
      description: "Join thousands of satisfied customers who trust Alabastar for all their service needs."
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

      {/* Right Side - Signup Form (40% width on desktop, full width on mobile) */}
      <div className="w-full lg:w-2/5 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/brand/logo-icon.svg" alt="Alabastar" width={40} height={40} priority />
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">ALABASTAR</span>
          </Link> */}
          <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Create your account
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">
            Join thousands of satisfied customers
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                <User className="inline w-4 h-4 mr-2" />
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all"
                placeholder="Enter your full name"
              />
            </div>

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
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                <Phone className="inline w-4 h-4 mr-2" />
                Phone Number (Optional)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent transition-all"
                placeholder="08123456789 or +2348123456789"
              />
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                Nigerian format: 08123456789
              </p>
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent transition-all"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <Check 
                        size={12} 
                        className={req.met ? "text-green-500" : "text-slate-400"} 
                      />
                      <span className={req.met ? "text-green-600 dark:text-green-400" : "text-slate-500"}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                <Lock className="inline w-4 h-4 mr-2" />
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  required
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500/50 border-slate-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="agreeToTerms" className="text-slate-700 dark:text-slate-300">
                  I agree to the{" "}
                  <a href="#" className="text-pink-600 hover:text-pink-500">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-pink-600 hover:text-pink-500">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-gradient-to-r from-pink-600 to-orange-500 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <>
                  Create Account
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

            {/* Google Sign Up */}
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

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-pink-600 hover:text-pink-500">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Provider Link */}
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Are you a service provider?{" "}
            <Link href="/become-provider" className="font-medium text-orange-500 hover:text-orange-400">
              Join as a provider
            </Link>
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center text-slate-700 dark:text-slate-300">Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}

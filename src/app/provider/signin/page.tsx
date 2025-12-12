"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Users, Shield, Star, Zap } from "lucide-react";

export default function ProviderSignIn() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/auth/provider/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      console.log('Login response:', { 
        ok: response.ok, 
        status: response.status,
        success: data.success, 
        hasData: !!data.data, 
        hasToken: !!data.data?.token,
        message: data.message 
      });
      
      if (response.ok && data.success) {
        // Store authentication data
        if (data.data?.token) {
          localStorage.setItem('token', data.data.token);
          localStorage.setItem('user', JSON.stringify(data.data.user));
          if (data.data.providerProfile) {
            localStorage.setItem('providerProfile', JSON.stringify(data.data.providerProfile));
          }
          
          toast.success('Welcome back! Redirecting to dashboard...');
          setTimeout(() => {
            router.push('/provider/dashboard');
          }, 1500);
        } else {
          console.error('Token missing in response:', data);
          toast.error('Login failed. Token not received. Please try again.');
        }
      } else {
        console.error('Login failed:', { status: response.status, data });
        toast.error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex">
      {/* Left Side - Static Image Section */}
      <div className="hidden lg:flex lg:w-[60%] relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/images/provider-signin-bg.jpg"
            alt="Provider Sign In"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-600/80 via-pink-500/70 to-slate-900/80"></div>
        </div>
        
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-12 text-white">
          {/* Logo/Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
              <Users className="w-10 h-10 text-white" />
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl font-bold mb-4">
            Welcome Back, Provider!
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-md">
            Sign in to access your provider dashboard and manage your services
          </p>
          
          {/* Features */}
          <div className="grid grid-cols-1 gap-4 max-w-sm">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Secure & Verified</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">5-Star Rated Platform</span>
            </div>
            
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium">Instant Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full lg:w-[40%] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <div className="flex justify-start mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-slate-50">
              Provider Sign In
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-300">
              Sign in to your provider account
            </p>
          </div>

          {/* Sign In Form */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  <Mail className="inline w-4 h-4 mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  <Lock className="inline w-4 h-4 mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-slate-300 dark:border-slate-600 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <button
                    type="button"
                    onClick={() => toast('🚧 Password Reset - Coming Soon!')}
                    className="text-pink-600 hover:text-pink-500 font-medium"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Don&apos;t have a provider account?{' '}
                <button
                  onClick={() => router.push('/become-provider')}
                  className="text-pink-600 hover:text-pink-500 font-medium"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              By signing in, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}












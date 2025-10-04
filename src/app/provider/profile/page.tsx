"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Edit3,
  Save,
  X,
  Camera,
  Upload,
  Star,
  Award,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2,
  Eye,
  EyeOff,
  Building2,
  Briefcase,
  Globe,
  MessageSquare
} from "lucide-react";

export default function ProviderProfile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    businessName: '',
    bio: '',
    category: '',
    location: '',
    website: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch provider profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const storedProfile = localStorage.getItem('providerProfile');
      
      if (!token) {
        toast.error('Please sign in to view profile');
        router.push('/provider/signin');
        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setProviderProfile(profile);
        
        // Set form data from stored profile
        setFormData({
          fullName: profile.user?.fullName || '',
          phone: profile.user?.phone || '',
          businessName: profile.businessName || '',
          bio: profile.bio || '',
          category: profile.category || '',
          location: profile.location || '',
          website: profile.website || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Fetch detailed profile from API
        const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
        const response = await fetch(`${base}/api/providers/profile/${profile.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          const detailedProfile = data.data;
          
          // Update form data with detailed profile
          setFormData(prev => ({
            ...prev,
            fullName: detailedProfile.user?.fullName || prev.fullName,
            phone: detailedProfile.user?.phone || prev.phone,
            businessName: detailedProfile.businessName || prev.businessName,
            bio: detailedProfile.bio || prev.bio,
            category: detailedProfile.category || prev.category,
            location: detailedProfile.location || prev.location,
            website: detailedProfile.website || prev.website
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Update user profile (basic info)
      const userUpdateResponse = await fetch(`${base}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phone: formData.phone
        })
      });

      if (!userUpdateResponse.ok) {
        throw new Error('Failed to update user profile');
      }

      // Update provider profile (business info)
      if (providerProfile?.id) {
        const providerUpdateResponse = await fetch(`${base}/api/providers/profile/${providerProfile.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            businessName: formData.businessName,
            bio: formData.bio,
            category: formData.category,
            location: formData.location,
            website: formData.website
          })
        });

        if (!providerUpdateResponse.ok) {
          throw new Error('Failed to update provider profile');
        }
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
      
      // Refresh profile data
      await fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Get verification status color
  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-200';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Get verification icon
  const getVerificationIcon = (status: string) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#2563EB] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/provider/dashboard')}
                className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2563EB] to-[#14B8A6] bg-clip-text text-transparent mb-2">
                  Profile
                </h1>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Manage your provider profile and account settings
                </p>
              </div>
            </div>
            <button
              onClick={() => setEditing(!editing)}
              className={`group px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                editing 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg hover:shadow-red-500/25' 
                  : 'bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white hover:shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              <div className="flex items-center space-x-2">
                {editing ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-16 h-16 text-white" />
                  </div>
                  {editing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-700 rounded-full shadow-lg hover:shadow-xl transition-all duration-200">
                      <Camera className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mt-4">
                  {formData.businessName || formData.fullName || 'Provider'}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {formData.category || 'Service Provider'}
                </p>
              </div>

              {/* Verification Status */}
              <div className="mb-6">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${getVerificationColor(providerProfile?.verificationStatus || 'pending')}`}>
                  {getVerificationIcon(providerProfile?.verificationStatus || 'pending')}
                  <span className="ml-2 capitalize">
                    {providerProfile?.verificationStatus || 'pending'} Verification
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Rating</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">4.8</span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed Jobs</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">24</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Profile Information</h3>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#2563EB]" />
                    Personal Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Full Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <User className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.fullName || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Phone Number
                      </label>
                      {editing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-[#2563EB]" />
                    Business Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Business Name
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.businessName || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Category
                      </label>
                      {editing ? (
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Category</option>
                          <option value="plumbing">Plumbing</option>
                          <option value="electrical">Electrical</option>
                          <option value="hvac">HVAC</option>
                          <option value="cleaning">Cleaning</option>
                          <option value="landscaping">Landscaping</option>
                          <option value="painting">Painting</option>
                          <option value="carpentry">Carpentry</option>
                          <option value="other">Other</option>
                        </select>
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100 capitalize">{formData.category || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Location
                      </label>
                      {editing ? (
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.location || 'Not specified'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Website
                      </label>
                      {editing ? (
                        <input
                          type="url"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://example.com"
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Globe className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.website || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Bio/Description
                      </label>
                      {editing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all duration-200 resize-none"
                          placeholder="Tell customers about your services and experience..."
                        />
                      ) : (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <p className="text-slate-900 dark:text-slate-100">
                            {formData.bio || 'No bio provided yet. Add a description to help customers understand your services.'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {editing && (
                  <div className="flex justify-end pt-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={saving}
                      className="group px-8 py-3 bg-gradient-to-r from-[#2563EB] to-[#14B8A6] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-2">
                        {saving ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                        )}
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

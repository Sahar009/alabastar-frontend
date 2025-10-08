"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useLocation from "../../../hooks/useLocation";
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
  MessageSquare,
  FileText,
  Image as ImageIcon,
  Trash2,
  Download,
  Plus,
  XCircle
} from "lucide-react";

export default function ProviderProfile() {
  const router = useRouter();
  const { detectLocation: detectUserLocation, detecting: detectingLocation } = useLocation();
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [stats, setStats] = useState({
    rating: 0,
    reviews: 0,
    totalReferrals: 0,
    totalCommissions: 0
  });
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    businessName: '',
    bio: '',
    category: '',
    subcategories: [] as string[],
    locationCity: '',
    locationState: '',
    latitude: '',
    longitude: '',
    portfolio: [] as string[]
  });

  // Fetch provider profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (!token) {
        toast.error('Please sign in to view profile');
        router.push('/provider/signin');
        return;
      }

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      }
      
      // Fetch profile using the current user's token (no need for providerId)
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/providers/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile fetch error:', errorData);
        toast.error(errorData.message || 'Failed to load profile');
        return;
      }

      const responseData = await response.json();
      console.log('Profile API Response:', responseData);
      const detailedProfile = responseData.data;
      
      if (!detailedProfile) {
        console.error('No profile data in response');
        toast.error('Failed to load profile data');
        return;
      }

      // Update form data with detailed profile
      const userData = detailedProfile.User || detailedProfile.user || {};
      
      const newFormData = {
        fullName: userData.fullName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        businessName: detailedProfile.businessName || '',
        bio: detailedProfile.bio || '',
        category: detailedProfile.category || '',
        subcategories: detailedProfile.subcategories || [],
        locationCity: detailedProfile.locationCity || '',
        locationState: detailedProfile.locationState || '',
        latitude: detailedProfile.latitude || '',
        longitude: detailedProfile.longitude || '',
        portfolio: detailedProfile.portfolio || []
      };
      
      console.log('Setting form data:', newFormData);
      setFormData(newFormData);
      setProviderProfile(detailedProfile);

      // Set stats from profile
      setStats({
        rating: 0,
        reviews: 0,
        totalReferrals: detailedProfile.totalReferrals || 0,
        totalCommissions: parseFloat(detailedProfile.totalCommissionsEarned) || 0
      });

      // Set documents from the profile response
      if (detailedProfile.ProviderDocuments) {
        console.log('Setting documents from profile response:', detailedProfile.ProviderDocuments);
        setDocuments(detailedProfile.ProviderDocuments);
      } else {
        // Fallback: Fetch documents separately if not included
        console.log('Fetching documents separately');
        await fetchDocuments(detailedProfile.id, token);
      }

      // Fetch rating data
      await fetchProviderRating(detailedProfile.id, token);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setLoading(false);
    }
  };

  // Fetch provider rating data
  const fetchProviderRating = async (providerId: string, token: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const ratingResponse = await fetch(`${base}/api/reviews/provider/${providerId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (ratingResponse.ok) {
        const ratingData = await ratingResponse.json();
        if (ratingData.success && ratingData.data) {
          setStats(prevStats => ({
            ...prevStats,
            rating: ratingData.data.averageRating || 0,
            reviews: ratingData.data.totalReviews || 0
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching provider rating:', error);
    }
  };

  // Fetch provider documents
  const fetchDocuments = async (providerId: string, token: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/providers/${providerId}/documents`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('Documents API Response:', responseData);
        setDocuments(responseData.data?.documents || responseData.data || []);
      } else {
        const errorData = await response.json();
        console.error('Documents fetch error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
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
      
      if (!providerProfile?.id) {
        throw new Error('Provider profile not found');
      }

      const response = await fetch(`${base}/api/providers/profile/${providerProfile.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          businessName: formData.businessName,
          bio: formData.bio,
          category: formData.category,
          subcategories: formData.subcategories,
          locationCity: formData.locationCity,
          locationState: formData.locationState,
          latitude: formData.latitude,
          longitude: formData.longitude,
          portfolio: formData.portfolio
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update provider profile');
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

  // Detect user location using the hook
  const detectLocation = async () => {
    const locationData = await detectUserLocation(true);
    
    if (locationData) {
      setFormData(prev => ({
        ...prev,
        locationCity: locationData.city || '',
        locationState: locationData.state || '',
        latitude: locationData.latitude.toString(),
        longitude: locationData.longitude.toString()
      }));
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingDoc(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${base}/api/providers/${providerProfile.id}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Document uploaded successfully!');
        await fetchDocuments(providerProfile.id, token);
      } else {
        throw new Error('Failed to upload document');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/providers/${providerProfile.id}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Document deleted successfully!');
        await fetchDocuments(providerProfile.id, token);
      } else {
        throw new Error('Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
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

  // Get document status color
  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'text-amber-600 bg-amber-100 dark:bg-amber-900 dark:text-amber-200';
      case 'rejected': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error if no profile data after loading
  if (!loading && !providerProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Failed to load profile data</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-6 py-2 bg-[#ec4899] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering profile with formData:', formData);
  console.log('Provider profile:', providerProfile);
  console.log('Documents:', documents);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className="text-4xl font-bold text-[#ec4899] mb-2">
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
                  ? 'bg-red-500 text-white hover:shadow-lg hover:shadow-red-500/25' 
                  : 'bg-[#ec4899] text-white hover:shadow-lg hover:shadow-pink-500/25'
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
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-[#ec4899] rounded-full flex items-center justify-center shadow-lg">
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
                <p className="text-slate-600 dark:text-slate-400 capitalize">
                  {formData.category || 'Service Provider'}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                  {formData.email}
                </p>
              </div>

              {/* Verification Status */}
              <div className="mb-6 text-center">
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
                    <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                      <Star className="w-4 h-4 text-[#ec4899]" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Rating</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {stats.reviews > 0 ? stats.rating.toFixed(1) : 'New'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <Award className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Referrals</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    {stats.totalReferrals}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">₦</span>
                    </div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Commissions</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    ₦{stats.totalCommissions.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-6 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-[#ec4899]" />
                Location
              </h3>
              <div className="space-y-2">
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">City:</span> {formData.locationCity || 'Not specified'}
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">State:</span> {formData.locationState || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal & Business Information */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">Profile Information</h3>
              
              <div className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-[#ec4899]" />
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
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
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
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.phone || 'Not provided'}</span>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Email Address
                      </label>
                      <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 dark:text-slate-100">{formData.email || 'Not provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-[#ec4899]" />
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
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                        />
                      ) : (
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Building2 className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">{formData.businessName || 'Not provided'}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Category
                        </label>
                        {editing ? (
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
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
                          Subcategories
                        </label>
                        <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-900 dark:text-slate-100">
                            {formData.subcategories?.length > 0 ? formData.subcategories.join(', ') : 'None'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                          Location
                        </label>
                        {editing && (
                          <button
                            type="button"
                            onClick={detectLocation}
                            disabled={detectingLocation}
                            className="flex items-center space-x-1 text-xs text-[#ec4899] hover:text-pink-700 font-medium disabled:opacity-50"
                          >
                            <MapPin className="w-3 h-3" />
                            <span>{detectingLocation ? 'Detecting...' : 'Detect Location'}</span>
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            City
                          </label>
                          {editing ? (
                            <input
                              type="text"
                              name="locationCity"
                              value={formData.locationCity}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-900 dark:text-slate-100">{formData.locationCity || 'Not specified'}</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                            State
                          </label>
                          {editing ? (
                            <input
                              type="text"
                              name="locationState"
                              value={formData.locationState}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                            />
                          ) : (
                            <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span className="text-slate-900 dark:text-slate-100">{formData.locationState || 'Not specified'}</span>
                            </div>
                          )}
                        </div>
                      </div>
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
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200 resize-none"
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
                      className="group px-8 py-3 bg-[#ec4899] text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
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

            {/* Documents Section */}
            <div className="bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-[#ec4899]" />
                  Documents & Verification
                </h3>
              </div>

              {/* Upload Documents */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    ID Card
                  </label>
                  <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer hover:border-[#ec4899] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentUpload(e, 'id_card')}
                      className="hidden"
                      disabled={uploadingDoc}
                    />
                    <Upload className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingDoc ? 'Uploading...' : 'Upload ID'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Certificate
                  </label>
                  <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer hover:border-[#ec4899] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentUpload(e, 'certificate')}
                      className="hidden"
                      disabled={uploadingDoc}
                    />
                    <Upload className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingDoc ? 'Uploading...' : 'Upload Cert'}
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    License
                  </label>
                  <label className="flex items-center justify-center px-4 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-2xl cursor-pointer hover:border-[#ec4899] hover:bg-pink-50 dark:hover:bg-pink-900/10 transition-all duration-200">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleDocumentUpload(e, 'license')}
                      className="hidden"
                      disabled={uploadingDoc}
                    />
                    <Upload className="w-5 h-5 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {uploadingDoc ? 'Uploading...' : 'Upload License'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Documents List */}
              <div className="space-y-3">
                {documents.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">No documents uploaded yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Upload your verification documents to get verified faster
                    </p>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="p-2 bg-white dark:bg-slate-600 rounded-lg">
                          <FileText className="w-5 h-5 text-[#ec4899]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-slate-100 capitalize">
                            {doc.type.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Uploaded {new Date(doc.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getDocumentStatusColor(doc.status)}`}>
                          {doc.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-[#ec4899] hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 hover:bg-white dark:hover:bg-slate-600 rounded-lg transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
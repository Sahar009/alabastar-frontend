"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import useLocation from "../../../hooks/useLocation";
import { useAuth } from "../../../contexts/AuthContext";
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
  XCircle,
  Video
} from "lucide-react";

export default function ProviderProfile() {
  const router = useRouter();
  const { detectLocation: detectUserLocation, detecting: detectingLocation } = useLocation();
  const { user, providerProfile, loading: authLoading, updateProfile } = useAuth();
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
  const [featureLimits, setFeatureLimits] = useState<any>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
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
    portfolio: [] as string[],
    videoUrl: '',
    videoThumbnail: '',
    videoDuration: 0
  });
  const [currentProviderId, setCurrentProviderId] = useState<string | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [availableSubcategories, setAvailableSubcategories] = useState<string[]>([]);
  const [loadingSubcategories, setLoadingSubcategories] = useState(false);
  const [selectedCategoryForSubcat, setSelectedCategoryForSubcat] = useState<string>('');

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setHasToken(!!token);
  }, []);

  // Initialize form data from API
  useEffect(() => {
    console.log('Provider Profile useEffect - authLoading:', authLoading, 'user:', user, 'profileLoaded:', profileLoaded);
    
    // Don't run if profile already loaded - we're done!
    if (profileLoaded) {
      return;
    }
    
    if (!authLoading) {
      // Check for token first - if token exists, try to fetch profile even if user is not in context
      const token = localStorage.getItem('token');
      setHasToken(!!token);
      
      // If we have a token, always try to fetch profile (don't redirect)
      if (token) {
        console.log('Token found, fetching provider profile (user:', !!user, ')');
        fetchCurrentProviderProfile();
        return;
      }
      
      // Only redirect if we have NO token AND NO user AND profile hasn't loaded
      if (!token && !user && !profileLoaded) {
        console.log('No token and no user found, redirecting to signin');
        router.push('/provider/signin');
        return;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, profileLoaded]);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/categories/categories?limit=100&isActive=true`);
      const data = await response.json();

      if (data.success && data.data?.categories) {
        const transformedCategories = data.data.categories.map((category: any) => ({
          value: category.slug || category.name.toLowerCase().replace(/\s+/g, '_'),
          label: category.name,
          id: category.id,
          description: category.description
        }));
        setCategories(transformedCategories);
      } else {
        console.error('Failed to load categories:', data.message);
        // Fallback to hardcoded categories
        setCategories([
          { value: 'plumbing', label: 'Plumbing' },
          { value: 'electrical', label: 'Electrical' },
          { value: 'cleaning', label: 'Cleaning' },
          { value: 'moving', label: 'Moving' },
          { value: 'ac_repair', label: 'AC Repair' },
          { value: 'carpentry', label: 'Carpentry' },
          { value: 'painting', label: 'Painting' },
          { value: 'pest_control', label: 'Pest Control' },
          { value: 'laundry', label: 'Laundry' },
          { value: 'tiling', label: 'Tiling' },
          { value: 'cctv', label: 'CCTV' },
          { value: 'gardening', label: 'Gardening' },
          { value: 'appliance_repair', label: 'Appliance Repair' },
          { value: 'locksmith', label: 'Locksmith' },
          { value: 'carpet_cleaning', label: 'Carpet Cleaning' }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to hardcoded categories
      setCategories([
        { value: 'plumbing', label: 'Plumbing' },
        { value: 'electrical', label: 'Electrical' },
        { value: 'cleaning', label: 'Cleaning' },
        { value: 'moving', label: 'Moving' },
        { value: 'ac_repair', label: 'AC Repair' },
        { value: 'carpentry', label: 'Carpentry' },
        { value: 'painting', label: 'Painting' },
        { value: 'pest_control', label: 'Pest Control' },
        { value: 'laundry', label: 'Laundry' },
        { value: 'tiling', label: 'Tiling' },
        { value: 'cctv', label: 'CCTV' },
        { value: 'gardening', label: 'Gardening' },
        { value: 'appliance_repair', label: 'Appliance Repair' },
        { value: 'locksmith', label: 'Locksmith' },
        { value: 'carpet_cleaning', label: 'Carpet Cleaning' }
      ]);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Fetch subcategories for a category
  const loadSubcategories = async (category: string) => {
    if (!category) return;
    
    try {
      setLoadingSubcategories(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const token = localStorage.getItem('token');
      const response = await fetch(`${base}/api/providers/subcategories/${category}?limit=30`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      console.log('[ProviderProfile] Subcategories API response:', data);
      
      if (data.success && data.data?.subcategories) {
        console.log('[ProviderProfile] Setting subcategories:', data.data.subcategories);
        setAvailableSubcategories(data.data.subcategories);
      } else {
        console.warn('[ProviderProfile] No subcategories in response');
        setAvailableSubcategories([]);
      }
    } catch (error) {
      console.error('Error loading subcategories:', error);
      setAvailableSubcategories([]);
    } finally {
      setLoadingSubcategories(false);
    }
  };

  // Handle category selection - opens subcategory modal
  const handleCategorySelect = async (categoryValue: string) => {
    // Update category in formData
    setFormData(prev => ({ ...prev, category: categoryValue }));
    
    // Load and show subcategories
    setSelectedCategoryForSubcat(categoryValue);
    await loadSubcategories(categoryValue);
    setShowSubcategoryModal(true);
  };

  // Handle edit subcategories button - loads subcategories for existing category
  const handleEditSubcategories = async () => {
    if (!formData.category) {
      console.warn('[ProviderProfile] No category selected');
      return;
    }
    
    console.log('[ProviderProfile] Opening subcategory modal for category:', formData.category);
    console.log('[ProviderProfile] Current subcategories:', formData.subcategories);
    
    // Open modal first to show loading state
    setShowSubcategoryModal(true);
    setSelectedCategoryForSubcat(formData.category);
    
    // Then load subcategories
    await loadSubcategories(formData.category);
    
    console.log('[ProviderProfile] Modal opened, subcategories loaded');
  };

  // Handle subcategory toggle
  const handleSubcategoryToggle = (subcategory: string) => {
    const normalized = subcategory.toLowerCase().trim();
    const currentSubcats = formData.subcategories || [];
    
    // Check if already selected (case-insensitive comparison)
    const isAlreadySelected = currentSubcats.some((item: string) => 
      item.toLowerCase().trim() === normalized
    );
    
    if (isAlreadySelected) {
      // Remove if already selected
      setFormData(prev => ({
        ...prev,
        subcategories: currentSubcats.filter((item: string) => 
          item.toLowerCase().trim() !== normalized
        )
      }));
    } else {
      // Add if not selected (store normalized version)
      setFormData(prev => ({
        ...prev,
        subcategories: [...currentSubcats, normalized]
      }));
    }
  };

  // Close subcategory modal
  const handleCloseSubcategoryModal = () => {
    setShowSubcategoryModal(false);
    setAvailableSubcategories([]);
    setSelectedCategoryForSubcat('');
  };

  // Fetch current provider profile from API
  const fetchCurrentProviderProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        // Only redirect if user is actually not authenticated
        if (!user) {
          router.push('/provider/signin');
        }
        return;
      }

      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      // Fetch current provider profile
      const response = await fetch(`${base}/api/providers/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const providerData = data.data;
          
          // Update form data with API data
          setFormData({
            fullName: providerData.User?.fullName || providerData.user?.fullName || '',
            email: providerData.User?.email || providerData.user?.email || '',
            phone: providerData.User?.phone || providerData.user?.phone || '',
            businessName: providerData.businessName || '',
            bio: providerData.bio || providerData.description || '',
            category: providerData.category || '',
            subcategories: providerData.subcategories || [],
            locationCity: providerData.locationCity || '',
            locationState: providerData.locationState || '',
            latitude: providerData.latitude || '',
            longitude: providerData.longitude || '',
            portfolio: providerData.portfolio || [],
            videoUrl: providerData.videoUrl || '',
            videoThumbnail: providerData.videoThumbnail || '',
            videoDuration: providerData.videoDuration || 0
          });

          // Update stats with API data
          setStats({
            rating: providerData.averageRating || 0,
            reviews: providerData.totalReviews || 0,
            totalReferrals: providerData.totalReferrals || 0,
            totalCommissions: parseFloat(providerData.totalCommissionsEarned || '0') || 0
          });

          // Handle documents from API response
          let allDocuments: any[] = [];
          
          // Handle ProviderDocuments array (old structure)
          if (providerData.ProviderDocuments && providerData.ProviderDocuments.length > 0) {
            allDocuments = [...providerData.ProviderDocuments];
          }
          
          // Handle portfolio structure (new structure)
          if (providerData.portfolio) {
            if (providerData.portfolio.documents && Array.isArray(providerData.portfolio.documents)) {
              allDocuments = [...allDocuments, ...providerData.portfolio.documents];
            }
            if (providerData.portfolio.brandImages && Array.isArray(providerData.portfolio.brandImages)) {
              allDocuments = [...allDocuments, ...providerData.portfolio.brandImages];
            }
          }
          
          // Handle direct documents array (fallback)
          if (providerData.documents && Array.isArray(providerData.documents)) {
            allDocuments = [...allDocuments, ...providerData.documents];
          }
          
          if (allDocuments.length > 0) {
            setDocuments(allDocuments);
            console.log('Documents loaded:', allDocuments);
          }

          // Set current provider ID for updates
          setCurrentProviderId(providerData.id);
          
          // Mark profile as loaded to prevent redirects
          setProfileLoaded(true);

          // Fetch additional data in parallel (don't let failures block the page)
          if (providerData.id) {
            Promise.allSettled([
              fetchProviderRating(providerData.id, token),
              fetchFeatureLimits(providerData.id, token)
            ]).catch(error => {
              console.error('Error fetching additional provider data:', error);
            });
          }

          console.log('Current provider profile loaded from API:', providerData);
        }
      } else {
        // Handle 401 Unauthorized - only redirect if truly unauthenticated
        if (response.status === 401) {
          const errorData = await response.json().catch(() => ({}));
          console.error('Authentication failed:', errorData);
          
          // Clear invalid token and redirect only if we get a clear 401
          localStorage.removeItem('token');
          toast.error('Session expired. Please sign in again.');
          router.push('/provider/signin');
          return;
        }
        
        // For other errors, just log them and show error message
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('Failed to fetch current provider profile:', response.status, errorText);
        
        // Show user-friendly error for network/server issues
        if (response.status >= 500) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('Failed to load profile. Please refresh the page.');
        }
      }
    } catch (error: any) {
      console.error('Error fetching current provider profile:', error);
      // Don't redirect on network errors - just show error
      if (error.message?.includes('fetch')) {
        toast.error('Network error. Please check your connection.');
      }
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
        // Handle 401 Unauthorized - but don't redirect immediately
        if (response.status === 401) {
          console.error('Authentication failed in documents fetch');
          if (!user) {
            localStorage.removeItem('token');
            router.push('/provider/signin');
          }
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('Documents fetch error:', errorData);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  // Fetch feature limits
  const fetchFeatureLimits = async (providerId: string, token: string) => {
    try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/providers/${providerId}/feature-limits`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Feature limits:', data.data);
        setFeatureLimits(data.data);
      } else {
        // Handle 401 Unauthorized - but don't redirect immediately
        if (response.status === 401) {
          console.error('Authentication failed in feature limits fetch');
          if (!user) {
            localStorage.removeItem('token');
            router.push('/provider/signin');
          }
          return;
        }
        console.error('Feature limits fetch error:', response.status);
      }
    } catch (error) {
      console.error('Error fetching feature limits:', error);
    }
  };

  // Update profile
  const handleUpdateProfile = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      if (!currentProviderId) {
        throw new Error('Provider profile not found');
      }

      const response = await fetch(`${base}/api/providers/profile/${currentProviderId}`, {
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
        // Handle 401 Unauthorized - but don't redirect immediately
        if (response.status === 401) {
          console.error('Authentication failed during profile update');
          if (!user) {
            localStorage.removeItem('token');
            router.push('/provider/signin');
          } else {
            toast.error('Session expired. Please refresh the page.');
          }
          return;
        }
        throw new Error('Failed to update provider profile');
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
      
      // Refresh profile data by updating AuthContext
      await updateProfile({
        fullName: formData.fullName,
        phone: formData.phone
      });
      
      // Refresh current provider profile from API
      await fetchCurrentProviderProfile();
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

    // Check photo limit for brand images
    if (type === 'brand_image' && featureLimits) {
      if (featureLimits.currentPhotoCount >= featureLimits.features.maxPhotos) {
        toast.error(`Photo limit reached! You have ${featureLimits.currentPhotoCount}/${featureLimits.features.maxPhotos} photos. Upgrade to add more.`);
        setShowUpgradeModal(true);
        return;
      }
    }

    try {
      setUploadingDoc(true);
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const formData = new FormData();
      formData.append('documents', file); // Changed from 'file' to 'documents'
      formData.append('type', type);

      const response = await fetch(`${base}/api/providers/${currentProviderId}/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        toast.success('Document uploaded successfully!');
        if (currentProviderId && token) {
          await fetchDocuments(currentProviderId, token);
          await fetchFeatureLimits(currentProviderId, token); // Refresh limits
          // Also refresh current provider profile
          await fetchCurrentProviderProfile();
        }
      } else {
        // Handle 401 Unauthorized - but don't redirect immediately
        if (response.status === 401) {
          console.error('Authentication failed during document upload');
          if (!user) {
            localStorage.removeItem('token');
            router.push('/provider/signin');
          } else {
            toast.error('Session expired. Please refresh the page.');
          }
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to upload document');
      }
    } catch (error: any) {
      console.error('Error uploading document:', error);
      toast.error(error.message || 'Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if Premium plan
    if (!featureLimits || featureLimits.features.maxVideos === 0) {
      toast.error('Video upload is a Premium feature!');
      setShowUpgradeModal(true);
      return;
    }

    // Check if already has video
    if (featureLimits.hasVideo) {
      toast.error('You already have a video. Delete the existing one first.');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a valid video file');
      return;
    }

    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      toast.error('Video file size must be less than 50MB');
      return;
    }

    try {
      setUploadingVideo(true);
      toast.loading('Uploading video... This may take a moment.');

      // For now, just show coming soon
      // TODO: Implement Cloudinary video upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.dismiss();
      toast('🚧 Video upload integration coming soon! Backend is ready.', { duration: 4000 });
      
    } catch (error: any) {
      toast.dismiss();
      console.error('Error uploading video:', error);
      toast.error(error.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
    }
  };

  // Handle video delete
  const handleVideoDelete = async () => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/providers/${currentProviderId}/video`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Video deleted successfully!');
        // Refresh profile data by updating AuthContext
        await updateProfile({});
        
        // Refresh current provider profile from API
        await fetchCurrentProviderProfile();
      } else {
        // Handle 401 Unauthorized - but don't redirect immediately
        if (response.status === 401) {
          console.error('Authentication failed during video deletion');
          if (!user) {
            localStorage.removeItem('token');
            router.push('/provider/signin');
          } else {
            toast.error('Session expired. Please refresh the page.');
          }
          return;
        }
        throw new Error('Failed to delete video');
      }
    } catch (error: any) {
      console.error('Error deleting video:', error);
      toast.error(error.message || 'Failed to delete video');
    }
  };

  // Delete document
  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication token not found');
        return;
      }
      
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${base}/api/providers/${currentProviderId}/documents/${documentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        toast.success('Document deleted successfully!');
        if (currentProviderId) {
          await fetchDocuments(currentProviderId, token);
          // Also refresh current provider profile
          await fetchCurrentProviderProfile();
        }
      } else {
        // Handle 401 Unauthorized - but don't redirect immediately
        if (response.status === 401) {
          console.error('Authentication failed during document deletion');
          if (!user) {
            localStorage.removeItem('token');
            router.push('/provider/signin');
          } else {
            toast.error('Session expired. Please refresh the page.');
          }
          return;
        }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#ec4899] animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show error only if no token, no user, no profile data, and not loading
  // If we have currentProviderId or formData populated, it means we successfully loaded the profile
  const hasProfileData = currentProviderId || formData.businessName || formData.email;
  
  if (!authLoading && !loading && !user && !hasToken && !hasProfileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Please sign in to view your profile</p>
          <button
            onClick={() => router.push('/provider/signin')}
            className="mt-4 px-6 py-2 bg-[#ec4899] text-white rounded-xl hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  console.log('Rendering profile with formData:', formData);
  console.log('Provider profile:', providerProfile);
  console.log('Documents:', documents);
  console.log('Feature limits:', featureLimits);

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
                          loadingCategories ? (
                            <div className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 flex items-center space-x-2">
                              <div className="w-4 h-4 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                              <span className="text-slate-600 dark:text-slate-400">Loading categories...</span>
                            </div>
                          ) : (
                            <select
                              name="category"
                              value={formData.category}
                              onChange={(e) => handleCategorySelect(e.target.value)}
                              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-2xl bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#ec4899] focus:border-transparent transition-all duration-200"
                            >
                              <option value="">Select Category</option>
                              {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>
                                  {cat.label}
                                </option>
                              ))}
                            </select>
                          )
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
                        {editing ? (
                          <div>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {formData.subcategories?.length > 0 ? (
                                formData.subcategories.map((subcat) => (
                                  <span
                                    key={subcat}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium"
                                  >
                                    {subcat.replace(/_/g, ' ')}
                                    <button
                                      type="button"
                                      onClick={() => handleSubcategoryToggle(subcat)}
                                      className="hover:bg-pink-200 dark:hover:bg-pink-800 rounded-full p-0.5"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))
                              ) : (
                                <span className="text-slate-500 dark:text-slate-400 text-sm">No subcategories selected</span>
                              )}
                            </div>
                            {formData.category && (
                              <button
                                type="button"
                                onClick={handleEditSubcategories}
                                className="w-full px-4 py-2.5 border-2 border-dashed border-pink-300 dark:border-pink-700 rounded-xl text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200 font-medium"
                              >
                                {formData.subcategories?.length > 0 ? 'Edit Subcategories' : 'Select Subcategories'}
                              </button>
                            )}
                            {!formData.category && (
                              <p className="text-sm text-slate-500 dark:text-slate-400">Please select a category first</p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-xl">
                            <Briefcase className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-900 dark:text-slate-100">
                              {formData.subcategories?.length > 0 ? formData.subcategories.map(s => s.replace(/_/g, ' ')).join(', ') : 'None'}
                            </span>
                          </div>
                        )}
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

            {/* Brand Images Section */}
            <div className="bg-gradient-to-br from-white via-pink-50 to-white dark:from-slate-800 dark:via-pink-900/20 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                    <ImageIcon className="w-6 h-6 mr-2 text-[#ec4899]" />
                    Brand Images
                  </h3>
                  {featureLimits && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-600 dark:text-slate-400 font-medium">
                              {featureLimits.currentPhotoCount || 0} / {featureLimits.features.maxPhotos || 5} photos used
                            </span>
                            <span className="text-[#ec4899] font-semibold">
                              {featureLimits.photosRemaining || 0} remaining
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-pink-600 to-orange-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${((featureLimits.currentPhotoCount || 0) / (featureLimits.features.maxPhotos || 5)) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {featureLimits && featureLimits.photosRemaining > 0 && (
                  <label className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDocumentUpload(e, 'brand_image')}
                      className="hidden"
                      disabled={uploadingDoc}
                    />
                    <div className="flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>{uploadingDoc ? 'Uploading...' : 'Add Photo'}</span>
                    </div>
                  </label>
                )}
              </div>

              {/* Brand Images Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                {documents.filter(doc => doc.type === 'brand_image').map((image) => (
                  <div key={image.id} className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border-2 border-transparent group-hover:border-pink-500 transition-all duration-300">
                      <img 
                        src={image.url} 
                        alt="Brand" 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <label className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            
                            // Delete old image first
                            try {
                              await handleDeleteDocument(image.id);
                              // Then upload new one
                              const fakeEvent = {
                                target: { files: [file] }
                              } as any;
                              await handleDocumentUpload(fakeEvent, 'brand_image');
                            } catch (error) {
                              console.error('Error replacing image:', error);
                            }
                          }}
                          className="hidden"
                          disabled={uploadingDoc}
                        />
                        <Edit3 className="w-4 h-4" />
                      </label>
                      <button
                        onClick={() => handleDeleteDocument(image.id)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upgrade Prompt if limit reached */}
              {featureLimits && featureLimits.photosRemaining === 0 && (
                <div className="p-4 bg-gradient-to-r from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 border border-orange-200 dark:border-orange-800 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        Photo Limit Reached
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        You&apos;ve used all {featureLimits.features.maxPhotos} photos in your {featureLimits.planName} plan. 
                        Upgrade to Premium for up to 10 photos!
                      </p>
                      <button
                        onClick={() => setShowUpgradeModal(true)}
                        className="px-4 py-2 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 text-sm"
                      >
                        Upgrade to Premium
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Business Video Section */}
            <div className="bg-gradient-to-br from-white via-purple-50 to-white dark:from-slate-800 dark:via-purple-900/20 dark:to-slate-800 rounded-3xl shadow-xl p-8 border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50 flex items-center">
                    <Camera className="w-6 h-6 mr-2 text-purple-600" />
                    Business Video
                    {featureLimits && featureLimits.features.maxVideos > 0 && (
                      <span className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded-full">
                        PREMIUM
                      </span>
                    )}
                  </h3>
                  {featureLimits && featureLimits.features.maxVideos > 0 && (
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                      Upload a promotional video (max {featureLimits.features.videoMaxDuration} seconds)
                    </p>
                  )}
                </div>
              </div>

              {featureLimits && featureLimits.features.maxVideos > 0 ? (
                <>
                  {featureLimits.hasVideo && featureLimits.videoDetails ? (
                    <div className="space-y-4">
                      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700">
                        <video 
                          src={featureLimits.videoDetails.url} 
                          poster={featureLimits.videoDetails.thumbnail}
                          controls
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Duration: {featureLimits.videoDetails.duration}s
                        </span>
                        <button
                          onClick={handleVideoDelete}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all duration-300 flex items-center space-x-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span>Delete Video</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center px-6 py-12 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-2xl cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all duration-200">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={uploadingVideo}
                      />
                      <Camera className="w-12 h-12 text-purple-400 mb-4" />
                      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                        {uploadingVideo ? 'Uploading video...' : 'Upload Your Business Video'}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                        Max {featureLimits.features.videoMaxDuration} seconds • MP4, MOV, AVI • Max 50MB
                      </p>
                    </label>
                  )}
                </>
              ) : (
                <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-xl text-center">
                  <div className="inline-flex p-4 bg-purple-100 dark:bg-purple-900/30 rounded-2xl mb-4">
                    <Camera className="w-8 h-8 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                    Video Upload is a Premium Feature
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    Upgrade to Premium to showcase your business with a 90-second promotional video
                  </p>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
                  >
                    Upgrade to Premium
                  </button>
                </div>
              )}
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
                {documents.filter(doc => doc.type !== 'brand_image').length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-600 dark:text-slate-400">No documents uploaded yet</p>
                    <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
                      Upload your verification documents to get verified faster
                    </p>
                  </div>
                ) : (
                  documents.filter(doc => doc.type !== 'brand_image').map((doc) => (
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

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl rounded-3xl max-w-2xl w-full shadow-2xl shadow-pink-500/20 border border-white/20 dark:border-slate-700/50">
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex p-4 bg-gradient-to-r from-pink-100 to-orange-100 dark:from-pink-900/30 dark:to-orange-900/30 rounded-2xl mb-4">
                  <Award className="w-12 h-12 text-[#ec4899]" />
                </div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-orange-500 bg-clip-text text-transparent mb-2">
                  Upgrade to Premium
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  Unlock more features and grow your business faster
                </p>
              </div>

              {/* Feature Comparison */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-3">Basic Plan</h4>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>5 photos max</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span>No video</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>2 weeks top listing</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-gradient-to-br from-pink-50 to-orange-50 dark:from-pink-900/20 dark:to-orange-900/20 rounded-xl border-2 border-pink-300 dark:border-pink-700">
                  <h4 className="font-bold text-[#ec4899] mb-3 flex items-center">
                    Premium Plan
                    <Star className="w-4 h-4 ml-2 fill-current" />
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">10 photos max</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">1 video (90s)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">2 months top listing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">All rewards access</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold">TV + Radio promotion</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
                >
                  Maybe Later
                </button>
                <button
                  onClick={() => {
                    setShowUpgradeModal(false);
                    router.push('/provider/settings?tab=subscription');
                  }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
                >
                  Upgrade Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Selection Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[80vh] shadow-2xl shadow-pink-500/20 border border-white/20 dark:border-slate-700/50 flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Select Subcategories</h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Choose the services you offer. You can add custom ones later.
                </p>
              </div>
              <button
                onClick={handleCloseSubcategoryModal}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Debug: Remove in production */}
              {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-2 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-400">
                  Debug: Loading={loadingSubcategories.toString()}, Count={availableSubcategories.length}
                </div>
              )}
              {loadingSubcategories ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-[#ec4899] animate-spin mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading subcategories...</p>
                </div>
              ) : availableSubcategories.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {availableSubcategories.map((subcat, index) => {
                    const normalized = subcat.toLowerCase().trim();
                    const currentSubcats = formData.subcategories || [];
                    const isSelected = currentSubcats.some((item: string) => item.toLowerCase().trim() === normalized);
                    return (
                      <button
                        key={`${subcat}-${index}`}
                        type="button"
                        onClick={() => handleSubcategoryToggle(subcat)}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-[#ec4899] bg-pink-50 dark:bg-pink-900/20'
                            : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-700 bg-white dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`font-medium capitalize ${
                            isSelected
                              ? 'text-[#ec4899] dark:text-pink-300'
                              : 'text-slate-900 dark:text-slate-100'
                          }`}
                        >
                          {subcat.replace(/_/g, ' ')}
                        </span>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-[#ec4899]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12">
                  <Briefcase className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 text-center mb-2">
                    No popular subcategories found for this category.
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 text-center">
                    You can add custom subcategories using the input field on the profile page.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleCloseSubcategoryModal}
                className="w-full px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 transform hover:scale-105"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
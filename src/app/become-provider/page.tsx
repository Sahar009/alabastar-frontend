"use client";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { Upload, User, Mail, Phone, FileText, Award, Camera, X, Plus, Tag, Image, Eye, EyeOff, Gift, Check } from "lucide-react";
import LocationPicker from "../../components/LocationPicker";
import { useAuth } from "../../contexts/AuthContext";

// Custom Naira symbol component
const NairaIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v2h-2v-2zm0 4h2v6h-2v-6zm0 8h2v2h-2v-2z"/>
    <text x="12" y="16" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">₦</text>
  </svg>
);

export default function BecomeProviderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, token } = useAuth();
  const [formData, setFormData] = useState({
    // User data
    fullName: "",
    email: "",
    phone: "",
    alternativePhone: "",
    password: "",
    confirmPassword: "",
    
    // Provider profile data
    businessName: "",
    category: "",
    subcategories: [] as string[],
    bio: "",
    locationCity: "",
    locationState: "",
    latitude: "",
    longitude: "",
    referralCode: "", // Add referral code field
    subscriptionPlanId: "", // Add subscription plan selection
    
    // Document data
    documents: [] as File[],
    brandImages: [] as File[]
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<{url: string, type: string, name: string, preview?: string}[]>([]);
  const [uploadedBrandImages, setUploadedBrandImages] = useState<{url: string, type: string, name: string, preview?: string}[]>([]);
  const [location, setLocation] = useState({
    city: "",
    state: "",
    latitude: 0,
    longitude: 0,
    address: ""
  });
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registrationFee, setRegistrationFee] = useState(5000); // Default fee
  const [paymentData, setPaymentData] = useState<any>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null);
  const [referralCodeInfo, setReferralCodeInfo] = useState<any>(null);
  const [validatingReferralCode, setValidatingReferralCode] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [savingStep, setSavingStep] = useState(false);
  const [registrationProgress, setRegistrationProgress] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandImageInputRef = useRef<HTMLInputElement>(null);

  const categories = [
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
  ];

  const subcategoryOptions: { [key: string]: string[] } = {
    plumbing: ['Pipe Repair', 'Drain Cleaning', 'Water Heater', 'Toilet Repair', 'Faucet Installation'],
    electrical: ['Wiring', 'Outlet Installation', 'Light Fixtures', 'Circuit Breaker', 'Generator'],
    cleaning: ['House Cleaning', 'Office Cleaning', 'Deep Cleaning', 'Window Cleaning', 'Carpet Cleaning'],
    moving: ['Local Moving', 'Long Distance', 'Packing', 'Furniture Assembly', 'Storage'],
    ac_repair: ['AC Installation', 'AC Repair', 'AC Maintenance', 'Duct Cleaning', 'Refrigerant'],
    carpentry: ['Furniture Repair', 'Cabinet Making', 'Door Installation', 'Window Installation', 'Deck Building'],
    painting: ['Interior Painting', 'Exterior Painting', 'Wallpaper', 'Staining', 'Touch-ups'],
    pest_control: ['Ant Control', 'Cockroach Control', 'Termite Control', 'Rodent Control', 'Flea Control'],
    laundry: ['Wash & Fold', 'Dry Cleaning', 'Ironing', 'Stain Removal', 'Alterations'],
    tiling: ['Floor Tiling', 'Wall Tiling', 'Bathroom Tiling', 'Kitchen Tiling', 'Mosaic Work'],
    cctv: ['CCTV Installation', 'CCTV Repair', 'Security Systems', 'Access Control', 'Monitoring'],
    gardening: ['Lawn Care', 'Tree Trimming', 'Landscaping', 'Garden Design', 'Plant Care'],
    appliance_repair: ['Refrigerator', 'Washing Machine', 'Dryer', 'Dishwasher', 'Microwave'],
    locksmith: ['Lock Installation', 'Lock Repair', 'Key Duplication', 'Safe Opening', 'Access Control'],
    carpet_cleaning: ['Steam Cleaning', 'Dry Cleaning', 'Stain Removal', 'Odor Treatment', 'Protection']
  };


  // Save registration step to backend
  const saveRegistrationStep = async (stepNumber: number, stepData: any) => {
    try {
      setSavingStep(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      if (stepNumber === 1) {
        // Stage 1: Create user account (POST)
        const response = await fetch(`${base}/api/providers/register/step/${stepNumber}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(stepData)
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log(`Step ${stepNumber} saved successfully - User account created`);
          
          // Store the authentication data
          if (data.data.token && data.data.user) {
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            // Update the auth context (if available)
            // Note: This will require a page refresh to update the auth context
            // Or we can trigger a login event
            
            setRegistrationProgress(data.data.registrationProgress);
            toast.success(`Step ${stepNumber} completed! Account created successfully.`);
            
            // Refresh the page to update auth context
            window.location.reload();
          }
        } else {
          console.error('Error creating account:', data.message);
          toast.error(`Failed to create account: ${data.message}`);
        }
      } else {
        // Stages 2-4: Update existing user's progress (PUT)
        const currentToken = token || localStorage.getItem('token');
        
        if (!currentToken) {
          toast.error('Authentication required. Please start over.');
          return;
        }
        
        const response = await fetch(`${base}/api/providers/register/progress`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentToken}`
          },
          body: JSON.stringify({
            currentStep: stepNumber,
            stepData: {
              [`step${stepNumber}`]: stepData
            }
          })
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
          console.log(`Step ${stepNumber} saved successfully`);
          setRegistrationProgress(data.data);
          toast.success(`Step ${stepNumber} saved successfully!`);
        } else {
          console.error('Error saving step:', data.message);
          toast.error(`Failed to save step ${stepNumber}: ${data.message}`);
        }
      }
    } catch (error) {
      console.error('Error saving registration step:', error);
      toast.error('Failed to save progress. Please try again.');
    } finally {
      setSavingStep(false);
    }
  };

  // Load existing registration progress
  const loadRegistrationProgress = async () => {
    if (user && token) {
      // User is authenticated, load from backend
      try {
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/providers/register/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setRegistrationProgress(data.data);
        
        // If user has existing progress, load it into form
        if (data.data.stepData && Object.keys(data.data.stepData).length > 0) {
          const allStepData = {
            ...data.data.stepData.step1,
            ...data.data.stepData.step2,
            ...data.data.stepData.step3,
            ...data.data.stepData.step4,
            ...data.data.stepData.step5
          };
          
          setFormData(prev => ({ ...prev, ...allStepData }));
          
          // Set current step to the highest completed step + 1
          setCurrentStep(Math.min(data.data.currentStep + 1, 5));
          
          // Load uploaded files if they exist
          if (allStepData.documents) {
            setUploadedFiles(allStepData.documents.map((doc: any) => ({
              url: doc.url,
              type: doc.type,
              name: doc.name || 'Document',
              preview: doc.url
            })));
          }
          
          if (allStepData.brandImages) {
            setUploadedBrandImages(allStepData.brandImages.map((img: any) => ({
              url: img.url,
              type: img.type,
              name: img.name || 'Brand Image',
              preview: img.url
            })));
          }
          
          // Load subscription plan if selected
          if (allStepData.subscriptionPlanId) {
            const plan = subscriptionPlans.find(p => p.id === allStepData.subscriptionPlanId);
            if (plan) {
              setSelectedPlan(plan);
              setRegistrationFee(plan.price);
            }
          }
          
          toast.success(`Welcome back! Continuing from step ${data.data.currentStep}`);
        }
      } else {
        console.error('Error loading progress:', data.message);
      }
    } catch (error) {
      console.error('Error loading registration progress:', error);
    }
    }
  };

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Format phone numbers
    if (name === 'phone' || name === 'alternativePhone') {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [name]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Validate referral code in real-time
    if (name === 'referralCode') {
      validateReferralCode(value);
    }
  };

  const validateReferralCode = async (code: string) => {
    if (!code || code.trim().length < 6) {
      setReferralCodeValid(null);
      setReferralCodeInfo(null);
      return;
    }

    try {
      setValidatingReferralCode(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/referrals/validate/${code.trim()}`);
      const data = await response.json();

      if (data.success && data.valid) {
        setReferralCodeValid(true);
        setReferralCodeInfo(data.data);
        toast.success(`Valid referral code! You'll be referred by ${data.data.businessName}`);
      } else {
        setReferralCodeValid(false);
        setReferralCodeInfo(null);
        if (code.trim().length >= 6) {
          toast.error(data.message || 'Invalid referral code');
        }
      }
    } catch (error) {
      console.error('Error validating referral code:', error);
      setReferralCodeValid(false);
      setReferralCodeInfo(null);
      if (code.trim().length >= 6) {
        toast.error('Error validating referral code');
      }
    } finally {
      setValidatingReferralCode(false);
    }
  };

  const fetchSubscriptionPlans = async () => {
    try {
      setLoadingPlans(true);
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/subscription-plans/plans`);
      const data = await response.json();

      if (data.success) {
        setSubscriptionPlans(data.data);
        // Auto-select the first (cheapest) plan
        if (data.data.length > 0) {
          const firstPlan = data.data[0];
          setSelectedPlan(firstPlan);
          setFormData(prev => ({ ...prev, subscriptionPlanId: firstPlan.id }));
          setRegistrationFee(firstPlan.price);
        }
      } else {
        toast.error('Failed to load subscription plans');
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      toast.error('Error loading subscription plans');
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleLocationSelect = (selectedLocation: {
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    // Fallback: if city is empty, use state as city
    const cityToUse = selectedLocation.city || selectedLocation.state;
    
    setLocation(selectedLocation);
    setFormData(prev => ({
      ...prev,
      locationCity: cityToUse,
      locationState: selectedLocation.state,
      latitude: selectedLocation.latitude.toString(),
      longitude: selectedLocation.longitude.toString()
    }));
    
    // Show success message
    toast.success(`Location set to ${cityToUse}, ${selectedLocation.state}`);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.includes(subcategory)
        ? prev.subcategories.filter(s => s !== subcategory)
        : [...prev.subcategories, subcategory]
    }));
  };

  const removeSubcategory = (subcategory: string) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== subcategory)
    }));
  };

  const addSubcategory = (subcategory: string) => {
    if (subcategory.trim() && !formData.subcategories.includes(subcategory.trim())) {
      setFormData(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, subcategory.trim()]
      }));
    }
    setSubcategoryInput("");
    setShowSuggestions(false);
  };

  const getFilteredSuggestions = () => {
    if (!formData.category || !subcategoryInput.trim()) {
      return subcategoryOptions[formData.category] || [];
    }
    
    const existingSuggestions = subcategoryOptions[formData.category] || [];
    const filtered = existingSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(subcategoryInput.toLowerCase()) &&
      !formData.subcategories.includes(suggestion)
    );
    
    // Add the current input as a suggestion if it's not already in the list
    if (subcategoryInput.trim() && 
        !existingSuggestions.includes(subcategoryInput.trim()) &&
        !formData.subcategories.includes(subcategoryInput.trim())) {
      filtered.unshift(subcategoryInput.trim());
    }
    
    return filtered;
  };

  const handleSubcategoryInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const suggestions = getFilteredSuggestions();
      if (suggestions.length > 0) {
        addSubcategory(suggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSubcategoryInput("");
    }
  };

  const handleFileUpload = async (files: FileList, isBrandImage = false) => {
    if (!files || files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    // Validate file types and sizes
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = isBrandImage 
      ? ['image/jpeg', 'image/jpg', 'image/png'] 
      : ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} has an unsupported format. Please use JPG, PNG${isBrandImage ? '' : ', or PDF'}.`);
        return;
      }
    }

    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append(isBrandImage ? 'brandImages' : 'documents', file);
    });

    try {
      setUploading(true);
      toast.loading(`Uploading ${isBrandImage ? 'brand images' : 'files'}...`, { id: 'upload' });
      
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const endpoint = isBrandImage 
        ? `${base}/api/providers/brand-images/upload`
        : `${base}/api/providers/documents/upload`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        const newFiles = data.files.map((file: { url: string; originalName?: string; filename: string }) => ({
          url: file.url,
          type: isBrandImage ? 'brand_image' : 'id_card',
          name: file.originalName || file.filename,
          preview: file.url
        }));
        
        if (isBrandImage) {
          setUploadedBrandImages(prev => [...prev, ...newFiles]);
        } else {
          setUploadedFiles(prev => [...prev, ...newFiles]);
        }
        
        toast.success(`Successfully uploaded ${files.length} ${isBrandImage ? 'brand image(s)' : 'file(s)'}`, { id: 'upload' });
      } else {
        console.error('Upload failed:', data);
        toast.error(data.message || 'File upload failed. Please try again.', { id: 'upload' });
      }
    } catch (error) {
      console.error('Upload error:', error);
      
      // Fallback: Create local file URLs for demo purposes
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.loading('Backend unavailable. Creating local preview...', { id: 'upload' });
        
        const newFiles = Array.from(files).map(file => ({
          url: URL.createObjectURL(file),
          type: isBrandImage ? 'brand_image' : 'id_card',
          name: file.name,
          preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
        }));
        
        if (isBrandImage) {
          setUploadedBrandImages(prev => [...prev, ...newFiles]);
        } else {
          setUploadedFiles(prev => [...prev, ...newFiles]);
        }
        
        toast.success(`Files added locally (${files.length} file(s)). Note: Backend upload required for final submission.`, { id: 'upload' });
      } else {
        toast.error('Network error. Please check your connection and try again.', { id: 'upload' });
      }
    } finally {
      setUploading(false);
      // Reset the file input to allow re-uploading the same file
      const inputRef = isBrandImage ? brandImageInputRef : fileInputRef;
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const removeFile = (index: number, isBrandImage = false) => {
    const setter = isBrandImage ? setUploadedBrandImages : setUploadedFiles;
    setter(prev => {
      const fileToRemove = prev[index];
      // Clean up object URL to prevent memory leaks
      if (fileToRemove?.preview && fileToRemove.preview.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we're on step 5 and payment is initialized, redirect to Paystack
    if (currentStep === 5 && paymentData) {
      window.location.href = paymentData.authorization_url;
      return;
    }
    
    // Validate final step
    if (!formData.subscriptionPlanId) {
      toast.error('Please select a subscription plan');
      return;
    }
    
    // If we reach here, it means we need to initialize payment
    // All previous steps should have been saved already
    await initializePayment();
  };

  const nextStep = async () => {
    // Validate current step before moving to next
    if (currentStep === 1) {
      // Check required fields for step 1
      if (!formData.fullName || !formData.businessName || !formData.email || !formData.password || !formData.confirmPassword) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      
      // Save step 1 data
      await saveRegistrationStep(1, {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        alternativePhone: formData.alternativePhone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        businessName: formData.businessName,
        referralCode: formData.referralCode
      });
      
    } else if (currentStep === 2) {
      // Check required fields for step 2
      if (!formData.category) {
        toast.error('Please select a service category');
        return;
      }
      // Check if we have location data (either city or state with coordinates)
      // Trim whitespace to handle any hidden characters
      const trimmedCity = formData.locationCity?.trim() || '';
      const trimmedState = formData.locationState?.trim() || '';
      const trimmedLat = formData.latitude?.trim() || '';
      const trimmedLng = formData.longitude?.trim() || '';
      
      const hasLocationData = (trimmedCity && trimmedState) || 
                             (trimmedState && trimmedLat && trimmedLng);
      
      if (!hasLocationData) {
        toast.error('Please select your location');
        return;
      }
      
      // If city is empty but we have state and coordinates, use state as city
      if (!trimmedCity && trimmedState) {
        setFormData(prev => ({
          ...prev,
          locationCity: trimmedState
        }));
      }
      
      // Save step 2 data
      await saveRegistrationStep(2, {
        category: formData.category,
        subcategories: formData.subcategories,
        bio: formData.bio,
        locationCity: formData.locationCity,
        locationState: formData.locationState,
        latitude: formData.latitude,
        longitude: formData.longitude
      });
      
    } else if (currentStep === 3) {
      // Check required fields for step 3
      if (uploadedFiles.length === 0) {
        toast.error('Please upload at least one document');
        return;
      }
      if (uploadedBrandImages.length === 0) {
        toast.error('Please upload at least one brand image');
        return;
      }
      
      // Save step 3 data
      await saveRegistrationStep(3, {
        documents: uploadedFiles.map(file => ({
          type: file.type,
          url: file.url,
          name: file.name
        })),
        brandImages: uploadedBrandImages.map(file => ({
          type: file.type,
          url: file.url,
          name: file.name
        }))
      });
      
    } else if (currentStep === 4) {
      // Check required fields for step 4 (subscription plan)
      if (!formData.subscriptionPlanId) {
        toast.error('Please select a subscription plan');
        return;
      }
      
      // Save step 4 data
      await saveRegistrationStep(4, {
        subscriptionPlanId: formData.subscriptionPlanId
      });
    }
    
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    // Don't allow going back to step 1 if user is authenticated (account already created)
    if (currentStep > 1 && !(currentStep === 2 && user)) {
      setCurrentStep(currentStep - 1);
    }
  };

  const initializePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // Initialize payment first with provider data
      const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${base}/api/providers/initialize-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          documents: uploadedFiles.map(file => ({
            type: file.type,
            url: file.url
          })),
          brandImages: uploadedBrandImages.map(file => ({
            type: file.type,
            url: file.url
          }))
        })
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        setPaymentData(data.data);
        toast.success('Payment initialized successfully! Redirecting to Paystack...');
        
        // Auto-redirect to Paystack checkout
        setTimeout(() => {
          window.location.href = data.data.authorization_url;
        }, 1500); // Small delay to show the toast
      } else {
        console.error('Payment initialization failed:', data);
        toast.error(data.message || 'Failed to initialize payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handle payment return from Paystack
  useEffect(() => {
    const reference = searchParams.get('reference');
    const trxref = searchParams.get('trxref');
    
    // If user is returning from payment, redirect to success page
    if (reference || trxref) {
      const paymentReference = reference || trxref;
      console.log('Payment return detected, redirecting to success page with reference:', paymentReference);
      router.push(`/provider/registration/success?reference=${paymentReference}`);
      return;
    }
  }, [searchParams, router]);

  // Load registration progress when component mounts or user/token changes
  useEffect(() => {
    loadRegistrationProgress();
  }, [user, token]);

  // Fetch subscription plans on component mount
  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-50">Become a Provider</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Join our network of trusted businesses and providers</p>
          
          {/* Provider Sign In Link */}
          <div className="mt-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have a provider account?{' '}
              <button
                onClick={() => router.push('/provider/signin')}
                className="text-pink-600 hover:text-pink-500 font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep >= step 
                    ? 'bg-gradient-to-r from-pink-600 to-orange-500 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > step 
                      ? 'bg-gradient-to-r from-pink-600 to-orange-500' 
                      : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Step {currentStep} of 5: {
                currentStep === 1 ? 'Personal Information' :
                currentStep === 2 ? 'Service Details' : 
                currentStep === 3 ? 'Documents & Verification' : 
                currentStep === 4 ? 'Subscription Plan' : 'Payment'
              }
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Award className="inline w-4 h-4 mr-2" />
                    Business Name *
                  </label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                    placeholder="Enter your business name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email Address *
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

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                    placeholder="08123456789 or +2348123456789"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    format: 08123456789
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    name="alternativePhone"
                    value={formData.alternativePhone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                    placeholder="08123456789 or +2348123456789 (optional)"
                  />
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Optional: format: 08123456789 
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                      placeholder="Create a password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Gift className="inline w-4 h-4 mr-2" />
                    Referral Code (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleInputChange}
                      className={`w-full rounded-xl border px-4 py-3 pr-12 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent ${
                        referralCodeValid === true 
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                          : referralCodeValid === false 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'
                      }`}
                      placeholder="Enter referral code if you have one"
                    />
                    {validatingReferralCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}
                    {referralCodeValid === true && !validatingReferralCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    {referralCodeValid === false && !validatingReferralCode && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Referral Code Info */}
                  {referralCodeInfo && (
                    <div className="mt-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <div>
                          <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                            Referred by: {referralCodeInfo.businessName}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {referralCodeInfo.category} • {referralCodeInfo.totalReferrals} referrals made
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Got referred by an existing provider? Enter their referral code to earn them a commission when you subscribe!
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {/* Success message for authenticated users */}
              {user && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="w-5 h-5 bg-green-500 rounded-full mr-3 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-green-800 dark:text-green-200">Account Created Successfully!</h3>
                      <p className="text-sm text-green-700 dark:text-green-300">Your provider account has been created. Continue with your service details below.</p>
                    </div>
                  </div>
                </div>
              )}
              
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Service Details</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  <Award className="inline w-4 h-4 mr-2" />
                  Service Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Tag className="inline w-4 h-4 mr-2" />
                    Subcategories
                  </label>
                  
                  {/* Selected subcategories */}
                  {formData.subcategories.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-2">
                        {formData.subcategories.map(sub => (
                          <span
                            key={sub}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                          >
                            {sub}
                            <button
                              type="button"
                              onClick={() => removeSubcategory(sub)}
                              className="ml-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Input field with suggestions */}
                  <div className="relative">
                    <div className="flex">
                      <input
                        type="text"
                        value={subcategoryInput}
                        onChange={(e) => {
                          setSubcategoryInput(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onKeyDown={handleSubcategoryInputKeyDown}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        placeholder="Type a subcategory or select from suggestions..."
                        className="flex-1 rounded-l-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (subcategoryInput.trim()) {
                            addSubcategory(subcategoryInput);
                          }
                        }}
                        disabled={!subcategoryInput.trim()}
                        className="px-4 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-r-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Suggestions dropdown */}
                    {showSuggestions && getFilteredSuggestions().length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {getFilteredSuggestions().map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => addSubcategory(suggestion)}
                            className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 first:rounded-t-xl last:rounded-b-xl"
                          >
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-2 text-slate-400" />
                              {suggestion}
                              {!subcategoryOptions[formData.category]?.includes(suggestion) && (
                                <span className="ml-auto text-xs text-green-600 dark:text-green-400">
                                  New
                                </span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Predefined suggestions */}
                  {subcategoryOptions[formData.category] && subcategoryOptions[formData.category].length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Popular suggestions:</p>
                      <div className="flex flex-wrap gap-2">
                        {subcategoryOptions[formData.category]
                          .filter(sub => !formData.subcategories.includes(sub))
                          .slice(0, 6)
                          .map(sub => (
                            <button
                              key={sub}
                              type="button"
                              onClick={() => addSubcategory(sub)}
                              className="px-3 py-1 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                            >
                              {sub}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    initialCity={formData.locationCity}
                    initialState={formData.locationState}
                    initialLat={parseFloat(formData.latitude) || 0}
                    initialLng={parseFloat(formData.longitude) || 0}
                  />
                  
                  {/* Location Status Indicator */}
                  {formData.locationCity && formData.locationState && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                          Location set: {formData.locationCity}, {formData.locationState}
                        </span>
                      </div>
                    </div>
                  )}
                  
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  <FileText className="inline w-4 h-4 mr-2" />
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                  placeholder="Tell us about your experience and expertise..."
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Documents & Verification</h2>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  <Upload className="inline w-4 h-4 mr-2" />
                  Upload Documents *
                </label>
                <div className="mb-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-amber-800 dark:text-amber-200 mb-1">
                        Required Documents
                      </h4>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        You must upload <strong>one of the following</strong> valid identification documents:
                      </p>
                      <ul className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-1">
                        <li>• <strong>NIN (National Identification Number) card</strong></li>
                        <li>• <strong>Driver&apos;s License</strong></li>
                        <li>• <strong>National Passport</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors group ${
                  uploading 
                    ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-pink-500 dark:hover:border-pink-500'
                }`}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files);
                      }
                    }}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="file-upload" className={`cursor-pointer block ${uploading ? 'cursor-not-allowed' : ''}`}>
                    {uploading ? (
                      <div className="animate-spin mx-auto h-12 w-12 border-4 border-pink-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Camera className="mx-auto h-12 w-12 text-slate-400 group-hover:text-pink-600 transition-colors" />
                    )}
                    <p className={`mt-2 text-sm transition-colors ${
                      uploading 
                        ? 'text-pink-600 dark:text-pink-400' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-pink-600'
                    }`}>
                      {uploading ? 'Uploading files...' : 'Click to upload your identification document'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      PNG, JPG, PDF up to 10MB each
                    </p>
                    <div className="mt-2 text-xs text-pink-600 dark:text-pink-400">
                      Required: NIN, Driver&apos;s License, or National Passport
                    </div>
                  </label>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-3">Uploaded Documents</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            {file.preview ? (
                              <Image className="h-5 w-5 text-green-500" />
                            ) : (
                              <FileText className="h-5 w-5 text-slate-400" />
                            )}
                            <div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{file.name}</span>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {file.name.toLowerCase().includes('nin') ? 'NIN Card' :
                                 file.name.toLowerCase().includes('license') || file.name.toLowerCase().includes('licence') ? 'Driver&apos;s License' :
                                 file.name.toLowerCase().includes('passport') ? 'National Passport' : 'Identification Document'}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index, false)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Image Preview */}
                        {file.preview && (
                          <div className="mt-3">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                              onError={(e) => {
                                // Hide image if it fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Document uploaded successfully! Your application will be reviewed.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Brand Images Upload Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                  <Camera className="inline w-4 h-4 mr-2" />
                  Upload Brand Images *
                </label>
                <div className="mb-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                        Brand Images Required
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        Upload <strong>at least 2-3 images</strong> showcasing your work, business, or services:
                      </p>
                      <ul className="mt-2 text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        <li>• <strong>Work samples</strong> (before/after photos)</li>
                        <li>• <strong>Business logo</strong> or signage</li>
                        <li>• <strong>Tools/equipment</strong> you use</li>
                        <li>• <strong>Team photos</strong> (if applicable)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors group ${
                  uploading 
                    ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/20' 
                    : 'border-slate-300 dark:border-slate-600 hover:border-pink-500 dark:hover:border-pink-500'
                }`}>
                  <input
                    ref={brandImageInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleFileUpload(e.target.files, true);
                      }
                    }}
                    className="hidden"
                    id="brand-image-upload"
                    disabled={uploading}
                  />
                  <label htmlFor="brand-image-upload" className={`cursor-pointer block ${uploading ? 'cursor-not-allowed' : ''}`}>
                    {uploading ? (
                      <div className="animate-spin mx-auto h-12 w-12 border-4 border-pink-600 border-t-transparent rounded-full"></div>
                    ) : (
                      <Camera className="mx-auto h-12 w-12 text-slate-400 group-hover:text-pink-600 transition-colors" />
                    )}
                    <p className={`mt-2 text-sm transition-colors ${
                      uploading 
                        ? 'text-pink-600 dark:text-pink-400' 
                        : 'text-slate-600 dark:text-slate-400 group-hover:text-pink-600'
                    }`}>
                      {uploading ? 'Uploading brand images...' : 'Click to upload your brand images'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      PNG, JPG up to 10MB each
                    </p>
                    <div className="mt-2 text-xs text-pink-600 dark:text-pink-400">
                      Required: At least 2-3 brand images
                    </div>
                  </label>
                </div>
              </div>

              {uploadedBrandImages.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-slate-900 dark:text-slate-50 mb-3">Uploaded Brand Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {uploadedBrandImages.map((file, index) => (
                      <div key={index} className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Image className="h-5 w-5 text-green-500" />
                            <div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{file.name}</span>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Brand Image</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile(index, true)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Image Preview */}
                        {file.preview && (
                          <div className="mt-3">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-600"
                              onError={(e) => {
                                // Hide image if it fails to load
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Brand images uploaded successfully! These will showcase your business.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Verification Process</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• We&apos;ll verify your NIN, Driver&apos;s License, or National Passport</li>
                  <li>• Document review takes 24-48 hours</li>
                  <li>• You&apos;ll receive an email notification once verified</li>
                  <li>• Verified providers get priority in search results</li>
                  <li>• You can start accepting bookings immediately after verification</li>
                </ul>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Choose Your Subscription Plan</h2>
              <p className="text-slate-600 dark:text-slate-400">Select a subscription plan that best fits your business needs</p>
              
              {loadingPlans ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-pink-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="ml-2 text-slate-600 dark:text-slate-400">Loading subscription plans...</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative rounded-2xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                        selectedPlan?.id === plan.id
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20 shadow-lg'
                          : 'border-slate-200 dark:border-slate-700 hover:border-pink-300 dark:hover:border-pink-600'
                      }`}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setFormData(prev => ({ ...prev, subscriptionPlanId: plan.id }));
                        setRegistrationFee(plan.price);
                      }}
                    >
                      {selectedPlan?.id === plan.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                            {new Intl.NumberFormat('en-NG', {
                              style: 'currency',
                              currency: 'NGN',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(plan.price)}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400 ml-1">/{plan.interval}</span>
                        </div>
                        
                        {plan.benefits && plan.benefits.length > 0 && (
                          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-4">
                            {plan.benefits.map((benefit: string, index: number) => (
                              <li key={index} className="flex items-center">
                                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        )}
                        
                        <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
                          selectedPlan?.id === plan.id
                            ? 'bg-pink-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {selectedPlan?.id === plan.id ? 'Selected' : 'Select Plan'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedPlan && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        Selected: {selectedPlan.name}
                      </p>
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        {new Intl.NumberFormat('en-NG', {
                          style: 'currency',
                          currency: 'NGN',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0
                        }).format(selectedPlan.price)} per {selectedPlan.interval}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Payment</h2>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <NairaIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {selectedPlan ? selectedPlan.name : 'Subscription Plan'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedPlan ? `${selectedPlan.interval} subscription` : 'Complete your provider registration'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400">
                      {selectedPlan ? selectedPlan.name : 'Subscription Fee'}
                    </span>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {new Intl.NumberFormat('en-NG', {
                        style: 'currency',
                        currency: 'NGN',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(registrationFee)}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    {selectedPlan ? `${selectedPlan.interval} subscription with instant activation` : 'One-time payment to activate your provider account'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure payment via Paystack</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Instant account activation after payment</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Priority listing in search results</span>
                  </div>
                </div>
              </div>

              {!paymentData ? (
                <button
                  type="button"
                  onClick={initializePayment}
                  disabled={isProcessingPayment}
                  className="w-full py-4 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {isProcessingPayment ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <NairaIcon className="w-6 h-6" />
                      <span>Pay {selectedPlan ? selectedPlan.name : 'Subscription Fee'}</span>
                    </div>
                  )}
                </button>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">Redirecting to Paystack...</span>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Please complete your payment on the secure Paystack checkout page.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.location.href = paymentData.authorization_url}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg hover:shadow-xl"
                  >
                    Complete Payment on Paystack
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && !(currentStep === 2 && user) && (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Previous
              </button>
            )}
            
            {/* Show message for step 2 when user is authenticated */}
            {currentStep === 2 && user && (
              <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Account created! You can't go back to step 1.
              </div>
            )}
            
            <div className="ml-auto">
              {currentStep < 5 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !paymentData}
                  className="px-8 py-3 bg-gradient-to-r from-pink-600 to-orange-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Complete Registration'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

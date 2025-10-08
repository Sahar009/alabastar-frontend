"use client";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Shield, 
  Bell, 
  CreditCard,
  Key,
  Camera,
  Save,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";

export default function ProviderSettings() {
  const [user, setUser] = useState<any>(null);
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedProfile = localStorage.getItem('providerProfile');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    if (storedProfile) {
      setProviderProfile(JSON.parse(storedProfile));
    }
  }, []);

  const handleComingSoon = (feature: string) => {
    toast(`🚧 ${feature} - Coming Soon!`, {
      duration: 3000,
      icon: '🚧'
    });
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
    setEditing(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'documents', label: 'Documents', icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Profile Information</h2>
                    <button
                      onClick={() => setEditing(!editing)}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>{editing ? 'Cancel' : 'Edit'}</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                        <Camera className="w-8 h-8 text-slate-400" />
                      </div>
                      <div>
                        <button
                          onClick={() => handleComingSoon("Profile Picture Upload")}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Change Photo
                        </button>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">JPG, PNG up to 2MB</p>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                          <User className="inline w-4 h-4 mr-2" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={user?.fullName || ''}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                          <Mail className="inline w-4 h-4 mr-2" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={user?.email || ''}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                          <Phone className="inline w-4 h-4 mr-2" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={user?.phone || ''}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                          <Phone className="inline w-4 h-4 mr-2" />
                          Alternative Phone
                        </label>
                        <input
                          type="tel"
                          value={user?.alternativePhone || ''}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Service Information */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Service Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                            Service Category
                          </label>
                          <input
                            type="text"
                            value={providerProfile?.category || ''}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                            <MapPin className="inline w-4 h-4 mr-2" />
                            Location
                          </label>
                          <input
                            type="text"
                            value={`${providerProfile?.locationCity || ''}, ${providerProfile?.locationState || ''}`}
                            disabled={!editing}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          />
                        </div>
                      </div>

                      <div className="mt-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                          <FileText className="inline w-4 h-4 mr-2" />
                          Bio
                        </label>
                        <textarea
                          value={providerProfile?.bio || ''}
                          disabled={!editing}
                          rows={4}
                          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                          placeholder="Tell customers about your experience and expertise..."
                        />
                      </div>
                    </div>

                    {editing && (
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => setEditing(false)}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
                        >
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">Security Settings</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Change Password</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                            <Key className="inline w-4 h-4 mr-2" />
                            Current Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter current password"
                            />
                            <button
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Enter new password"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Confirm new password"
                          />
                        </div>
                        
                        <button
                          onClick={() => handleComingSoon("Password Change")}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-50">SMS Authentication</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                        </div>
                        <button
                          onClick={() => handleComingSoon("Two-Factor Authentication")}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Enable
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">Notification Preferences</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-50">New Booking Requests</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Get notified when you receive new booking requests</p>
                        </div>
                        <button
                          onClick={() => handleComingSoon("Email Notifications")}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Configure
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-50">Payment Updates</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Notifications about payments and earnings</p>
                        </div>
                        <button
                          onClick={() => handleComingSoon("Payment Notifications")}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Configure
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <div>
                          <h4 className="font-medium text-slate-900 dark:text-slate-50">Account Updates</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Important updates about your account status</p>
                        </div>
                        <button
                          onClick={() => handleComingSoon("Account Notifications")}
                          className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Configure
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">Billing & Payments</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Payment Methods</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Manage your payment methods</p>
                        <button
                          onClick={() => handleComingSoon("Payment Methods")}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Add Payment Method
                        </button>
                      </div>

                      <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Payout Settings</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Configure how you receive payments</p>
                        <button
                          onClick={() => handleComingSoon("Payout Settings")}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                          Configure Payouts
                        </button>
                      </div>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Transaction History</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">View your payment history and statements</p>
                      <button
                        onClick={() => handleComingSoon("Transaction History")}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Documents Tab */}
              {activeTab === 'documents' && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-6">Document Management</h2>
                  
                  <div className="space-y-6">
                    <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Verification Documents</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                        Status: <span className={`font-medium ${
                          providerProfile?.verificationStatus === 'verified' ? 'text-green-600 dark:text-green-400' :
                          providerProfile?.verificationStatus === 'pending' ? 'text-amber-600 dark:text-amber-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {providerProfile?.verificationStatus === 'verified' ? 'Verified' :
                           providerProfile?.verificationStatus === 'pending' ? 'Pending Review' : 'Rejected'}
                        </span>
                      </p>
                      <button
                        onClick={() => handleComingSoon("Document Upload")}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Upload New Document
                      </button>
                    </div>

                    <div className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-50 mb-2">Portfolio</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Showcase your work with photos and descriptions</p>
                      <button
                        onClick={() => handleComingSoon("Portfolio Management")}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Manage Portfolio
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



















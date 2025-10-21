"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, Mail, Phone, Settings, LogOut, Edit3, Save, X, MapPin, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, customer, providerProfile, loading, updateProfile, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      setFormData({
        fullName: user.fullName,
        phone: user.phone || ""
      });
    }
  }, [user, loading, router]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const success = await updateProfile(formData);
    if (success) {
      setEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-pink-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Image src="/brand/logo-icon.svg" alt="Alabastar" width={32} height={32} priority />
            <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100">ALABASTAR</span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">My Profile</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Personal Information</h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 rounded-xl transition-colors"
                  >
                    <Edit3 size={16} />
                    Edit
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-pink-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          fullName: user.fullName,
                          phone: user.phone || ""
                        });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <User className="inline w-4 h-4 mr-2" />
                    Full Name
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#2563EB]/50 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-slate-900 dark:text-slate-100 py-3">{user.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Mail className="inline w-4 h-4 mr-2" />
                    Email Address
                  </label>
                  <p className="text-slate-900 dark:text-slate-100 py-3">{user.email}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Phone className="inline w-4 h-4 mr-2" />
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-4 py-3 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-pink-500/50 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-slate-900 dark:text-slate-100 py-3">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    <Shield className="inline w-4 h-4 mr-2" />
                    Account Status
                  </label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className="text-slate-900 dark:text-slate-100 capitalize">{user.status}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Profile Section */}
            {providerProfile && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-8 mt-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">Business Information</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Business Name
                    </label>
                    <p className="text-slate-900 dark:text-slate-100 py-3">{providerProfile.businessName}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <Mail className="inline w-4 h-4 mr-2" />
                      Business Email
                    </label>
                    <p className="text-slate-900 dark:text-slate-100 py-3">{providerProfile.businessEmail}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <Phone className="inline w-4 h-4 mr-2" />
                      Business Phone
                    </label>
                    <p className="text-slate-900 dark:text-slate-100 py-3">{providerProfile.businessPhone}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <MapPin className="inline w-4 h-4 mr-2" />
                      Business Address
                    </label>
                    <p className="text-slate-900 dark:text-slate-100 py-3">{providerProfile.businessAddress}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      <Shield className="inline w-4 h-4 mr-2" />
                      Verification Status
                    </label>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        providerProfile.verificationStatus === 'verified' ? 'bg-green-500' : 
                        providerProfile.verificationStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-slate-900 dark:text-slate-100 capitalize">{providerProfile.verificationStatus}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                      Experience
                    </label>
                    <p className="text-slate-900 dark:text-slate-100 py-3">{providerProfile.yearsOfExperience} years</p>
                  </div>

                  {providerProfile.description && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                        Description
                      </label>
                      <p className="text-slate-900 dark:text-slate-100 py-3">{providerProfile.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {providerProfile ? (
                  // Provider Actions
                  <>
                    <Link
                      href="/provider/dashboard"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-pink-600" />
                      <span className="text-slate-700 dark:text-slate-300">Provider Dashboard</span>
                    </Link>
                    <Link
                      href="/provider/bookings"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-orange-500" />
                      <span className="text-slate-700 dark:text-slate-300">My Bookings</span>
                    </Link>
                    <Link
                      href="/provider/services"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-blue-500" />
                      <span className="text-slate-700 dark:text-slate-300">Manage Services</span>
                    </Link>
                  </>
                ) : (
                  // Customer Actions
                  <>
                    <Link
                      href="/providers"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <MapPin className="w-5 h-5 text-pink-600" />
                      <span className="text-slate-700 dark:text-slate-300">Browse Services</span>
                    </Link>
                    <Link
                      href="/bookings"
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings className="w-5 h-5 text-orange-500" />
                      <span className="text-slate-700 dark:text-slate-300">My Bookings</span>
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Notification Settings */}
            {customer && (
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-white/10 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Email</span>
                    <div className={`w-12 h-6 rounded-full ${customer.notificationSettings.email ? 'bg-pink-600' : 'bg-slate-300'} transition-colors`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${customer.notificationSettings.email ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">SMS</span>
                    <div className={`w-12 h-6 rounded-full ${customer.notificationSettings.sms ? 'bg-pink-600' : 'bg-slate-300'} transition-colors`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${customer.notificationSettings.sms ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 dark:text-slate-300">Push</span>
                    <div className={`w-12 h-6 rounded-full ${customer.notificationSettings.push ? 'bg-pink-600' : 'bg-slate-300'} transition-colors`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${customer.notificationSettings.push ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

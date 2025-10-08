# Settings Page - Frontend API Integration Guide

## 🎯 Quick Reference for Frontend Integration

This guide shows exactly how to integrate all the settings APIs into your React/Next.js settings page.

---

## 🔧 Setup

### Base URL Configuration
```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

### Get Auth Token
```typescript
const token = localStorage.getItem('token');
```

### Request Headers
```typescript
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

---

## 📋 API Integration Examples

### 1. **Update Profile**
```typescript
const updateProfile = async (fullName: string, phone: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ fullName, phone })
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Profile updated successfully');
      // Update local storage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.fullName = fullName;
      user.phone = phone;
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      toast.error(data.message || 'Failed to update profile');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Error updating profile');
  }
};
```

---

### 2. **Change Password**
```typescript
const changePassword = async (currentPassword: string, newPassword: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/change-password`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Password changed successfully');
      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(data.message || 'Failed to change password');
    }
  } catch (error) {
    console.error('Error changing password:', error);
    toast.error('Error changing password');
  }
};
```

---

### 3. **Get Notification Preferences**
```typescript
const fetchNotificationPreferences = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/notifications/preferences`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    if (response.ok) {
      setNotificationPreferences(data.data);
    } else {
      toast.error('Failed to load notification preferences');
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
    toast.error('Error loading preferences');
  }
};
```

---

### 4. **Update Notification Preferences**
```typescript
const updateNotificationPreferences = async (preferences: any) => {
  try {
    const response = await fetch(`${BASE_URL}/api/notifications/preferences`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(preferences)
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Notification preferences updated');
      setNotificationPreferences(data.data);
    } else {
      toast.error(data.message || 'Failed to update preferences');
    }
  } catch (error) {
    console.error('Error updating preferences:', error);
    toast.error('Error updating preferences');
  }
};
```

---

### 5. **Get Active Subscription**
```typescript
const fetchActiveSubscription = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/my-subscription`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    if (response.ok) {
      setActiveSubscription(data.data);
    } else {
      console.log('No active subscription found');
      setActiveSubscription(null);
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
  }
};
```

---

### 6. **Get Subscription History**
```typescript
const fetchSubscriptionHistory = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/history`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    if (response.ok) {
      setSubscriptionHistory(data.data);
    } else {
      toast.error('Failed to load subscription history');
    }
  } catch (error) {
    console.error('Error fetching history:', error);
  }
};
```

---

### 7. **Cancel Subscription**
```typescript
const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/cancel`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscriptionId })
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Subscription cancelled successfully');
      // Refresh subscription data
      await fetchActiveSubscription();
    } else {
      toast.error(data.message || 'Failed to cancel subscription');
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    toast.error('Error cancelling subscription');
  }
};
```

---

### 8. **Reactivate Subscription**
```typescript
const reactivateSubscription = async (subscriptionId: string) => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscriptions/reactivate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ subscriptionId })
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Subscription reactivated successfully');
      // Refresh subscription data
      await fetchActiveSubscription();
    } else {
      toast.error(data.message || 'Failed to reactivate subscription');
    }
  } catch (error) {
    console.error('Error reactivating subscription:', error);
    toast.error('Error reactivating subscription');
  }
};
```

---

### 9. **Get Available Plans**
```typescript
const fetchAvailablePlans = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/subscription-plans/plans`, {
      method: 'GET',
      headers
    });

    const data = await response.json();
    
    if (response.ok) {
      setAvailablePlans(data.data);
    } else {
      toast.error('Failed to load subscription plans');
    }
  } catch (error) {
    console.error('Error fetching plans:', error);
  }
};
```

---

### 10. **Delete Account**
```typescript
const deleteAccount = async () => {
  // Double confirmation
  const confirmed = window.confirm(
    'Are you absolutely sure you want to delete your account? This action cannot be undone.'
  );
  
  if (!confirmed) return;

  // Require typing "DELETE"
  const confirmText = prompt('Type "DELETE" to confirm account deletion:');
  
  if (confirmText !== 'DELETE') {
    toast.error('Account deletion cancelled');
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/delete-account`, {
      method: 'DELETE',
      headers
    });

    const data = await response.json();
    
    if (response.ok) {
      toast.success('Account deleted successfully');
      // Clear all local storage
      localStorage.clear();
      // Redirect to home
      router.push('/');
    } else {
      toast.error(data.message || 'Failed to delete account');
    }
  } catch (error) {
    console.error('Error deleting account:', error);
    toast.error('Error deleting account');
  }
};
```

---

## 🎨 Complete Settings Page Component Structure

```typescript
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ProviderSettings() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  
  // Account states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  
  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification states
  const [notificationPreferences, setNotificationPreferences] = useState<any>(null);
  
  // Subscription states
  const [activeSubscription, setActiveSubscription] = useState<any>(null);
  const [subscriptionHistory, setSubscriptionHistory] = useState<any[]>([]);
  const [availablePlans, setAvailablePlans] = useState<any[]>([]);

  const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  useEffect(() => {
    // Load initial data
    loadUserData();
    fetchNotificationPreferences();
    fetchActiveSubscription();
    fetchAvailablePlans();
  }, []);

  const loadUserData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setFullName(user.fullName || '');
    setPhone(user.phone || '');
  };

  // Add all the API functions from above here...
  
  return (
    <div className="settings-page">
      {/* Your settings UI here */}
    </div>
  );
}
```

---

## 🔄 Data Flow

### **On Page Load:**
```typescript
useEffect(() => {
  // 1. Load user from localStorage
  loadUserData();
  
  // 2. Fetch notification preferences
  fetchNotificationPreferences();
  
  // 3. Fetch active subscription
  fetchActiveSubscription();
  
  // 4. Fetch available plans
  fetchAvailablePlans();
}, []);
```

### **On Tab Change:**
```typescript
const handleTabChange = (tab: string) => {
  setActiveTab(tab);
  
  // Load data for specific tab if needed
  if (tab === 'subscription' && subscriptionHistory.length === 0) {
    fetchSubscriptionHistory();
  }
};
```

---

## ⚠️ Error Handling

### **Handle 401 Unauthorized:**
```typescript
if (response.status === 401) {
  toast.error('Session expired. Please login again.');
  localStorage.clear();
  router.push('/provider/signin');
  return;
}
```

### **Handle Network Errors:**
```typescript
try {
  // API call
} catch (error) {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    toast.error('Network error. Please check your connection.');
  } else {
    toast.error('An unexpected error occurred');
  }
  console.error('Error:', error);
}
```

---

## ✅ Testing Checklist

- [ ] Profile update works
- [ ] Password change works
- [ ] Notification preferences load
- [ ] Notification preferences update
- [ ] Active subscription displays
- [ ] Subscription history displays
- [ ] Cancel subscription works
- [ ] Reactivate subscription works
- [ ] Available plans display
- [ ] Account deletion works
- [ ] Error messages display
- [ ] Success messages display
- [ ] Loading states work
- [ ] Token expiration handled

---

## 🚀 Ready to Integrate!

All APIs are implemented and tested. Simply copy the functions above into your settings page component and connect them to your UI elements.

**Need Help?** Check `backend/SETTINGS_API_DOCUMENTATION.md` for detailed API specs.

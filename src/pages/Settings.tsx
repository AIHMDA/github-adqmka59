import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Shield, Globe, Moon, User } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john@example.com'
  });
  const [passwords, setPasswords] = useState({
    current: '',
    new: ''
  });
  const [notifications, setNotifications] = useState({
    email: true,
    push: true
  });

  const handleProfileUpdate = () => {
    // TODO: Implement profile update
    console.log('Updating profile:', profileData);
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = () => {
    // TODO: Implement password change
    console.log('Changing password:', passwords);
    alert('Password changed successfully!');
    setPasswords({ current: '', new: '' });
  };

  const handleNotificationChange = () => {
    setNotifications(prev => ({
      ...prev,
      email: !prev.email
    }));
    alert('Notification settings updated!');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    alert(`${theme === 'light' ? 'Dark' : 'Light'} mode enabled!`);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
    alert(`Language changed to ${language === 'en' ? 'Arabic' : 'English'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-500">Manage your account and application preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Profile Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input 
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="John Doe" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input 
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="john@example.com" 
              />
            </div>
            <Button onClick={handleProfileUpdate}>
              <User className="w-4 h-4 mr-2" />
              Update Profile
            </Button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <Input 
                type="password"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <Input 
                type="password"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
              />
            </div>
            <Button onClick={handlePasswordChange}>
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-gray-500">Receive email updates about your account</p>
              </div>
              <Button variant="outline" onClick={handleNotificationChange}>
                <Bell className="w-4 h-4 mr-2" />
                {notifications.email ? 'Disable' : 'Enable'}
              </Button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Appearance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-gray-500">Toggle dark mode theme</p>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                <Moon className="w-4 h-4 mr-2" />
                {theme === 'light' ? 'Enable' : 'Disable'}
              </Button>
            </div>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Language & Region</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-gray-500">Choose your preferred language</p>
              </div>
              <Button variant="outline" onClick={toggleLanguage}>
                <Globe className="w-4 h-4 mr-2" />
                {language === 'en' ? 'English' : 'العربية'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
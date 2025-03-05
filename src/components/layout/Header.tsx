import React, { useState } from 'react';
import { Bell, User, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { LoginDialog } from '../auth/LoginDialog';
import { Button } from '../ui/button';

export const Header = () => {
  const { language, setLanguage } = useLanguage();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">
          Security Management Platform
        </h1>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-gray-600" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
              className="ml-3 border rounded-md px-2 py-1"
            >
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>

          {isLoggedIn ? (
            <Button variant="outline" onClick={() => setIsLoggedIn(false)}>
              <User className="h-5 w-5 mr-2" />
              Logout
            </Button>
          ) : (
            <Button onClick={() => setIsLoginOpen(true)}>
              <User className="h-5 w-5 mr-2" />
              Login
            </Button>
          )}
        </div>
      </div>

      <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </header>
  );
};
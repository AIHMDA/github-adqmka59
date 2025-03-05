import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Lock, Mail, Apple, Github, ArrowLeft } from 'lucide-react';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type LoginView = 'main' | 'google' | 'outlook' | 'apple' | 'github';

export const LoginDialog: React.FC<LoginDialogProps> = ({ open, onOpenChange }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentView, setCurrentView] = useState<LoginView>('main');
  const [socialFormData, setSocialFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', { email, password });
  };

  const handleSocialLogin = (provider: LoginView) => {
    setCurrentView(provider);
  };

  const handleSocialRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Social registration:', { provider: currentView, ...socialFormData });
    // TODO: Implement actual registration
    alert('Registration successful! Please check your email to verify your account.');
    setCurrentView('main');
    setSocialFormData({ email: '', name: '', password: '', confirmPassword: '' });
  };

  const renderSocialRegistrationForm = () => {
    const providerNames = {
      google: 'Google',
      outlook: 'Outlook',
      apple: 'Apple',
      github: 'GitHub'
    };

    return (
      <form onSubmit={handleSocialRegistration} className="space-y-4">
        <div className="flex items-center mb-4">
          <Button
            type="button"
            variant="outline"
            className="mr-4"
            onClick={() => setCurrentView('main')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            Register with {providerNames[currentView]}
          </h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              value={socialFormData.name}
              onChange={(e) => setSocialFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              type="email"
              value={socialFormData.email}
              onChange={(e) => setSocialFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input
              type="password"
              value={socialFormData.password}
              onChange={(e) => setSocialFormData(prev => ({ ...prev, password: e.target.value }))}
              placeholder="Create a password"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <Input
              type="password"
              value={socialFormData.confirmPassword}
              onChange={(e) => setSocialFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm your password"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full">
          Create Account
        </Button>
      </form>
    );
  };

  const renderMainView = () => (
    <form onSubmit={handleLogin} className="space-y-4 pt-4">
      <div className="space-y-2">
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="email"
            placeholder="Email"
            className="pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="password"
            placeholder="Password"
            className="pl-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Login with Email
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('google')}
        >
          <Mail className="mr-2 h-4 w-4" /> Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('outlook')}
        >
          <Mail className="mr-2 h-4 w-4" /> Outlook
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('apple')}
        >
          <Apple className="mr-2 h-4 w-4" /> Apple
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => handleSocialLogin('github')}
        >
          <Github className="mr-2 h-4 w-4" /> GitHub
        </Button>
      </div>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {currentView === 'main' ? 'Login to Security Hub' : 'Create Account'}
          </DialogTitle>
        </DialogHeader>
        {currentView === 'main' ? renderMainView() : renderSocialRegistrationForm()}
      </DialogContent>
    </Dialog>
  );
};
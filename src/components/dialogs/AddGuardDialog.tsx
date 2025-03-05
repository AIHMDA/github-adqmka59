import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Calendar, Shield, AlertTriangle, MapPin, Users } from 'lucide-react';

interface AddGuardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGuardCreated?: (guardData: any) => void;
}

interface FormErrors {
  [key: string]: string;
}

export const AddGuardDialog: React.FC<AddGuardDialogProps> = ({ 
  open, 
  onOpenChange,
  onGuardCreated 
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    nationalId: '',
    address: '',
    isStaff: true
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate phone
    const phoneRegex = /^\+?[\d\s-]{8,}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'Guard must be at least 18 years old';
      }
    }

    // Validate national ID
    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'National ID is required';
    } else if (formData.nationalId.length < 5) {
      newErrors.nationalId = 'Please enter a valid national ID';
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create guard object with additional fields
      const guardData = {
        id: `guard-${Date.now()}`,
        ...formData,
        status: 'available',
        skills: [],
        createdAt: new Date().toISOString()
      };

      // Store in localStorage
      const existingGuards = JSON.parse(localStorage.getItem('guards') || '[]');
      const updatedGuards = [...existingGuards, guardData];
      localStorage.setItem('guards', JSON.stringify(updatedGuards));

      // Notify parent component
      onGuardCreated?.(guardData);

      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Guard created successfully!';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);

      // Reset form and close dialog
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        nationalId: '',
        address: '',
        isStaff: true
      });
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating guard:', error);
      
      // Show error message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to create guard. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Guard</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Enter full name"
                  className={`pl-10 ${errors.fullName ? 'border-red-500' : ''}`}
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.fullName}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="email"
                  placeholder="Enter email"
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="tel"
                  placeholder="Enter phone number"
                  className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="date"
                  className={`pl-10 ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
              {errors.dateOfBirth && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">National ID</label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Enter national ID"
                  className={`pl-10 ${errors.nationalId ? 'border-red-500' : ''}`}
                  value={formData.nationalId}
                  onChange={(e) => handleInputChange('nationalId', e.target.value)}
                />
              </div>
              {errors.nationalId && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.nationalId}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Enter address"
                  className={`pl-10 ${errors.address ? 'border-red-500' : ''}`}
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              {errors.address && (
                <p className="text-sm text-red-500 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isStaff"
                checked={formData.isStaff}
                onChange={(e) => setFormData(prev => ({ ...prev, isStaff: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <label htmlFor="isStaff" className="text-sm font-medium flex items-center">
                <Users className="w-4 h-4 mr-1" />
                Add as Staff Member
              </label>
            </div>
            <p className="text-sm text-gray-500 ml-6">
              Staff members are guards directly employed by your organization and have priority for private bookings.
            </p>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Add Guard'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Building, Users } from 'lucide-react';

interface AddJobSiteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJobSiteCreated?: (jobSiteData: any) => void;
}

export const AddJobSiteDialog: React.FC<AddJobSiteDialogProps> = ({
  open,
  onOpenChange,
  onJobSiteCreated
}) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    requiredGuards: 1,
    specialRequirements: '',
    coordinates: { lat: 55.6761, lng: 12.5683 } // Default coordinates
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here we would normally make an API call to create the job site
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      onJobSiteCreated?.({
        ...formData
      });
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Job site created successfully!';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);

      // Reset form and close dialog
      setFormData({
        name: '',
        address: '',
        requiredGuards: 1,
        specialRequirements: '',
        coordinates: { lat: 55.6761, lng: 12.5683 }
      });
      onOpenChange(false);

    } catch (error) {
      console.error('Error creating job site:', error);
      
      // Show error message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to create job site. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Add New Job Site
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Site Name</label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Enter site name"
                  className="pl-10"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Enter full address"
                  className="pl-10"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Security Requirements */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Required Guards</label>
              <div className="relative">
                <Users className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="number"
                  min="1"
                  className="pl-10"
                  value={formData.requiredGuards}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    requiredGuards: parseInt(e.target.value) || 1 
                  }))}
                  required
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Maximum number of guards that can be assigned to this location
              </p>
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="text-sm font-medium">Special Requirements</label>
            <textarea
              className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 resize-none"
              placeholder="Enter any special requirements or notes for this job site"
              value={formData.specialRequirements}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                specialRequirements: e.target.value 
              }))}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Job Site'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
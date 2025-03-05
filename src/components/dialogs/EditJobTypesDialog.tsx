import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Building, Plus, Trash } from 'lucide-react';
import { useShiftContext } from '@/contexts/ShiftContext';

interface EditJobTypesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  siteId: string;
  siteName: string;
  initialJobTypes: Array<{
    type: string;
    count: number;
    guardsPerShift: number;
  }>;
}

interface JobType {
  type: string;
  count: number;
  guardsPerShift: number;
}

export const EditJobTypesDialog: React.FC<EditJobTypesDialogProps> = ({
  open,
  onOpenChange,
  siteId,
  siteName,
  initialJobTypes
}) => {
  const { updateJobSiteJobTypes } = useShiftContext();
  const [jobTypes, setJobTypes] = useState<JobType[]>(initialJobTypes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddJobType = () => {
    setJobTypes([...jobTypes, { type: '', count: 0, guardsPerShift: 1 }]);
  };

  const handleRemoveJobType = (index: number) => {
    setJobTypes(jobTypes.filter((_, i) => i !== index));
  };

  const handleJobTypeChange = (index: number, field: keyof JobType, value: string | number) => {
    const updatedJobTypes = [...jobTypes];
    updatedJobTypes[index] = {
      ...updatedJobTypes[index],
      [field]: value
    };
    setJobTypes(updatedJobTypes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update job types in context
      updateJobSiteJobTypes(siteId, jobTypes);
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Job types updated successfully!';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);

      // Close dialog
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating job types:', error);
      
      // Show error message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to update job types. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Edit Job Types for {siteName}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          {/* Job Types */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Job Types</label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddJobType}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Job Type
              </Button>
            </div>
            
            {jobTypes.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                No job types defined. Add a job type to get started.
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 items-center text-sm font-medium text-gray-500">
                  <div className="col-span-5">Job Type</div>
                  <div className="col-span-3">Count</div>
                  <div className="col-span-3">Guards per Shift</div>
                  <div className="col-span-1"></div>
                </div>
                
                {jobTypes.map((jobType, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-5">
                      <Input
                        placeholder="Job type"
                        value={jobType.type}
                        onChange={(e) => handleJobTypeChange(index, 'type', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        placeholder="Count"
                        value={jobType.count}
                        onChange={(e) => handleJobTypeChange(index, 'count', parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Guards per shift"
                        value={jobType.guardsPerShift}
                        onChange={(e) => handleJobTypeChange(index, 'guardsPerShift', parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                    <div className="col-span-1 flex justify-center">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveJobType(index)}
                        disabled={jobTypes.length <= 1}
                      >
                        <Trash className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
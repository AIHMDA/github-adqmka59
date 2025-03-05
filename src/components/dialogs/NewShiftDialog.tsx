import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, MapPin, User, Shield, AlertTriangle, Lock, Globe, Users } from 'lucide-react';
import Select from 'react-select';

interface NewShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShiftCreated?: (shiftData: any) => void;
  jobSites: Array<{
    id: string;
    name: string;
    address: string;
    requiredGuards: number;
  }>;
}

type WeekDay = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'ALL';

export const NewShiftDialog: React.FC<NewShiftDialogProps> = ({ 
  open, 
  onOpenChange,
  onShiftCreated,
  jobSites 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    jobSite: null as { id: string; name: string; address: string } | null,
    startDate: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    numberOfGuards: 1,
    dressCode: '',
    additionalComments: '',
    selectedWeekdays: new Set<WeekDay>(),
    bookingType: 'private' as 'private' | 'public',
    staffOnly: true,
    jobType: 'Standard Security' as string,
    requirements: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const jobSiteOptions = jobSites.map(site => ({
    value: site.id,
    label: site.name,
    address: site.address,
    requiredGuards: site.requiredGuards
  }));

  const jobTypeOptions = [
    'Standard Security',
    'Event Security',
    'VIP Protection',
    'Access Control',
    'Surveillance',
    'Loss Prevention',
    'Emergency Response'
  ];

  const toggleWeekday = (day: WeekDay) => {
    const newSelectedWeekdays = new Set(formData.selectedWeekdays);
    
    if (day === 'ALL') {
      if (newSelectedWeekdays.has('ALL')) {
        newSelectedWeekdays.clear();
      } else {
        newSelectedWeekdays.clear();
        weekdays.forEach(d => newSelectedWeekdays.add(d));
      }
    } else {
      if (newSelectedWeekdays.has(day)) {
        newSelectedWeekdays.delete(day);
        newSelectedWeekdays.delete('ALL');
      } else {
        newSelectedWeekdays.add(day);
        if (weekdays.slice(1).every(d => newSelectedWeekdays.has(d))) {
          newSelectedWeekdays.add('ALL');
        }
      }
    }

    setFormData(prev => ({
      ...prev,
      selectedWeekdays: newSelectedWeekdays
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.jobSite) {
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Please select a job site';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      const shifts = [];
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const weekdays = Array.from(formData.selectedWeekdays);
      
      if (isRecurring && weekdays.length > 0) {
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          const dayName = format(currentDate, 'EEE').toUpperCase();
          if (weekdays.includes(dayName) || weekdays.includes('ALL')) {
            shifts.push({
              id: `shift-${Date.now()}-${shifts.length}`,
              title: formData.title,
              location: formData.jobSite.name,
              address: formData.jobSite.address,
              date: format(currentDate, 'MMM dd'),
              time: `${formData.startTime} - ${formData.endTime}`,
              securityLevel: formData.jobType,
              requirements: [],
              bookingType: formData.bookingType,
              staffOnly: formData.staffOnly
            });
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      } else {
        shifts.push({
          id: `shift-${Date.now()}`,
          title: formData.title,
          location: formData.jobSite.name,
          address: formData.jobSite.address,
          date: format(new Date(formData.startDate), 'MMM dd'),
          time: `${formData.startTime} - ${formData.endTime}`,
          securityLevel: formData.jobType,
          requirements: [],
          bookingType: formData.bookingType,
          staffOnly: formData.staffOnly
        });
      }

      // Create multiple shifts based on numberOfGuards
      const allShifts = [];
      for (const shift of shifts) {
        for (let i = 0; i < formData.numberOfGuards; i++) {
          allShifts.push({
            ...shift,
            id: `${shift.id}-guard-${i + 1}`
          });
        }
      }

      // Add all shifts to unassigned shifts
      allShifts.forEach(shift => onShiftCreated?.(shift));
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Shifts created successfully!';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);

      // Close dialog and reset form
      onOpenChange(false);
      setFormData({
        title: '',
        jobSite: null,
        startDate: new Date(),
        endDate: new Date(),
        startTime: '',
        endTime: '',
        numberOfGuards: 1,
        dressCode: '',
        additionalComments: '',
        selectedWeekdays: new Set(),
        bookingType: 'private',
        staffOnly: true,
        jobType: 'Standard Security',
        requirements: []
      });
      setIsRecurring(false);

    } catch (error) {
      console.error('Error creating shift:', error);
      
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to create shift. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNumberOfGuardsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    const maxGuards = formData.jobSite ? 
      jobSites.find(site => site.id === formData.jobSite?.id)?.requiredGuards || 1 : 1;
    
    if (!isNaN(value) && value >= 1) {
      setFormData(prev => ({
        ...prev,
        numberOfGuards: Math.min(value, maxGuards)
      }));
    }
  };

  const format = (date: Date, formatStr: string) => {
    // Simple format function to replace date-fns format
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    if (formatStr === 'MMM dd') {
      return `${months[date.getMonth()]} ${date.getDate().toString().padStart(2, '0')}`;
    }
    
    if (formatStr === 'EEE') {
      return days[date.getDay()];
    }
    
    return date.toLocaleDateString();
  };

  const weekdays: WeekDay[] = ['ALL', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Shift</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Shift Title</label>
              <Input
                placeholder="Enter shift title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            {/* Job Site Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Site</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 z-10" />
                <Select
                  className="pl-8"
                  options={jobSiteOptions}
                  value={jobSiteOptions.find(option => 
                    formData.jobSite && option.value === formData.jobSite.id
                  )}
                  onChange={(selected) => selected && setFormData(prev => ({
                    ...prev,
                    jobSite: {
                      id: selected.value,
                      name: selected.label,
                      address: selected.address
                    },
                    numberOfGuards: Math.min(prev.numberOfGuards, selected.requiredGuards)
                  }))}
                  placeholder="Select a job site"
                  isSearchable
                  noOptionsMessage={() => "No job sites available"}
                />
              </div>
              {formData.jobSite && (
                <p className="text-sm text-gray-500 mt-1">
                  <MapPin className="inline-block w-4 h-4 mr-1" />
                  {formData.jobSite.address}
                </p>
              )}
              {jobSiteOptions.length === 0 && (
                <div className="text-sm text-yellow-600 flex items-center mt-1">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  No job sites available. Please add a job site first.
                </div>
              )}
            </div>

            {/* Booking Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Booking Type</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={formData.bookingType === 'private' ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    bookingType: 'private',
                    staffOnly: true // Private bookings default to staff only
                  }))}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Private
                </Button>
                <Button
                  type="button"
                  variant={formData.bookingType === 'public' ? "default" : "outline"}
                  className="w-full"
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    bookingType: 'public',
                    staffOnly: false // Public bookings can't be staff only
                  }))}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Public
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {formData.bookingType === 'private' 
                  ? 'Private bookings are only visible to guards you select.'
                   : 'Public bookings are visible to all guards and can be claimed by available guards.'}
              </p>
            </div>

            {/* Job Type (Replacing Security Level) */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Job Type</label>
              <div className="relative">
                <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <select
                  className="w-full pl-10 h-9 rounded-md border border-gray-200"
                  value={formData.jobType}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
                >
                  {jobTypeOptions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Staff Only Option (only for private bookings) */}
            {formData.bookingType === 'private' && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="staffOnly"
                    checked={formData.staffOnly}
                    onChange={(e) => setFormData(prev => ({ ...prev, staffOnly: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="staffOnly" className="text-sm font-medium flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    Staff Only
                  </label>
                </div>
                <p className="text-sm text-gray-500 ml-6">
                  When enabled, only guards uploaded by you can be assigned to this shift.
                </p>
              </div>
            )}

            {/* Date and Time Selection */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="recurring"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-gray-300"
                />
                <label htmlFor="recurring" className="text-sm font-medium">
                  Recurring Shift
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 z-10" />
                    <DatePicker
                      selected={formData.startDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, startDate: date || new Date() }))}
                      className="w-full pl-10 h-9 rounded-md border border-gray-200"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 z-10" />
                    <DatePicker
                      selected={formData.endDate}
                      onChange={(date) => setFormData(prev => ({ ...prev, endDate: date || new Date() }))}
                      className="w-full pl-10 h-9 rounded-md border border-gray-200"
                      dateFormat="MMMM d, yyyy"
                      minDate={formData.startDate}
                    />
                  </div>
                </div>
              </div>

              {isRecurring && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Weekdays</label>
                  <div className="grid grid-cols-4 gap-2">
                    {weekdays.map((day) => (
                      <Button
                        key={day}
                        type="button"
                        variant={formData.selectedWeekdays.has(day) ? "default" : "outline"}
                        className="w-full"
                        onClick={() => toggleWeekday(day)}
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      className="pl-10"
                      value={formData.startTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      className="pl-10"
                      value={formData.endTime}
                      onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Number of Guards Required</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="number"
                    min="1"
                    max={formData.jobSite ? 
                      jobSites.find(site => site.id === formData.jobSite?.id)?.requiredGuards : 1
                    }
                    className="pl-10"
                    value={formData.numberOfGuards}
                    onChange={handleNumberOfGuardsChange}
                    required
                  />
                </div>
                {formData.jobSite && (
                  <p className="text-sm text-gray-500">
                    Maximum allowed: {
                      jobSites.find(site => site.id === formData.jobSite?.id)?.requiredGuards
                    } guards
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Dress Code</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Enter dress code requirements"
                    className="pl-10"
                    value={formData.dressCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, dressCode: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Additional Comments */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Additional Comments</label>
              <textarea
                className="w-full min-h-[100px] p-3 rounded-md border border-gray-200 resize-none"
                placeholder="Enter any additional instructions or requirements"
                value={formData.additionalComments}
                onChange={(e) => setFormData(prev => ({ ...prev, additionalComments: e.target.value }))}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Shift'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
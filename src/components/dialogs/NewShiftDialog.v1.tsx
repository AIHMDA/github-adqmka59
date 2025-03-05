import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, MapPin, User, Shield } from 'lucide-react';

interface NewShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type WeekDay = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'ALL';

export const NewShiftDialog: React.FC<NewShiftDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    startDate: new Date(),
    endDate: new Date(),
    startTime: '',
    endTime: '',
    numberOfGuards: 1,
    dressCode: '',
    additionalComments: '',
    mapLocation: { lat: 55.6761, lng: 12.5683 },
    selectedWeekdays: new Set<WeekDay>()
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);

  const weekdays: WeekDay[] = ['ALL', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/create-shift', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          weekdays: Array.from(formData.selectedWeekdays),
          isRecurring
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Shift created successfully!');
        onOpenChange(false);
        setFormData({
          title: '',
          address: '',
          startDate: new Date(),
          endDate: new Date(),
          startTime: '',
          endTime: '',
          numberOfGuards: 1,
          dressCode: '',
          additionalComments: '',
          mapLocation: { lat: 55.6761, lng: 12.5683 },
          selectedWeekdays: new Set()
        });
        setIsRecurring(false);
      } else {
        alert('Failed to create shift: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating shift:', error);
      alert('Failed to create shift. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

            {/* Address */}
            <div className="space-y-2">
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

            {/* Map Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Map Location</label>
              <div className="h-[300px] bg-gray-100 rounded-md flex items-center justify-center">
                <p className="text-gray-500">Map integration requires a valid Google Maps API key</p>
              </div>
            </div>

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
                    className="pl-10"
                    value={formData.numberOfGuards}
                    onChange={(e) => setFormData(prev => ({ ...prev, numberOfGuards: parseInt(e.target.value) || 1 }))}
                    required
                  />
                </div>
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
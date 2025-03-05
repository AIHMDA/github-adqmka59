import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Clock, MapPin, Users, Check } from 'lucide-react';

interface Guard {
  id: string;
  name: string;
  status: 'available' | 'on_duty' | 'off_duty';
  skills: string[];
  preferences?: {
    maxHoursPerWeek?: number;
    preferredLocations?: string[];
    availableDays?: string[];
  };
}

interface GuardPreferencesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guard: Guard;
  locations: string[];
  onSave: (guardId: string, preferences: any) => void;
}

export const GuardPreferencesDialog: React.FC<GuardPreferencesDialogProps> = ({
  open,
  onOpenChange,
  guard,
  locations,
  onSave
}) => {
  // Create a local state for this specific guard's preferences
  const [preferences, setPreferences] = useState({
    maxHoursPerWeek: 40,
    preferredLocations: [] as string[],
    availableDays: [] as string[]
  });
  
  // Initialize preferences from guard data when dialog opens
  useEffect(() => {
    if (open && guard) {
      setPreferences({
        maxHoursPerWeek: guard.preferences?.maxHoursPerWeek || 40,
        preferredLocations: guard.preferences?.preferredLocations || [],
        availableDays: guard.preferences?.availableDays || []
      });
    }
  }, [open, guard]);

  const handleSave = () => {
    // Save preferences for this specific guard only
    onSave(guard.id, { ...preferences });
    onOpenChange(false);
  };

  const toggleDay = (day: string) => {
    // Create a new array to avoid modifying the original state directly
    const updatedDays = [...preferences.availableDays];
    
    if (updatedDays.includes(day)) {
      // Remove day if already selected
      const index = updatedDays.indexOf(day);
      updatedDays.splice(index, 1);
    } else {
      // Add day if not selected
      updatedDays.push(day);
    }
    
    // Update state with the new array
    setPreferences(prev => ({
      ...prev,
      availableDays: updatedDays
    }));
  };

  const toggleLocation = (location: string) => {
    // Create a new array to avoid modifying the original state directly
    const updatedLocations = [...preferences.preferredLocations];
    
    if (updatedLocations.includes(location)) {
      // Remove location if already selected
      const index = updatedLocations.indexOf(location);
      updatedLocations.splice(index, 1);
    } else {
      // Add location if not selected
      updatedLocations.push(location);
    }
    
    // Update state with the new array
    setPreferences(prev => ({
      ...prev,
      preferredLocations: updatedLocations
    }));
  };

  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2" />
            {guard.name}'s Preferences
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Maximum Hours */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Maximum Hours Per Week</label>
            <div className="relative">
              <Clock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="number"
                min="1"
                max="168"
                className="pl-10"
                value={preferences.maxHoursPerWeek}
                onChange={(e) => setPreferences(prev => ({ 
                  ...prev, 
                  maxHoursPerWeek: parseInt(e.target.value) || 40
                }))}
              />
            </div>
          </div>

          {/* Available Days */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Available Days</label>
            <div className="grid grid-cols-7 gap-2">
              {weekdays.map((day) => (
                <Button
                  key={day}
                  type="button"
                  variant={preferences.availableDays.includes(day) ? "default" : "outline"}
                  className="w-full text-xs"
                  onClick={() => toggleDay(day)}
                >
                  {day.substring(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Preferred Locations</label>
            <div className="border rounded-lg p-4 max-h-[200px] overflow-y-auto">
              {locations.length > 0 ? (
                <div className="space-y-2">
                  {locations.map((location) => (
                    <div
                      key={location}
                      className={`
                        flex items-center justify-between p-2 rounded
                        ${preferences.preferredLocations.includes(location) ? 'bg-blue-50' : 'bg-gray-50'}
                        cursor-pointer
                      `}
                      onClick={() => toggleLocation(location)}
                    >
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{location}</span>
                      </div>
                      {preferences.preferredLocations.includes(location) && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No locations available
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
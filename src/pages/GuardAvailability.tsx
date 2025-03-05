import React, { useState } from 'react';
import { GuardAvailabilitySection } from '@/components/guards/GuardAvailabilitySection';
import { GuardPreferencesDialog } from '@/components/dialogs/GuardPreferencesDialog';
import { AssignShiftDialog } from '@/components/dialogs/AssignShiftDialog';
import { useShiftContext } from '@/contexts/ShiftContext';
import { Button } from '@/components/ui/button';
import { UserPlus, RefreshCcw } from 'lucide-react';
import { AddGuardDialog } from '@/components/dialogs/AddGuardDialog';

interface Guard {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'on_duty' | 'off_duty';
  currentLocation?: string;
  skills: string[];
  nextShift?: {
    time: string;
    location: string;
  };
  preferences?: {
    maxHoursPerWeek?: number;
    preferredLocations?: string[];
    preferredShiftTimes?: ('morning' | 'afternoon' | 'night')[];
    unavailableDays?: string[];
  };
}

export const GuardAvailability = () => {
  const { unassignedShifts, assignShift } = useShiftContext();
  const [isAddGuardOpen, setIsAddGuardOpen] = useState(false);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [locations, setLocations] = useState<string[]>([]);

  // Get unique locations from localStorage
  React.useEffect(() => {
    const storedJobSites = localStorage.getItem('jobSites');
    if (storedJobSites) {
      const jobSites = JSON.parse(storedJobSites);
      const locationNames = jobSites.map((site: any) => site.name);
      setLocations(locationNames);
    }
  }, []);

  const handleAssignShift = (guardId: string) => {
    const guard = JSON.parse(localStorage.getItem('guards') || '[]').find((g: any) => g.id === guardId);
    if (guard) {
      setSelectedGuard(guard);
      setSelectedShift(unassignedShifts[0]);
      setIsAssignShiftOpen(true);
    }
  };

  const handleEditPreferences = (guard: Guard) => {
    setSelectedGuard(guard);
    setIsPreferencesOpen(true);
  };

  const handleSavePreferences = (guardId: string, preferences: any) => {
    const storedGuards = JSON.parse(localStorage.getItem('guards') || '[]');
    const updatedGuards = storedGuards.map((guard: any) => {
      if (guard.id === guardId) {
        return {
          ...guard,
          preferences
        };
      }
      return guard;
    });
    
    localStorage.setItem('guards', JSON.stringify(updatedGuards));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('guardsUpdated'));
  };

  const handleAssignGuard = async (shiftId: string, guardId: string) => {
    const guard = JSON.parse(localStorage.getItem('guards') || '[]').find((g: any) => g.id === guardId);
    if (!guard) return;

    // Update guard status to on_duty
    const storedGuards = JSON.parse(localStorage.getItem('guards') || '[]');
    const updatedGuards = storedGuards.map((g: any) => {
      if (g.id === guardId) {
        return {
          ...g,
          status: 'on_duty'
        };
      }
      return g;
    });
    
    localStorage.setItem('guards', JSON.stringify(updatedGuards));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('guardsUpdated'));

    // Assign the shift
    assignShift(shiftId, guard.name, `https://i.pravatar.cc/150?u=${guardId}`);
  };

  const handleGuardCreated = (guardData: any) => {
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('guardsUpdated'));
  };

  const handleUpdateGuardStatus = () => {
    // Simulate updating guard statuses
    const storedGuards = JSON.parse(localStorage.getItem('guards') || '[]');
    
    // Randomly update some guard statuses for demonstration
    const updatedGuards = storedGuards.map((guard: any) => {
      // 20% chance to change status
      if (Math.random() < 0.2) {
        const statuses: ('available' | 'on_duty' | 'off_duty')[] = ['available', 'on_duty', 'off_duty'];
        const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
        return {
          ...guard,
          status: newStatus
        };
      }
      return guard;
    });
    
    localStorage.setItem('guards', JSON.stringify(updatedGuards));
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event('guardsUpdated'));
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'Guard statuses updated successfully!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Guard Availability</h2>
          <p className="text-gray-500">Manage and view guard availability status</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUpdateGuardStatus}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Update Status
          </Button>
          <Button onClick={() => setIsAddGuardOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Guard
          </Button>
        </div>
      </div>

      <GuardAvailabilitySection 
        onAssignShift={handleAssignShift}
        onEditPreferences={handleEditPreferences}
      />

      <AddGuardDialog 
        open={isAddGuardOpen}
        onOpenChange={setIsAddGuardOpen}
        onGuardCreated={handleGuardCreated}
      />

      {selectedGuard && (
        <GuardPreferencesDialog
          open={isPreferencesOpen}
          onOpenChange={setIsPreferencesOpen}
          guard={selectedGuard}
          locations={locations}
          onSave={handleSavePreferences}
        />
      )}

      {selectedGuard && selectedShift && (
        <AssignShiftDialog
          open={isAssignShiftOpen}
          onOpenChange={setIsAssignShiftOpen}
          shift={selectedShift}
          availableGuards={[selectedGuard as any]}
          onAssign={handleAssignGuard}
        />
      )}
    </div>
  );
};
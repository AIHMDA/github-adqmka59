import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MetricCard } from '@/components/shared/MetricCard';
import { ActivityRow } from '@/components/shared/ActivityRow';
import { Button } from '@/components/ui/button';
import { UserPlus, Settings, RefreshCcw } from 'lucide-react';
import { AddGuardDialog } from '@/components/dialogs/AddGuardDialog';
import { DocumentUpload } from '@/components/DocumentUpload';
import { ManageRoleDialog } from '@/components/dialogs/ManageRoleDialog';
import { GuardPreferencesDialog } from '@/components/dialogs/GuardPreferencesDialog';
import { AssignShiftDialog } from '@/components/dialogs/AssignShiftDialog';
import { useShiftContext } from '@/contexts/ShiftContext';
import { GuardAvailabilitySection } from '@/components/guards/GuardAvailabilitySection';

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

export const UserManagement = () => {
  const { unassignedShifts, assignShift } = useShiftContext();
  const [activeTab, setActiveTab] = useState('guards');
  const [isAddGuardOpen, setIsAddGuardOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [locations, setLocations] = useState<string[]>([]);

  // Load guards from localStorage on mount
  useEffect(() => {
    const loadGuards = () => {
      const storedGuards = localStorage.getItem('guards');
      if (storedGuards) {
        setGuards(JSON.parse(storedGuards));
      }
    };

    loadGuards();

    // Get unique locations from localStorage
    const storedJobSites = localStorage.getItem('jobSites');
    if (storedJobSites) {
      const jobSites = JSON.parse(storedJobSites);
      const locationNames = jobSites.map((site: any) => site.name);
      setLocations(locationNames);
    }

    // Add event listener for guard updates
    window.addEventListener('guardsUpdated', loadGuards);

    return () => {
      window.removeEventListener('guardsUpdated', loadGuards);
    };
  }, []);

  const handleDocumentUpload = (documentType: string, file: File) => {
    console.log(`Uploading ${documentType}:`, file);
  };

  const handleManageRole = (role: string) => {
    setSelectedRole(role);
  };

  const handleAssignShift = (guardId: string) => {
    const guard = guards.find(g => g.id === guardId);
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
    setGuards(prev => {
      const updatedGuards = prev.map(guard => {
        if (guard.id === guardId) {
          return {
            ...guard,
            preferences
          };
        }
        return guard;
      });
      
      localStorage.setItem('guards', JSON.stringify(updatedGuards));
      return updatedGuards;
    });
  };

  const handleAssignGuard = async (shiftId: string, guardId: string) => {
    const guard = guards.find(g => g.id === guardId);
    if (!guard) return;

    // Update guard status to on_duty
    setGuards(prev => {
      const updatedGuards = prev.map(g => {
        if (g.id === guardId) {
          return {
            ...g,
            status: 'on_duty' as const,
            currentLocation: unassignedShifts.find(s => s.id === shiftId)?.location
          };
        }
        return g;
      });
      
      localStorage.setItem('guards', JSON.stringify(updatedGuards));
      return updatedGuards;
    });

    // Assign the shift
    assignShift(shiftId, guard.name, `https://i.pravatar.cc/150?u=${guardId}`);
  };

  const handleGuardCreated = (guardData: any) => {
    const newGuard: Guard = {
      id: guardData.id || `guard-${Date.now()}`,
      name: guardData.fullName,
      email: guardData.email,
      status: 'available',
      skills: [],
      preferences: {
        maxHoursPerWeek: 40,
        preferredLocations: [],
        preferredShiftTimes: ['morning', 'afternoon'],
        unavailableDays: []
      }
    };

    setGuards(prev => {
      const updatedGuards = [...prev, newGuard];
      localStorage.setItem('guards', JSON.stringify(updatedGuards));
      return updatedGuards;
    });
  };

  const handleUpdateGuardStatus = () => {
    // Simulate updating guard statuses
    const updatedGuards = guards.map(guard => {
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
    
    setGuards(updatedGuards);
    localStorage.setItem('guards', JSON.stringify(updatedGuards));
    
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
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-500">Manage guards, roles, and preferences</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleUpdateGuardStatus}>
            <RefreshCcw className="w-4 h-4 mr-2" />
            Update Status
          </Button>
          <Button onClick={() => setIsAddGuardOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add New Guard
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-transparent border-b w-full justify-start">
          <TabsTrigger 
            value="guards"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Guards
          </TabsTrigger>
          <TabsTrigger 
            value="availability"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Availability
          </TabsTrigger>
          <TabsTrigger 
            value="onboarding"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Onboarding
          </TabsTrigger>
          <TabsTrigger 
            value="roles"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Roles & Permissions
          </TabsTrigger>
          <TabsTrigger 
            value="performance"
            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-900 rounded-none px-4"
          >
            Performance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="guards" className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <MetricCard label="Total Guards" value={guards.length.toString()} />
            <MetricCard 
              label="Available Guards" 
              value={guards.filter(g => g.status === 'available').length.toString()} 
            />
            <MetricCard 
              label="On Duty" 
              value={guards.filter(g => g.status === 'on_duty').length.toString()} 
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Guard Management</h3>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => {}}>
                  Import Guards
                </Button>
                <Button onClick={() => setIsAddGuardOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Guard
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              {guards.map(guard => (
                <div key={guard.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{guard.name}</h4>
                      <p className="text-sm text-gray-500">{guard.email}</p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          guard.status === 'available' ? 'bg-green-100 text-green-800' :
                          guard.status === 'on_duty' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {guard.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditPreferences(guard)}
                      >
                        Preferences
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleAssignShift(guard.id)}
                        disabled={guard.status !== 'available'}
                      >
                        Assign Shift
                      </Button>
                    </div>
                  </div>
                  
                  {/* Guard Preferences Summary */}
                  {guard.preferences && (
                    <div className="mt-3 pt-3 border-t">
                      <h5 className="text-sm font-medium mb-2">Preferences</h5>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500">Max Hours/Week</p>
                          <p>{guard.preferences.maxHoursPerWeek || 40} hours</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Preferred Times</p>
                          <p>{guard.preferences.preferredShiftTimes?.join(', ') || 'Any'}</p>
                        </div>
                        {guard.preferences.preferredLocations?.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Preferred Locations</p>
                            <p>{guard.preferences.preferredLocations.join(', ')}</p>
                          </div>
                        )}
                        {guard.preferences.unavailableDays?.length > 0 && (
                          <div className="col-span-2">
                            <p className="text-gray-500">Unavailable Days</p>
                            <p>{guard.preferences.unavailableDays.join(', ')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {guards.length === 0 && (
                <div className="text-center py-8 text-gray-500 border rounded-lg">
                  No guards have been added yet.
                  <div className="mt-2">
                    <Button onClick={() => setIsAddGuardOpen(true)}>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add First Guard
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Guard Availability</h3>
            <GuardAvailabilitySection 
              onAssignShift={handleAssignShift}
              onEditPreferences={handleEditPreferences}
            />
          </div>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Required Documents</h3>
            <DocumentUpload
              title="Government ID"
              description="National ID or passport required"
              required
              onUpload={(file) => handleDocumentUpload('Government ID', file)}
            />
            <DocumentUpload
              title="Security License"
              description="Optional verification"
              onUpload={(file) => handleDocumentUpload('Security License', file)}
            />
            <DocumentUpload
              title="Training Certificate"
              description="Optional verification"
              onUpload={(file) => handleDocumentUpload('Training Certificate', file)}
            />
          </div>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Available Roles</h3>
            <div className="space-y-2">
              {['Senior Guard', 'Regular Guard', 'Trainee'].map((role) => (
                <div key={role} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{role}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleManageRole(role)}
                  >
                    Manage
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="font-semibold mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <MetricCard label="Shifts Completed" value="145" />
              <MetricCard label="Attendance Rate" value="98.5%" />
              <MetricCard label="Incident Reports" value="3" />
              <MetricCard label="Average Rating" value="4.8/5.0" />
            </div>

            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-2">
              <ActivityRow 
                activity="Completed shift at Mall of Arabia" 
                time="2 hours ago" 
              />
              <ActivityRow 
                activity="Submitted incident report" 
                time="Yesterday" 
              />
              <ActivityRow 
                activity="Training completion: Emergency Response" 
                time="3 days ago" 
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddGuardDialog 
        open={isAddGuardOpen}
        onOpenChange={setIsAddGuardOpen}
        onGuardCreated={handleGuardCreated}
      />

      {selectedRole && (
        <ManageRoleDialog
          open={true}
          onOpenChange={() => setSelectedRole(null)}
          role={selectedRole}
        />
      )}

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
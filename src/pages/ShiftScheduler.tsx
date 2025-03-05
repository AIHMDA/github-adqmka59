import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Plus, ChevronLeft, ChevronRight, MapPin, Building, Shield, AlertTriangle, X, Settings, Wand2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import { NewShiftDialog } from '@/components/dialogs/NewShiftDialog';
import { AddJobSiteDialog } from '@/components/dialogs/AddJobSiteDialog';
import { AssignShiftDialog } from '@/components/dialogs/AssignShiftDialog';
import { EditJobTypesDialog } from '@/components/dialogs/EditJobTypesDialog';
import { JobDetailsDialog } from '@/components/dialogs/JobDetailsDialog';
import { AutoScheduleDialog } from '@/components/dialogs/AutoScheduleDialog';
import { GuardPreferencesDialog } from '@/components/dialogs/GuardPreferencesDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useShiftContext } from '@/contexts/ShiftContext';
import { useShiftOptimizer } from '@/hooks/useShiftOptimizer';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableShift } from '@/components/scheduler/SortableShift';

interface Shift {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  securityLevel: string;
  requirements: string[];
  bookingType?: 'private' | 'public';
  staffOnly?: boolean;
  assigned?: {
    name: string;
    avatar?: string;
  };
}

interface JobSite {
  id: string;
  name: string;
  address: string;
  activeGuards: number;
  totalShifts: number;
  status: 'active' | 'inactive';
  lastIncident?: string;
  requiredGuards: number;
}

interface Guard {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'on_duty' | 'off_duty';
  skills: string[];
  preferences?: {
    maxHoursPerWeek?: number;
    preferredLocations?: string[];
    availableDays?: string[];
  };
  nextShift?: {
    time: string;
    location: string;
  };
}

export const ShiftScheduler = () => {
  const { 
    unassignedShifts, 
    assignedShifts, 
    jobSites,
    addUnassignedShift,
    addJobSite,
    assignShift,
    unassignShift: contextUnassignShift
  } = useShiftContext();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewShiftOpen, setIsNewShiftOpen] = useState(false);
  const [isAddJobSiteOpen, setIsAddJobSiteOpen] = useState(false);
  const [isEditJobTypesOpen, setIsEditJobTypesOpen] = useState(false);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [isAutoScheduleOpen, setIsAutoScheduleOpen] = useState(false);
  const [isGuardPreferencesOpen, setIsGuardPreferencesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  const [isAssignShiftOpen, setIsAssignShiftOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<any | null>(null);
  const [availableGuards, setAvailableGuards] = useState<Guard[]>([]);
  const [selectedJobSite, setSelectedJobSite] = useState<JobSite | null>(null);
  const [selectedGuard, setSelectedGuard] = useState<Guard | null>(null);
  const [locations, setLocations] = useState<string[]>([]);

  // Load guards from localStorage when component mounts
  useEffect(() => {
    const loadGuards = () => {
      const storedGuards = localStorage.getItem('guards');
      if (storedGuards) {
        const guards = JSON.parse(storedGuards);
        // Filter only available guards
        const availableGuards = guards.filter((guard: Guard) => guard.status === 'available');
        setAvailableGuards(availableGuards);
      }
    };

    loadGuards();

    // Get unique locations from job sites
    const locationNames = jobSites.map(site => site.name);
    setLocations([...new Set(locationNames)]);

    // Add event listener for guard updates
    window.addEventListener('guardsUpdated', loadGuards);

    return () => {
      window.removeEventListener('guardsUpdated', loadGuards);
    };
  }, [jobSites]);

  const { optimize, isOptimizing } = useShiftOptimizer(
    availableGuards,
    unassignedShifts,
    async (shiftId, guardId) => {
      const guard = availableGuards.find(g => g.id === guardId);
      if (guard) {
        assignShift(shiftId, guard.name, `https://i.pravatar.cc/150?u=${guardId}`);
      }
    }
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (active.id !== over.id) {
      const shift = [...unassignedShifts, ...assignedShifts].find(s => s.id === active.id);
      if (!shift) return;

      if (unassignedShifts.find(s => s.id === active.id)) {
        setSelectedShift(shift);
        setIsAssignShiftOpen(true);
      }
      else if (assignedShifts.find(s => s.id === active.id)) {
        contextUnassignShift(active.id as string);
      }
    }
  };

  const handlePreviousWeek = () => {
    setSelectedDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    setSelectedDate(prev => addWeeks(prev, 1));
  };

  const handleAutoOptimize = async () => {
    try {
      await optimize();
    } catch (error) {
      console.error('Error during optimization:', error);
    }
  };

  const handleSettings = () => {
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'Opening scheduler settings...';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  };

  const handleJobSiteCreated = (jobSiteData: any) => {
    const newJobSite = {
      id: `site-${Date.now()}`,
      name: jobSiteData.name,
      address: jobSiteData.address,
      activeGuards: 0,
      totalShifts: 0,
      status: 'active' as const,
      requiredGuards: jobSiteData.requiredGuards
    };

    addJobSite(newJobSite);
  };

  const handleShiftCreated = (shiftData: any) => {
    const shift = {
      id: `shift-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`, // Add random string to ensure uniqueness
      title: shiftData.title,
      location: shiftData.location,
      date: shiftData.date,
      time: shiftData.time,
      securityLevel: shiftData.securityLevel || 'Standard',
      requirements: shiftData.requirements || [],
      bookingType: shiftData.bookingType,
      staffOnly: shiftData.staffOnly
    };
    
    addUnassignedShift(shift);
  };

  const handleAssignShift = (shiftId: string) => {
    const shift = unassignedShifts.find(s => s.id === shiftId);
    if (shift) {
      setSelectedShift(shift);
      setIsAssignShiftOpen(true);
    }
  };

  const handleAssignGuard = async (shiftId: string, guardId: string) => {
    const guard = availableGuards.find(g => g.id === guardId);
    if (!guard) return;

    // Get all guards to update
    const storedGuards = localStorage.getItem('guards');
    let updatedGuards = [];
    if (storedGuards) {
      updatedGuards = JSON.parse(storedGuards);
    }

    // Assign the shift
    assignShift(shiftId, guard.name, `https://i.pravatar.cc/150?u=${guardId}`);
  };

  const handleEditJobTypes = (jobSite: any) => {
    setSelectedJobSite(jobSite);
    setIsEditJobTypesOpen(true);
  };

  const handleViewJobDetails = (jobSite: any) => {
    setSelectedJobSite(jobSite);
    setIsJobDetailsOpen(true);
  };

  const handleEditGuardPreferences = (guard: Guard) => {
    setSelectedGuard(guard);
    setIsGuardPreferencesOpen(true);
  };

  const handleSavePreferences = (guardId: string, preferences: any) => {
    // Get all guards from localStorage
    const storedGuards = JSON.parse(localStorage.getItem('guards') || '[]');
    
    // Update only the specific guard's preferences
    const updatedGuards = storedGuards.map((g: any) => {
      if (g.id === guardId) {
        return {
          ...g,
          preferences: { ...preferences } // Create a new object to avoid reference issues
        };
      }
      return g; // Return other guards unchanged
    });
    
    // Save updated guards back to localStorage
    localStorage.setItem('guards', JSON.stringify(updatedGuards));
    
    // Trigger event to notify of guard updates
    window.dispatchEvent(new Event('guardsUpdated'));
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'Guard preferences updated successfully!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  };

  const weekStart = startOfWeek(selectedDate);
  const weekDays = [...Array(7)].map((_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shift Scheduler</h2>
          <p className="text-gray-500">Manage guard shifts and schedules</p>
        </div>
        <Button onClick={() => setIsNewShiftOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Shift
        </Button>
      </div>

      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handlePreviousWeek}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h3 className="text-lg font-semibold">
            Week of {format(selectedDate, 'MMM dd, yyyy')}
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleNextWeek}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="default" 
            className="bg-emerald-600 hover:bg-emerald-700 transition-colors"
            onClick={handleAutoOptimize}
            disabled={isOptimizing}
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isOptimizing ? 'Optimizing...' : 'Auto-Optimize'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleSettings}
            className="hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="shifts">Shift Management</TabsTrigger>
          <TabsTrigger value="sites">Job Sites</TabsTrigger>
          <TabsTrigger value="guards">Guards</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Shifts Today</p>
                  <p className="text-2xl font-semibold">8</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Guards on Duty</p>
                  <p className="text-2xl font-semibold">12</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Hours Scheduled</p>
                  <p className="text-2xl font-semibold">96</p>
                </div>
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">
                    {format(selectedDate, 'MMMM yyyy')}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handlePreviousWeek}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleNextWeek}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Today</Button>
                  <Button variant="outline" size="sm">Week</Button>
                  <Button variant="outline" size="sm">Month</Button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 text-center">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="text-sm font-medium text-gray-500">
                    {format(day, 'EEE')}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-7 gap-4 p-4">
              {weekDays.map((day) => (
                <div
                  key={day.toString()}
                  className="min-h-[120px] border rounded-lg p-2"
                >
                  <div className="text-sm font-medium mb-2">
                    {format(day, 'd')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Unassigned Shifts</h3>
                <div className="space-y-4">
                  <SortableContext items={unassignedShifts.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {unassignedShifts.map((shift) => (
                      <div key={shift.id} className="relative">
                        <SortableShift shift={shift} />
                        <Button
                          className="absolute top-2 right-2"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAssignShift(shift.id)}
                        >
                          Assign
                        </Button>
                      </div>
                    ))}
                  </SortableContext>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Assigned Shifts</h3>
                <div className="space-y-4">
                  <SortableContext items={assignedShifts.map(s => s.id)} strategy={verticalListSortingStrategy}>
                    {assignedShifts.map((shift) => (
                      <SortableShift 
                        key={shift.id} 
                        shift={shift}
                        onUnassign={() => contextUnassignShift(shift.id)}
                      />
                    ))}
                  </SortableContext>
                </div>
              </div>
            </div>
          </DndContext>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Job Sites</p>
                  <p className="text-2xl font-semibold">{jobSites.length}</p>
                </div>
                <Building className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Active Guards</p>
                  <p className="text-2xl font-semibold">
                    {jobSites.reduce((sum, site) => sum + site.activeGuards, 0)}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Guard Coverage</p>
                  <p className="text-2xl font-semibold">
                    {Math.round((jobSites.reduce((sum, site) => sum + site.activeGuards, 0) / 
                      jobSites.reduce((sum, site) => sum + site.requiredGuards, 0)) * 100)}%
                  </p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Job Sites</h3>
                <Button onClick={() => setIsAddJobSiteOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Job Site
                </Button>
              </div>
              <div className="space-y-4">
                {jobSites.map(site => (
                  <div key={site.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{site.name}</h4>
                        <p className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {site.address}
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewJobDetails(site)}
                      >
                        View Details
                      </Button>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Active Guards</p>
                        <p className="font-semibold">{site.activeGuards} / {site.requiredGuards}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total Shifts</p>
                        <p className="font-semibold">{site.totalShifts}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Incident</p>
                        <p className="font-semibold flex items-center">
                          {site.lastIncident ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-yellow-500 mr-1" />
                              {site.lastIncident}
                            </>
                          ) : (
                            <span className="text-green-600">No incidents</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="guards" className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Guard Preferences</h3>
            <div className="space-y-4">
              {availableGuards.map(guard => (
                <div key={guard.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">{guard.name}</h4>
                        <p className="text-sm text-gray-500">{guard.email}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditGuardPreferences(guard)}
                    >
                      Edit Preferences
                    </Button>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Max Hours/Week</p>
                      <p className="font-semibold">{guard.preferences?.maxHoursPerWeek || 40}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Preferred Locations</p>
                      <p className="font-semibold">
                        {guard.preferences?.preferredLocations?.length 
                          ? guard.preferences.preferredLocations.join(', ') 
                          : 'None specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Available Days</p>
                      <p className="font-semibold">
                        {guard.preferences?.availableDays?.length 
                          ? guard.preferences.availableDays.map(day => day.substring(0, 3)).join(', ') 
                          : 'All days'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <NewShiftDialog 
        open={isNewShiftOpen}
        onOpenChange={setIsNewShiftOpen}
        onShiftCreated={handleShiftCreated}
        jobSites={jobSites}
      />

      <AddJobSiteDialog
        open={isAddJobSiteOpen}
        onOpenChange={setIsAddJobSiteOpen}
        onJobSiteCreated={handleJobSiteCreated}
      />

      {selectedShift && (
        <AssignShiftDialog
          open={isAssignShiftOpen}
          onOpenChange={setIsAssignShiftOpen}
          shift={selectedShift}
          availableGuards={availableGuards}
          onAssign={handleAssignGuard}
        />
      )}

      {selectedJobSite && (
        <EditJobTypesDialog
          open={isEditJobTypesOpen}
          onOpenChange={setIsEditJobTypesOpen}
          jobSite={selectedJobSite}
        />
      )}

      {selectedJobSite && (
        <JobDetailsDialog
          open={isJobDetailsOpen}
          onOpenChange={setIsJobDetailsOpen}
          jobSite={selectedJobSite}
        />
      )}

      <AutoScheduleDialog
        open={isAutoScheduleOpen}
        onOpenChange={setIsAutoScheduleOpen}
      />

      {selectedGuard && (
        <GuardPreferencesDialog
          open={isGuardPreferencesOpen}
          onOpenChange={setIsGuardPreferencesOpen}
          guard={selectedGuard}
          locations={locations}
          onSave={handleSavePreferences}
        />
      )}
    </div>
  );
};
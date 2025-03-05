import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wand2, AlertTriangle, Check, X, User, Calendar, Clock, MapPin, Shield, Briefcase, Star } from 'lucide-react';
import { useAutoScheduler } from '@/hooks/useAutoScheduler';
import { Input } from '@/components/ui/input';

interface Guard {
  id: string;
  name: string;
  email: string;
  status: 'available' | 'on_duty' | 'off_duty';
  skills: string[];
  preferences?: {
    maxHoursPerWeek?: number;
    preferredLocations?: string[];
    preferredShiftTimes?: ('morning' | 'afternoon' | 'night')[];
    unavailableDays?: string[];
  };
}

interface Shift {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  securityLevel: string;
  requirements: string[];
  assigned?: {
    name: string;
    avatar?: string;
  };
}

interface AutoScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guards: Array<Guard>;
  shifts: Array<Shift>;
  onAssign: (shiftId: string, guardId: string) => void;
}

export const AutoScheduleDialog: React.FC<AutoScheduleDialogProps> = ({
  open,
  onOpenChange,
  guards = [],
  shifts = [],
  onAssign
}) => {
  const [activeTab, setActiveTab] = useState<'parameters' | 'overview' | 'assignments' | 'conflicts'>('parameters');
  const [scheduleParams, setScheduleParams] = useState({
    shiftTypes: [] as string[],
    clientPriority: 'balanced' as 'client-first' | 'guard-first' | 'balanced',
    priorityLevel: 5,
    considerGuardPreferences: true,
    maxShiftsPerGuard: 0,
    minRestHours: 8
  });
  
  // Extract unique shift types from shifts
  const availableShiftTypes = shifts && shifts.length > 0 
    ? [...new Set(shifts.map(s => s.title))] 
    : [];
  
  const { 
    generateSchedule, 
    applySchedule, 
    isScheduling, 
    lastResult, 
    error 
  } = useAutoScheduler(guards, shifts, onAssign);

  const handleGenerateSchedule = async () => {
    await generateSchedule(scheduleParams);
    setActiveTab('overview');
  };

  const handleApplySchedule = async () => {
    const success = await applySchedule();
    if (success) {
      onOpenChange(false);
    }
  };

  const toggleShiftType = (type: string) => {
    setScheduleParams(prev => {
      if (prev.shiftTypes.includes(type)) {
        return {
          ...prev,
          shiftTypes: prev.shiftTypes.filter(t => t !== type)
        };
      } else {
        return {
          ...prev,
          shiftTypes: [...prev.shiftTypes, type]
        };
      }
    });
  };

  const selectAllShiftTypes = () => {
    setScheduleParams(prev => ({
      ...prev,
      shiftTypes: [...availableShiftTypes]
    }));
  };

  const clearShiftTypes = () => {
    setScheduleParams(prev => ({
      ...prev,
      shiftTypes: []
    }));
  };

  // Calculate stats for the dialog
  const unassignedShifts = shifts ? shifts.filter(shift => !shift.assigned) : [];
  const availableGuards = guards ? guards.filter(guard => guard.status === 'available') : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Wand2 className="w-5 h-5 mr-2" />
            Automatic Shift Scheduling
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Unassigned Shifts</p>
              <p className="text-2xl font-semibold">{unassignedShifts.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Available Guards</p>
              <p className="text-2xl font-semibold">{availableGuards.length}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Potential Assignments</p>
              <p className="text-2xl font-semibold">
                {Math.min(unassignedShifts.length, availableGuards.length)}
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-4">
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'parameters'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('parameters')}
              >
                Parameters
              </button>
              {lastResult && (
                <>
                  <button
                    className={`pb-2 px-1 ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button
                    className={`pb-2 px-1 ${
                      activeTab === 'assignments'
                        ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('assignments')}
                  >
                    Assignments ({lastResult.assignments.length})
                  </button>
                  <button
                    className={`pb-2 px-1 ${
                      activeTab === 'conflicts'
                        ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                        : 'text-gray-500'
                    }`}
                    onClick={() => setActiveTab('conflicts')}
                  >
                    Conflicts ({lastResult.conflicts.length})
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Parameters Tab */}
          {activeTab === 'parameters' && (
            <div className="space-y-6">
              {/* Shift Types */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Shift Types</label>
                  <div className="space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={selectAllShiftTypes}
                    >
                      Select All
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={clearShiftTypes}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableShiftTypes.map((type) => (
                    <div 
                      key={type}
                      className={`
                        flex items-center p-2 border rounded cursor-pointer
                        ${scheduleParams.shiftTypes.includes(type) 
                          ? 'bg-blue-50 border-blue-300' 
                          : 'bg-white border-gray-200'}
                      `}
                      onClick={() => toggleShiftType(type)}
                    >
                      <Briefcase className={`w-4 h-4 mr-2 ${
                        scheduleParams.shiftTypes.includes(type) 
                          ? 'text-blue-600' 
                          : 'text-gray-400'
                      }`} />
                      <span className="text-sm">{type}</span>
                    </div>
                  ))}
                </div>
                
                {availableShiftTypes.length === 0 && (
                  <p className="text-sm text-gray-500">No shift types available</p>
                )}
                
                {scheduleParams.shiftTypes.length === 0 && availableShiftTypes.length > 0 && (
                  <p className="text-sm text-yellow-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    No shift types selected. All unassigned shifts will be considered.
                  </p>
                )}
              </div>

              {/* Client Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Client Priority</label>
                <div className="grid grid-cols-3 gap-2">
                  <div 
                    className={`
                      flex items-center justify-center p-2 border rounded cursor-pointer
                      ${scheduleParams.clientPriority === 'client-first' 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200'}
                    `}
                    onClick={() => setScheduleParams(prev => ({ ...prev, clientPriority: 'client-first' }))}
                  >
                    <Star className={`w-4 h-4 mr-2 ${
                      scheduleParams.clientPriority === 'client-first' 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`} />
                    <span className="text-sm">Client First</span>
                  </div>
                  
                  <div 
                    className={`
                      flex items-center justify-center p-2 border rounded cursor-pointer
                      ${scheduleParams.clientPriority === 'balanced' 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200'}
                    `}
                    onClick={() => setScheduleParams(prev => ({ ...prev, clientPriority: 'balanced' }))}
                  >
                    <Shield className={`w-4 h-4 mr-2 ${
                      scheduleParams.clientPriority === 'balanced' 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`} />
                    <span className="text-sm">Balanced</span>
                  </div>
                  
                  <div 
                    className={`
                      flex items-center justify-center p-2 border rounded cursor-pointer
                      ${scheduleParams.clientPriority === 'guard-first' 
                        ? 'bg-blue-50 border-blue-300' 
                        : 'bg-white border-gray-200'}
                    `}
                    onClick={() => setScheduleParams(prev => ({ ...prev, clientPriority: 'guard-first' }))}
                  >
                    <User className={`w-4 h-4 mr-2 ${
                      scheduleParams.clientPriority === 'guard-first' 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                    }`} />
                    <span className="text-sm">Guard First</span>
                  </div>
                </div>
                
                <div className="mt-2">
                  <label className="text-sm font-medium">Priority Level (1-10)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={scheduleParams.priorityLevel}
                      onChange={(e) => setScheduleParams(prev => ({ 
                        ...prev, 
                        priorityLevel: parseInt(e.target.value) 
                      }))}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-8 text-center">{scheduleParams.priorityLevel}</span>
                  </div>
                </div>
              </div>

              {/* Additional Parameters */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="considerPreferences"
                    checked={scheduleParams.considerGuardPreferences}
                    onChange={(e) => setScheduleParams(prev => ({ 
                      ...prev, 
                      considerGuardPreferences: e.target.checked 
                    }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="considerPreferences" className="text-sm font-medium">
                    Consider Guard Preferences
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Max Shifts Per Guard (0 = unlimited)</label>
                    <Input
                      type="number"
                      min="0"
                      value={scheduleParams.maxShiftsPerGuard}
                      onChange={(e) => setScheduleParams(prev => ({ 
                        ...prev, 
                        maxShiftsPerGuard: parseInt(e.target.value) || 0 
                      }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Minimum Rest Hours</label>
                    <Input
                      type="number"
                      min="0"
                      value={scheduleParams.minRestHours}
                      onChange={(e) => setScheduleParams(prev => ({ 
                        ...prev, 
                        minRestHours: parseInt(e.target.value) || 8 
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <Button 
              onClick={handleGenerateSchedule} 
              disabled={isScheduling || unassignedShifts.length === 0 || availableGuards.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Wand2 className="w-4 h-4 mr-2" />
              {isScheduling ? 'Generating...' : 'Generate Schedule'}
            </Button>
            
            {lastResult && (
              <Button 
                onClick={handleApplySchedule} 
                disabled={lastResult.assignments.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-2" />
                Apply Schedule
              </Button>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results Content */}
          {lastResult && activeTab !== 'parameters' && (
            <div className="pt-4">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Total Shifts</p>
                      <p className="text-xl font-semibold">{lastResult.metrics.totalShifts}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Assigned</p>
                      <p className="text-xl font-semibold text-green-600">{lastResult.metrics.assignedShifts}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Unassigned</p>
                      <p className="text-xl font-semibold text-red-600">{lastResult.metrics.unassignedShifts}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-500">Avg. Guard Utilization</p>
                      <p className="text-xl font-semibold">
                        {lastResult.metrics.averageGuardUtilization.toFixed(1)} shifts
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Guard Utilization</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-2">
                        {Object.entries(lastResult.metrics.guardUtilization)
                          .sort(([, a], [, b]) => b - a)
                          .map(([guardId, count]) => {
                            const guard = guards.find(g => g.id === guardId);
                            if (!guard) return null;
                            
                            return (
                              <div key={guardId} className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <User className="w-4 h-4 mr-2 text-gray-500" />
                                  <span>{guard.name}</span>
                                </div>
                                <div className="flex items-center">
                                  <span className="text-sm font-medium">{count} shifts</span>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Assignments Tab */}
              {activeTab === 'assignments' && (
                <div className="space-y-4">
                  {lastResult.assignments.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-3 font-medium grid grid-cols-12 gap-2">
                        <div className="col-span-5">Shift</div>
                        <div className="col-span-4">Guard</div>
                        <div className="col-span-3">Match Score</div>
                      </div>
                      <div className="divide-y">
                        {lastResult.assignments.map(assignment => {
                          const shift = shifts.find(s => s.id === assignment.shiftId);
                          if (!shift) return null;
                          
                          return (
                            <div key={assignment.shiftId} className="p-3 grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-5">
                                <p className="font-medium">{shift.title}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span className="mr-2">{shift.date}</span>
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{shift.time}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{shift.location}</span>
                                </div>
                              </div>
                              <div className="col-span-4">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center mr-2">
                                    <User className="w-3 h-3 text-gray-600" />
                                  </div>
                                  <span>{assignment.guardName}</span>
                                </div>
                              </div>
                              <div className="col-span-3">
                                <div className={`
                                  px-2 py-1 rounded-full text-xs inline-flex items-center
                                  ${assignment.score >= 10 ? 'bg-green-100 text-green-800' : 
                                    assignment.score >= 5 ? 'bg-blue-100 text-blue-800' : 
                                    'bg-yellow-100 text-yellow-800'}
                                `}>
                                  <Shield className="w-3 h-3 mr-1" />
                                  {assignment.score.toFixed(1)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-lg">
                      No assignments were generated.
                    </div>
                  )}
                </div>
              )}

              {/* Conflicts Tab */}
              {activeTab === 'conflicts' && (
                <div className="space-y-4">
                  {lastResult.conflicts.length > 0 ? (
                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 p-3 font-medium grid grid-cols-12 gap-2">
                        <div className="col-span-5">Shift</div>
                        <div className="col-span-7">Reason</div>
                      </div>
                      <div className="divide-y">
                        {lastResult.conflicts.map(conflict => {
                          const shift = shifts.find(s => s.id === conflict.shiftId);
                          if (!shift) return null;
                          
                          return (
                            <div key={conflict.shiftId} className="p-3 grid grid-cols-12 gap-2 items-center">
                              <div className="col-span-5">
                                <p className="font-medium">{shift.title}</p>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  <span className="mr-2">{shift.date}</span>
                                  <Clock className="w-3 h-3 mr-1" />
                                  <span>{shift.time}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  <span>{shift.location}</span>
                                </div>
                              </div>
                              <div className="col-span-7">
                                <div className="flex items-start text-red-600">
                                  <AlertTriangle className="w-4 h-4 mr-2 mt-0.5" />
                                  <span>{conflict.reason}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 border rounded-lg">
                      No conflicts were detected.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
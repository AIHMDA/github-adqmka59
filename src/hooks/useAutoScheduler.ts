import { useState, useCallback } from 'react';
import { AutoScheduler } from '../services/autoScheduler';

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

interface ScheduleParams {
  shiftTypes: string[];
  clientPriority: 'client-first' | 'guard-first' | 'balanced';
  priorityLevel: number;
  considerGuardPreferences: boolean;
  maxShiftsPerGuard: number;
  minRestHours: number;
}

interface ScheduleResult {
  assignments: Array<{
    shiftId: string;
    guardId: string;
    guardName: string;
    score: number;
  }>;
  unassignedShifts: string[];
  conflicts: Array<{
    shiftId: string;
    reason: string;
  }>;
  metrics: {
    totalShifts: number;
    assignedShifts: number;
    unassignedShifts: number;
    averageGuardUtilization: number;
    guardUtilization: Record<string, number>;
  };
}

export function useAutoScheduler(
  guards: Guard[] = [],
  shifts: Shift[] = [],
  onAssign: (shiftId: string, guardId: string) => void
) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [lastResult, setLastResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateSchedule = useCallback(async (params: ScheduleParams) => {
    setIsScheduling(true);
    setError(null);
    
    try {
      // Filter only unassigned shifts and available guards
      let unassignedShifts = shifts.filter(shift => !shift.assigned);
      const availableGuards = guards.filter(guard => guard.status === 'available');
      
      // Filter by shift types if specified
      if (params.shiftTypes.length > 0) {
        unassignedShifts = unassignedShifts.filter(shift => 
          params.shiftTypes.includes(shift.title)
        );
      }
      
      if (unassignedShifts.length === 0) {
        setError('No unassigned shifts to schedule');
        setIsScheduling(false);
        return null;
      }
      
      if (availableGuards.length === 0) {
        setError('No available guards for scheduling');
        setIsScheduling(false);
        return null;
      }
      
      const scheduler = new AutoScheduler(availableGuards, unassignedShifts);
      
      // Configure scheduler with parameters
      scheduler.configure({
        clientPriority: params.clientPriority,
        priorityLevel: params.priorityLevel,
        considerGuardPreferences: params.considerGuardPreferences,
        maxShiftsPerGuard: params.maxShiftsPerGuard,
        minRestHours: params.minRestHours
      });
      
      const result = scheduler.generateSchedule();
      
      setLastResult(result);
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = `Successfully scheduled ${result.assignments.length} shifts. ${result.conflicts.length} shifts could not be assigned.`;
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 5000);
      
      return result;
    } catch (err) {
      console.error('Error during scheduling:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      
      // Show error message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to generate schedule. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
      
      return null;
    } finally {
      setIsScheduling(false);
    }
  }, [guards, shifts]);

  const applySchedule = useCallback(async () => {
    if (!lastResult) return false;
    
    try {
      // Apply the assignments
      for (const assignment of lastResult.assignments) {
        await onAssign(assignment.shiftId, assignment.guardId);
      }
      
      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = `Successfully applied ${lastResult.assignments.length} shift assignments.`;
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
      
      return true;
    } catch (error) {
      console.error('Error applying schedule:', error);
      
      // Show error message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to apply schedule. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
      
      return false;
    }
  }, [lastResult, onAssign]);

  return {
    generateSchedule,
    applySchedule,
    isScheduling,
    lastResult,
    error
  };
}
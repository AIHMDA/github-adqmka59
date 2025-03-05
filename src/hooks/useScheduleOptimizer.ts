import { useState, useCallback } from 'react';
import { ScheduleOptimizer } from '../services/scheduler';

interface Guard {
  id: string;
  name: string;
  maxHoursPerWeek: number;
  skills: string[];
  preferredLocations: string[];
}

interface Shift {
  id: string;
  locationId: string;
  startTime: Date;
  endTime: Date;
  requiredSkills: string[];
  guardId?: string;
}

interface Conflict {
  shiftId: string;
  type: string;
  details: string;
}

export function useScheduleOptimizer(initialGuards: Guard[], initialShifts: Shift[]) {
  const [guards] = useState<Guard[]>(initialGuards);
  const [shifts] = useState<Shift[]>(initialShifts);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [assignments, setAssignments] = useState<Map<string, string>>(new Map());

  const optimizeSchedule = useCallback(() => {
    const optimizer = new ScheduleOptimizer(guards, shifts);
    
    // Get optimized assignments
    const newAssignments = optimizer.optimizeSchedule();
    setAssignments(newAssignments);

    // Check for conflicts
    const newConflicts = optimizer.detectConflicts();
    setConflicts(newConflicts);

    return {
      assignments: newAssignments,
      conflicts: newConflicts
    };
  }, [guards, shifts]);

  const checkConflicts = useCallback(() => {
    const optimizer = new ScheduleOptimizer(guards, shifts);
    const newConflicts = optimizer.detectConflicts();
    setConflicts(newConflicts);
    return newConflicts;
  }, [guards, shifts]);

  return {
    assignments,
    conflicts,
    optimizeSchedule,
    checkConflicts
  };
}
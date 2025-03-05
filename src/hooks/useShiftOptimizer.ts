import { useState, useCallback } from 'react';
import { ShiftOptimizer } from '../services/optimizer';

interface Guard {
  id: string;
  name: string;
  status: 'available' | 'on_duty' | 'off_duty';
  skills: string[];
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

interface OptimizationResult {
  assignments: Array<{
    shiftId: string;
    guardId: string;
  }>;
  conflicts: Array<{
    shiftId: string;
    guardId: string;
    reason: string;
  }>;
}

export function useShiftOptimizer(
  guards: Guard[],
  shifts: Shift[],
  onAssign: (shiftId: string, guardId: string) => void
) {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [lastResult, setLastResult] = useState<OptimizationResult | null>(null);

  const optimize = useCallback(async () => {
    setIsOptimizing(true);
    try {
      const optimizer = new ShiftOptimizer(guards, shifts);
      const result = optimizer.optimize();
      setLastResult(result);

      // Apply assignments
      for (const assignment of result.assignments) {
        const guard = guards.find(g => g.id === assignment.guardId);
        if (guard) {
          await onAssign(assignment.shiftId, assignment.guardId);
        }
      }

      // Show success message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = `Successfully assigned ${result.assignments.length} shifts. ${result.conflicts.length} conflicts found.`;
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);

      return result;
    } catch (error) {
      console.error('Optimization error:', error);
      
      // Show error message
      const message = document.createElement('div');
      message.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50';
      message.textContent = 'Failed to optimize shifts. Please try again.';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 3000);
      
      throw error;
    } finally {
      setIsOptimizing(false);
    }
  }, [guards, shifts, onAssign]);

  return {
    optimize,
    isOptimizing,
    lastResult
  };
}
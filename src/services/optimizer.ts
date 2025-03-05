import { addMinutes, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

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

export class ShiftOptimizer {
  private guards: Guard[];
  private shifts: Shift[];
  private assignments: Map<string, string> = new Map(); // shiftId -> guardId
  private conflicts: Array<{
    shiftId: string;
    guardId: string;
    reason: string;
  }> = [];

  constructor(guards: Guard[], shifts: Shift[]) {
    this.guards = guards;
    this.shifts = shifts;
  }

  private parseTime(timeStr: string): Date {
    const [start] = timeStr.split(' - ');
    const [hours, minutes] = start.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private hasRequiredSkills(guard: Guard, shift: Shift): boolean {
    return shift.requirements.every(req => guard.skills.includes(req));
  }

  private isGuardAvailable(guard: Guard, shift: Shift): boolean {
    if (guard.status !== 'available') {
      this.conflicts.push({
        shiftId: shift.id,
        guardId: guard.id,
        reason: `Guard is ${guard.status}`
      });
      return false;
    }

    // Check for overlapping shifts
    const shiftTime = this.parseTime(shift.time);
    const shiftEnd = addMinutes(shiftTime, 480); // Assuming 8-hour shifts

    for (const [assignedShiftId, assignedGuardId] of this.assignments.entries()) {
      if (assignedGuardId === guard.id) {
        const assignedShift = this.shifts.find(s => s.id === assignedShiftId);
        if (assignedShift) {
          const assignedTime = this.parseTime(assignedShift.time);
          const assignedEnd = addMinutes(assignedTime, 480);

          if (areIntervalsOverlapping(
            { start: shiftTime, end: shiftEnd },
            { start: assignedTime, end: assignedEnd }
          )) {
            this.conflicts.push({
              shiftId: shift.id,
              guardId: guard.id,
              reason: 'Schedule conflict with another shift'
            });
            return false;
          }
        }
      }
    }

    return true;
  }

  private calculateGuardScore(guard: Guard, shift: Shift): number {
    let score = 0;

    // Base score for having required skills
    if (this.hasRequiredSkills(guard, shift)) {
      score += 10;
    }

    // Bonus for matching security level
    const guardLevel = guard.skills.find(s => s.includes('Level'));
    if (guardLevel && shift.securityLevel.includes(guardLevel)) {
      score += 5;
    }

    // Penalty for number of assigned shifts (for workload balance)
    const assignedShifts = Array.from(this.assignments.values())
      .filter(guardId => guardId === guard.id).length;
    score -= assignedShifts * 2;

    return score;
  }

  public optimize(): OptimizationResult {
    this.assignments.clear();
    this.conflicts = [];

    // Sort shifts by requirements (more requirements first)
    const sortedShifts = [...this.shifts]
      .sort((a, b) => b.requirements.length - a.requirements.length);

    for (const shift of sortedShifts) {
      let bestGuard: Guard | null = null;
      let bestScore = -Infinity;

      for (const guard of this.guards) {
        if (!this.isGuardAvailable(guard, shift)) {
          continue;
        }

        const score = this.calculateGuardScore(guard, shift);
        if (score > bestScore) {
          bestScore = score;
          bestGuard = guard;
        }
      }

      if (bestGuard) {
        this.assignments.set(shift.id, bestGuard.id);
      } else if (!this.conflicts.some(c => c.shiftId === shift.id)) {
        this.conflicts.push({
          shiftId: shift.id,
          guardId: '',
          reason: 'No available guard meets requirements'
        });
      }
    }

    return {
      assignments: Array.from(this.assignments.entries()).map(([shiftId, guardId]) => ({
        shiftId,
        guardId
      })),
      conflicts: this.conflicts
    };
  }
}
import { addMinutes, isWithinInterval, areIntervalsOverlapping } from 'date-fns';

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

export class ScheduleOptimizer {
  private guards: Guard[] = [];
  private shifts: Shift[] = [];
  private assignments: Map<string, string[]> = new Map(); // guardId -> shiftIds

  constructor(guards: Guard[], shifts: Shift[]) {
    this.guards = guards;
    this.shifts = shifts;
    this.initializeAssignments();
  }

  private initializeAssignments() {
    this.guards.forEach(guard => {
      this.assignments.set(guard.id, []);
    });
  }

  // Check if a guard can be assigned to a shift
  private canAssignGuard(guard: Guard, shift: Shift): boolean {
    // Check skills match
    const hasRequiredSkills = shift.requiredSkills.every(
      skill => guard.skills.includes(skill)
    );
    if (!hasRequiredSkills) return false;

    // Check location preference
    const isPreferredLocation = guard.preferredLocations.includes(shift.locationId);
    if (!isPreferredLocation) return false;

    // Check for time conflicts
    const guardShifts = this.assignments.get(guard.id) || [];
    const hasConflict = guardShifts.some(shiftId => {
      const existingShift = this.shifts.find(s => s.id === shiftId);
      if (!existingShift) return false;

      return areIntervalsOverlapping(
        { start: existingShift.startTime, end: existingShift.endTime },
        { start: shift.startTime, end: shift.endTime }
      );
    });
    if (hasConflict) return false;

    // Check weekly hours limit
    const totalHours = this.calculateTotalHours(guard.id, shift);
    if (totalHours > guard.maxHoursPerWeek) return false;

    return true;
  }

  // Calculate total weekly hours for a guard
  private calculateTotalHours(guardId: string, newShift?: Shift): number {
    const guardShifts = this.assignments.get(guardId) || [];
    let totalMinutes = guardShifts.reduce((acc, shiftId) => {
      const shift = this.shifts.find(s => s.id === shiftId);
      if (!shift) return acc;

      const duration = (shift.endTime.getTime() - shift.startTime.getTime()) / (1000 * 60);
      return acc + duration;
    }, 0);

    if (newShift) {
      const newShiftDuration = 
        (newShift.endTime.getTime() - newShift.startTime.getTime()) / (1000 * 60);
      totalMinutes += newShiftDuration;
    }

    return totalMinutes / 60;
  }

  // Find the best guard for a shift
  private findBestGuard(shift: Shift): Guard | null {
    let bestGuard: Guard | null = null;
    let bestScore = -1;

    for (const guard of this.guards) {
      if (!this.canAssignGuard(guard, shift)) continue;

      const score = this.calculateAssignmentScore(guard, shift);
      if (score > bestScore) {
        bestScore = score;
        bestGuard = guard;
      }
    }

    return bestGuard;
  }

  // Calculate a score for a potential assignment
  private calculateAssignmentScore(guard: Guard, shift: Shift): number {
    let score = 0;

    // Preferred location bonus
    if (guard.preferredLocations.includes(shift.locationId)) {
      score += 10;
    }

    // Skill match bonus
    const skillMatchCount = shift.requiredSkills.filter(
      skill => guard.skills.includes(skill)
    ).length;
    score += skillMatchCount * 5;

    // Workload balance penalty
    const currentHours = this.calculateTotalHours(guard.id);
    const hoursAfterAssignment = this.calculateTotalHours(guard.id, shift);
    const workloadBalance = 1 - (hoursAfterAssignment / guard.maxHoursPerWeek);
    score += workloadBalance * 20;

    return score;
  }

  // Optimize the entire schedule
  public optimizeSchedule(): Map<string, string> {
    const assignments = new Map<string, string>(); // shiftId -> guardId
    const sortedShifts = [...this.shifts].sort((a, b) => 
      a.startTime.getTime() - b.startTime.getTime()
    );

    for (const shift of sortedShifts) {
      const bestGuard = this.findBestGuard(shift);
      if (bestGuard) {
        assignments.set(shift.id, bestGuard.id);
        const guardShifts = this.assignments.get(bestGuard.id) || [];
        guardShifts.push(shift.id);
        this.assignments.set(bestGuard.id, guardShifts);
      }
    }

    return assignments;
  }

  // Detect scheduling conflicts
  public detectConflicts(): Array<{ shiftId: string; type: string; details: string }> {
    const conflicts: Array<{ shiftId: string; type: string; details: string }> = [];

    // Check for overlapping shifts
    this.assignments.forEach((shiftIds, guardId) => {
      for (let i = 0; i < shiftIds.length; i++) {
        for (let j = i + 1; j < shiftIds.length; j++) {
          const shift1 = this.shifts.find(s => s.id === shiftIds[i]);
          const shift2 = this.shifts.find(s => s.id === shiftIds[j]);
          
          if (shift1 && shift2 && areIntervalsOverlapping(
            { start: shift1.startTime, end: shift1.endTime },
            { start: shift2.startTime, end: shift2.endTime }
          )) {
            conflicts.push({
              shiftId: shift1.id,
              type: 'overlap',
              details: `Overlaps with shift ${shift2.id}`
            });
          }
        }
      }
    });

    // Check for insufficient rest periods (minimum 8 hours between shifts)
    this.assignments.forEach((shiftIds, guardId) => {
      const guardShifts = shiftIds
        .map(id => this.shifts.find(s => s.id === id))
        .filter((s): s is Shift => s !== undefined)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

      for (let i = 0; i < guardShifts.length - 1; i++) {
        const currentShift = guardShifts[i];
        const nextShift = guardShifts[i + 1];
        const restPeriod = (nextShift.startTime.getTime() - currentShift.endTime.getTime()) / (1000 * 60 * 60);

        if (restPeriod < 8) {
          conflicts.push({
            shiftId: nextShift.id,
            type: 'insufficient_rest',
            details: `Only ${restPeriod.toFixed(1)} hours rest after previous shift`
          });
        }
      }
    });

    // Check for exceeded weekly hours
    this.assignments.forEach((shiftIds, guardId) => {
      const guard = this.guards.find(g => g.id === guardId);
      if (!guard) return;

      const totalHours = this.calculateTotalHours(guardId);
      if (totalHours > guard.maxHoursPerWeek) {
        conflicts.push({
          shiftId: shiftIds[shiftIds.length - 1],
          type: 'exceeded_hours',
          details: `Exceeds maximum weekly hours (${totalHours.toFixed(1)}/${guard.maxHoursPerWeek})`
        });
      }
    });

    return conflicts;
  }
}
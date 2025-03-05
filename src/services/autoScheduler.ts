import { addMinutes, areIntervalsOverlapping, format, parse, parseISO } from 'date-fns';

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

interface ScheduleConfig {
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

export class AutoScheduler {
  private guards: Guard[];
  private shifts: Shift[];
  private assignments: Map<string, string> = new Map(); // shiftId -> guardId
  private guardAssignments: Map<string, string[]> = new Map(); // guardId -> shiftIds
  private conflicts: Array<{ shiftId: string; reason: string }> = [];
  private config: ScheduleConfig = {
    clientPriority: 'balanced',
    priorityLevel: 5,
    considerGuardPreferences: true,
    maxShiftsPerGuard: 0,
    minRestHours: 8
  };

  constructor(guards: Guard[], shifts: Shift[]) {
    this.guards = guards;
    this.shifts = shifts;
    this.initializeGuardAssignments();
  }

  public configure(config: Partial<ScheduleConfig>): void {
    this.config = { ...this.config, ...config };
  }

  private initializeGuardAssignments() {
    this.guards.forEach(guard => {
      this.guardAssignments.set(guard.id, []);
    });
  }

  private parseShiftTime(shift: Shift): { start: Date; end: Date } {
    // Parse date and time strings
    const dateObj = parse(shift.date, 'MMM dd', new Date());
    const [startTimeStr, endTimeStr] = shift.time.split(' - ');
    
    // Create start and end date objects
    const startTime = parse(startTimeStr, 'HH:mm', dateObj);
    const endTime = parse(endTimeStr, 'HH:mm', dateObj);
    
    // If end time is before start time, assume it's the next day
    if (endTime < startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    
    return { start: startTime, end: endTime };
  }

  private hasRequiredSkills(guard: Guard, shift: Shift): boolean {
    // If no requirements, any guard can do it
    if (!shift.requirements || shift.requirements.length === 0) {
      return true;
    }
    
    // Check if guard has all required skills
    return shift.requirements.every(req => guard.skills.includes(req));
  }

  private matchesSecurityLevel(guard: Guard, shift: Shift): boolean {
    // Extract security level from shift (e.g., "Security Level 2" -> "2")
    const levelMatch = shift.securityLevel.match(/Level\s+(\d+)/i);
    if (!levelMatch) return true; // If no specific level, any guard can do it
    
    const shiftLevel = parseInt(levelMatch[1]);
    
    // Check if guard has appropriate security level skill
    return guard.skills.some(skill => {
      const guardLevelMatch = skill.match(/Level\s+(\d+)/i);
      if (!guardLevelMatch) return false;
      
      const guardLevel = parseInt(guardLevelMatch[1]);
      return guardLevel >= shiftLevel;
    });
  }

  private isGuardAvailable(guard: Guard, shift: Shift): boolean {
    // Check if guard is available
    if (guard.status !== 'available') {
      return false;
    }
    
    // Parse shift times
    const shiftTimes = this.parseShiftTime(shift);
    
    // Check for unavailable days if specified and preferences are considered
    if (this.config.considerGuardPreferences && guard.preferences?.unavailableDays) {
      const shiftDay = format(shiftTimes.start, 'EEEE').toLowerCase();
      if (guard.preferences.unavailableDays.includes(shiftDay)) {
        return false;
      }
    }
    
    // Check for max shifts per guard if specified
    if (this.config.maxShiftsPerGuard > 0) {
      const guardShiftCount = (this.guardAssignments.get(guard.id) || []).length;
      if (guardShiftCount >= this.config.maxShiftsPerGuard) {
        return false;
      }
    }
    
    // Check for overlapping shifts
    const guardShiftIds = this.guardAssignments.get(guard.id) || [];
    for (const assignedShiftId of guardShiftIds) {
      const assignedShift = this.shifts.find(s => s.id === assignedShiftId);
      if (!assignedShift) continue;
      
      const assignedTimes = this.parseShiftTime(assignedShift);
      
      // Check if shifts overlap
      if (areIntervalsOverlapping(
        { start: shiftTimes.start, end: shiftTimes.end },
        { start: assignedTimes.start, end: assignedTimes.end }
      )) {
        return false;
      }
      
      // Ensure minimum rest period between shifts
      const restPeriodStart = assignedTimes.end;
      const restPeriodEnd = new Date(restPeriodStart);
      restPeriodEnd.setHours(restPeriodEnd.getHours() + this.config.minRestHours);
      
      if (
        (shiftTimes.start >= restPeriodStart && shiftTimes.start <= restPeriodEnd) ||
        (assignedTimes.start >= shiftTimes.end && assignedTimes.start <= addMinutes(shiftTimes.end, this.config.minRestHours * 60))
      ) {
        return false;
      }
    }
    
    return true;
  }

  private calculateGuardScore(guard: Guard, shift: Shift): number {
    let score = 0;
    
    // Base score for having required skills
    if (this.hasRequiredSkills(guard, shift)) {
      score += 10;
    } else {
      // If guard doesn't have required skills, they shouldn't be assigned
      return -100;
    }
    
    // Bonus for matching security level
    if (this.matchesSecurityLevel(guard, shift)) {
      score += 5;
    } else {
      // If guard doesn't match security level, they shouldn't be assigned
      return -100;
    }
    
    // Apply client priority factor
    if (this.config.considerGuardPreferences && guard.preferences) {
      // Preferred locations bonus
      if (guard.preferences.preferredLocations?.includes(shift.location)) {
        const locationBonus = this.config.clientPriority === 'guard-first' ? 5 : 
                             (this.config.clientPriority === 'balanced' ? 3 : 1);
        score += locationBonus * (this.config.priorityLevel / 5);
      }
      
      // Preferred shift times bonus
      if (guard.preferences.preferredShiftTimes) {
        const shiftTimes = this.parseShiftTime(shift);
        const hour = shiftTimes.start.getHours();
        
        // Determine shift time category
        let timeCategory: 'morning' | 'afternoon' | 'night';
        if (hour >= 5 && hour < 12) {
          timeCategory = 'morning';
        } else if (hour >= 12 && hour < 18) {
          timeCategory = 'afternoon';
        } else {
          timeCategory = 'night';
        }
        
        if (guard.preferences.preferredShiftTimes.includes(timeCategory)) {
          const timeBonus = this.config.clientPriority === 'guard-first' ? 4 : 
                           (this.config.clientPriority === 'balanced' ? 2 : 1);
          score += timeBonus * (this.config.priorityLevel / 5);
        }
      }
    }
    
    // Workload balancing - penalize guards with more shifts
    const guardShiftCount = (this.guardAssignments.get(guard.id) || []).length;
    const workloadPenalty = this.config.clientPriority === 'client-first' ? 0.2 : 
                           (this.config.clientPriority === 'balanced' ? 0.5 : 1);
    score -= guardShiftCount * workloadPenalty * (this.config.priorityLevel / 5);
    
    // Check max hours per week if specified and preferences are considered
    if (this.config.considerGuardPreferences && guard.preferences?.maxHoursPerWeek) {
      const currentHours = this.calculateGuardHours(guard.id);
      const shiftHours = this.calculateShiftHours(shift);
      
      if (currentHours + shiftHours > guard.preferences.maxHoursPerWeek) {
        return -100; // Exceeds max hours
      }
      
      // Bonus for guards who haven't reached their hour limit
      const hourUtilization = currentHours / guard.preferences.maxHoursPerWeek;
      const hourBonus = this.config.clientPriority === 'guard-first' ? 5 : 
                       (this.config.clientPriority === 'balanced' ? 3 : 1);
      score += (1 - hourUtilization) * hourBonus * (this.config.priorityLevel / 5);
    }
    
    return score;
  }

  private calculateGuardHours(guardId: string): number {
    const guardShiftIds = this.guardAssignments.get(guardId) || [];
    let totalHours = 0;
    
    for (const shiftId of guardShiftIds) {
      const shift = this.shifts.find(s => s.id === shiftId);
      if (shift) {
        totalHours += this.calculateShiftHours(shift);
      }
    }
    
    return totalHours;
  }

  private calculateShiftHours(shift: Shift): number {
    const { start, end } = this.parseShiftTime(shift);
    const durationMs = end.getTime() - start.getTime();
    return durationMs / (1000 * 60 * 60); // Convert to hours
  }

  private calculateTotalScore(): number {
    let totalScore = 0;
    
    for (const [shiftId, guardId] of this.assignments.entries()) {
      const shift = this.shifts.find(s => s.id === shiftId);
      const guard = this.guards.find(g => g.id === guardId);
      
      if (shift && guard) {
        totalScore += this.calculateGuardScore(guard, shift);
      }
    }
    
    return totalScore;
  }

  public generateSchedule(): ScheduleResult {
    this.assignments.clear();
    this.conflicts = [];
    this.initializeGuardAssignments();
    
    // Sort shifts by date and time
    const sortedShifts = [...this.shifts].sort((a, b) => {
      const aTime = this.parseShiftTime(a);
      const bTime = this.parseShiftTime(b);
      return aTime.start.getTime() - bTime.start.getTime();
    });
    
    // First pass: Try to assign shifts based on requirements and availability
    for (const shift of sortedShifts) {
      // Skip already assigned shifts
      if (shift.assigned) continue;
      
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
      
      if (bestGuard && bestScore > 0) {
        this.assignments.set(shift.id, bestGuard.id);
        const guardShifts = this.guardAssignments.get(bestGuard.id) || [];
        guardShifts.push(shift.id);
        this.guardAssignments.set(bestGuard.id, guardShifts);
      } else {
        this.conflicts.push({
          shiftId: shift.id,
          reason: bestScore <= 0 ? 'No qualified guard available' : 'No available guard'
        });
      }
    }
    
    // Second pass: Try to optimize by swapping assignments
    this.optimizeAssignments();
    
    // Prepare result
    const assignmentResults = Array.from(this.assignments.entries()).map(([shiftId, guardId]) => {
      const guard = this.guards.find(g => g.id === guardId);
      return {
        shiftId,
        guardId,
        guardName: guard?.name || 'Unknown',
        score: 0 // We'll calculate this below
      };
    });
    
    // Calculate scores for the final assignments
    for (const assignment of assignmentResults) {
      const shift = this.shifts.find(s => s.id === assignment.shiftId);
      const guard = this.guards.find(g => g.id === assignment.guardId);
      
      if (shift && guard) {
        assignment.score = this.calculateGuardScore(guard, shift);
      }
    }
    
    // Calculate metrics
    const guardUtilization: Record<string, number> = {};
    let totalUtilization = 0;
    
    for (const guard of this.guards) {
      const guardShifts = this.guardAssignments.get(guard.id) || [];
      const utilization = guardShifts.length;
      guardUtilization[guard.id] = utilization;
      totalUtilization += utilization;
    }
    
    const averageUtilization = this.guards.length > 0 ? 
      totalUtilization / this.guards.length : 0;
    
    return {
      assignments: assignmentResults,
      unassignedShifts: this.conflicts.map(c => c.shiftId),
      conflicts: this.conflicts,
      metrics: {
        totalShifts: sortedShifts.length,
        assignedShifts: this.assignments.size,
        unassignedShifts: this.conflicts.length,
        averageGuardUtilization: averageUtilization,
        guardUtilization
      }
    };
  }

  private optimizeAssignments(): void {
    let improved = true;
    let iterations = 0;
    const maxIterations = 100; // Prevent infinite loops
    
    while (improved && iterations < maxIterations) {
      improved = false;
      iterations++;
      
      // Try to swap assignments to improve overall score
    }
  }
}
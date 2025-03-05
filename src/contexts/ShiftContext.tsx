import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface JobSite {
  id: string;
  name: string;
  address: string;
  activeGuards: number;
  totalShifts: number;
  status: 'active' | 'inactive';
  lastIncident?: string;
  requiredGuards: number;
  jobTypes?: Array<{
    type: string;
    count: number;
    guardsPerShift: number;
  }>;
}

interface ShiftContextType {
  unassignedShifts: Shift[];
  assignedShifts: Shift[];
  jobSites: JobSite[];
  setUnassignedShifts: (shifts: Shift[]) => void;
  setAssignedShifts: (shifts: Shift[]) => void;
  setJobSites: (sites: JobSite[]) => void;
  addUnassignedShift: (shift: Shift) => void;
  addJobSite: (site: JobSite) => void;
  assignShift: (shiftId: string, guardName: string, guardAvatar?: string) => void;
  unassignShift: (shiftId: string) => void;
  updateJobSiteJobTypes: (siteId: string, jobTypes: Array<{type: string, count: number, guardsPerShift: number}>) => void;
}

const ShiftContext = createContext<ShiftContextType | undefined>(undefined);

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [unassignedShifts, setUnassignedShifts] = useState<Shift[]>([]);
  const [assignedShifts, setAssignedShifts] = useState<Shift[]>([]);
  const [jobSites, setJobSites] = useState<JobSite[]>([]);

  // Load state from localStorage on mount
  useEffect(() => {
    const storedUnassignedShifts = localStorage.getItem('unassignedShifts');
    const storedAssignedShifts = localStorage.getItem('assignedShifts');
    const storedJobSites = localStorage.getItem('jobSites');

    if (storedUnassignedShifts) {
      setUnassignedShifts(JSON.parse(storedUnassignedShifts));
    }
    if (storedAssignedShifts) {
      setAssignedShifts(JSON.parse(storedAssignedShifts));
    }
    if (storedJobSites) {
      setJobSites(JSON.parse(storedJobSites));
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('unassignedShifts', JSON.stringify(unassignedShifts));
    localStorage.setItem('assignedShifts', JSON.stringify(assignedShifts));
    localStorage.setItem('jobSites', JSON.stringify(jobSites));
  }, [unassignedShifts, assignedShifts, jobSites]);

  const addUnassignedShift = (shift: Shift) => {
    setUnassignedShifts(prev => [...prev, shift]);
  };

  const addJobSite = (site: JobSite) => {
    // Initialize with default job types if not provided
    const siteWithJobTypes = {
      ...site,
      jobTypes: site.jobTypes || [
        { type: 'Regular Security', count: 0, guardsPerShift: 1 },
        { type: 'Event Security', count: 0, guardsPerShift: 2 }
      ]
    };
    setJobSites(prev => [...prev, siteWithJobTypes]);
  };

  const updateJobSiteJobTypes = (siteId: string, jobTypes: Array<{type: string, count: number, guardsPerShift: number}>) => {
    setJobSites(prev => prev.map(site => 
      site.id === siteId ? { ...site, jobTypes } : site
    ));
  };

  const assignShift = (shiftId: string, guardName: string, guardAvatar?: string) => {
    const shift = unassignedShifts.find(s => s.id === shiftId);
    if (!shift) return;

    setUnassignedShifts(shifts => shifts.filter(s => s.id !== shiftId));
    setAssignedShifts(shifts => [...shifts, {
      ...shift,
      assigned: {
        name: guardName,
        avatar: guardAvatar
      }
    }]);
  };

  const unassignShift = (shiftId: string) => {
    const shift = assignedShifts.find(s => s.id === shiftId);
    if (!shift) return;

    setAssignedShifts(shifts => shifts.filter(s => s.id !== shiftId));
    setUnassignedShifts(shifts => [...shifts, {
      ...shift,
      assigned: undefined
    }]);
  };

  return (
    <ShiftContext.Provider value={{
      unassignedShifts,
      assignedShifts,
      jobSites,
      setUnassignedShifts,
      setAssignedShifts,
      setJobSites,
      addUnassignedShift,
      addJobSite,
      assignShift,
      unassignShift,
      updateJobSiteJobTypes
    }}>
      {children}
    </ShiftContext.Provider>
  );
}

export function useShiftContext() {
  const context = useContext(ShiftContext);
  if (context === undefined) {
    throw new Error('useShiftContext must be used within a ShiftProvider');
  }
  return context;
}
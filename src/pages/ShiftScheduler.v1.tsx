import React, { useState } from 'react';
import { Calendar, Clock, Users, Plus, ChevronLeft, ChevronRight, MapPin, Building, Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, addDays, startOfWeek } from 'date-fns';
import { NewShiftDialog } from '@/components/dialogs/NewShiftDialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface Shift {
  id: string;
  guardName: string;
  location: string;
  startTime: string;
  endTime: string;
  date: Date;
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

export const ShiftScheduler = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isNewShiftOpen, setIsNewShiftOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('calendar');
  
  const [shifts] = useState<Shift[]>([
    {
      id: '1',
      guardName: 'John Smith',
      location: 'Main Entrance',
      startTime: '08:00',
      endTime: '16:00',
      date: new Date()
    },
    {
      id: '2',
      guardName: 'Sarah Johnson',
      location: 'Parking Area',
      startTime: '16:00',
      endTime: '00:00',
      date: new Date()
    }
  ]);

  const [jobSites] = useState<JobSite[]>([
    {
      id: '1',
      name: 'Mall of Arabia',
      address: '123 Main Street',
      activeGuards: 8,
      totalShifts: 24,
      status: 'active',
      requiredGuards: 10,
      lastIncident: '2 days ago'
    },
    {
      id: '2',
      name: 'Central Station',
      address: '456 Railway Ave',
      activeGuards: 6,
      totalShifts: 18,
      status: 'active',
      requiredGuards: 6
    },
    {
      id: '3',
      name: 'City Hospital',
      address: '789 Health Blvd',
      activeGuards: 12,
      totalShifts: 36,
      status: 'active',
      requiredGuards: 15,
      lastIncident: '1 week ago'
    }
  ]);

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

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="sites">Job Sites</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Quick Stats */}
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

          {/* Calendar View */}
          <div className="bg-white rounded-lg shadow-sm">
            {/* Calendar Header */}
            <div className="border-b p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-semibold">
                    {format(selectedDate, 'MMMM yyyy')}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
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

              {/* Week Days Header */}
              <div className="grid grid-cols-7 gap-4 text-center">
                {weekDays.map((day) => (
                  <div key={day.toString()} className="text-sm font-medium text-gray-500">
                    {format(day, 'EEE')}
                  </div>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-4 p-4">
              {weekDays.map((day) => (
                <div
                  key={day.toString()}
                  className="min-h-[120px] border rounded-lg p-2"
                >
                  <div className="text-sm font-medium mb-2">
                    {format(day, 'd')}
                  </div>
                  {shifts
                    .filter(shift => format(shift.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
                    .map(shift => (
                      <div
                        key={shift.id}
                        className="bg-blue-50 border border-blue-100 rounded p-2 mb-1 text-sm"
                      >
                        <div className="font-medium">{shift.guardName}</div>
                        <div className="text-xs text-gray-500">
                          {shift.startTime} - {shift.endTime}
                        </div>
                        <div className="text-xs text-gray-500">{shift.location}</div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="sites" className="space-y-6">
          {/* Job Sites Dashboard */}
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

          {/* Job Sites List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Active Job Sites</h3>
                <Button>
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
                      <Button variant="outline" size="sm">
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
      </Tabs>

      <NewShiftDialog 
        open={isNewShiftOpen}
        onOpenChange={setIsNewShiftOpen}
      />
    </div>
  );
};
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Building, 
  MapPin, 
  Users, 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash, 
  Briefcase,
  Shield
} from 'lucide-react';
import { useShiftContext } from '@/contexts/ShiftContext';
import { format } from 'date-fns';

interface JobDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobSite: {
    id: string;
    name: string;
    address: string;
    activeGuards: number;
    totalShifts: number;
    status: 'active' | 'inactive';
    requiredGuards: number;
    lastIncident?: string;
    jobTypes?: Array<{
      type: string;
      count: number;
      guardsPerShift: number;
    }>;
  };
}

export const JobDetailsDialog: React.FC<JobDetailsDialogProps> = ({
  open,
  onOpenChange,
  jobSite
}) => {
  const { unassignedShifts, assignedShifts, addUnassignedShift } = useShiftContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'shifts' | 'guards'>('overview');
  const [isAddingShift, setIsAddingShift] = useState(false);
  const [newShift, setNewShift] = useState({
    title: '',
    jobType: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    guardsRequired: 1
  });

  // Filter shifts for this job site
  const siteShifts = [...unassignedShifts, ...assignedShifts].filter(
    shift => shift.location === jobSite.name
  );

  // Group shifts by job type
  const shiftsByType: Record<string, typeof siteShifts> = {};
  siteShifts.forEach(shift => {
    const type = shift.title || 'Uncategorized';
    if (!shiftsByType[type]) {
      shiftsByType[type] = [];
    }
    shiftsByType[type].push(shift);
  });

  const handleAddShift = () => {
    setIsAddingShift(true);
    
    // Set default job type if available
    if (jobSite.jobTypes && jobSite.jobTypes.length > 0) {
      setNewShift(prev => ({
        ...prev,
        jobType: jobSite.jobTypes![0].type,
        guardsRequired: jobSite.jobTypes![0].guardsPerShift
      }));
    }
  };

  const handleCancelAddShift = () => {
    setIsAddingShift(false);
    setNewShift({
      title: '',
      jobType: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '17:00',
      guardsRequired: 1
    });
  };

  const handleSubmitShift = () => {
    // Create the new shift
    const shiftDate = new Date(newShift.date);
    
    // Create a single shift with the specified title and details
    const shift = {
      id: `shift-${Date.now()}`,
      title: newShift.jobType || newShift.title,
      location: jobSite.name,
      date: format(shiftDate, 'MMM dd'),
      time: `${newShift.startTime} - ${newShift.endTime}`,
      securityLevel: 'Standard',
      requirements: []
    };
    
    // Add the shift to unassigned shifts
    addUnassignedShift(shift);
    
    // Show success message
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'Shift created successfully!';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
    
    // Reset form
    handleCancelAddShift();
  };

  const handleDeleteShift = (shiftId: string) => {
    // This would typically call a function to delete the shift
    console.log('Deleting shift:', shiftId);
    
    // Show confirmation message
    const message = document.createElement('div');
    message.className = 'fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded shadow-lg z-50';
    message.textContent = 'This feature is not yet implemented.';
    document.body.appendChild(message);
    setTimeout(() => message.remove(), 3000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            {jobSite.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Job Site Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-1">
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {jobSite.address}
                </p>
                <div className="mt-2 grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Required Guards</p>
                    <p className="font-semibold">{jobSite.requiredGuards}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Active Guards</p>
                    <p className="font-semibold">{jobSite.activeGuards}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Shifts</p>
                    <p className="font-semibold">{jobSite.totalShifts}</p>
                  </div>
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-4">
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
                  activeTab === 'shifts'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('shifts')}
              >
                Shifts
              </button>
              <button
                className={`pb-2 px-1 ${
                  activeTab === 'guards'
                    ? 'border-b-2 border-blue-600 text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('guards')}
              >
                Guards
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="pt-2">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Job Types */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium">Job Types</h3>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Job Types
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {jobSite.jobTypes && jobSite.jobTypes.length > 0 ? (
                      jobSite.jobTypes.map((jobType, idx) => (
                        <div key={idx} className="border rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <Briefcase className="w-4 h-4 text-blue-600 mr-2" />
                            <h4 className="font-medium">{jobType.type}</h4>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-gray-500">Jobs</p>
                              <p className="font-semibold">{jobType.count}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Guards per Shift</p>
                              <p className="font-semibold">{jobType.guardsPerShift}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-4 text-gray-500 border rounded-lg">
                        No job types defined yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-medium mb-3">Recent Activity</h3>
                  <div className="border rounded-lg divide-y">
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-blue-600 mr-2" />
                        <span>New shift created</span>
                      </div>
                      <span className="text-sm text-gray-500">2 hours ago</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-green-600 mr-2" />
                        <span>Guard assigned to shift</span>
                      </div>
                      <span className="text-sm text-gray-500">Yesterday</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <Shield className="w-4 h-4 text-yellow-600 mr-2" />
                        <span>Security level updated</span>
                      </div>
                      <span className="text-sm text-gray-500">3 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shifts Tab */}
            {activeTab === 'shifts' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Shifts</h3>
                  <Button onClick={handleAddShift}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Shift
                  </Button>
                </div>

                {/* Add Shift Form */}
                {isAddingShift && (
                  <div className="border rounded-lg p-4 bg-gray-50 mb-4">
                    <h4 className="font-medium mb-3">Add New Shift</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {jobSite.jobTypes && jobSite.jobTypes.length > 0 ? (
                        <div>
                          <label className="block text-sm font-medium mb-1">Job Type</label>
                          <select
                            className="w-full rounded-md border border-gray-300 p-2"
                            value={newShift.jobType}
                            onChange={(e) => {
                              const selectedType = e.target.value;
                              const jobType = jobSite.jobTypes?.find(jt => jt.type === selectedType);
                              setNewShift(prev => ({
                                ...prev,
                                jobType: selectedType,
                                guardsRequired: jobType?.guardsPerShift || prev.guardsRequired
                              }));
                            }}
                            required
                          >
                            <option value="">Select Job Type</option>
                            {jobSite.jobTypes.map((type, idx) => (
                              <option key={idx} value={type.type}>
                                {type.type}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium mb-1">Shift Title</label>
                          <Input
                            value={newShift.title}
                            onChange={(e) => setNewShift(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Enter shift title"
                            required
                          />
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <Input
                          type="date"
                          value={newShift.date}
                          onChange={(e) => setNewShift(prev => ({ ...prev, date: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <Input
                          type="time"
                          value={newShift.startTime}
                          onChange={(e) => setNewShift(prev => ({ ...prev, startTime: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <Input
                          type="time"
                          value={newShift.endTime}
                          onChange={(e) => setNewShift(prev => ({ ...prev, endTime: e.target.value }))}
                          required
                        />
                      </div>
                      
                      {!newShift.jobType && (
                        <div>
                          <label className="block text-sm font-medium mb-1">Guards Required</label>
                          <Input
                            type="number"
                            min="1"
                            value={newShift.guardsRequired}
                            onChange={(e) => setNewShift(prev => ({ 
                              ...prev, 
                              guardsRequired: parseInt(e.target.value) || 1 
                            }))}
                            required
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelAddShift}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitShift}
                        disabled={!newShift.jobType && !newShift.title}
                      >
                        Create Shift
                      </Button>
                    </div>
                  </div>
                )}

                {/* Shifts List */}
                {Object.keys(shiftsByType).length > 0 ? (
                  <div className="space-y-6">
                    {Object.entries(shiftsByType).map(([type, shifts]) => (
                      <div key={type} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-100 p-3 font-medium flex items-center">
                          <Briefcase className="w-4 h-4 mr-2" />
                          {type}
                          <span className="ml-2 text-sm text-gray-500">
                            ({shifts.length} {shifts.length === 1 ? 'shift' : 'shifts'})
                          </span>
                        </div>
                        <div className="divide-y">
                          {shifts.map(shift => (
                            <div key={shift.id} className="p-3 flex justify-between items-center">
                              <div>
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                                  <span>{shift.date}</span>
                                  <Clock className="w-4 h-4 text-gray-500 ml-4 mr-2" />
                                  <span>{shift.time}</span>
                                </div>
                                {shift.assigned && (
                                  <div className="mt-1 text-sm text-green-600 flex items-center">
                                    <Users className="w-3 h-3 mr-1" />
                                    Assigned to: {shift.assigned.name}
                                  </div>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleDeleteShift(shift.id)}
                                >
                                  <Trash className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray -500 border rounded-lg">
                    No shifts have been created for this job site yet.
                    <div className="mt-2">
                      <Button onClick={handleAddShift}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add First Shift
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Guards Tab */}
            {activeTab === 'guards' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Assigned Guards</h3>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Assign Guard
                  </Button>
                </div>

                {/* Guards List */}
                <div className="border rounded-lg overflow-hidden">
                  {assignedShifts
                    .filter(shift => shift.location === jobSite.name)
                    .map(shift => shift.assigned?.name)
                    .filter((name, index, self) => name && self.indexOf(name) === index)
                    .length > 0 ? (
                    <div className="divide-y">
                      {assignedShifts
                        .filter(shift => shift.location === jobSite.name)
                        .map(shift => shift.assigned?.name)
                        .filter((name, index, self) => name && self.indexOf(name) === index)
                        .map((guardName, index) => (
                          <div key={index} className="p-3 flex justify-between items-center">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                                <Users className="w-4 h-4 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-medium">{guardName}</p>
                                <p className="text-sm text-gray-500">
                                  {assignedShifts.filter(s => 
                                    s.location === jobSite.name && 
                                    s.assigned?.name === guardName
                                  ).length} shifts assigned
                                </p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        ))
                    }
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No guards have been assigned to this job site yet.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};